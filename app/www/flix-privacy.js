/* FLIX privacy options (app only): Google requires a way to change or withdraw ad consent (UMP privacy options
   entry point) for players in the EEA / UK / Switzerland. Next to every "Yasal Bilgiler" button
   (data-flixlegal="legal", present in every FLIX game's settings / menu) this adds a "Gizlilik Seçenekleri" button
   with the same look. It is shown only when Google says it is required (FlixAds.privacyOptionsRequired(), ads.js)
   and reopens Google's consent form (FlixAds.showPrivacyOptions()). Works for buttons the game draws later too. */
(function () {
  var Cap = window.Capacitor;
  if (!Cap || !Cap.isNativePlatform || !Cap.isNativePlatform()) return;
  var MARK = 'data-flixprivacy';
  function required() { var A = window.FlixAds; return !!(A && A.privacyOptionsRequired && A.privacyOptionsRequired()); }
  function label() {
    var l = (document.documentElement.lang || 'tr').toLowerCase();
    return l.indexOf('tr') === 0 ? 'Gizlilik Seçenekleri' : 'Privacy Options';
  }
  function sync() {
    var on = required();
    document.querySelectorAll('[' + MARK + ']').forEach(function (b) { b.hidden = !on; b.style.display = on ? '' : 'none'; });
  }
  function decorate() {
    document.querySelectorAll('[data-flixlegal="legal"]').forEach(function (legal) {
      var next = legal.nextElementSibling;
      if (next && next.hasAttribute(MARK)) return;
      var b = document.createElement(legal.tagName === 'A' ? 'a' : 'button');
      b.className = legal.className; b.setAttribute(MARK, '1');
      if (legal.getAttribute('type')) b.setAttribute('type', legal.getAttribute('type'));
      b.textContent = '🔒 ' + label();
      b.addEventListener('click', function (e) {
        e.preventDefault(); e.stopPropagation();
        var A = window.FlixAds; if (!A || !A.showPrivacyOptions || b.disabled) return;
        b.disabled = true;
        A.showPrivacyOptions().then(function () { b.disabled = false; sync(); }, function () { b.disabled = false; });
      });
      legal.parentNode.insertBefore(b, legal.nextSibling);
    });
    sync();
  }
  window.addEventListener('flixprivacy', sync);
  function startObserver() {
    decorate();
    var t = 0;
    new MutationObserver(function () { if (!t) t = setTimeout(function () { t = 0; decorate(); }, 60); })
      .observe(document.body, { childList: true, subtree: true });
  }
  if (document.body) startObserver(); else document.addEventListener('DOMContentLoaded', startObserver);
})();
