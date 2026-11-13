/* ARKANA native bridge (Capacitor 8).
   The game calls window.FlixNative.{buy, restore, price, haptic, showRewardedAd}.
   On the web this file does nothing and the store runs as a clearly marked demo.
   Inside the iOS / Android app it connects to:
     - cordova-plugin-purchase (CdvPurchase v13) for App Store / Google Play in-app purchases
     - @capacitor-community/admob (via ads.js) for the rewarded revive and the paced interstitial between runs
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
    // every paid transaction is handed to the game (FlixGrant skips ones it already gave), then finished.
    // This also covers purchases that complete later: app closed mid-payment, "Ask to Buy", slow networks.
    S.when().approved(t => t.verify()).verified(r => r.finish())
      .finished(t => { for (const p of t.products) { try { if (window.FlixGrant) window.FlixGrant(p.id, t.transactionId || null); } catch (e) {} settle(p.id, true); } })
      .productUpdated(() => { try { if (window.onStorePrices) window.onStorePrices(); } catch (e) {} });
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

  // Rewarded ad: AdMob runs in ads.js (window.FlixAds; ids in ads-config.js, Google consent + tracking question there).
  // Resolves true when the player earned the reward, or when no ad could be shown (we never punish a missing ad), false when closed early.
  async function showRewardedAd() {
    const F = window.FlixAds; if (!F) return true;
    const r = await F.showRewarded(6000);
    return r !== 'closed';
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
  
  if (P.StatusBar) P.StatusBar.hide().catch(() => {});
})();
