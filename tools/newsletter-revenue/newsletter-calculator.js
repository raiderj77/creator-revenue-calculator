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

  function value(id) {
    return Number(document.getElementById(id).value);
  }

  function count(id) {
    return value(id);
  }

  function text(id, content) {
    var element = document.getElementById(id);
    if (element) element.textContent = content;
  }

  function track(eventName) {
    if (typeof window.crcTrackEvent === 'function') {
      window.crcTrackEvent(eventName);
    }
  }

  function activeNumericInputs() {
    var mode = document.getElementById('subscriberMode');
    var subscriberIds = mode && mode.value === 'derived'
      ? ['listSize', 'conversionRate']
      : ['paidSubscribers'];
    var commonIds = [
      'monthlyPrice',
      'platformFeePercent',
      'completedSponsorships',
      'netPerSponsorship',
      'confirmedReferrals',
      'netPerReferral',
      'otherMonthlyCosts'
    ];

    return subscriberIds.concat(commonIds).map(function (id) {
      return document.getElementById(id);
    }).filter(Boolean);
  }

  function inputIsValid(input) {
    return input.value.trim() !== '' && Number.isFinite(Number(input.value)) && input.checkValidity();
  }

  function inputsAreValid() {
    return activeNumericInputs().every(function (input) {
      return inputIsValid(input);
    });
  }

  function invalidateResults(message) {
    [
      'paidSubs',
      'grossSub',
      'subscriptionDetail',
      'feeDeduction',
      'feeDeductionPct',
      'netSub',
      'sponsorRevenue',
      'sponsorshipDetail',
      'referralRevenue',
      'referralDetail',
      'otherCosts',
      'totalMonthly',
      'breakdownTotal',
      'totalAnnual'
    ].forEach(function (id) { text(id, '—'); });

    var copy = document.getElementById('copyResult');
    if (copy) {
      copy.dataset.result = '';
      copy.disabled = true;
      copy.title = 'Complete every visible input before copying.';
    }
    text('newsletterCopyStatus', '');
    text('newsletterFormStatus', message || 'Results cleared. Enter a number in every visible field within the displayed range and increment.');
  }

  function validateInputs(shouldFocus) {
    var activeInputs = activeNumericInputs();
    var activeIds = activeInputs.map(function (input) { return input.id; });
    var firstInvalid = null;

    inputIds.forEach(function (id) {
      var input = document.getElementById(id);
      if (!input || input.tagName === 'SELECT' || activeIds.indexOf(id) === -1) {
        if (input) input.removeAttribute('aria-invalid');
        return;
      }

      if (!inputIsValid(input)) {
        input.setAttribute('aria-invalid', 'true');
        if (!firstInvalid) firstInvalid = input;
      } else {
        input.removeAttribute('aria-invalid');
      }
    });

    if (firstInvalid) {
      var label = document.querySelector('label[for="' + firstInvalid.id + '"]');
      text('newsletterFormStatus', 'Review ' + (label ? label.textContent.trim() : 'the highlighted field') + '. Use a value within the displayed range and increment.');
      if (shouldFocus) firstInvalid.focus();
      return false;
    }

    text('newsletterFormStatus', '');
    return true;
  }

  function copyText(content) {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      return navigator.clipboard.writeText(content);
    }

    return new Promise(function (resolve, reject) {
      var textarea = document.createElement('textarea');
      textarea.value = content;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();

      try {
        if (document.execCommand('copy')) resolve();
        else reject(new Error('Copy command was not accepted.'));
      } catch (error) {
        reject(error);
      } finally {
        document.body.removeChild(textarea);
      }
    });
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
    var conversionRate = value('conversionRate');
    var paidSubscribers = useDerived
      ? Math.round(listSize * conversionRate / 100)
      : count('paidSubscribers');
    var monthlyPrice = value('monthlyPrice');
    var platformFeePercent = value('platformFeePercent');
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
      copy.disabled = false;
      copy.removeAttribute('title');
    }
    text('newsletterCopyStatus', '');
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
        if (element.tagName !== 'SELECT') {
          if (inputIsValid(element)) element.removeAttribute('aria-invalid');
          else element.setAttribute('aria-invalid', 'true');
        }
        if (inputsAreValid()) {
          validateInputs(false);
          calculate();
        } else {
          invalidateResults();
        }
      });
    });

    var calculateButton = document.getElementById('calculateBtn');
    if (calculateButton) {
      calculateButton.addEventListener('click', function () {
        if (!validateInputs(true)) return;
        calculate();
        text('newsletterFormStatus', 'Scenario updated from your entries.');
        track('calculator_completed');
      });
    }

    var copyButton = document.getElementById('copyResult');
    if (copyButton) {
      copyButton.addEventListener('click', function () {
        if (!copyButton.dataset.result) {
          text('newsletterCopyStatus', 'Calculate a scenario before copying.');
          return;
        }

        text('newsletterCopyStatus', '');
        copyText(copyButton.dataset.result).then(function () {
          var previous = copyButton.innerHTML;
          copyButton.textContent = 'Copied';
          text('newsletterCopyStatus', 'Scenario copied to the clipboard.');
          track('result_copied');
          window.setTimeout(function () { copyButton.innerHTML = previous; }, 1500);
        }).catch(function () {
          text('newsletterCopyStatus', 'Copy failed. Select the visible results and copy them manually.');
        });
      });
    }

    updateSubscriberMode();
    initializeFaq();
    calculate();
  });
})();
