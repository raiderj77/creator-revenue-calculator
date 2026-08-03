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

    function readNumber(input, fallback) {
        var value = Number(input && input.value);
        return Number.isFinite(value) && value >= 0 ? value : fallback;
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
        var baseFee = readNumber(inputs.baseFee, 0);
        var deliverables = Math.max(1, Math.floor(readNumber(inputs.deliverables, 1)));
        var productionCosts = readNumber(inputs.productionCosts, 0);
        var usageRightsPct = readNumber(inputs.usageRightsPct, 0);
        var exclusivityPct = readNumber(inputs.exclusivityPct, 0);
        var rushPct = readNumber(inputs.rushPct, 0);

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
    }

    Object.keys(inputs).forEach(function (key) {
        inputs[key].addEventListener('input', calculate);
        inputs[key].addEventListener('change', calculate);
    });

    calculateBtn.addEventListener('click', calculate);

    copyBtn.addEventListener('click', function () {
        var text = this.dataset.summary || '';
        var button = this;

        navigator.clipboard.writeText(text).then(function () {
            button.classList.add('copied');
            button.innerHTML = '<i class="fas fa-check"></i> Copied to Clipboard';
            window.setTimeout(function () {
                button.classList.remove('copied');
                button.innerHTML = '<i class="fas fa-copy"></i> Copy Quote Summary';
            }, 2000);
        }).catch(function () {
            var textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
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
