(function() {
  try {
    var stored = localStorage.getItem('theme');
    var system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    var theme = stored || system;
    document.documentElement.setAttribute('data-theme', theme);
  } catch(e) {}
})();

document.addEventListener('DOMContentLoaded', function() {
  var btn = document.getElementById('theme-toggle');
  if (btn) {
    var current = document.documentElement.getAttribute('data-theme') || 'light';
    btn.textContent = current === 'light' ? '\u{1F319}' : '\u2600\uFE0F';
    btn.setAttribute('aria-label', 'Switch to ' + (current === 'light' ? 'dark' : 'light') + ' mode');
    btn.addEventListener('click', function() {
      current = current === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', current);
      localStorage.setItem('theme', current);
      btn.textContent = current === 'light' ? '\u{1F319}' : '\u2600\uFE0F';
      btn.setAttribute('aria-label', 'Switch to ' + (current === 'light' ? 'dark' : 'light') + ' mode');
    });
  }

  var resultCards = document.querySelectorAll('.results-card');
  if (!resultCards.length) return;

  var printStyles = document.createElement('link');
  printStyles.rel = 'stylesheet';
  printStyles.href = '/assets/css/print-results.css';
  document.head.appendChild(printStyles);

  resultCards.forEach(function(card) {
    card.setAttribute('data-printable-results', '');
    if (card.querySelector('.print-results-button')) return;

    var printButton = document.createElement('button');
    printButton.type = 'button';
    printButton.className = 'print-results-button';
    printButton.textContent = 'Print Results';
    printButton.title = 'Print these results or save them as a PDF';
    printButton.addEventListener('click', function() {
      window.print();
    });
    card.appendChild(printButton);
  });
});

(function() {
  var measurementId = 'G-EVYCWFNNP5';
  var storageKey = 'creatorrevenuecalculator:analytics-consent';
  var scriptId = 'creatorrevenuecalculator-google-analytics';

  function setDisabled(disabled) {
    window['ga-disable-' + measurementId] = disabled;
  }

  function clearAnalyticsCookies() {
    document.cookie.split(';').forEach(function(cookie) {
      var name = cookie.split('=')[0].trim();
      if (name !== '_ga' && name.indexOf('_ga_') !== 0) return;
      document.cookie = name + '=; Max-Age=0; Path=/; SameSite=Lax';
      document.cookie = name + '=; Max-Age=0; Path=/; Domain=.' + window.location.hostname + '; SameSite=Lax';
    });
  }

  function initializeAnalytics() {
    setDisabled(false);
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function() { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', {
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      personalization_storage: 'denied',
      functionality_storage: 'granted',
      security_storage: 'granted'
    });
    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    });
    window.gtag('event', 'page_view', {
      page_location: window.location.origin + window.location.pathname,
      page_path: window.location.pathname,
      page_title: document.title
    });

    if (!document.getElementById(scriptId)) {
      var script = document.createElement('script');
      script.id = scriptId;
      script.async = true;
      script.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurementId;
      document.head.appendChild(script);
    }
  }

  function disableAnalytics() {
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied'
      });
    }
    setDisabled(true);
    clearAnalyticsCookies();
  }

  function saveChoice(choice) {
    try { window.localStorage.setItem(storageKey, choice); } catch (error) {}
    if (choice === 'granted') initializeAnalytics();
    else disableAnalytics();
  }

  function makeButton(label, className) {
    var button = document.createElement('button');
    button.type = 'button';
    button.textContent = label;
    button.className = className;
    return button;
  }

  function showChoices(launcher) {
    if (document.getElementById('crc-analytics-choices')) return;
    if (launcher) launcher.remove();

    var dialog = document.createElement('div');
    dialog.id = 'crc-analytics-choices';
    dialog.className = 'crc-analytics-dialog';
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-label', 'Analytics choices');

    var heading = document.createElement('strong');
    heading.textContent = 'Optional, privacy-limited analytics';
    var copy = document.createElement('p');
    copy.textContent = 'If allowed, Google Analytics receives only this page title and path after the URL query string is removed. Calculator inputs and results are never sent.';
    var actions = document.createElement('div');
    actions.className = 'crc-analytics-actions';
    var deny = makeButton('Continue without analytics', 'crc-analytics-secondary');
    var allow = makeButton('Allow analytics', 'crc-analytics-primary');
    var details = document.createElement('a');
    details.href = '/privacy.html';
    details.textContent = 'Privacy details';

    deny.addEventListener('click', function() {
      saveChoice('denied');
      dialog.remove();
      showLauncher();
    });
    allow.addEventListener('click', function() {
      saveChoice('granted');
      dialog.remove();
      showLauncher();
    });

    actions.appendChild(deny);
    actions.appendChild(allow);
    actions.appendChild(details);
    dialog.appendChild(heading);
    dialog.appendChild(copy);
    dialog.appendChild(actions);
    document.body.appendChild(dialog);
    deny.focus();
  }

  function showLauncher() {
    if (document.getElementById('crc-privacy-choices')) return;
    var launcher = makeButton('Privacy choices', 'crc-privacy-launcher');
    launcher.id = 'crc-privacy-choices';
    launcher.addEventListener('click', function() { showChoices(launcher); });
    document.body.appendChild(launcher);
  }

  document.addEventListener('DOMContentLoaded', function() {
    var style = document.createElement('style');
    style.textContent = '.crc-analytics-dialog{position:fixed;z-index:10000;left:1rem;right:1rem;bottom:1rem;max-width:42rem;margin:auto;padding:1.25rem;border:1px solid #cbd5e1;border-radius:1rem;background:#fff;color:#111827;box-shadow:0 20px 50px rgba(15,23,42,.28);font:16px/1.5 system-ui,sans-serif}.crc-analytics-dialog p{margin:.5rem 0 0;color:#374151}.crc-analytics-actions{display:flex;flex-wrap:wrap;gap:.75rem;align-items:center;margin-top:1rem}.crc-analytics-actions button,.crc-privacy-launcher{min-height:44px;border-radius:.6rem;padding:.65rem 1rem;font-weight:700;cursor:pointer}.crc-analytics-primary{border:1px solid #4f46e5;background:#4f46e5;color:#fff}.crc-analytics-secondary{border:1px solid #6b7280;background:#fff;color:#111827}.crc-analytics-actions a{color:#3730a3;font-weight:700;text-decoration:underline}.crc-privacy-launcher{position:fixed;z-index:9999;left:1rem;bottom:1rem;border:1px solid #cbd5e1;background:#fff;color:#111827;box-shadow:0 8px 24px rgba(15,23,42,.18)}[data-theme="dark"] .crc-analytics-dialog,[data-theme="dark"] .crc-privacy-launcher{border-color:#475569;background:#0f172a;color:#f8fafc}[data-theme="dark"] .crc-analytics-dialog p{color:#cbd5e1}[data-theme="dark"] .crc-analytics-secondary{border-color:#64748b;background:#0f172a;color:#f8fafc}[data-theme="dark"] .crc-analytics-actions a{color:#c7d2fe}';
    document.head.appendChild(style);

    var choice = null;
    try { choice = window.localStorage.getItem(storageKey); } catch (error) {}
    if (choice === 'granted') initializeAnalytics();
    if (choice === 'granted' || choice === 'denied') showLauncher();
    else showChoices(null);
  });
})();
