#!/bin/sh
# Run on a Mac after `npx cap add ios`. Locks ARKANA to landscape, hides the status bar,
# declares no encryption (skips the export-compliance question) and lets ProMotion phones run smoothly.
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
echo "Info.plist ready"
