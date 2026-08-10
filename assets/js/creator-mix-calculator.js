(function () {
  'use strict';

  var revenueFields = [
    { id: 'mixAds', label: 'Platform and ad revenue' },
    { id: 'mixMemberships', label: 'Membership revenue' },
    { id: 'mixSponsorships', label: 'Completed sponsorship revenue' },
    { id: 'mixAffiliates', label: 'Attributable affiliate revenue' },
    { id: 'mixProducts', label: 'Product revenue' },
    { id: 'mixNewsletter', label: 'Newsletter revenue' }
  ];

  function money(amount) {
    var formatted = Math.abs(amount).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    return (amount < 0 ? '-$' : '$') + formatted;
  }

  function readMoney(id, errors) {
    var input = document.getElementById(id);
    if (!input) return 0;
    var raw = input.value.trim();
    var value = Number(raw);
    var minimum = Number(input.min || 0);
    var maximum = Number(input.max || 1000000000);
    var step = Number(input.step || 0.01);
    var stepOffset = step > 0 ? (value - minimum) / step : 0;
    var matchesStep = step <= 0 || Math.abs(stepOffset - Math.round(stepOffset)) < 0.0000001;
    var valid = raw !== '' && Number.isFinite(value) && value >= minimum && value <= maximum && matchesStep;
    input.setAttribute('aria-invalid', valid ? 'false' : 'true');
    if (!valid) errors.push({
      input: input,
      message: input.getAttribute('data-label') + ' must be between ' + money(minimum) + ' and ' + money(maximum) + ', using no more than two decimal places.'
    });
    return valid ? value : 0;
  }

  function setText(id, value) {
    var element = document.getElementById(id);
    if (element) element.textContent = value;
  }

  function renderBreakdown(values, gross) {
    var container = document.getElementById('mixBreakdown');
    if (!container) return;
    container.textContent = '';
    revenueFields.forEach(function (field) {
      var row = document.createElement('div');
      row.className = 'mix-result-row';
      var label = document.createElement('span');
      label.textContent = field.label;
      var value = document.createElement('strong');
      var share = gross > 0 ? values[field.id] / gross * 100 : 0;
      value.textContent = money(values[field.id]) + ' · ' + share.toFixed(1) + '%';
      row.appendChild(label);
      row.appendChild(value);
      container.appendChild(row);
    });
  }

  function clearResults() {
    setText('mixGross', '—');
    setText('mixCostsResult', '—');
    setText('mixReserveResult', '—');
    setText('mixNet', '—');
    setText('mixAnnual', '—');
    setText('mixConcentration', 'Correct the highlighted field to calculate a revenue mix.');
    setText('mixTargetResult', 'No target comparison is available while an input is invalid.');
    var breakdown = document.getElementById('mixBreakdown');
    if (breakdown) breakdown.textContent = '';
    var copyButton = document.getElementById('copyMixResult');
    if (copyButton) {
      copyButton.disabled = true;
      copyButton.dataset.result = '';
    }
  }

  function calculate(trackCompletion, focusInvalid) {
    var errors = [];
    var values = {};
    revenueFields.forEach(function (field) {
      values[field.id] = readMoney(field.id, errors);
    });
    var costs = readMoney('mixCosts', errors);
    var reserve = readMoney('mixReserve', errors);
    var target = readMoney('mixTarget', errors);
    var error = document.getElementById('mixCalculatorError');
    if (errors.length) {
      if (error) error.textContent = errors[0].message;
      clearResults();
      if (focusInvalid) errors[0].input.focus();
      return false;
    }
    if (error) error.textContent = '';

    var gross = revenueFields.reduce(function (sum, field) { return sum + values[field.id]; }, 0);
    var plannedNet = gross - costs - reserve;
    var annualized = plannedNet * 12;
    var largest = revenueFields.reduce(function (current, field) {
      return values[field.id] > values[current.id] ? field : current;
    }, revenueFields[0]);
    var largestShare = gross > 0 ? values[largest.id] / gross * 100 : 0;

    setText('mixGross', money(gross));
    setText('mixCostsResult', '-' + money(costs));
    setText('mixReserveResult', '-' + money(reserve));
    setText('mixNet', money(plannedNet));
    setText('mixAnnual', money(annualized));
    setText('mixConcentration', gross > 0
      ? largest.label + ' is ' + largestShare.toFixed(1) + '% of entered gross revenue.'
      : 'Add at least one revenue line to see the revenue mix.');

    if (target <= 0) {
      setText('mixTargetResult', 'No monthly target entered.');
    } else if (plannedNet >= target) {
      setText('mixTargetResult', 'Target met by ' + money(plannedNet - target) + ' in this scenario.');
    } else {
      setText('mixTargetResult', money(target - plannedNet) + ' remains to reach the entered monthly target.');
    }

    renderBreakdown(values, gross);
    var copyButton = document.getElementById('copyMixResult');
    if (copyButton) {
      copyButton.disabled = false;
      copyButton.dataset.result = [
        'Creator revenue scenario',
        'gross ' + money(gross),
        'known costs ' + money(costs),
        'planned reserve ' + money(reserve),
        'planned net ' + money(plannedNet),
        'annualized arithmetic ' + money(annualized),
        gross > 0 ? largest.label + ' ' + largestShare.toFixed(1) + '% of gross' : 'no revenue lines entered'
      ].join('; ') + '.';
    }
    if (trackCompletion && typeof window.crcTrackEvent === 'function') window.crcTrackEvent('calculator_completed');
    if (trackCompletion) {
      var results = document.getElementById('mixResults');
      if (results) results.focus();
    }
    return true;
  }

  function fallbackCopy(value) {
    var textarea = document.createElement('textarea');
    textarea.value = value;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    var copied = document.execCommand('copy');
    textarea.remove();
    return copied;
  }

  function showCopyStatus(message) {
    setText('mixCopyStatus', message);
  }

  document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('creatorRevenueForm');
    var calculateButton = document.getElementById('calculateMix');
    var copyButton = document.getElementById('copyMixResult');

    if (!form || !calculateButton) return;
    form.querySelectorAll('input[type="number"]').forEach(function (input) {
      input.addEventListener('input', function () { calculate(false, false); });
    });
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      calculate(true, true);
    });
    form.addEventListener('reset', function () {
      window.setTimeout(function () {
        form.querySelectorAll('input').forEach(function (input) { input.setAttribute('aria-invalid', 'false'); });
        calculate(false, false);
        showCopyStatus('');
      }, 0);
    });
    copyButton.addEventListener('click', function () {
      var result = copyButton.dataset.result;
      if (!result) return;
      var copied = function () {
        showCopyStatus('Scenario copied.');
        if (typeof window.crcTrackEvent === 'function') window.crcTrackEvent('result_copied');
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(result).then(copied).catch(function () {
          if (fallbackCopy(result)) copied();
          else showCopyStatus('Copy was unavailable. Select the printed summary instead.');
        });
      } else if (fallbackCopy(result)) copied();
      else showCopyStatus('Copy was unavailable. Select the printed summary instead.');
    });
    calculate(false, false);
  });
})();
