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
  printStyles.media = 'print';
  document.head.appendChild(printStyles);

  function canonicalToolUrl() {
    var canonical = document.querySelector('link[rel="canonical"]');
    try {
      var parsed = new URL(canonical ? canonical.href : window.location.href, window.location.origin);
      return parsed.origin + parsed.pathname;
    } catch (error) {
      return window.location.origin + window.location.pathname;
    }
  }

  function fallbackCopy(value) {
    var textarea = document.createElement('textarea');
    textarea.value = value;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    var copied = false;
    try { copied = document.execCommand('copy'); } catch (error) {}
    textarea.remove();
    return copied;
  }

  function copyToolUrl(value) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(value).then(function() { return true; }).catch(function() { return fallbackCopy(value); });
    }
    return Promise.resolve(fallbackCopy(value));
  }

  resultCards.forEach(function(card) {
    card.setAttribute('data-printable-results', '');
    if (!card.querySelector('.print-results-button')) {
      var printButton = document.createElement('button');
      printButton.type = 'button';
      printButton.className = 'print-results-button';
      printButton.textContent = 'Print Results';
      printButton.title = 'Print these results or save them as a PDF';
      printButton.addEventListener('click', function() {
        if (typeof window.crcTrackEvent === 'function') window.crcTrackEvent('result_printed');
        window.print();
      });
      card.appendChild(printButton);
    }

    if (!card.querySelector('.share-tool-button')) {
      var shareButton = document.createElement('button');
      var shareStatus = document.createElement('span');
      shareButton.type = 'button';
      shareButton.className = 'share-tool-button';
      shareButton.textContent = 'Share Tool';
      shareButton.title = 'Share or copy this tool link; result values are not included';
      shareStatus.className = 'share-tool-status';
      shareStatus.setAttribute('role', 'status');
      shareStatus.setAttribute('aria-live', 'polite');
      shareButton.addEventListener('click', function() {
        var url = canonicalToolUrl();
        shareStatus.textContent = '';
        if (navigator.share) {
          navigator.share({ title: document.title, url: url }).then(function() {
            shareStatus.textContent = 'Tool link shared.';
          }).catch(function(error) {
            if (error && error.name === 'AbortError') return;
            copyToolUrl(url).then(function(copied) {
              shareStatus.textContent = copied ? 'Tool link copied.' : 'Sharing is unavailable. Copy the page address from your browser.';
            });
          });
        } else {
          copyToolUrl(url).then(function(copied) {
            shareStatus.textContent = copied ? 'Tool link copied.' : 'Sharing is unavailable. Copy the page address from your browser.';
          });
        }
      });
      card.appendChild(shareButton);
      card.appendChild(shareStatus);
    }
  });
});

(function() {
  var measurementId = 'G-EVYCWFNNP5';
  var storageKey = 'creatorrevenuecalculator:analytics-consent';
  var scriptId = 'creatorrevenuecalculator-google-analytics';
  var analyticsEnabled = false;
  var permittedEvents = {
    calculator_completed: true,
    result_copied: true,
    result_printed: true
  };

  function globalPrivacyControlIsActive() {
    try {
      return navigator.globalPrivacyControl === true;
    } catch (error) {
      return false;
    }
  }

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
    if (analyticsEnabled) return;
    analyticsEnabled = true;
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
    analyticsEnabled = false;
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied'
      });
    }
    setDisabled(true);
    var injectedScript = document.getElementById(scriptId);
    if (injectedScript) injectedScript.remove();
    clearAnalyticsCookies();
  }

  window.crcTrackEvent = function(eventName) {
    if (!analyticsEnabled || !permittedEvents[eventName] || typeof window.gtag !== 'function') return false;
    window.gtag('event', eventName, {
      page_location: window.location.origin + window.location.pathname,
      page_path: window.location.pathname,
      page_title: document.title
    });
    return true;
  };

  function saveChoice(choice) {
    if (globalPrivacyControlIsActive()) choice = 'denied';
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

  function focusOnNextFrame(target) {
    window.requestAnimationFrame(function() {
      if (target && target.isConnected) target.focus();
    });
  }

  function showChoices(launcher) {
    if (document.getElementById('crc-analytics-choices')) return;
    if (launcher) launcher.remove();

    var gpcActive = globalPrivacyControlIsActive();

    var dialog = document.createElement('div');
    dialog.id = 'crc-analytics-choices';
    dialog.className = 'crc-analytics-dialog';
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-label', 'Analytics choices');

    var heading = document.createElement('strong');
    heading.textContent = 'Optional, privacy-limited analytics';
    var copy = document.createElement('p');
    copy.textContent = gpcActive
      ? 'Your browser sent a Global Privacy Control signal, so optional analytics remain off.'
      : 'If allowed, Google Analytics receives this page title and path plus generic calculate, copy, and print actions. URL queries, calculator inputs, and results are never sent.';
    var actions = document.createElement('div');
    actions.className = 'crc-analytics-actions';
    var deny = makeButton(gpcActive ? 'Close privacy choices' : 'Continue without analytics', 'crc-analytics-secondary');
    var allow = makeButton('Allow analytics', 'crc-analytics-primary');
    var details = document.createElement('a');
    details.href = '/privacy.html';
    details.textContent = 'Privacy details';

    deny.addEventListener('click', function() {
      saveChoice('denied');
      dialog.remove();
      focusOnNextFrame(showLauncher());
    });
    allow.addEventListener('click', function() {
      saveChoice('granted');
      dialog.remove();
      focusOnNextFrame(showLauncher());
    });

    actions.appendChild(deny);
    if (!gpcActive) actions.appendChild(allow);
    actions.appendChild(details);
    dialog.appendChild(heading);
    dialog.appendChild(copy);
    dialog.appendChild(actions);
    document.body.appendChild(dialog);
    focusOnNextFrame(deny);
  }

  function showLauncher() {
    var existing = document.getElementById('crc-privacy-choices');
    if (existing) return existing;
    var launcher = makeButton('Privacy choices', 'crc-privacy-launcher');
    launcher.id = 'crc-privacy-choices';
    launcher.addEventListener('click', function() { showChoices(launcher); });
    document.body.appendChild(launcher);
    return launcher;
  }

  document.addEventListener('DOMContentLoaded', function() {
    var choice = null;
    try { choice = window.localStorage.getItem(storageKey); } catch (error) {}
    if (globalPrivacyControlIsActive()) {
      saveChoice('denied');
      showLauncher();
      return;
    }
    if (choice === 'granted') initializeAnalytics();
    if (choice === 'granted' || choice === 'denied') showLauncher();
    else showChoices(null);
  });
})();
