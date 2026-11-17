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

  let store = null; const pending = {}; const waiting = [];
  // products waiting for Ask to Buy approval: buy(id) answers 'pending' for them instead of ordering again
  const deferred = new Set();
  function settle(id, ok) { if (pending[id]) { pending[id](ok); delete pending[id]; } }
  // Hands an approved purchase to the game (window.FlixGrant skips transactions it already gave) and only then lets it be finished,
  // so a purchase is never lost if the app closes mid-way. A transaction that arrives before the game is ready waits.
  function deliver(t) {
    const grant = window.FlixGrant; if (!grant) return false;
    for (const p of t.products) { deferred.delete(p.id); try { grant(p.id, t.transactionId || null); } catch (e) { console.warn('grant', e); } settle(p.id, true); }
    return true;
  }
  function flush() { if (!window.FlixGrant) return; for (const t of waiting.splice(0)) if (deliver(t)) t.verify(); syncOwned(); }
  // one-time packs the store reports as owned (e.g. "No Ads" after a reinstall) are handed to the game once per launch
  const synced = new Set();
  // 2.x fix (17 Kasım 2026): store.owned() also counts the plugin's temporary "virtual.<id>" transaction that exists while
  // the Apple payment sheet is open (state "initiated"). receiptUpdated fires right then, so a non-consumable was handed out
  // before the player paid, and stayed even when the sheet was closed. Only a real, approved or finished transaction counts.
  function realOwned(id) {
    if (!store) return false;
    for (const r of store.localReceipts || []) for (const t of r.transactions || []) {
      if (String(t.transactionId || '').startsWith('virtual.')) continue;
      if (t.state !== 'approved' && t.state !== 'finished') continue;
      if (t.isConsumed || t.isPending) continue;
      if (t.expirationDate && +t.expirationDate <= Date.now()) continue;
      if ((t.products || []).some(p => p.id === id)) return true;
    }
    return false;
  }
  function syncOwned() {
    if (!store || !window.FlixGrant) return;
    for (const id of NON_CONSUMABLE) if (!synced.has(id) && realOwned(id)) { synced.add(id); try { window.FlixGrant(id, null); } catch (e) {} }
  }
  function initStore() {
    if (!window.CdvPurchase) { console.warn('CdvPurchase missing'); return; }
    const {store: S, ProductType, Platform} = window.CdvPurchase;
    const platform = ios ? Platform.APPLE_APPSTORE : Platform.GOOGLE_PLAY;
    S.register([
      ...CONSUMABLE.map(id => ({id, type: ProductType.CONSUMABLE, platform})),
      ...NON_CONSUMABLE.map(id => ({id, type: ProductType.NON_CONSUMABLE, platform}))
    ]);
    // Receipts are checked on the device. For stronger anti-cheat add a server validator (e.g. RevenueCat or iaptic) via S.validator.
    // Every paid transaction (also ones that complete later: app closed mid-payment, "Ask to Buy", slow networks) reaches the game first, then is finished.
    let priceTimer = 0;
    S.when()
      .approved(t => { if (deliver(t)) t.verify(); else waiting.push(t); })
      .pending(t => { for (const p of t.products) { deferred.add(p.id); settle(p.id, 'pending'); } })
      .verified(r => r.finish())
      .productUpdated(() => { clearTimeout(priceTimer); priceTimer = setTimeout(() => { try { if (window.onStorePrices) window.onStorePrices(); } catch (e) {} }, 300); syncOwned(); })
      .receiptUpdated(syncOwned);
    S.error(e => { console.warn('store error', e); for (const id in pending) settle(id, false); });
    S.initialize([platform]);
    store = S;
    const iv = setInterval(() => { if (window.FlixGrant) { clearInterval(iv); flush(); } }, 500);
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
    // resolves true (bought), false (cancelled / failed / store unavailable) or 'pending' (waiting for Ask to Buy approval)
    buy(id) {
      return new Promise(res => {
        if (deferred.has(id)) return res('pending');
        if (!store) return res(false);
        const prod = store.get(id), offer = prod && prod.getOffer();
        if (!offer) return res(false);
        if (pending[id]) return res(false);
        pending[id] = res;
        offer.order().then(err => { if (err) settle(id, false); }, () => settle(id, false));
      });
    },
    // resolves with the owned one-time pack ids ([] when there is nothing to restore); rejects when the store can't be reached
    async restore() {
      if (!store) throw new Error('store unavailable');
      const err = await store.restorePurchases();
      if (err) throw err;
      return NON_CONSUMABLE.filter(id => realOwned(id));
    },
    // localized price string from the store, e.g. "₺44,99"; null until the store has loaded
    price(id) { const p = store && store.get(id); return p && p.pricing ? p.pricing.price : null; },
    haptic,
    showRewardedAd
  };

  document.addEventListener('deviceready', () => { try { initStore(); } catch (e) { console.warn('store init', e); store = null; } }, false);
  
  if (P.StatusBar) P.StatusBar.hide().catch(() => {});
})();
