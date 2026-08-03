(function () {
  'use strict';

  var inputIds = [
    'subscriberMode',
    'paidSubscribers',
    'listSize',
    'conversionRate',
    'monthlyPrice',
    'platformFeePercent',
    'completedSponsorships',
    'netPerSponsorship',
    'confirmedReferrals',
    'netPerReferral',
    'otherMonthlyCosts'
  ];

  function value(id, maximum) {
    var element = document.getElementById(id);
    var parsed = element ? Number.parseFloat(element.value) : 0;
    if (!Number.isFinite(parsed) || parsed <= 0) return 0;
    return typeof maximum === 'number' ? Math.min(parsed, maximum) : parsed;
  }

  function count(id) {
    return Math.floor(value(id));
  }

  function text(id, content) {
    var element = document.getElementById(id);
    if (element) element.textContent = content;
  }

  function formatMoney(amount) {
    var absolute = Math.abs(amount);
    var formatted = absolute.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    return (amount < 0 ? '-$' : '$') + formatted;
  }

  function formatDeduction(amount) {
    return '-$' + Math.abs(amount).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  function updateSubscriberMode() {
    var mode = document.getElementById('subscriberMode');
    var direct = document.getElementById('directSubscriberGroup');
    var derived = document.getElementById('derivedSubscriberGroup');
    var useDerived = mode && mode.value === 'derived';
    if (direct) direct.classList.toggle('visible', !useDerived);
    if (derived) derived.classList.toggle('visible', useDerived);
  }

  function calculate() {
    var mode = document.getElementById('subscriberMode');
    var useDerived = mode && mode.value === 'derived';
    var listSize = count('listSize');
    var conversionRate = value('conversionRate', 100);
    var paidSubscribers = useDerived
      ? Math.round(listSize * conversionRate / 100)
      : count('paidSubscribers');
    var monthlyPrice = value('monthlyPrice');
    var platformFeePercent = value('platformFeePercent', 100);
    var completedSponsorships = count('completedSponsorships');
    var netPerSponsorship = value('netPerSponsorship');
    var confirmedReferrals = count('confirmedReferrals');
    var netPerReferral = value('netPerReferral');
    var otherMonthlyCosts = value('otherMonthlyCosts');

    var grossSubscriptions = paidSubscribers * monthlyPrice;
    var platformFee = grossSubscriptions * platformFeePercent / 100;
    var netSubscriptions = grossSubscriptions - platformFee;
    var sponsorshipRevenue = completedSponsorships * netPerSponsorship;
    var referralRevenue = confirmedReferrals * netPerReferral;
    var totalMonthly = netSubscriptions + sponsorshipRevenue + referralRevenue - otherMonthlyCosts;
    var totalAnnual = totalMonthly * 12;

    text('paidSubs', useDerived
      ? paidSubscribers.toLocaleString('en-US') + ' paid subscribers from your list-size and conversion inputs'
      : paidSubscribers.toLocaleString('en-US') + ' paid subscribers entered directly');
    text('grossSub', formatMoney(grossSubscriptions));
    text('subscriptionDetail', paidSubscribers.toLocaleString('en-US') + ' × ' + formatMoney(monthlyPrice));
    text('feeDeduction', formatDeduction(platformFee));
    text('feeDeductionPct', platformFeePercent.toFixed(2) + '% entered manually');
    text('netSub', formatMoney(netSubscriptions));
    text('sponsorRevenue', formatMoney(sponsorshipRevenue));
    text('sponsorshipDetail', completedSponsorships.toLocaleString('en-US') + ' × ' + formatMoney(netPerSponsorship));
    text('referralRevenue', formatMoney(referralRevenue));
    text('referralDetail', confirmedReferrals.toLocaleString('en-US') + ' × ' + formatMoney(netPerReferral));
    text('otherCosts', formatDeduction(otherMonthlyCosts));
    text('totalMonthly', formatMoney(totalMonthly));
    text('breakdownTotal', formatMoney(totalMonthly));
    text('totalAnnual', formatMoney(totalAnnual));

    var copy = document.getElementById('copyResult');
    if (copy) {
      copy.dataset.result = [
        'Newsletter scenario: ' + formatMoney(totalMonthly) + ' per month',
        'net subscriptions ' + formatMoney(netSubscriptions),
        'completed sponsorships ' + formatMoney(sponsorshipRevenue),
        'confirmed referrals ' + formatMoney(referralRevenue),
        'other costs ' + formatMoney(otherMonthlyCosts)
      ].join('; ') + '.';
    }
  }

  function initializeFaq() {
    document.querySelectorAll('.faq-question').forEach(function (question) {
      question.setAttribute('aria-expanded', 'false');
      question.addEventListener('click', function () {
        var answer = question.nextElementSibling;
        var open = answer && answer.classList.contains('active');
        document.querySelectorAll('.faq-question').forEach(function (item) {
          item.classList.remove('active');
          item.setAttribute('aria-expanded', 'false');
        });
        document.querySelectorAll('.faq-answer').forEach(function (item) {
          item.classList.remove('active');
        });
        if (!open && answer) {
          question.classList.add('active');
          question.setAttribute('aria-expanded', 'true');
          answer.classList.add('active');
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    inputIds.forEach(function (id) {
      var element = document.getElementById(id);
      if (!element) return;
      element.addEventListener(element.tagName === 'SELECT' ? 'change' : 'input', function () {
        if (id === 'subscriberMode') updateSubscriberMode();
        calculate();
      });
    });

    var calculateButton = document.getElementById('calculateBtn');
    if (calculateButton) calculateButton.addEventListener('click', calculate);

    var copyButton = document.getElementById('copyResult');
    if (copyButton) {
      copyButton.addEventListener('click', function () {
        if (!navigator.clipboard || !copyButton.dataset.result) return;
        navigator.clipboard.writeText(copyButton.dataset.result).then(function () {
          var previous = copyButton.innerHTML;
          copyButton.textContent = 'Copied';
          window.setTimeout(function () { copyButton.innerHTML = previous; }, 1500);
        }).catch(function () {});
      });
    }

    updateSubscriberMode();
    initializeFaq();
    calculate();
  });
})();
