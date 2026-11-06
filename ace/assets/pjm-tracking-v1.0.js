/*!
 * pjm-tracking.js — Projectman.cz centrální web tracking pro HTML deliverables
 * ---------------------------------------------------------------------------
 * Umístění (single source of truth):
 *   https://ace.projectman.cz/assets/pjm-tracking.js
 *
 * Použití — jediný řádek co nejvýše v <head> stránky:
 *   <script src="https://ace.projectman.cz/assets/pjm-tracking.js"></script>
 *
 * Co skript dělá:
 *   1. nastaví Consent Mode default = denied (GDPR: měříme až po souhlasu)
 *   2. načte GTM kontejner GTM-5BWSWGR (GA4 G-LVKJZF9C9C, Google Ads,
 *      LinkedIn Insight, MS Clarity a další služby spravované v GTM)
 *   3. po inicializaci kontejneru přehraje uložený souhlas (viz REPLAY níže)
 *   4. pokud návštěvník ještě nerozhodl, zobrazí modální consent dialog
 *
 * REPLAY — proč to není jednodušší:
 *   Kontejner GTM-5BWSWGR obsahuje CMP integraci z www.projectman.cz. Ta při
 *   startu nenajde svoji consent cookie a vynutí `consent update: denied`.
 *   Protože update má v Consent Mode přednost, jakýkoli náš souhlas nastavený
 *   PŘED načtením kontejneru je přepsán a GA4 pak posílá jen anonymní
 *   cookieless pingy, které se v GA nikdy nezobrazí. Řešením je přehrát
 *   souhlas až v onload kontejneru — proto ten háček. NEODSTRAŇOVAT.
 *
 * Změny tohoto souboru se propíšou do všech deliverables (5min cache).
 * Verze: 1.0 (2026-09-09)
 */
