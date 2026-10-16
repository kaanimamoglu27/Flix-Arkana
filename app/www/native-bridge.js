/* ARKANA native bridge (Capacitor 6).
   The game calls window.FlixNative.{buy, restore, price, haptic, showRewardedAd}.
   On the web this file does nothing and the store runs as a clearly marked demo.
   Inside the iOS / Android app it connects to:
     - cordova-plugin-purchase (CdvPurchase v13) for App Store / Google Play in-app purchases
     - @capacitor-community/admob for the one rewarded ad after death ("watch an ad, keep playing")
     - @capacitor/haptics for hit vibration
     - @capacitor/status-bar to hide the status bar */
(function () {
  const Cap = window.Capacitor;
  if (!Cap || !Cap.isNativePlatform || !Cap.isNativePlatform()) return;
  const ios = Cap.getPlatform() === 'ios';
  const P = Cap.Plugins || {};

  // Product ids must match App Store Connect and Google Play Console exactly.
  const CONSUMABLE = ['bundle_mini', 'gems_80', 'gems_500', 'gems_1200', 'gems_2600', 'gems_7000', 'gems_15000', 'coins_1000', 'coins_6000', 'coins_15000', 'coins_40000'];
  const NON_CONSUMABLE = ['starter', 'bundle_hero', 'bundle_adv', 'bundle_legend', 'bundle_god', 'noads'];

  let store = null; const pending = {};
  function settle(id, ok) { if (pending[id]) { pending[id](ok); delete pending[id]; } }
  function initStore() {
    if (!window.CdvPurchase) { console.warn('CdvPurchase missing'); return; }
    const {store: S, ProductType, Platform} = window.CdvPurchase;
    const platform = ios ? Platform.APPLE_APPSTORE : Platform.GOOGLE_PLAY;
    S.register([
      ...CONSUMABLE.map(id => ({id, type: ProductType.CONSUMABLE, platform})),
      ...NON_CONSUMABLE.map(id => ({id, type: ProductType.NON_CONSUMABLE, platform}))
    ]);
    // Receipts are checked on the device. For stronger anti-cheat add a server validator (e.g. RevenueCat or iaptic) via S.validator.
    S.when().approved(t => t.verify()).verified(r => r.finish()).finished(t => { for (const p of t.products) settle(p.id, true); });
    S.error(e => { console.warn('store error', e); for (const id in pending) settle(id, false); });
    S.initialize([platform]);
    store = S;
  }

  // Map the game's buzz(ms) to native impacts: short taps light, kills medium, bosses heavy.
  let lastHap = 0;
  function haptic(ms) {
    const H = P.Haptics; if (!H) return;
    const now = Date.now(); if (now - lastHap < 40) return; lastHap = now;
    H.impact({style: ms >= 80 ? 'HEAVY' : ms >= 25 ? 'MEDIUM' : 'LIGHT'}).catch(() => {});
  }

  // Rewarded ad (AdMob). These are Google's public TEST ids; replace them with your own
  // AdMob ad unit ids before sending the app to review (AdMob > Apps > Ad units).
  const AD_UNIT = ios ? 'ca-app-pub-3940256099942544/1712485313' : 'ca-app-pub-3940256099942544/5224354917';
  const AD_TESTING = AD_UNIT.indexOf('3940256099942544') >= 0;
  let adReady = null;
  async function initAds() {
    const A = P.AdMob; if (!A) return;
    try {
      await A.initialize({initializeForTesting: AD_TESTING});
      if (ios) { try { await A.requestTrackingAuthorization(); } catch (e) {} }
      try { const c = await A.requestConsentInfo(); if (c && c.isConsentFormAvailable && c.status === 'REQUIRED') await A.showConsentForm(); } catch (e) {}
      prepAd();
    } catch (e) { console.warn('admob init', e); }
  }
  function prepAd() { const A = P.AdMob; if (!A) return; adReady = A.prepareRewardVideoAd({adId: AD_UNIT, isTesting: AD_TESTING}).then(() => true).catch(() => false); }
  // resolves true when the player earned the reward, or when no ad could be shown (we never punish a missing ad), false when closed early
  async function showRewardedAd() {
    const A = P.AdMob; if (!A) return true;
    if (!adReady) prepAd();
    const ok = await adReady; adReady = null;
    if (!ok) { prepAd(); return true; }
    let got = false; const h = await A.addListener('onRewardedVideoAdReward', () => { got = true; });
    try { await A.showRewardVideoAd(); got = true; } catch (e) { got = true; }
    try { h.remove(); } catch (e) {}
    prepAd(); return got;
  }

  window.FlixNative = {
    buy(id) {
      return new Promise(res => {
        if (!store) return res(false);
        const prod = store.get(id), offer = prod && prod.getOffer();
        if (!offer) return res(false);
        pending[id] = res;
        offer.order().then(err => { if (err) settle(id, false); });
      });
    },
    async restore() {
      if (!store) return [];
      await store.restorePurchases();
      return NON_CONSUMABLE.filter(id => store.get(id) && store.get(id).owned);
    },
    // localized price string from the store, e.g. "₺44,99"; null until the store has loaded
    price(id) { const p = store && store.get(id); return p && p.pricing ? p.pricing.price : null; },
    haptic,
    showRewardedAd
  };

  document.addEventListener('deviceready', initStore, false);
  initAds();
  if (P.StatusBar) P.StatusBar.hide().catch(() => {});
})();
