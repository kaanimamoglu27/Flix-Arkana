/* Flix Arkana: the one place for AdMob ids and switches (app only; the web build never loads AdMob).
   Real ids come from AdMob (apps.admob.com > Apps > Flix Arkana > App settings / Ad units).
   An id left empty (or not in the ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX form) falls back to Google's TEST ad unit.
   The env variables ADMOB_APP_ID / ADMOB_REWARDED_ID (GitHub secrets) override these ids at build time (tools/ios_setup.py). */
window.FLIX_ADS_CONFIG = {
  // true: always Google's test ads. tools/ios_setup.py sets it in the app's copy: false for release builds (ADS_MODE=real).
  forceTestAds: false,
  ids: {
    IOS_APP_ID: 'ca-app-pub-9939733946730095~7866593636',      // ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX
    IOS_REWARDED: 'ca-app-pub-9939733946730095/3988213328',    // rewarded: "Reklam izle, devam et" (one revive per run)
    IOS_INTERSTITIAL: '',
    IOS_BANNER: '',
    ANDROID_REWARDED: '',
    ANDROID_INTERSTITIAL: '',
    ANDROID_BANNER: ''
  },
  // Arkana only shows the optional rewarded revive; no interstitials, no banner.
  interstitial: false,
  bannerEnabled: false,
  // Asks the iPhone's "Allow tracking?" question once. If false, also update App Store Connect > App Privacy.
  requestTracking: true,
  testDevices: []
};
