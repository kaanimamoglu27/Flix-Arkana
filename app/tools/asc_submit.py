#!/usr/bin/env python3
"""Submit an ARKANA build for App Store review through the App Store Connect API.

Steps: wait until the TestFlight build of VERSION has finished processing, make sure an
editable App Store version VERSION exists (reuses / renames an unsent one, cancels an older
pending submission if CANCEL_PENDING=1), attach the build, write "What's New" and the review
notes, send ready in-app purchases along with the version, then submit for review.

Env: ASC_KEY_ID, ASC_ISSUER_ID, KEY_PATH (path to the .p8), VERSION, BUNDLE_ID,
     WHATS_NEW_TR, WHATS_NEW_EN, REVIEW_NOTES, CANCEL_PENDING (1/0), BUILD_WAIT_MIN.
Needs: pip install pyjwt cryptography
"""
import json, os, sys, time, urllib.request, urllib.error
import jwt

API = "https://api.appstoreconnect.apple.com"
KEY_ID = os.environ["ASC_KEY_ID"]
ISSUER = os.environ["ASC_ISSUER_ID"]
KEY = open(os.environ["KEY_PATH"]).read()
VERSION = os.environ["VERSION"].strip()
BUNDLE_ID = os.environ.get("BUNDLE_ID", "com.flixtoys.arkana")
CANCEL_PENDING = os.environ.get("CANCEL_PENDING", "1") == "1"
BUILD_WAIT_MIN = int(os.environ.get("BUILD_WAIT_MIN", "75"))
SUMMARY = os.environ.get("GITHUB_STEP_SUMMARY")

EDITABLE = {"PREPARE_FOR_SUBMISSION", "DEVELOPER_REJECTED", "REJECTED", "METADATA_REJECTED",
            "INVALID_BINARY"}
PENDING = {"WAITING_FOR_REVIEW", "IN_REVIEW", "READY_FOR_REVIEW"}
LIVE = {"READY_FOR_SALE", "REPLACED_WITH_NEW_VERSION", "REMOVED_FROM_SALE",
        "DEVELOPER_REMOVED_FROM_SALE"}


def log(msg):
    print(msg, flush=True)
    if SUMMARY:
        with open(SUMMARY, "a") as f:
            f.write(msg + "\n\n")


def token():
    now = int(time.time())
    return jwt.encode({"iss": ISSUER, "iat": now, "exp": now + 15 * 60,
                       "aud": "appstoreconnect-v1"}, KEY, algorithm="ES256",
                      headers={"kid": KEY_ID, "typ": "JWT"})


class ApiError(Exception):
    def __init__(self, code, body):
        super().__init__(f"HTTP {code}: {body}")
        self.code, self.body = code, body


def call(method, path, body=None, ok_missing=False):
    url = path if path.startswith("http") else API + path
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(url, data=data, method=method, headers={
        "Authorization": "Bearer " + token(), "Content-Type": "application/json"})
    for attempt in range(4):
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                raw = r.read()
                return json.loads(raw) if raw else {}
        except urllib.error.HTTPError as e:
            text = e.read().decode(errors="replace")
            if e.code == 404 and ok_missing:
                return None
            if e.code in (429, 500, 502, 503) and attempt < 3:
                time.sleep(5 * (attempt + 1))
                continue
            raise ApiError(e.code, text)


def errors_text(e):
    try:
        return "; ".join(f"{x.get('title')}: {x.get('detail')}" for x in json.loads(e.body)["errors"])
    except Exception:
        return e.body


