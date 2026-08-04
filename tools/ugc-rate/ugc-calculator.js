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

    function nonNegativeNumber(input, fallback) {
        var parsed = Number(input && input.value);
        return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
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

    function calculate() {
        var baseFee = nonNegativeNumber(inputs.baseFee, 0);
        var deliverables = Math.max(1, Math.floor(nonNegativeNumber(inputs.deliverables, 1)));
        var productionCosts = nonNegativeNumber(inputs.productionCosts, 0);
        var revisionsFee = nonNegativeNumber(inputs.revisionsFee, 0);
        var rawFootageFee = nonNegativeNumber(inputs.rawFootageFee, 0);
        var usageRightsFee = nonNegativeNumber(inputs.usageRightsFee, 0);
        var exclusivityFee = nonNegativeNumber(inputs.exclusivityFee, 0);
        var rushFee = nonNegativeNumber(inputs.rushFee, 0);

        var contentSubtotal = baseFee * deliverables;
        var addOns = productionCosts + revisionsFee + rawFootageFee + usageRightsFee + exclusivityFee + rushFee;
        var quoteTotal = contentSubtotal + addOns;
        var averagePerDeliverable = quoteTotal / deliverables;

        contentSubtotalOutput.textContent = currency(contentSubtotal);
        addOnsOutput.textContent = currency(addOns);
        quoteTotalOutput.textContent = currency(quoteTotal);
        averageOutput.textContent = currency(averagePerDeliverable);
        averageDetail.textContent = 'Quote total divided by ' + deliverables + (deliverables === 1 ? ' deliverable.' : ' deliverables.');

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
        var text = copyButton.dataset.summary || '';

        function showCopiedStatus() {
            copyStatus.textContent = 'Quote summary copied.';
            copyButton.textContent = 'Copied';
            window.setTimeout(function () {
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
        inputs[key].addEventListener('input', calculate);
        inputs[key].addEventListener('change', calculate);
    });

    calculateButton.addEventListener('click', calculate);
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
    calculate();
});