(function (w, d) {
  'use strict';

  var GTM_ID     = 'GTM-5BWSWGR';
  var COOKIE     = 'pjm_cc_status';
  var COOKIE_DAYS = 365;
  var SHARED_DOMAIN = 'projectman.cz';   // souhlas sdílený napříč subdoménami

  if (w.__pjmTrackingLoaded) { return; }  // ochrana proti dvojímu vložení
  w.__pjmTrackingLoaded = true;

  /* ---------- cookie helpers (bez regexu, ať nezáleží na pořadí cookies) ---------- */
  function getStatus() {
    var parts = d.cookie.split(';');
    for (var i = 0; i < parts.length; i++) {
      var kv = parts[i].trim().split('=');
      if (kv[0] === COOKIE) { return kv[1] || null; }
    }
    return null;
  }

  function setStatus(v) {
    var exp = '; max-age=' + (COOKIE_DAYS * 86400) + '; path=/; SameSite=Lax';
    if (d.location.hostname.indexOf(SHARED_DOMAIN) > -1) {
      exp += '; domain=.' + SHARED_DOMAIN;
    }
    d.cookie = COOKIE + '=' + v + exp;
  }

  /* ---------- Consent Mode ---------- */
  w.dataLayer = w.dataLayer || [];
  function gtag() { w.dataLayer.push(arguments); }

  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    wait_for_update: 500
  });

  function consentUpdate(granted) {
    var v = granted ? 'granted' : 'denied';
    gtag('consent', 'update', {
      ad_storage: v,
      ad_user_data: v,
      ad_personalization: v,
      analytics_storage: v
    });
  }

  /* ---------- GTM kontejner ---------- */
  w.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
  var j = d.createElement('script');
  j.async = true;
  j.src = 'https://www.googletagmanager.com/gtm.js?id=' + GTM_ID;
  j.onload = function () {
    // REPLAY: přebije denied, které si kontejnerová CMP nastavila při startu
    if (getStatus() === 'allow') { consentUpdate(true); }
  };
  // vložíme před první script; fallback na head / documentElement, ať to funguje
  // i ve fragmentech bez <head> a při jakémkoli způsobu načtení
  var ref = d.getElementsByTagName('script')[0];
  if (ref && ref.parentNode) { ref.parentNode.insertBefore(j, ref); }
  else { (d.head || d.documentElement).appendChild(j); }

  /* ---------- modální consent dialog ---------- */
  var CSS = ''
    + '#pjm-cc-ov{position:fixed;inset:0;z-index:99998;background:rgba(26,26,26,.72);'
    + '-webkit-backdrop-filter:blur(3px);backdrop-filter:blur(3px);display:none;'
    + 'align-items:center;justify-content:center;padding:24px}'
    + '#pjm-cc-ov.pjm-open{display:flex}'
    + '#pjm-cc{background:#fff;color:#626567;font-family:Poppins,system-ui,-apple-system,sans-serif;'
    + 'max-width:520px;width:100%;border-radius:10px;padding:32px;'
    + 'box-shadow:0 12px 40px rgba(0,0,0,.3);border-top:4px solid #FF525F;'
    + 'max-height:calc(100vh - 48px);overflow-y:auto}'
    + '#pjm-cc h2{font-family:inherit;font-size:19px;font-weight:600;color:#1a1a1a;margin:0 0 12px;line-height:1.35}'
    + '#pjm-cc p{font-size:14.5px;line-height:1.6;margin:0 0 24px}'
    + '#pjm-cc .pjm-cc-btns{display:flex;gap:12px;flex-wrap:wrap}'
    + '#pjm-cc button{font-family:inherit;font-size:14px;font-weight:500;border:none;border-radius:6px;'
    + 'padding:12px 22px;cursor:pointer;margin:0;flex:1 1 auto;min-width:160px}'
    + '#pjm-cc .pjm-cc-allow{background:#FF525F;color:#fff}'
    + '#pjm-cc .pjm-cc-deny{background:#f4f7fa;color:#626567}'
    + '#pjm-cc button:hover{opacity:.9}'
    + 'body.pjm-cc-locked{overflow:hidden}';

  var HTML = ''
    + '<div id="pjm-cc" role="dialog" aria-modal="true" aria-labelledby="pjm-cc-title">'
    +   '<h2 id="pjm-cc-title">Tento obsah je připraven pro vás.</h2>'
    +   '<p>Abychom věděli, které části vás zajímají, a mohli obsah dál zlepšovat, '
    +   'měříme jeho používání. Bez souhlasu se k obsahu dostanete také, jen bez měření.</p>'
    +   '<div class="pjm-cc-btns">'
    +     '<button type="button" class="pjm-cc-allow">Souhlasím a pokračovat</button>'
    +     '<button type="button" class="pjm-cc-deny">Pokračovat bez měření</button>'
    +   '</div>'
    + '</div>';

  function buildDialog() {
    var st = d.createElement('style');
    st.textContent = CSS;
    d.head.appendChild(st);

    var ov = d.createElement('div');
    ov.id = 'pjm-cc-ov';
    ov.innerHTML = HTML;
    d.body.appendChild(ov);

    var box = ov.firstChild;

    function close() {
      ov.classList.remove('pjm-open');
      d.body.classList.remove('pjm-cc-locked');
    }

    function open() {
      ov.classList.add('pjm-open');
      d.body.classList.add('pjm-cc-locked');
      box.querySelector('.pjm-cc-allow').focus();
      // fokus zamčený v dialogu; Esc ani klik na pozadí dialog nezavírají
      d.addEventListener('keydown', function trap(e) {
        if (!ov.classList.contains('pjm-open')) { d.removeEventListener('keydown', trap); return; }
        if (e.key === 'Tab') {
          var b = box.querySelectorAll('button'), first = b[0], last = b[b.length - 1];
          if (e.shiftKey && d.activeElement === first) { e.preventDefault(); last.focus(); }
          else if (!e.shiftKey && d.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      });
    }

    box.querySelector('.pjm-cc-allow').addEventListener('click', function () {
      setStatus('allow'); consentUpdate(true); close();
    });
    box.querySelector('.pjm-cc-deny').addEventListener('click', function () {
      setStatus('deny'); consentUpdate(false); close();
    });

    if (!getStatus()) { open(); }
  }

  var status = getStatus();
  if (status === 'allow') {
    consentUpdate(true);   // replay v j.onload to ještě zopakuje
  } else if (status === 'deny') {
    consentUpdate(false);
  }

  if (d.readyState === 'loading') {
    d.addEventListener('DOMContentLoaded', buildDialog);
  } else {
    buildDialog();
  }

  /* ---------- veřejné API pro stránky ---------- */
  w.pjmTracking = {
    /** Odeslání vlastní události do GTM/GA4. Projde jen po souhlasu. */
    event: function (name, params) {
      var o = params || {};
      o.event = name;
      o.page_hostname = d.location.hostname;
      w.dataLayer.push(o);
    },
    /** Aktuální stav souhlasu: 'allow' | 'deny' | null */
    consent: getStatus,
    /** Smaže souhlas a znovu načte stránku (pro testování). */
    reset: function () {
      d.cookie = COOKIE + '=; Max-Age=0; path=/; domain=.' + SHARED_DOMAIN;
      d.cookie = COOKIE + '=; Max-Age=0; path=/';
      d.location.reload();
    },
    version: '1.0'
  };
})(window, document);