def main():
    apps = call("GET", f"/v1/apps?filter[bundleId]={BUNDLE_ID}")["data"]
    if not apps:
        sys.exit(f"No App Store Connect app with bundle id {BUNDLE_ID}")
    app_id = apps[0]["id"]
    log(f"App: {apps[0]['attributes']['name']} ({app_id}), target version {VERSION}")

    # 1. Wait for the build of this version to finish processing.
    build, deadline = None, time.time() + BUILD_WAIT_MIN * 60
    while True:
        res = call("GET", f"/v1/builds?filter[app]={app_id}&filter[preReleaseVersion.version]={VERSION}"
                          "&sort=-uploadedDate&limit=1")["data"]
        if res:
            build = res[0]
            state = build["attributes"]["processingState"]
            if state == "VALID":
                break
            if state in ("FAILED", "INVALID"):
                sys.exit(f"Build {build['attributes']['version']} processing state is {state}")
            log(f"Build {build['attributes']['version']} is {state}, waiting...")
        else:
            log(f"No build for version {VERSION} in App Store Connect yet, waiting...")
        if time.time() > deadline:
            sys.exit(f"Timed out after {BUILD_WAIT_MIN} min waiting for a processed build of {VERSION}")
        time.sleep(60)
    build_id, build_no = build["id"], build["attributes"]["version"]
    log(f"Build {build_no} is processed")
    if build["attributes"].get("usesNonExemptEncryption") is None:
        call("PATCH", f"/v1/builds/{build_id}", {"data": {"type": "builds", "id": build_id,
             "attributes": {"usesNonExemptEncryption": False}}})
        log("Export compliance: no non-exempt encryption")

    # 2. Find or prepare the App Store version.
    def versions():
        return call("GET", f"/v1/apps/{app_id}/appStoreVersions?filter[platform]=IOS&limit=50")["data"]

    vers = versions()
    for v in vers:
        log(f"  existing version {v['attributes']['versionString']}: {v['attributes']['appStoreState']}")
    released = any(v["attributes"]["appStoreState"] in LIVE for v in vers)
    target = next((v for v in vers if v["attributes"]["versionString"] == VERSION
                   and v["attributes"]["appStoreState"] not in LIVE), None)
    if target and target["attributes"]["appStoreState"] in PENDING:
        log(f"Version {VERSION} is already {target['attributes']['appStoreState']}; nothing to submit.")
        return
    if not target:
        target = next((v for v in vers if v["attributes"]["appStoreState"] in EDITABLE), None)
    if not target:
        pending = next((v for v in vers if v["attributes"]["appStoreState"] in PENDING), None)
        if pending:
            if not CANCEL_PENDING:
                sys.exit(f"Version {pending['attributes']['versionString']} is "
                         f"{pending['attributes']['appStoreState']}; rerun with cancel_pending=true to replace it")
            subs = call("GET", f"/v1/reviewSubmissions?filter[app]={app_id}&filter[platform]=IOS"
                               "&filter[state]=WAITING_FOR_REVIEW,IN_REVIEW,READY_FOR_REVIEW&limit=10")["data"]
            for s in subs:
                call("PATCH", f"/v1/reviewSubmissions/{s['id']}", {"data": {"type": "reviewSubmissions",
                     "id": s["id"], "attributes": {"canceled": True}}})
            log(f"Cancelled the pending review of {pending['attributes']['versionString']} to replace it with {VERSION}")
            for _ in range(30):
                time.sleep(20)
                cur = call("GET", f"/v1/appStoreVersions/{pending['id']}")["data"]
                if cur["attributes"]["appStoreState"] in EDITABLE:
                    target = cur
                    break
            if not target:
                sys.exit("The cancelled version did not become editable in time; rerun the workflow")
        elif any(v["attributes"]["appStoreState"] == "PENDING_DEVELOPER_RELEASE" for v in vers):
            sys.exit("A version is approved and waiting for manual release; release it first, then rerun")
        else:
            target = call("POST", "/v1/appStoreVersions", {"data": {"type": "appStoreVersions",
                "attributes": {"platform": "IOS", "versionString": VERSION, "releaseType": "AFTER_APPROVAL"},
                "relationships": {"app": {"data": {"type": "apps", "id": app_id}}}}})["data"]
            log(f"Created App Store version {VERSION}")
    vid = target["id"]
    if target["attributes"]["versionString"] != VERSION:
        old = target["attributes"]["versionString"]
        call("PATCH", f"/v1/appStoreVersions/{vid}", {"data": {"type": "appStoreVersions", "id": vid,
             "attributes": {"versionString": VERSION}}})
        log(f"Renamed unsent version {old} to {VERSION}")

    # 3. Attach the build.
    call("PATCH", f"/v1/appStoreVersions/{vid}/relationships/build",
         {"data": {"type": "builds", "id": build_id}})
    log(f"Attached build {build_no} to version {VERSION}")

    # 4. What's New (only allowed once the app has a released version).
    if released:
        locs = call("GET", f"/v1/appStoreVersions/{vid}/appStoreVersionLocalizations?limit=50")["data"]
        for loc in locs:
            lang = loc["attributes"]["locale"]
            text = os.environ["WHATS_NEW_TR"] if lang.startswith("tr") else os.environ["WHATS_NEW_EN"]
            call("PATCH", f"/v1/appStoreVersionLocalizations/{loc['id']}", {"data": {
                "type": "appStoreVersionLocalizations", "id": loc["id"], "attributes": {"whatsNew": text}}})
            log(f"What's New set for {lang}")
    else:
        log("First release of the app: App Store does not take What's New text, skipped")

    # 5. Review notes.
    notes = os.environ["REVIEW_NOTES"]
    det = call("GET", f"/v1/appStoreVersions/{vid}/appStoreReviewDetail", ok_missing=True)
    if det and det.get("data"):
        did = det["data"]["id"]
        call("PATCH", f"/v1/appStoreReviewDetails/{did}", {"data": {"type": "appStoreReviewDetails",
             "id": did, "attributes": {"notes": notes, "demoAccountRequired": False}}})
    else:
        call("POST", "/v1/appStoreReviewDetails", {"data": {"type": "appStoreReviewDetails",
             "attributes": {"notes": notes, "demoAccountRequired": False},
             "relationships": {"appStoreVersion": {"data": {"type": "appStoreVersions", "id": vid}}}}})
    log("Review notes written")

    # 6. In-app purchases that are ready go in with this version.
    try:
        iaps = call("GET", f"/v1/apps/{app_id}/inAppPurchasesV2?limit=200")["data"]
    except ApiError as e:
        iaps = []
        log(f"Could not list in-app purchases: {errors_text(e)}")
    counts = {}
    for p in iaps:
        st = p["attributes"].get("state")
        counts[st] = counts.get(st, 0) + 1
        if st == "READY_TO_SUBMIT":
            try:
                call("POST", "/v1/inAppPurchaseSubmissions", {"data": {"type": "inAppPurchaseSubmissions",
                     "relationships": {"inAppPurchaseV2": {"data": {"type": "inAppPurchases", "id": p["id"]}}}}})
                log(f"IAP {p['attributes'].get('productId')} sent with this version")
            except ApiError as e:
                log(f"IAP {p['attributes'].get('productId')} could not be sent: {errors_text(e)}")
    if iaps:
        log("In-app purchase states: " + ", ".join(f"{k}: {v}" for k, v in sorted(counts.items(), key=str)))
        missing = [p["attributes"].get("productId") for p in iaps
                   if p["attributes"].get("state") == "MISSING_METADATA"]
        if missing:
            log("WARNING, IAPs missing metadata (not sent): " + ", ".join(missing))

    # 7. Submit for review.
    open_subs = call("GET", f"/v1/reviewSubmissions?filter[app]={app_id}&filter[platform]=IOS"
                            "&filter[state]=READY_FOR_REVIEW,UNRESOLVED_ISSUES&limit=10")["data"]
    sub = open_subs[0] if open_subs else call("POST", "/v1/reviewSubmissions", {"data": {
        "type": "reviewSubmissions", "attributes": {"platform": "IOS"},
        "relationships": {"app": {"data": {"type": "apps", "id": app_id}}}}})["data"]
    try:
        call("POST", "/v1/reviewSubmissionItems", {"data": {"type": "reviewSubmissionItems",
             "relationships": {"reviewSubmission": {"data": {"type": "reviewSubmissions", "id": sub["id"]}},
                               "appStoreVersion": {"data": {"type": "appStoreVersions", "id": vid}}}}})
    except ApiError as e:
        if e.code != 409 or "already" not in e.body.lower():
            sys.exit("Could not add the version to the review submission: " + errors_text(e))
    try:
        call("PATCH", f"/v1/reviewSubmissions/{sub['id']}", {"data": {"type": "reviewSubmissions",
             "id": sub["id"], "attributes": {"submitted": True}}})
    except ApiError as e:
        sys.exit("Submission refused by App Store Connect: " + errors_text(e))
    state = call("GET", f"/v1/appStoreVersions/{vid}")["data"]["attributes"]["appStoreState"]
    log(f"SUBMITTED: version {VERSION} (build {build_no}) is now {state}")


if __name__ == "__main__":
    try:
        main()
    except ApiError as e:
        log("App Store Connect error: " + errors_text(e))
        sys.exit(1)
