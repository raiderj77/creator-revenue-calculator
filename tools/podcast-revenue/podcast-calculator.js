// Podcast revenue scenario calculator.

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  var form = document.getElementById('podcastForm');
  var formStatus = document.getElementById('podcastFormStatus');
  var resultsCard = document.getElementById('podcastResults');
  var copyButton = document.getElementById('copySummary');
  var copyStatus = document.getElementById('copyStatus');
  var copyResetTimer;

  var inputs = {
    downloadsPerEpisode: document.getElementById('downloadsPerEpisode'),
    episodesPerMonth: document.getElementById('episodesPerMonth'),
    adCpm: document.getElementById('adCpm'),
    creatorShare: document.getElementById('creatorShare'),
    directSponsorRevenue: document.getElementById('directSponsorRevenue'),
    preRollAds: document.getElementById('preRollAds'),
    midRollAds: document.getElementById('midRollAds'),
    postRollAds: document.getElementById('postRollAds')
  };

  var fieldRules = {
    downloadsPerEpisode: { label: 'Downloads per episode', scale: 0, minUnits: 0n, maxUnits: 100000000n, whole: true, stepLabel: '1' },
    episodesPerMonth: { label: 'Episodes per month', scale: 0, minUnits: 0n, maxUnits: 1000n, whole: true, stepLabel: '1' },
    adCpm: { label: 'Contract or blended ad CPM', scale: 2, minUnits: 0n, maxUnits: 10000000n, money: true, stepLabel: '$0.01' },
    creatorShare: { label: 'Creator share after fees', scale: 1, minUnits: 0n, maxUnits: 1000n, percent: true, stepLabel: '0.1%' },
    directSponsorRevenue: { label: 'Completed net direct-sponsor revenue', scale: 2, minUnits: 0n, maxUnits: 10000000000n, money: true, stepLabel: '$0.01' },
    preRollAds: { label: 'Pre-roll ad slots per episode', scale: 0, minUnits: 0n, maxUnits: 100n, whole: true, stepLabel: '1' },
    midRollAds: { label: 'Mid-roll ad slots per episode', scale: 0, minUnits: 0n, maxUnits: 100n, whole: true, stepLabel: '1' },
    postRollAds: { label: 'Post-roll ad slots per episode', scale: 0, minUnits: 0n, maxUnits: 100n, whole: true, stepLabel: '1' }
  };

  var outputs = {
    preRollRevenue: document.getElementById('preRollRevenue'),
    midRollRevenue: document.getElementById('midRollRevenue'),
    postRollRevenue: document.getElementById('postRollRevenue'),
    sponsorships: document.getElementById('sponsorships'),
    totalEarnings: document.getElementById('totalEarnings'),
    annualEarnings: document.getElementById('annualEarnings'),
    preRollDetail: document.getElementById('preRollDetail'),
    midRollDetail: document.getElementById('midRollDetail'),
    postRollDetail: document.getElementById('postRollDetail'),
    sponsorshipsDetail: document.getElementById('sponsorshipsDetail'),
    totalDetail: document.getElementById('totalDetail'),
    annualDetail: document.getElementById('annualDetail'),
    perEpisode: document.getElementById('perEpisode'),
    per1000Downloads: document.getElementById('per1000Downloads'),
    perAdSlot: document.getElementById('perAdSlot'),
    monthlyDownloads: document.getElementById('monthlyDownloads')
  };

  function scaleFactor(scale) {
    return 10n ** BigInt(scale);
  }

  function parseScaledUnits(rawValue, scale) {
    var normalized = rawValue.trim();
    if (normalized.length > 64) return { validNumber: false, stepMismatch: false, units: 0n };
    var match = /^(-?)(\d+)(?:\.(\d+))?$/.exec(normalized);
    if (!match) return { validNumber: false, stepMismatch: false, units: 0n };

    var negative = match[1] === '-';
    var whole = match[2];
    var fraction = match[3] || '';
    var retainedFraction = fraction.slice(0, scale).padEnd(scale, '0');
    var discardedFraction = fraction.slice(scale);
    var stepMismatch = /[1-9]/.test(discardedFraction);
    var units = BigInt(whole) * scaleFactor(scale);
    if (retainedFraction) units += BigInt(retainedFraction);
    if (negative) units = -units;
    if (units === 0n) units = 0n;

    return { validNumber: true, stepMismatch: stepMismatch, units: units };
  }

  function formatWhole(value) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function formatScaledUnits(value, scale) {
    var negative = value < 0n;
    var absolute = negative ? -value : value;
    var factor = scaleFactor(scale);
    var whole = formatWhole(absolute / factor);
    var fraction = scale > 0 ? '.' + (absolute % factor).toString().padStart(scale, '0') : '';
    return (negative ? '-' : '') + whole + fraction;
  }

  function currencyFromCents(value) {
    var normalized = value === 0n ? 0n : value;
    return (normalized < 0n ? '-$' : '$') + formatScaledUnits(normalized < 0n ? -normalized : normalized, 2);
  }

  function percentageFromTenths(value) {
    return formatScaledUnits(value, 1) + '%';
  }

  function roundDivide(numerator, denominator) {
    return (numerator + denominator / 2n) / denominator;
  }

  function placementRevenueCents(downloads, episodes, slots, cpmCents, shareBasisPoints) {
    return roundDivide(downloads * episodes * slots * cpmCents * shareBasisPoints, 10000000n);
  }

  function track(eventName) {
    if (typeof window.crcTrackEvent === 'function') {
      window.crcTrackEvent(eventName);
    }
  }

  function setFieldError(key, message) {
    var input = inputs[key];
    var errorElement = document.getElementById(key + 'Error');
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
    input.setCustomValidity(message);
    if (errorElement) errorElement.textContent = message;
  }

  function formatBound(rule, value) {
    if (rule.money) return currencyFromCents(value);
    if (rule.percent) return percentageFromTenths(value);
    return formatWhole(value);
  }

  function validateInput(key) {
    var input = inputs[key];
    var rules = fieldRules[key];
    var rawValue = input.value.trim();
    var parsed = parseScaledUnits(rawValue, rules.scale);
    var error = '';

    if (rawValue === '') {
      error = rules.label + ' is required.';
    } else if (!parsed.validNumber) {
      error = 'Enter a valid number for ' + rules.label.toLowerCase() + '.';
    } else if (parsed.stepMismatch) {
      error = rules.whole
        ? rules.label + ' must be a whole number.'
        : rules.label + ' must use increments of ' + rules.stepLabel + '.';
    } else if (parsed.units < rules.minUnits || parsed.units > rules.maxUnits) {
      error = rules.label + ' must be between ' + formatBound(rules, rules.minUnits) + ' and ' + formatBound(rules, rules.maxUnits) + '.';
    }

    setFieldError(key, error);
    return { valid: error === '', units: parsed.units, input: input };
  }

  function validateAllInputs() {
    var values = {};
    var invalidInputs = [];

    Object.keys(inputs).forEach(function (key) {
      var validation = validateInput(key);
      values[key] = validation.units;
      if (!validation.valid) invalidInputs.push(validation.input);
    });

    function addGroupError(key, message) {
      var errorElement = document.getElementById(key + 'Error');
      if (!errorElement || errorElement.textContent) return;
      setFieldError(key, message);
      if (invalidInputs.indexOf(inputs[key]) === -1) invalidInputs.push(inputs[key]);
    }

    if (invalidInputs.length === 0) {
      var hasDownloads = values.downloadsPerEpisode > 0n;
      var hasEpisodes = values.episodesPerMonth > 0n;
      if (hasDownloads !== hasEpisodes) {
        var audienceMessage = 'Enter both positive downloads per episode and episodes per month, or set both to 0.';
        addGroupError('downloadsPerEpisode', audienceMessage);
        addGroupError('episodesPerMonth', audienceMessage);
      }

      var totalSlots = values.preRollAds + values.midRollAds + values.postRollAds;
      var hasAdScenario = values.adCpm > 0n || values.creatorShare > 0n || totalSlots > 0n;
      if (hasAdScenario) {
        if (!hasDownloads) addGroupError('downloadsPerEpisode', 'Enter positive downloads to calculate ad inventory, or set every ad input to 0.');
        if (!hasEpisodes) addGroupError('episodesPerMonth', 'Enter positive episodes to calculate ad inventory, or set every ad input to 0.');
        if (values.adCpm === 0n) addGroupError('adCpm', 'Enter a positive CPM for ad inventory, or set every ad input to 0.');
        if (values.creatorShare === 0n) addGroupError('creatorShare', 'Enter a positive creator share for ad inventory, or set every ad input to 0.');
        if (totalSlots === 0n) {
          var slotMessage = 'Enter at least one ad slot per episode, or set CPM and creator share to 0.';
          addGroupError('preRollAds', slotMessage);
          addGroupError('midRollAds', slotMessage);
          addGroupError('postRollAds', slotMessage);
        }
      }
    }

    return { valid: invalidInputs.length === 0, values: values, invalidInputs: invalidInputs };
  }

  function resetCopyButton() {
    if (copyResetTimer) window.clearTimeout(copyResetTimer);
    copyButton.classList.remove('copied');
    copyButton.textContent = 'Copy revenue summary';
  }

  function clearInvalidResults() {
    ['preRollRevenue', 'midRollRevenue', 'postRollRevenue', 'sponsorships', 'totalEarnings', 'annualEarnings', 'perEpisode', 'per1000Downloads', 'perAdSlot', 'monthlyDownloads'].forEach(function (key) {
      outputs[key].textContent = '\u2014';
    });
    outputs.preRollDetail.textContent = 'Correct the highlighted inputs to calculate pre-roll ad inventory.';
    outputs.midRollDetail.textContent = 'Correct the highlighted inputs to calculate mid-roll ad inventory.';
    outputs.postRollDetail.textContent = 'Correct the highlighted inputs to calculate post-roll ad inventory.';
    outputs.sponsorshipsDetail.textContent = 'No direct-sponsor amount is retained while an active input is invalid.';
    outputs.totalDetail.textContent = 'No total is retained while an active input is empty or invalid.';
    outputs.annualDetail.textContent = 'No annualized scenario is retained while an active input is empty or invalid.';
    resultsCard.classList.add('has-invalid-inputs');
    copyButton.disabled = true;
    copyButton.setAttribute('aria-disabled', 'true');
    delete copyButton.dataset.summary;
    resetCopyButton();
    copyStatus.textContent = '';
    formStatus.textContent = 'Results cleared. Correct the highlighted fields before using this scenario.';
  }

  function placementFormula(values, slots, revenueCents) {
    return formatWhole(values.downloadsPerEpisode) + ' downloads \u00f7 1,000 \u00d7 ' + currencyFromCents(values.adCpm) + ' \u00d7 ' + formatWhole(slots) + ' slots \u00d7 ' + formatWhole(values.episodesPerMonth) + ' episodes \u00d7 ' + percentageFromTenths(values.creatorShare) + ' = ' + currencyFromCents(revenueCents) + '.';
  }

  function updateResults(values) {
    var shareBasisPoints = values.creatorShare * 10n;
    var preRollCents = placementRevenueCents(values.downloadsPerEpisode, values.episodesPerMonth, values.preRollAds, values.adCpm, shareBasisPoints);
    var midRollCents = placementRevenueCents(values.downloadsPerEpisode, values.episodesPerMonth, values.midRollAds, values.adCpm, shareBasisPoints);
    var postRollCents = placementRevenueCents(values.downloadsPerEpisode, values.episodesPerMonth, values.postRollAds, values.adCpm, shareBasisPoints);
    var sponsorCents = values.directSponsorRevenue;
    var totalAdCents = preRollCents + midRollCents + postRollCents;
    var totalRevenueCents = totalAdCents + sponsorCents;
    var annualRevenueCents = totalRevenueCents * 12n;
    var monthlyDownloads = values.downloadsPerEpisode * values.episodesPerMonth;
    var monthlyAdSlots = (values.preRollAds + values.midRollAds + values.postRollAds) * values.episodesPerMonth;
    var perEpisodeCents = values.episodesPerMonth > 0n ? roundDivide(totalRevenueCents, values.episodesPerMonth) : null;
    var per1000DownloadsCents = monthlyDownloads > 0n ? roundDivide(totalRevenueCents * 1000n, monthlyDownloads) : null;
    var perAdSlotCents = monthlyAdSlots > 0n ? roundDivide(totalAdCents, monthlyAdSlots) : null;

    outputs.preRollRevenue.textContent = currencyFromCents(preRollCents);
    outputs.midRollRevenue.textContent = currencyFromCents(midRollCents);
    outputs.postRollRevenue.textContent = currencyFromCents(postRollCents);
    outputs.sponsorships.textContent = currencyFromCents(sponsorCents);
    outputs.totalEarnings.textContent = currencyFromCents(totalRevenueCents);
    outputs.annualEarnings.textContent = currencyFromCents(annualRevenueCents);
    outputs.preRollDetail.textContent = placementFormula(values, values.preRollAds, preRollCents);
    outputs.midRollDetail.textContent = placementFormula(values, values.midRollAds, midRollCents);
    outputs.postRollDetail.textContent = placementFormula(values, values.postRollAds, postRollCents);
    outputs.sponsorshipsDetail.textContent = currencyFromCents(sponsorCents) + ' entered directly; no sponsor placement is assumed.';
    outputs.totalDetail.textContent = currencyFromCents(preRollCents) + ' + ' + currencyFromCents(midRollCents) + ' + ' + currencyFromCents(postRollCents) + ' + ' + currencyFromCents(sponsorCents) + ' = ' + currencyFromCents(totalRevenueCents) + '.';
    outputs.annualDetail.textContent = currencyFromCents(totalRevenueCents) + ' monthly \u00d7 12 = ' + currencyFromCents(annualRevenueCents) + '.';
    outputs.perEpisode.textContent = perEpisodeCents === null ? 'Not available' : currencyFromCents(perEpisodeCents);
    outputs.per1000Downloads.textContent = per1000DownloadsCents === null ? 'Not available' : currencyFromCents(per1000DownloadsCents);
    outputs.perAdSlot.textContent = perAdSlotCents === null ? 'Not available' : currencyFromCents(perAdSlotCents);
    outputs.monthlyDownloads.textContent = formatWhole(monthlyDownloads);

    resultsCard.classList.remove('has-invalid-inputs');
    copyButton.disabled = false;
    copyButton.setAttribute('aria-disabled', 'false');
    copyButton.dataset.summary = [
      'Podcast revenue scenario',
      'Downloads per episode: ' + formatWhole(values.downloadsPerEpisode),
      'Episodes per month: ' + formatWhole(values.episodesPerMonth),
      'Contract or blended ad CPM: ' + currencyFromCents(values.adCpm),
      'Creator share after fees: ' + percentageFromTenths(values.creatorShare),
      'Pre-roll ad inventory: ' + placementFormula(values, values.preRollAds, preRollCents),
      'Mid-roll ad inventory: ' + placementFormula(values, values.midRollAds, midRollCents),
      'Post-roll ad inventory: ' + placementFormula(values, values.postRollAds, postRollCents),
      'Completed net direct-sponsor revenue: ' + currencyFromCents(sponsorCents) + ' entered directly',
      'Total monthly: ' + currencyFromCents(totalRevenueCents),
      'Annualized scenario: ' + currencyFromCents(totalRevenueCents) + ' monthly \u00d7 12 = ' + currencyFromCents(annualRevenueCents),
      'Revenue per episode: ' + (perEpisodeCents === null ? 'Not available' : currencyFromCents(perEpisodeCents)),
      'Revenue per 1,000 downloads: ' + (per1000DownloadsCents === null ? 'Not available' : currencyFromCents(per1000DownloadsCents)),
      'Ad revenue per placed slot: ' + (perAdSlotCents === null ? 'Not available' : currencyFromCents(perAdSlotCents)),
      'Arithmetic from user-supplied figures; not a payout forecast, contract, tax calculation, or guarantee.'
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
      track('result_copied');
      if (copyButton.disabled || copyButton.dataset.summary !== summary) return;
      copyButton.classList.add('copied');
      copyButton.textContent = 'Copied';
      copyStatus.textContent = 'Revenue summary copied to the clipboard.';
      copyResetTimer = window.setTimeout(function () {
        resetCopyButton();
        copyStatus.textContent = '';
      }, 2000);
    }).catch(function () {
      copyStatus.textContent = 'Copy failed. Select the visible results and copy them manually.';
    });
  });

  calculate({ focusInvalid: false, explicit: false });
});
