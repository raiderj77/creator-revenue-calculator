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

  function number(id) {
    var element = document.getElementById(id);
    var parsed = element ? Number.parseFloat(element.value) : 0;
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
  }

  function count(id) {
    return Math.floor(number(id));
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

  function inputsAreValid() {
    return ids.every(function (id) {
      var element = document.getElementById(id);
      return element && element.value.trim() !== '' && element.checkValidity();
    });
  }

  function calculate() {
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
  }

  document.addEventListener('DOMContentLoaded', function () {
    ids.forEach(function (id) {
      var element = document.getElementById(id);
      if (element) element.addEventListener('input', calculate);
    });
    var button = document.getElementById('calculateBtn');
    if (button) {
      button.addEventListener('click', function () {
        calculate();
        if (inputsAreValid() && typeof window.crcTrackEvent === 'function') {
          window.crcTrackEvent('calculator_completed');
        }
      });
    }
    calculate();
  });
})();
