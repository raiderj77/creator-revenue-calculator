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

  function calculate() {
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
  }

  document.addEventListener('DOMContentLoaded', function () {
    ids.forEach(function (id) {
      var element = document.getElementById(id);
      if (element) element.addEventListener('input', calculate);
    });
    var button = document.getElementById('calculateBtn');
    if (button) button.addEventListener('click', calculate);
    calculate();
  });
})();
