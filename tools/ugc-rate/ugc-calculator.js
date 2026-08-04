document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    var inputs = {
        baseFee: document.getElementById('baseFee'),
        deliverables: document.getElementById('deliverables'),
        productionCosts: document.getElementById('productionCosts'),
        revisionsFee: document.getElementById('revisionsFee'),
        rawFootageFee: document.getElementById('rawFootageFee'),
        usageRightsFee: document.getElementById('usageRightsFee'),
        exclusivityFee: document.getElementById('exclusivityFee'),
        rushFee: document.getElementById('rushFee')
    };

    var calculateButton = document.getElementById('calculateBtn');
    var contentSubtotalOutput = document.getElementById('contentSubtotal');
    var addOnsOutput = document.getElementById('addOnsTotal');
    var quoteTotalOutput = document.getElementById('quoteTotal');
    var breakdown = document.getElementById('quoteBreakdown');
    var averageOutput = document.getElementById('averagePerDeliverable');
    var averageDetail = document.getElementById('averageDetail');
    var copyButton = document.getElementById('copyQuote');
    var copyStatus = document.getElementById('copyStatus');
    var resultsCard = document.querySelector('.results-card');
    var copyResetTimer;
    var fieldRules = {
        baseFee: { label: 'Base creation fee', min: 0, max: 1000000, step: 0.01 },
        deliverables: { label: 'Number of deliverables', min: 1, max: 1000, step: 1, whole: true },
        productionCosts: { label: 'Production costs', min: 0, max: 1000000, step: 0.01 },
        revisionsFee: { label: 'Revisions add-on', min: 0, max: 1000000, step: 0.01 },
        rawFootageFee: { label: 'Raw footage or variants add-on', min: 0, max: 1000000, step: 0.01 },
        usageRightsFee: { label: 'Usage rights add-on', min: 0, max: 1000000, step: 0.01 },
        exclusivityFee: { label: 'Exclusivity add-on', min: 0, max: 1000000, step: 0.01 },
        rushFee: { label: 'Rush add-on', min: 0, max: 1000000, step: 0.01 }
    };

    function isStepAligned(value, minimum, step) {
        var stepCount = (value - minimum) / step;
        return Math.abs(stepCount - Math.round(stepCount)) < 0.000000001;
    }

    function validateInput(key) {
        var input = inputs[key];
        var rules = fieldRules[key];
        var errorElement = document.getElementById(key + 'Error');
        var rawValue = input.value.trim();
        var value = Number(rawValue);
        var error = '';

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

        if (error) {
            input.setAttribute('aria-invalid', 'true');
            errorElement.textContent = error;
        } else {
            input.setAttribute('aria-invalid', 'false');
            errorElement.textContent = '';
        }

        return { valid: error === '', value: value, input: input };
    }

    function validateAllInputs() {
        var values = {};
        var invalidInputs = [];

        Object.keys(inputs).forEach(function (key) {
            var validation = validateInput(key);
            if (validation.valid) {
                values[key] = validation.value;
            } else {
                invalidInputs.push(validation.input);
            }
        });

        return { valid: invalidInputs.length === 0, values: values, invalidInputs: invalidInputs };
    }

    function currency(value) {
        return value.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    function addBreakdownRow(label, value) {
        var row = document.createElement('div');
        row.className = 'factor-item neutral';

        var labelElement = document.createElement('span');
        labelElement.className = 'factor-label';
        labelElement.textContent = label;

        var valueElement = document.createElement('span');
        valueElement.className = 'factor-value';
        valueElement.textContent = currency(value);

        row.appendChild(labelElement);
        row.appendChild(valueElement);
        breakdown.appendChild(row);
    }

    function clearInvalidResults() {
        contentSubtotalOutput.textContent = '—';
        addOnsOutput.textContent = '—';
        quoteTotalOutput.textContent = '—';
        averageOutput.textContent = '—';
        averageDetail.textContent = 'Correct the highlighted inputs to calculate a quote.';
        breakdown.textContent = '';

        var invalidMessage = document.createElement('p');
        invalidMessage.className = 'invalid-results-message';
        invalidMessage.textContent = 'Enter valid values in every field to see the itemized breakdown.';
        breakdown.appendChild(invalidMessage);

        resultsCard.classList.add('has-invalid-inputs');
        copyButton.disabled = true;
        copyButton.setAttribute('aria-disabled', 'true');
        delete copyButton.dataset.summary;
        copyButton.textContent = 'Copy Quote Summary';
        copyStatus.textContent = '';
        if (copyResetTimer) window.clearTimeout(copyResetTimer);
    }

    function calculate(focusFirstInvalid) {
        var validation = validateAllInputs();
        if (!validation.valid) {
            clearInvalidResults();
            if (focusFirstInvalid) validation.invalidInputs[0].focus();
            return;
        }

        var baseFee = validation.values.baseFee;
        var deliverables = validation.values.deliverables;
        var productionCosts = validation.values.productionCosts;
        var revisionsFee = validation.values.revisionsFee;
        var rawFootageFee = validation.values.rawFootageFee;
        var usageRightsFee = validation.values.usageRightsFee;
        var exclusivityFee = validation.values.exclusivityFee;
        var rushFee = validation.values.rushFee;

        var contentSubtotal = baseFee * deliverables;
        var addOns = productionCosts + revisionsFee + rawFootageFee + usageRightsFee + exclusivityFee + rushFee;
        var quoteTotal = contentSubtotal + addOns;
        var averagePerDeliverable = quoteTotal / deliverables;

        contentSubtotalOutput.textContent = currency(contentSubtotal);
        addOnsOutput.textContent = currency(addOns);
        quoteTotalOutput.textContent = currency(quoteTotal);
        averageOutput.textContent = currency(averagePerDeliverable);
        averageDetail.textContent = 'Quote total divided by ' + deliverables + (deliverables === 1 ? ' deliverable.' : ' deliverables.');
        resultsCard.classList.remove('has-invalid-inputs');
        copyButton.disabled = false;
        copyButton.setAttribute('aria-disabled', 'false');

        breakdown.textContent = '';
        addBreakdownRow('Creation fee × ' + deliverables, contentSubtotal);
        addBreakdownRow('Production costs', productionCosts);
        addBreakdownRow('Revisions', revisionsFee);
        addBreakdownRow('Raw footage or variants', rawFootageFee);
        addBreakdownRow('Usage rights', usageRightsFee);
        addBreakdownRow('Exclusivity', exclusivityFee);
        addBreakdownRow('Rush', rushFee);

        copyButton.dataset.summary = [
            'UGC quote worksheet',
            'Creation fee: ' + currency(baseFee) + ' × ' + deliverables,
            'Content subtotal: ' + currency(contentSubtotal),
            'Production costs: ' + currency(productionCosts),
            'Revisions: ' + currency(revisionsFee),
            'Raw footage or variants: ' + currency(rawFootageFee),
            'Usage rights: ' + currency(usageRightsFee),
            'Exclusivity: ' + currency(exclusivityFee),
            'Rush: ' + currency(rushFee),
            'Quote total: ' + currency(quoteTotal),
            'User-supplied scenario; not a market-rate recommendation, contract, or guarantee.'
        ].join('\n');
    }

    function copySummary() {
        if (copyButton.disabled) return;
        var text = copyButton.dataset.summary || '';

        function showCopiedStatus() {
            copyStatus.textContent = 'Quote summary copied.';
            copyButton.textContent = 'Copied';
            copyResetTimer = window.setTimeout(function () {
                copyButton.textContent = 'Copy Quote Summary';
                copyStatus.textContent = '';
            }, 2000);
        }

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(showCopiedStatus).catch(function () {
                fallbackCopy(text, showCopiedStatus);
            });
            return;
        }

        fallbackCopy(text, showCopiedStatus);
    }

    function fallbackCopy(text, onSuccess) {
        var textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        var copied = document.execCommand('copy');
        document.body.removeChild(textarea);
        copyStatus.textContent = copied ? 'Quote summary copied.' : 'Copy failed. Select and copy the itemized values manually.';
        if (copied) onSuccess();
    }

    Object.keys(inputs).forEach(function (key) {
        inputs[key].addEventListener('input', function () { calculate(false); });
        inputs[key].addEventListener('change', function () { calculate(false); });
    });

    calculateButton.addEventListener('click', function () { calculate(true); });
    copyButton.addEventListener('click', copySummary);

    var faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(function (question) {
        question.setAttribute('aria-expanded', 'false');
        question.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                this.click();
            }
        });
        question.addEventListener('click', function () {
            var answer = document.getElementById(this.getAttribute('aria-controls'));
            var shouldOpen = this.getAttribute('aria-expanded') !== 'true';

            faqQuestions.forEach(function (item) {
                item.setAttribute('aria-expanded', 'false');
                item.classList.remove('active');
                var itemAnswer = document.getElementById(item.getAttribute('aria-controls'));
                if (itemAnswer) itemAnswer.classList.remove('active');
            });

            if (shouldOpen && answer) {
                this.setAttribute('aria-expanded', 'true');
                this.classList.add('active');
                answer.classList.add('active');
            }
        });
    });

    if (faqQuestions.length > 0) faqQuestions[0].click();
    calculate(false);
});
