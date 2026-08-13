(function () {
  'use strict';

  var ids = [
    'brandDealsCount',
    'netBrandDealFee',
    'affiliateSales',
    'netCommissionPerSale',
    'liveBadgeNet',
    'platformBonusNet'
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
      'brandDeals', 'brandDealsDetail', 'affiliateRevenue', 'affiliateDetail',
      'badgeIncome', 'badgeDetail', 'reelsBonus', 'reelsBonusDetail',
      'totalEarnings', 'totalDetail', 'perPost', 'perReel', 'perFollower',
      'engagementMultiplier'
    ].forEach(function (id) { text(id, '—'); });
    resultsCard.classList.add('has-invalid-inputs');
  }

  function calculate(shouldFocus) {
    if (!validateInputs(Boolean(shouldFocus))) {
      clearResults();
      return false;
    }

    var brandDealsCount = count('brandDealsCount');
    var netBrandDealFee = number('netBrandDealFee');
    var affiliateSales = count('affiliateSales');
    var netCommissionPerSale = number('netCommissionPerSale');
    var liveBadgeNet = number('liveBadgeNet');
    var platformBonusNet = number('platformBonusNet');

    var brandRevenue = brandDealsCount * netBrandDealFee;
    var affiliateRevenue = affiliateSales * netCommissionPerSale;
    var total = brandRevenue + affiliateRevenue + liveBadgeNet + platformBonusNet;

    text('brandDeals', money(brandRevenue));
    text('brandDealsDetail', Math.round(brandDealsCount).toLocaleString('en-US') + ' completed deliverables × ' + money(netBrandDealFee));
    text('affiliateRevenue', money(affiliateRevenue));
    text('affiliateDetail', Math.round(affiliateSales).toLocaleString('en-US') + ' attributed sales × ' + money(netCommissionPerSale));
    text('badgeIncome', money(liveBadgeNet));
    text('badgeDetail', 'Net dashboard amount entered directly');
    text('reelsBonus', money(platformBonusNet));
    text('reelsBonusDetail', 'Confirmed dashboard offer entered directly');
    text('totalEarnings', money(total));
    text('totalDetail', 'Sum of the four visible revenue lines; no hidden multipliers.');
    text('perPost', money(netBrandDealFee));
    text('perReel', money(netCommissionPerSale));
    text('perFollower', money(0));
    text('engagementMultiplier', '0×');
    resultsCard.classList.remove('has-invalid-inputs');
    formStatus.textContent = shouldFocus ? 'Scenario updated from your entries.' : '';
    return true;
  }

  document.addEventListener('DOMContentLoaded', function () {
    resultsCard = document.getElementById('instagramResults');
    formStatus = document.getElementById('instagramFormStatus');
    ids.forEach(function (id) {
      var element = document.getElementById(id);
      if (element) element.addEventListener('input', function () { calculate(false); });
    });
    var button = document.getElementById('calculateBtn');
    if (button) {
      button.addEventListener('click', function () {
        if (calculate(true)) {
          document.getElementById('instagramResults').focus();
          if (typeof window.crcTrackEvent === 'function') {
            window.crcTrackEvent('calculator_completed');
          }
        }
      });
    }
    calculate(false);
  });
})();
