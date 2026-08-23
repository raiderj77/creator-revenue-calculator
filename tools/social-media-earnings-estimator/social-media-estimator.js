(function () {
  'use strict';

  var rowsContainer = document.getElementById('scenarioRows');
  var template = document.getElementById('scenarioTemplate');
  var addButton = document.getElementById('addScenario');
  var calculateButton = document.getElementById('calculateScenarios');
  var resetButton = document.getElementById('resetScenarios');
  var results = document.getElementById('scenarioResults');
  var status = document.getElementById('scenarioStatus');
  var monthlyTotal = document.getElementById('monthlyTotal');
  var annualTotal = document.getElementById('annualTotal');
  var scenarioCount = document.getElementById('scenarioCount');
  var breakdown = document.getElementById('scenarioBreakdown');
  var copyButton = document.getElementById('copySummary');
  var printButton = document.getElementById('printSummary');
  var copyStatus = document.getElementById('copyStatus');
  var nextRowNumber = 0;
  var lastSummary = '';

  function formatMoney(value) {
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  function scenarioRows() {
    return Array.prototype.slice.call(rowsContainer.querySelectorAll('.scenario-row'));
  }

  function updateRowNumbers() {
    scenarioRows().forEach(function (row, index) {
      row.querySelector('legend').textContent = 'Scenario ' + (index + 1);
      row.querySelector('.remove-scenario').disabled = scenarioRows().length === 1;
    });
  }

  function updateMode(row) {
    var direct = row.querySelector('.scenario-type').value === 'direct';
    row.querySelector('.quantity-field').hidden = direct;
    row.querySelector('.rate-field').hidden = direct;
    row.querySelector('.direct-field').hidden = !direct;
  }

  function addScenario(shouldFocus, preserveResult) {
    nextRowNumber += 1;
    var fragment = template.content.cloneNode(true);
    var row = fragment.querySelector('.scenario-row');
    row.dataset.rowNumber = String(nextRowNumber);
    row.querySelector('.scenario-type').addEventListener('change', function () {
      updateMode(row);
    });
    row.addEventListener('input', function () {
      clearCurrentResult('Inputs changed. Calculate again to update the total.');
    });
    row.addEventListener('change', function () {
      clearCurrentResult('Scenario changed. Calculate again to update the total.');
    });
    row.querySelector('.remove-scenario').addEventListener('click', function () {
      var remaining = scenarioRows();
      if (remaining.length === 1) return;
      var fallback = row.previousElementSibling || row.nextElementSibling;
      row.remove();
      updateRowNumbers();
      clearCurrentResult('Scenario removed. Calculate again to update the total.');
      if (fallback) fallback.querySelector('select').focus();
    });
    rowsContainer.appendChild(fragment);
    updateMode(row);
    updateRowNumbers();
    if (!preserveResult) {
      clearCurrentResult('Scenario added. Calculate again to update the total.');
    }
    if (shouldFocus) row.querySelector('select').focus();
  }

  function clearInvalid(row) {
    row.querySelectorAll('input').forEach(function (input) {
      input.removeAttribute('aria-invalid');
    });
  }

  function validNumber(input) {
    return input.value.trim() !== '' && Number.isFinite(Number(input.value)) && input.checkValidity();
  }

  function readScenario(row) {
    clearInvalid(row);
    var platform = row.querySelector('.scenario-platform').value;
    var type = row.querySelector('.scenario-type').value;
    var inputs = type === 'direct'
      ? [row.querySelector('.scenario-direct')]
      : [row.querySelector('.scenario-quantity'), row.querySelector('.scenario-rate')];
    var firstInvalid = inputs.find(function (input) { return !validNumber(input); });
    if (firstInvalid) {
      firstInvalid.setAttribute('aria-invalid', 'true');
      return { valid: false, firstInvalid: firstInvalid };
    }

    if (type === 'direct') {
      return {
        valid: true,
        platform: platform,
        typeLabel: 'User-entered revenue',
        monthly: Number(inputs[0].value),
        formula: 'entered monthly revenue'
      };
    }

    var quantity = Number(inputs[0].value);
    var rate = Number(inputs[1].value);
    return {
      valid: true,
      platform: platform,
      typeLabel: type === 'platform' ? 'Platform payout scenario' : 'Sponsorship-value scenario',
      monthly: quantity / 1000 * rate,
      formula: quantity.toLocaleString('en-US') + ' ÷ 1,000 × ' + formatMoney(rate)
    };
  }

  function clearCurrentResult(message) {
    monthlyTotal.textContent = '—';
    annualTotal.textContent = '—';
    scenarioCount.textContent = 'Update needed';
    breakdown.replaceChildren(document.createElement('li'));
    breakdown.firstElementChild.textContent = 'Calculate again to see the current breakdown.';
    copyButton.disabled = true;
    printButton.disabled = true;
    lastSummary = '';
    status.textContent = message || '';
  }

  function calculate() {
    var rows = scenarioRows();
    var values = rows.map(readScenario);
    var invalid = values.find(function (value) { return !value.valid; });
    if (invalid) {
      clearCurrentResult('Review the highlighted value. Enter zero or a positive number within the displayed limit.');
      invalid.firstInvalid.focus();
      return false;
    }

    var total = values.reduce(function (sum, value) { return sum + value.monthly; }, 0);
    monthlyTotal.textContent = formatMoney(total);
    annualTotal.textContent = formatMoney(total * 12);
    scenarioCount.textContent = values.length + (values.length === 1 ? ' included' : ' included');
    breakdown.replaceChildren();
    values.forEach(function (value) {
      var item = document.createElement('li');
      var label = document.createElement('span');
      var amount = document.createElement('strong');
      label.textContent = value.platform + ' — ' + value.typeLabel + ' (' + value.formula + ')';
      amount.textContent = formatMoney(value.monthly) + '/month';
      item.append(label, amount);
      breakdown.appendChild(item);
    });
    lastSummary = [
      'Creator Revenue Calculator manual scenario',
      'Monthly scenario: ' + formatMoney(total),
      'Annual scenario at the same inputs: ' + formatMoney(total * 12),
      ''
    ].concat(values.map(function (value) {
      return value.platform + ' — ' + value.typeLabel + ': ' + formatMoney(value.monthly) + '/month';
    })).concat([
      '',
      'Manual scenario—not an actual platform payout. Arithmetic from visible user-entered assumptions; not a forecast, guarantee, or financial advice.'
    ]).join('\n');
    copyButton.disabled = false;
    printButton.disabled = false;
    status.textContent = 'Scenario totals updated from your entries.';
    copyStatus.textContent = '';
    results.focus();
    if (typeof window.crcTrackEvent === 'function') {
      window.crcTrackEvent('calculator_completed');
    }
    return true;
  }

  function reset() {
    rowsContainer.replaceChildren();
    addScenario(false, true);
    monthlyTotal.textContent = '$0.00';
    annualTotal.textContent = '$0.00';
    scenarioCount.textContent = '0 included';
    breakdown.replaceChildren(document.createElement('li'));
    breakdown.firstElementChild.textContent = 'Add a scenario and calculate to see the breakdown.';
    copyButton.disabled = true;
    printButton.disabled = true;
    copyStatus.textContent = '';
    status.textContent = 'Scenario inputs reset.';
    lastSummary = '';
    rowsContainer.querySelector('select').focus();
  }

  addButton.addEventListener('click', function () { addScenario(true, false); });
  calculateButton.addEventListener('click', calculate);
  resetButton.addEventListener('click', reset);
  copyButton.addEventListener('click', function () {
    if (!lastSummary) return;
    if (!navigator.clipboard || !navigator.clipboard.writeText) {
      copyStatus.textContent = 'Copy is unavailable in this browser. Use the print option instead.';
      return;
    }
    navigator.clipboard.writeText(lastSummary).then(function () {
      copyStatus.textContent = 'Summary copied.';
    }).catch(function () {
      copyStatus.textContent = 'Copy failed. Use the print option instead.';
    });
  });
  printButton.addEventListener('click', function () { window.print(); });

  addScenario(false, true);
})();
