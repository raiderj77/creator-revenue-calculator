/**
 * Google Consent Mode v2 + Cookie Consent Banner
 * Creator Revenue Calculator
 * Must load BEFORE any gtag, Google Analytics, or AdSense scripts.
 */
(function () {
  'use strict';

  // --- Google Consent Mode v2: default all denied ---
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;

  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    functionality_storage: 'denied',
    personalization_storage: 'denied',
    wait_for_update: 500
  });

  // --- Apply saved preference immediately (before banner renders) ---
  var saved = localStorage.getItem('cookie_consent');
  if (saved === 'granted') {
    gtag('consent', 'update', {
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
      analytics_storage: 'granted',
      functionality_storage: 'granted',
      personalization_storage: 'granted'
    });
  }
  // 'declined' keeps everything denied — no update needed

  // --- Banner logic (runs after DOM ready) ---
  function initBanner() {
    if (saved) return; // choice already made, no banner

    var banner = document.createElement('div');
    banner.id = 'crc-consent-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Cookie consent');
    banner.innerHTML =
      '<p style="margin:0 0 0.5rem;">We use cookies for analytics and ads. ' +
      '<a href="/cookies.html" style="color:#818cf8;">Learn more</a></p>' +
      '<button id="crc-accept" style="background:#6366f1;color:#fff;border:none;padding:0.5rem 1.5rem;border-radius:0.375rem;cursor:pointer;margin-right:0.5rem;font-size:0.95rem;">Accept</button>' +
      '<button id="crc-decline" style="background:transparent;color:#9ca3af;border:1px solid #4b5563;padding:0.5rem 1.5rem;border-radius:0.375rem;cursor:pointer;font-size:0.95rem;">Decline</button>';

    banner.style.cssText =
      'position:fixed;bottom:0;left:0;right:0;background:#1f2937;color:#fff;' +
      'padding:1rem;text-align:center;z-index:9999;box-shadow:0 -2px 8px rgba(0,0,0,0.3);';

    document.body.appendChild(banner);

    document.getElementById('crc-accept').addEventListener('click', function () {
      localStorage.setItem('cookie_consent', 'granted');
      gtag('consent', 'update', {
        ad_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted',
        analytics_storage: 'granted',
        functionality_storage: 'granted',
        personalization_storage: 'granted'
      });
      banner.remove();
    });

    document.getElementById('crc-decline').addEventListener('click', function () {
      localStorage.setItem('cookie_consent', 'declined');
      banner.remove();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBanner);
  } else {
    initBanner();
  }
})();
