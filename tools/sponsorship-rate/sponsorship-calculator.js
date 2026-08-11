document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    var inputs = {
        baseFee: document.getElementById('baseFee'),
        deliverables: document.getElementById('deliverables'),
        productionCosts: document.getElementById('productionCosts'),
        usageRightsPct: document.getElementById('usageRightsPct'),
        exclusivityPct: document.getElementById('exclusivityPct'),
        rushPct: document.getElementById('rushPct')
    };

    var calculateBtn = document.getElementById('calculateBtn');
    var rateLow = document.getElementById('rateLow');
    var rateRecommended = document.getElementById('rateRecommended');
    var ratePremium = document.getElementById('ratePremium');
    var factorsContainer = document.getElementById('rateFactors');
    var tierBadge = document.getElementById('tierBadge');
    var tierBenchmarkText = document.getElementById('tierBenchmark');
    var negotiationText = document.getElementById('negotiationTip');
    var perDeliverable = document.getElementById('monthlyEstimate');
    var perDeliverableDetail = document.getElementById('monthlyDetail');
    var copyBtn = document.getElementById('copyRateCard');
    var formStatus = document.getElementById('sponsorshipFormStatus');
    var copyStatus = document.getElementById('sponsorshipCopyStatus');

    function setStatus(element, message) {
        if (element) element.textContent = message;
    }

    function track(eventName) {
        if (typeof window.crcTrackEvent === 'function') {
            window.crcTrackEvent(eventName);
        }
    }

    function inputIsValid(input) {
        return input.value.trim() !== '' && Number.isFinite(Number(input.value)) && input.checkValidity();
    }

    function inputsAreValid() {
        return Object.keys(inputs).every(function (key) {
            return inputIsValid(inputs[key]);
        });
    }

    function invalidateResults(message) {
        rateLow.textContent = '—';
        rateRecommended.textContent = '—';
        ratePremium.textContent = '—';
        factorsContainer.textContent = 'Enter valid values to see the itemized inputs.';
        tierBadge.textContent = 'Needs input';
        tierBadge.className = 'tier-badge';
        tierBenchmarkText.textContent = 'No quote is calculated while an input is empty or invalid.';
        negotiationText.textContent = 'Complete every visible field before using the quote scenario.';
        perDeliverable.textContent = '—';
        perDeliverableDetail.textContent = 'Complete every visible field to calculate an average.';
        copyBtn.dataset.summary = '';
        copyBtn.disabled = true;
        copyBtn.title = 'Complete every input before copying.';
        setStatus(copyStatus, '');
        setStatus(formStatus, message || 'Results cleared. Enter a number in every field within the displayed range and increment.');
    }

    function validateInputs(shouldFocus) {
        var firstInvalid = null;

        Object.keys(inputs).forEach(function (key) {
            var input = inputs[key];
            if (!inputIsValid(input)) {
                input.setAttribute('aria-invalid', 'true');
                if (!firstInvalid) firstInvalid = input;
            } else {
                input.removeAttribute('aria-invalid');
            }
        });

        if (firstInvalid) {
            var label = document.querySelector('label[for="' + firstInvalid.id + '"]');
            setStatus(formStatus, 'Review ' + (label ? label.textContent.trim() : 'the highlighted field') + '. Use a value within the displayed range and increment.');
            if (shouldFocus) firstInvalid.focus();
            return false;
        }

        setStatus(formStatus, '');
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

    function formatMoney(value) {
        return value.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    function addFactor(label, value) {
        var row = document.createElement('div');
        row.className = 'factor-item neutral';

        var factorLabel = document.createElement('span');
        factorLabel.className = 'factor-label';
        factorLabel.textContent = label;

        var factorValue = document.createElement('span');
        factorValue.className = 'factor-value';
        factorValue.textContent = value;

        row.appendChild(factorLabel);
        row.appendChild(factorValue);
        factorsContainer.appendChild(row);
    }

    function calculate() {
        var baseFee = Number(inputs.baseFee.value);
        var deliverables = Number(inputs.deliverables.value);
        var productionCosts = Number(inputs.productionCosts.value);
        var usageRightsPct = Number(inputs.usageRightsPct.value);
        var exclusivityPct = Number(inputs.exclusivityPct.value);
        var rushPct = Number(inputs.rushPct.value);

        var contentSubtotal = baseFee * deliverables;
        var usageRights = contentSubtotal * usageRightsPct / 100;
        var exclusivity = contentSubtotal * exclusivityPct / 100;
        var rush = contentSubtotal * rushPct / 100;
        var addOns = productionCosts + usageRights + exclusivity + rush;
        var quoteTotal = contentSubtotal + addOns;
        var averagePerDeliverable = quoteTotal / deliverables;

        rateLow.textContent = formatMoney(contentSubtotal);
        rateRecommended.textContent = formatMoney(addOns);
        ratePremium.textContent = formatMoney(quoteTotal);

        factorsContainer.textContent = '';
        addFactor('Base fee', formatMoney(baseFee));
        addFactor('Deliverables', String(deliverables));
        addFactor('Production costs', formatMoney(productionCosts));
        addFactor('Usage rights (' + usageRightsPct + '%)', formatMoney(usageRights));
        addFactor('Exclusivity (' + exclusivityPct + '%)', formatMoney(exclusivity));
        addFactor('Rush (' + rushPct + '%)', formatMoney(rush));

        tierBadge.textContent = 'Your entries';
        tierBadge.className = 'tier-badge';
        tierBenchmarkText.textContent = 'No follower, niche, platform, or market benchmark is applied.';
        negotiationText.textContent = 'Attach the exact deliverables, revision limit, payment timing, usage period, exclusivity scope, and campaign dates to the written quote.';
        perDeliverable.textContent = formatMoney(averagePerDeliverable);
        perDeliverableDetail.textContent = 'Quote total divided by ' + deliverables + (deliverables === 1 ? ' deliverable' : ' deliverables');

        copyBtn.dataset.summary = [
            'Sponsorship quote scenario',
            'Content subtotal: ' + formatMoney(contentSubtotal),
            'Production costs: ' + formatMoney(productionCosts),
            'Usage rights: ' + formatMoney(usageRights),
            'Exclusivity: ' + formatMoney(exclusivity),
            'Rush: ' + formatMoney(rush),
            'Total: ' + formatMoney(quoteTotal),
            'Based on user-supplied assumptions; not a market-rate recommendation.'
        ].join('\n');
        copyBtn.disabled = false;
        copyBtn.removeAttribute('title');
        setStatus(copyStatus, '');
    }

    Object.keys(inputs).forEach(function (key) {
        inputs[key].addEventListener('input', function () {
            if (inputIsValid(this)) this.removeAttribute('aria-invalid');
            else this.setAttribute('aria-invalid', 'true');
            if (inputsAreValid()) {
                setStatus(formStatus, '');
                calculate();
            } else {
                invalidateResults();
            }
        });
        inputs[key].addEventListener('change', function () {
            if (inputIsValid(this)) this.removeAttribute('aria-invalid');
            else this.setAttribute('aria-invalid', 'true');
            if (inputsAreValid()) {
                setStatus(formStatus, '');
                calculate();
            } else {
                invalidateResults();
            }
        });
    });

    calculateBtn.addEventListener('click', function () {
        if (!validateInputs(true)) return;
        calculate();
        setStatus(formStatus, 'Quote scenario updated from your entries.');
        track('calculator_completed');
    });

    copyBtn.addEventListener('click', function () {
        var text = this.dataset.summary || '';
        var button = this;

        if (!text) {
            setStatus(copyStatus, 'Calculate a quote before copying.');
            return;
        }

        setStatus(copyStatus, '');
        copyText(text).then(function () {
            button.classList.add('copied');
            button.innerHTML = '<i class="fas fa-check" aria-hidden="true"></i> Copied to Clipboard';
            setStatus(copyStatus, 'Quote summary copied to the clipboard.');
            track('result_copied');
            window.setTimeout(function () {
                button.classList.remove('copied');
                button.innerHTML = '<i class="fas fa-copy" aria-hidden="true"></i> Copy Quote Summary';
            }, 2000);
        }).catch(function () {
            setStatus(copyStatus, 'Copy failed. Select the visible results and copy them manually.');
        });
    });

    var faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(function (question) {
        question.setAttribute('aria-expanded', 'false');
        question.addEventListener('click', function () {
            var answer = this.nextElementSibling;
            var wasActive = answer.classList.contains('active');

            document.querySelectorAll('.faq-answer').forEach(function (item) {
                item.classList.remove('active');
            });
            document.querySelectorAll('.faq-question').forEach(function (item) {
                item.classList.remove('active');
                item.setAttribute('aria-expanded', 'false');
            });

            if (!wasActive) {
                answer.classList.add('active');
                this.classList.add('active');
                this.setAttribute('aria-expanded', 'true');
            }
        });
    });

    if (faqQuestions.length > 0) {
        faqQuestions[0].click();
    }

    calculate();
});
