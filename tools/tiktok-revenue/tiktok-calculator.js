(function () {
  'use strict';

  var ids = [
    'qualifiedViews',
    'rewardPerThousand',
    'brandDealsCount',
    'netBrandDealFee',
    'liveNetRevenue',
    'otherNetRevenue'
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
    var qualifiedViews = count('qualifiedViews');
    var rewardPerThousand = number('rewardPerThousand');
    var brandDealsCount = count('brandDealsCount');
    var netBrandDealFee = number('netBrandDealFee');
    var liveNetRevenue = number('liveNetRevenue');
    var otherNetRevenue = number('otherNetRevenue');

    var rewardsRevenue = qualifiedViews / 1000 * rewardPerThousand;
    var brandRevenue = brandDealsCount * netBrandDealFee;
    var total = rewardsRevenue + brandRevenue + liveNetRevenue + otherNetRevenue;

    text('creatorFund', money(rewardsRevenue));
    text('creatorFundDetail', Math.round(qualifiedViews).toLocaleString('en-US') + ' qualified views ÷ 1,000 × ' + money(rewardPerThousand));
    text('brandDeals', money(brandRevenue));
    text('brandDealsDetail', Math.round(brandDealsCount).toLocaleString('en-US') + ' completed deals × ' + money(netBrandDealFee));
    text('liveGifts', money(liveNetRevenue));
    text('liveGiftsDetail', 'Net dashboard amount entered directly');
    text('otherRevenue', money(otherNetRevenue));
    text('totalEarnings', money(total));
    text('totalDetail', 'Sum of the four visible revenue lines; no hidden multipliers.');
    text('per1kViews', money(rewardPerThousand));
    text('perVideo', money(netBrandDealFee));
    text('perFollower', money(0));
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
