document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  var form = document.getElementById('tiktokForm');
  var modeInputs = document.querySelectorAll('input[name="rewardsMode"]');
  var directPanel = document.getElementById('directRewardsFields');
  var derivedPanel = document.getElementById('derivedRewardsFields');
  var formStatus = document.getElementById('tiktokFormStatus');
  var resultsCard = document.getElementById('tiktokResults');
  var copyButton = document.getElementById('copySummary');
  var copyStatus = document.getElementById('copyStatus');
  var copyResetTimer;

  var inputs = {
    creatorRewardsAmount: document.getElementById('creatorRewardsAmount'),
    qualifiedViews: document.getElementById('qualifiedViews'),
    rewardPerThousand: document.getElementById('rewardPerThousand'),
    brandDealsCount: document.getElementById('brandDealsCount'),
    netBrandDealFee: document.getElementById('netBrandDealFee'),
    liveNetRevenue: document.getElementById('liveNetRevenue'),
    otherNetRevenue: document.getElementById('otherNetRevenue')
  };

  var fieldRules = {
    creatorRewardsAmount: { label: 'Creator Rewards dashboard amount', min: 0, max: 100000000, step: 0.01 },
    qualifiedViews: { label: 'Qualified Creator Rewards views', min: 0, max: 100000000000, step: 1, whole: true },
    rewardPerThousand: { label: 'Observed Creator Rewards RPM', min: 0, max: 100000, step: 0.01 },
    brandDealsCount: { label: 'Completed brand deals', min: 0, max: 100000, step: 1, whole: true },
    netBrandDealFee: { label: 'Average net revenue per completed deal', min: 0, max: 100000000, step: 0.01 },
    liveNetRevenue: { label: 'Net LIVE revenue', min: 0, max: 100000000, step: 0.01 },
    otherNetRevenue: { label: 'Other confirmed TikTok revenue', min: 0, max: 100000000, step: 0.01 }
  };

  var outputs = {
    creatorRewards: document.getElementById('creatorRewardsResult'),
    brandDeals: document.getElementById('brandDealsResult'),
    liveRevenue: document.getElementById('liveRevenueResult'),
    otherRevenue: document.getElementById('otherRevenueResult'),
    totalMonthly: document.getElementById('totalMonthlyResult'),
    annualized: document.getElementById('annualizedResult'),
    creatorRewardsFormula: document.getElementById('creatorRewardsFormula'),
    brandDealsFormula: document.getElementById('brandDealsFormula'),
    totalFormula: document.getElementById('totalFormula'),
    rewardsMethod: document.getElementById('rewardsMethod')
  };

  function currentMode() {
    var checked = document.querySelector('input[name="rewardsMode"]:checked');
    return checked ? checked.value : 'direct';
  }

  function toCents(value) {
    return BigInt(Math.round(value * 100));
  }

  function divideAndRound(numerator, denominator) {
    return (numerator + denominator / 2n) / denominator;
  }

  function currencyFromCents(value) {
    var negative = value < 0n;
    var absolute = negative ? -value : value;
    var dollars = (absolute / 100n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    var cents = (absolute % 100n).toString().padStart(2, '0');
    return (negative ? '-' : '') + '$' + dollars + '.' + cents;
  }

  function currency(value) {
    return currencyFromCents(toCents(value));
  }

  function wholeNumber(value) {
    return value.toLocaleString('en-US', { maximumFractionDigits: 0 });
  }

  function track(eventName) {
    if (typeof window.crcTrackEvent === 'function') {
      window.crcTrackEvent(eventName);
    }
  }

  function isStepAligned(value, minimum, step) {
    var stepCount = (value - minimum) / step;
    return Math.abs(stepCount - Math.round(stepCount)) < 0.000000001;
  }

  function setFieldError(key, message) {
    var input = inputs[key];
    var errorElement = document.getElementById(key + 'Error');
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (errorElement) errorElement.textContent = message;
  }

  function validateInput(key) {
    var input = inputs[key];
    var rules = fieldRules[key];
    var rawValue = input.value.trim();
    var value = Number(rawValue);
    if (Object.is(value, -0)) value = 0;
    var error = '';

    if (input.disabled) {
      setFieldError(key, '');
      return { valid: true, value: 0, input: input };
    }

    if (rawValue === '') {
      error = rules.label + ' is required.';
    } else if (!Number.isFinite(value)) {
      error = 'Enter a valid number for ' + rules.label.toLowerCase() + '.';
    } else if (value < rules.min || value > rules.max) {
      error = rules.label + ' must be between ' + rules.min.toLocaleString('en-US') + ' and ' + rules.max.toLocaleString('en-US') + '.';
    } else if (rules.whole && !Number.isInteger(value)) {
      error = rules.label + ' must be a whole number.';
    } else if (!isStepAligned(value, rules.min, rules.step)) {
      error = rules.label + ' must use increments of ' + rules.step + '.';
    }

    setFieldError(key, error);
    return { valid: error === '', value: value, input: input };
  }

  function activeKeys() {
    var rewardKeys = currentMode() === 'direct'
      ? ['creatorRewardsAmount']
      : ['qualifiedViews', 'rewardPerThousand'];
    return rewardKeys.concat(['brandDealsCount', 'netBrandDealFee', 'liveNetRevenue', 'otherNetRevenue']);
  }

  function validateAllInputs() {
    var values = {};
    var invalidInputs = [];
    var keys = activeKeys();

    keys.forEach(function (key) {
      var validation = validateInput(key);
      values[key] = validation.value;
      if (!validation.valid) invalidInputs.push(validation.input);
    });

    if (invalidInputs.length === 0 && currentMode() === 'derived') {
      var hasViews = values.qualifiedViews > 0;
      var hasRpm = values.rewardPerThousand > 0;
      if (hasViews !== hasRpm) {
        var rewardsPairMessage = 'Enter both qualified views and observed RPM as positive values, or set both to 0.';
        setFieldError('qualifiedViews', rewardsPairMessage);
        setFieldError('rewardPerThousand', rewardsPairMessage);
        invalidInputs.push(hasViews ? inputs.rewardPerThousand : inputs.qualifiedViews);
      }
    }

    if (invalidInputs.length === 0) {
      var hasDeals = values.brandDealsCount > 0;
      var hasDealFee = values.netBrandDealFee > 0;
      if (hasDeals !== hasDealFee) {
        var dealPairMessage = 'Enter both a completed-deal count and a positive net fee, or set both to 0.';
        setFieldError('brandDealsCount', dealPairMessage);
        setFieldError('netBrandDealFee', dealPairMessage);
        invalidInputs.push(hasDeals ? inputs.netBrandDealFee : inputs.brandDealsCount);
      }
    }

    return { valid: invalidInputs.length === 0, values: values, invalidInputs: invalidInputs };
  }

  function resetCopyButton() {
    if (copyResetTimer) window.clearTimeout(copyResetTimer);
    copyButton.classList.remove('copied');
    copyButton.innerHTML = '<i class="fas fa-copy" aria-hidden="true"></i> Copy revenue summary';
  }

  function clearInvalidResults() {
    Object.keys(outputs).forEach(function (key) {
      if (key.indexOf('Formula') === -1 && key !== 'rewardsMethod') {
        outputs[key].textContent = '—';
      }
    });
    outputs.creatorRewardsFormula.textContent = 'Correct the highlighted inputs to calculate Creator Rewards.';
    outputs.brandDealsFormula.textContent = 'Correct the highlighted inputs to calculate completed-deal revenue.';
    outputs.totalFormula.textContent = 'No total is retained while an active input is empty or invalid.';
    outputs.rewardsMethod.textContent = 'Needs valid input';
    resultsCard.classList.add('has-invalid-inputs');
    copyButton.disabled = true;
    copyButton.setAttribute('aria-disabled', 'true');
    delete copyButton.dataset.summary;
    resetCopyButton();
    copyStatus.textContent = '';
    formStatus.textContent = 'Results cleared. Correct the highlighted fields before using this scenario.';
  }

  function updateResults(values) {
    var mode = currentMode();
    var creatorRewardsCents = mode === 'direct'
      ? toCents(values.creatorRewardsAmount)
      : divideAndRound(BigInt(values.qualifiedViews) * toCents(values.rewardPerThousand), 1000n);
    var brandRevenueCents = BigInt(values.brandDealsCount) * toCents(values.netBrandDealFee);
    var liveRevenueCents = toCents(values.liveNetRevenue);
    var otherRevenueCents = toCents(values.otherNetRevenue);
    var totalMonthlyCents = creatorRewardsCents + brandRevenueCents + liveRevenueCents + otherRevenueCents;
    var annualizedCents = totalMonthlyCents * 12n;
    var rewardsFormula;
    var rewardsSummary;

    if (mode === 'direct') {
      rewardsFormula = 'Dashboard amount entered directly: ' + currency(values.creatorRewardsAmount) + '.';
      rewardsSummary = 'Creator Rewards: ' + currencyFromCents(creatorRewardsCents) + ' (dashboard amount entered directly)';
      outputs.rewardsMethod.textContent = 'Dashboard amount';
    } else {
      rewardsFormula = wholeNumber(values.qualifiedViews) + ' qualified views ÷ 1,000 × ' + currency(values.rewardPerThousand) + ' = ' + currencyFromCents(creatorRewardsCents) + '.';
      rewardsSummary = 'Creator Rewards: ' + wholeNumber(values.qualifiedViews) + ' ÷ 1,000 × ' + currency(values.rewardPerThousand) + ' = ' + currencyFromCents(creatorRewardsCents);
      outputs.rewardsMethod.textContent = 'Qualified views × observed RPM';
    }

    outputs.creatorRewards.textContent = currencyFromCents(creatorRewardsCents);
    outputs.brandDeals.textContent = currencyFromCents(brandRevenueCents);
    outputs.liveRevenue.textContent = currencyFromCents(liveRevenueCents);
    outputs.otherRevenue.textContent = currencyFromCents(otherRevenueCents);
    outputs.totalMonthly.textContent = currencyFromCents(totalMonthlyCents);
    outputs.annualized.textContent = currencyFromCents(annualizedCents);
    outputs.creatorRewardsFormula.textContent = rewardsFormula;
    outputs.brandDealsFormula.textContent = wholeNumber(values.brandDealsCount) + ' completed deals × ' + currency(values.netBrandDealFee) + ' = ' + currencyFromCents(brandRevenueCents) + '.';
    outputs.totalFormula.textContent = currencyFromCents(creatorRewardsCents) + ' + ' + currencyFromCents(brandRevenueCents) + ' + ' + currencyFromCents(liveRevenueCents) + ' + ' + currencyFromCents(otherRevenueCents) + ' = ' + currencyFromCents(totalMonthlyCents) + '; annualized × 12 = ' + currencyFromCents(annualizedCents) + '.';

    resultsCard.classList.remove('has-invalid-inputs');
    copyButton.disabled = false;
    copyButton.setAttribute('aria-disabled', 'false');
    copyButton.dataset.summary = [
      'TikTok revenue scenario',
      rewardsSummary,
      'Completed brand deals: ' + wholeNumber(values.brandDealsCount) + ' × ' + currency(values.netBrandDealFee) + ' = ' + currencyFromCents(brandRevenueCents),
      'Net LIVE revenue: ' + currencyFromCents(liveRevenueCents),
      'Other confirmed revenue: ' + currencyFromCents(otherRevenueCents),
      'Total monthly: ' + currencyFromCents(totalMonthlyCents),
      'Annualized scenario: ' + currencyFromCents(annualizedCents),
      'Based only on user-supplied figures; not a payout forecast, contract, or guarantee.'
    ].join('\n');
    resetCopyButton();
    copyStatus.textContent = '';
  }

  function calculate(options) {
    var validation = validateAllInputs();
    if (!validation.valid) {
      clearInvalidResults();
      if (options.focusInvalid) validation.invalidInputs[0].focus();
      return false;
    }

    formStatus.textContent = '';
    updateResults(validation.values);

    if (options.explicit) {
      formStatus.textContent = 'Revenue scenario updated from your entries.';
      track('calculator_completed');
      resultsCard.focus();
    }
    return true;
  }

  function setMode() {
    var direct = currentMode() === 'direct';
    directPanel.hidden = !direct;
    derivedPanel.hidden = direct;
    inputs.creatorRewardsAmount.disabled = !direct;
    inputs.qualifiedViews.disabled = direct;
    inputs.rewardPerThousand.disabled = direct;

    if (direct) {
      setFieldError('qualifiedViews', '');
      setFieldError('rewardPerThousand', '');
    } else {
      setFieldError('creatorRewardsAmount', '');
    }
  }

  function fallbackCopy(text) {
    var textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    var copied = false;
    try {
      copied = document.execCommand('copy');
    } finally {
      document.body.removeChild(textarea);
    }
    return copied;
  }

  function copyText(text) {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      return navigator.clipboard.writeText(text).catch(function () {
        if (fallbackCopy(text)) return;
        throw new Error('Copy command was not accepted.');
      });
    }

    return new Promise(function (resolve, reject) {
      try {
        if (fallbackCopy(text)) resolve();
        else reject(new Error('Copy command was not accepted.'));
      } catch (error) {
        reject(error);
      }
    });
  }

  Object.keys(inputs).forEach(function (key) {
    inputs[key].addEventListener('input', function () {
      calculate({ focusInvalid: false, explicit: false });
    });
    inputs[key].addEventListener('change', function () {
      calculate({ focusInvalid: false, explicit: false });
    });
  });

  modeInputs.forEach(function (input) {
    input.addEventListener('change', function () {
      setMode();
      calculate({ focusInvalid: false, explicit: false });
    });
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    calculate({ focusInvalid: true, explicit: true });
  });

  copyButton.addEventListener('click', function () {
    var summary = copyButton.dataset.summary || '';
    if (copyButton.disabled || !summary) {
      copyStatus.textContent = 'Calculate a valid revenue scenario before copying.';
      return;
    }

    copyStatus.textContent = '';
    copyText(summary).then(function () {
      copyButton.classList.add('copied');
      copyButton.textContent = 'Copied';
      copyStatus.textContent = 'Revenue summary copied to the clipboard.';
      track('result_copied');
      copyResetTimer = window.setTimeout(function () {
        resetCopyButton();
        copyStatus.textContent = '';
      }, 2000);
    }).catch(function () {
      copyStatus.textContent = 'Copy failed. Select the visible results and copy them manually.';
    });
  });

  var faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(function (question) {
    question.addEventListener('click', function () {
      var answer = document.getElementById(question.getAttribute('aria-controls'));
      var shouldOpen = question.getAttribute('aria-expanded') !== 'true';

      faqQuestions.forEach(function (item) {
        item.setAttribute('aria-expanded', 'false');
        var itemAnswer = document.getElementById(item.getAttribute('aria-controls'));
        if (itemAnswer) itemAnswer.classList.remove('open');
      });

      if (shouldOpen && answer) {
        question.setAttribute('aria-expanded', 'true');
        answer.classList.add('open');
      }
    });
  });

  setMode();
  if (faqQuestions.length > 0) faqQuestions[0].click();
  calculate({ focusInvalid: false, explicit: false });
});
