(function () {
  'use strict';

  var ids = [
    'subscribers',
    'netPerSubscriber',
    'bitsPerMonth',
    'adImpressions',
    'netAdRevenuePerThousand',
    'sponsorshipRevenueInput'
  ];
  var resultsCard;
  var formStatus;

  function number(id) {
    var element = document.getElementById(id);
    return element ? Number(element.value) || 0 : 0;
  }

  function count(id) {
    return number(id);
  }

  function money(value) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2
    }).format(value);
  }

  function text(id, value) {
    var element = document.getElementById(id);
    if (element) element.textContent = value;
  }

  function inputIsValid(input) {
    return input && input.value.trim() !== '' && Number.isFinite(Number(input.value)) && input.checkValidity();
  }

  function validateInputs(shouldFocus) {
    var firstInvalid = null;
    ids.forEach(function (id) {
      var input = document.getElementById(id);
      if (inputIsValid(input)) {
        input.removeAttribute('aria-invalid');
      } else {
        input.setAttribute('aria-invalid', 'true');
        if (!firstInvalid) firstInvalid = input;
      }
    });

    if (!firstInvalid) return true;

    var label = document.querySelector('label[for="' + firstInvalid.id + '"]');
    formStatus.textContent = 'Review ' + (label ? label.textContent.trim() : 'the highlighted field') + '. Use a value within the displayed range and increment.';
    if (shouldFocus) firstInvalid.focus();
    return false;
  }

  function clearResults() {
    [
      'subscriptions', 'subscriptionsDetail', 'bits', 'bitsDetail', 'adRevenue',
      'adRevenueDetail', 'sponsorships', 'sponsorshipsDetail', 'totalEarnings',
      'totalDetail', 'perSubscriber', 'per100Bits', 'perHour', 'twitchFee'
    ].forEach(function (id) { text(id, '—'); });
    resultsCard.classList.add('has-invalid-inputs');
  }

  function calculate(shouldFocus) {
    if (!validateInputs(Boolean(shouldFocus))) {
      clearResults();
      return false;
    }

    var subscribers = count('subscribers');
    var netPerSubscriber = number('netPerSubscriber');
    var bitsUsed = count('bitsPerMonth');
    var adImpressions = count('adImpressions');
    var netAdsPerThousand = number('netAdRevenuePerThousand');
    var sponsorshipRevenue = number('sponsorshipRevenueInput');

    var subscriptionRevenue = subscribers * netPerSubscriber;
    var bitsRevenue = bitsUsed * 0.01;
    var adRevenue = adImpressions / 1000 * netAdsPerThousand;
    var total = subscriptionRevenue + bitsRevenue + adRevenue + sponsorshipRevenue;

    text('subscriptions', money(subscriptionRevenue));
    text('subscriptionsDetail', Math.round(subscribers).toLocaleString('en-US') + ' subscriptions × ' + money(netPerSubscriber));
    text('bits', money(bitsRevenue));
    text('bitsDetail', Math.round(bitsUsed).toLocaleString('en-US') + ' Bits × $0.01');
    text('adRevenue', money(adRevenue));
    text('adRevenueDetail', Math.round(adImpressions).toLocaleString('en-US') + ' impressions ÷ 1,000 × ' + money(netAdsPerThousand));
    text('sponsorships', money(sponsorshipRevenue));
    text('sponsorshipsDetail', 'Completed revenue entered directly');
    text('totalEarnings', money(total));
    text('totalDetail', 'Sum of the four visible revenue lines; no hidden multipliers.');
    text('perSubscriber', money(netPerSubscriber));
    text('per100Bits', money(1));
    text('perHour', money(netAdsPerThousand));
    text('twitchFee', money(0));
    resultsCard.classList.remove('has-invalid-inputs');
    formStatus.textContent = shouldFocus ? 'Scenario updated from your entries.' : '';
    return true;
  }

  document.addEventListener('DOMContentLoaded', function () {
    resultsCard = document.getElementById('twitchResults');
    formStatus = document.getElementById('twitchFormStatus');
    ids.forEach(function (id) {
      var element = document.getElementById(id);
      if (element) element.addEventListener('input', function () { calculate(false); });
    });
    var button = document.getElementById('calculateBtn');
    if (button) {
      button.addEventListener('click', function () {
        if (calculate(true)) {
          document.getElementById('twitchResults').focus();
          if (typeof window.crcTrackEvent === 'function') {
            window.crcTrackEvent('calculator_completed');
          }
        }
      });
    }
    calculate(false);
  });
})();
