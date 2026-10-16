#!/bin/sh
# Run on a Mac after `npx cap add ios`. Locks ARKANA to landscape, hides the status bar,
# adds the AdMob app id + tracking prompt text, declares no encryption (skips the export-compliance question) and lets ProMotion phones run smoothly.
set -e
PL=ios/App/App/Info.plist
B=/usr/libexec/PlistBuddy
$B -c "Delete :UISupportedInterfaceOrientations" $PL 2>/dev/null || true
$B -c "Add :UISupportedInterfaceOrientations array" $PL
$B -c "Add :UISupportedInterfaceOrientations:0 string UIInterfaceOrientationLandscapeRight" $PL
$B -c "Add :UISupportedInterfaceOrientations:1 string UIInterfaceOrientationLandscapeLeft" $PL
$B -c "Delete :UISupportedInterfaceOrientations~ipad" $PL 2>/dev/null || true
$B -c "Add :UISupportedInterfaceOrientations~ipad array" $PL
$B -c "Add :UISupportedInterfaceOrientations~ipad:0 string UIInterfaceOrientationLandscapeRight" $PL
$B -c "Add :UISupportedInterfaceOrientations~ipad:1 string UIInterfaceOrientationLandscapeLeft" $PL
$B -c "Add :UIRequiresFullScreen bool true" $PL 2>/dev/null || $B -c "Set :UIRequiresFullScreen true" $PL
$B -c "Add :UIStatusBarHidden bool true" $PL 2>/dev/null || $B -c "Set :UIStatusBarHidden true" $PL
$B -c "Add :UIViewControllerBasedStatusBarAppearance bool false" $PL 2>/dev/null || $B -c "Set :UIViewControllerBasedStatusBarAppearance false" $PL
$B -c "Add :ITSAppUsesNonExemptEncryption bool false" $PL 2>/dev/null || $B -c "Set :ITSAppUsesNonExemptEncryption false" $PL
$B -c "Add :CADisableMinimumFrameDurationOnPhone bool true" $PL 2>/dev/null || true
# AdMob (rewarded ad after death). GADApplicationIdentifier below is Google's TEST app id:
# replace it with your own AdMob app id (AdMob > Apps > App settings, looks like ca-app-pub-XXXX~YYYY).
ADMOB_APP_ID=${ADMOB_APP_ID:-ca-app-pub-3940256099942544~1458002511}
$B -c "Add :GADApplicationIdentifier string $ADMOB_APP_ID" $PL 2>/dev/null || $B -c "Set :GADApplicationIdentifier $ADMOB_APP_ID" $PL
$B -c "Add :NSUserTrackingUsageDescription string 'Reklamları sana daha uygun göstermek için kullanılır. Hayır dersen oyun aynı şekilde çalışır.'" $PL 2>/dev/null || true
$B -c "Delete :SKAdNetworkItems" $PL 2>/dev/null || true
$B -c "Add :SKAdNetworkItems array" $PL
$B -c "Add :SKAdNetworkItems:0 dict" $PL
$B -c "Add :SKAdNetworkItems:0:SKAdNetworkIdentifier string cstr6suwn9.skadnetwork" $PL
echo "Info.plist ready"
