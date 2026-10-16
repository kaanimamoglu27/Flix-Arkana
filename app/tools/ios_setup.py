#!/usr/bin/env python3
"""Prepares the iOS project after `npx cap add ios` / `npx cap sync ios`. Works on Mac, Linux and GitHub Actions.
- locks ARKANA to landscape, hides the status bar, full screen on iPad
- declares no non-exempt encryption (skips the export-compliance question on every upload)
- lets ProMotion iPhones run at 120 Hz
- AdMob app id (env ADMOB_APP_ID, Google's TEST id if unset) + tracking prompt text + SKAdNetwork id
- copies the app icon (store/icon-1024.png) and launch screen (store/cizgi_roman/acilis_ekrani_2732.png)
- env ADMOB_REWARDED_ID sets the real rewarded ad unit (Google's TEST unit if unset)
- optional env BUILD_NUMBER / APP_VERSION set the build number and version shown in the App Store"""
import json, os, plistlib, subprocess, pathlib, re, shutil
app = pathlib.Path(__file__).resolve().parent.parent
ios = app / 'ios' / 'App'
pl_path = ios / 'App' / 'Info.plist'
with open(pl_path, 'rb') as f: pl = plistlib.load(f)
land = ['UIInterfaceOrientationLandscapeRight', 'UIInterfaceOrientationLandscapeLeft']
pl['UISupportedInterfaceOrientations'] = land
pl['UISupportedInterfaceOrientations~ipad'] = land
pl['UIRequiresFullScreen'] = True
pl['UIStatusBarHidden'] = True
pl['UIViewControllerBasedStatusBarAppearance'] = False
pl['ITSAppUsesNonExemptEncryption'] = False
pl['CADisableMinimumFrameDurationOnPhone'] = True
pl['CFBundleDisplayName'] = 'ARKANA'
pl['GADApplicationIdentifier'] = os.environ.get('ADMOB_APP_ID') or 'ca-app-pub-3940256099942544~1458002511'
pl['NSUserTrackingUsageDescription'] = 'Reklamları sana daha uygun göstermek için kullanılır. Hayır dersen oyun aynı şekilde çalışır.'
pl['SKAdNetworkItems'] = [{'SKAdNetworkIdentifier': 'cstr6suwn9.skadnetwork'}]
with open(pl_path, 'wb') as f: plistlib.dump(pl, f)
xc = ios / 'App' / 'Assets.xcassets'
shutil.copy(app / 'store' / 'icon-1024.png', xc / 'AppIcon.appiconset' / 'AppIcon-512@2x.png')
splash = app / 'store' / 'cizgi_roman' / 'acilis_ekrani_2732.png'
if splash.exists():
    # one compressed launch image instead of three 4.5 MB copies (keeps the app download small)
    si = xc / 'Splash.imageset'
    for f in si.glob('*.png'): f.unlink()
    try:
        from PIL import Image
        Image.open(splash).convert('RGB').save(si / 'splash.jpg', quality=88, optimize=True); name = 'splash.jpg'
    except ImportError:
        name = 'splash.jpg'
        if shutil.which('sips'):  # macOS built-in image tool
            subprocess.run(['sips', '-s', 'format', 'jpeg', '-s', 'formatOptions', '88', str(splash), '--out', str(si / name)], check=True, capture_output=True)
        else:
            shutil.copy(splash, si / 'splash.png'); name = 'splash.png'
    (si / 'Contents.json').write_text(json.dumps({'images': [{'idiom': 'universal', 'filename': name}], 'info': {'author': 'xcode', 'version': 1}}, indent=2))
# rewarded ad unit (env ADMOB_REWARDED_ID) goes into the copy of native-bridge.js inside the app
ad = os.environ.get('ADMOB_REWARDED_ID')
nb = ios / 'App' / 'public' / 'native-bridge.js'
if ad and nb.exists():
    nb.write_text(nb.read_text().replace("'ca-app-pub-3940256099942544/1712485313'", repr(ad)))
    print('rewarded ad unit set')
pbx = ios / 'App.xcodeproj' / 'project.pbxproj'
s = pbx.read_text()
if os.environ.get('BUILD_NUMBER'): s = re.sub(r'CURRENT_PROJECT_VERSION = [^;]+;', 'CURRENT_PROJECT_VERSION = %s;' % os.environ['BUILD_NUMBER'], s)
if os.environ.get('APP_VERSION'): s = re.sub(r'MARKETING_VERSION = [^;]+;', 'MARKETING_VERSION = %s;' % os.environ['APP_VERSION'], s)
pbx.write_text(s)
print('iOS project ready: landscape, icon, launch screen, AdMob id', pl['GADApplicationIdentifier'])
