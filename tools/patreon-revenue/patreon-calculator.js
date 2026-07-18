// Patreon Revenue Calculator - fee model reviewed against Patreon Help Center on 2026-07-17.

document.addEventListener('DOMContentLoaded', function() {
    var planData = {
        standard: { label: 'Standard', rate: 0.10, legacy: false },
        founders: { label: 'Legacy Founders', rate: 0.05, legacy: true },
        pro: { label: 'Legacy Pro', rate: 0.08, legacy: true },
        merch: { label: 'Legacy Pro + Merch', rate: 0.11, legacy: true }
    };

    var processingData = {
        us: { label: 'US card / Apple Pay / US PayPal or Venmo', standardRate: 0.029, standardFlat: 0.30, microRate: 0.05, microFlat: 0.10 },
        nonus: { label: 'Non-US PayPal or Venmo', standardRate: 0.039, standardFlat: 0.30, microRate: 0.06, microFlat: 0.10 }
    };

    var planSelect = document.getElementById('plan');
    var processingSelect = document.getElementById('processingProfile');
    var churnInput = document.getElementById('churn');
    var tierInputs = [];
    for (var i = 1; i <= 4; i++) {
        tierInputs.push({
            name: document.getElementById('tierName' + i),
            price: document.getElementById('tierPrice' + i),
            patrons: document.getElementById('tierPatrons' + i)
        });
    }

    var calculateBtn = document.getElementById('calculateBtn');
    var grossMonthlyEl = document.getElementById('grossMonthly');
    var platformFeeEl = document.getElementById('platformFee');
    var platformFeePctEl = document.getElementById('platformFeePct');
    var processingFeeEl = document.getElementById('processingFee');
    var processingFeeLabelEl = document.getElementById('processingFeeLabel');
    var totalFeesEl = document.getElementById('totalFees');
    var netMonthlyEl = document.getElementById('netMonthly');
    var netAnnualEl = document.getElementById('netAnnual');
    var keepPercentEl = document.getElementById('keepPercent');
    var churnPatronsEl = document.getElementById('churnPatrons');
    var churnRevenueEl = document.getElementById('churnRevenue');
    var tierBreakdownBody = document.getElementById('tierBreakdownBody');
    var copyBtn = document.getElementById('copyResult');
    var microNote = document.getElementById('microNote');

    calculateBtn.addEventListener('click', calculate);
    var allInputs = [planSelect, processingSelect, churnInput];
    tierInputs.forEach(function(tier) { allInputs.push(tier.name, tier.price, tier.patrons); });
    allInputs.forEach(function(el) {
        el.addEventListener('input', calculate);
        el.addEventListener('change', calculate);
    });

    function calculate() {
        var plan = planData[planSelect.value];
        var processing = processingData[processingSelect.value];
        var churnRate = parseFloat(churnInput.value) || 0;
        var totalGross = 0;
        var totalPlatformFee = 0;
        var totalProcessingFee = 0;
        var totalPatrons = 0;
        var tierRows = [];

        tierInputs.forEach(function(tier, index) {
            var tierName = tier.name.value || ('Tier ' + (index + 1));
            var price = Math.max(0, parseFloat(tier.price.value) || 0);
            var patrons = Math.max(0, parseInt(tier.patrons.value, 10) || 0);
            if (!price || !patrons) return;

            var gross = price * patrons;
            var platformFee = gross * plan.rate;
            var usesMicroRate = plan.legacy && price <= 3;
            var processingRate = usesMicroRate ? processing.microRate : processing.standardRate;
            var processingFlat = usesMicroRate ? processing.microFlat : processing.standardFlat;
            var processingFee = ((price * processingRate) + processingFlat) * patrons;
            var net = Math.max(0, gross - platformFee - processingFee);

            totalGross += gross;
            totalPlatformFee += platformFee;
            totalProcessingFee += processingFee;
            totalPatrons += patrons;
            tierRows.push({ name: tierName, price: price, patrons: patrons, gross: gross, fees: platformFee + processingFee, net: net, usesMicroRate: usesMicroRate });
        });

        var totalFees = totalPlatformFee + totalProcessingFee;
        var netMonthly = Math.max(0, totalGross - totalFees);
        var patronsLost = Math.round(totalPatrons * churnRate / 100);
        var revenueAtRisk = totalPatrons ? (netMonthly / totalPatrons) * patronsLost : 0;

        grossMonthlyEl.textContent = formatMoney(totalGross);
        platformFeeEl.textContent = '-' + formatMoney(totalPlatformFee);
        platformFeePctEl.textContent = plan.label + ' (' + Math.round(plan.rate * 100) + '%)';
        processingFeeEl.textContent = '-' + formatMoney(totalProcessingFee);
        processingFeeLabelEl.textContent = processing.label;
        totalFeesEl.textContent = '-' + formatMoney(totalFees);
        netMonthlyEl.textContent = formatMoney(netMonthly);
        netAnnualEl.textContent = formatMoney(netMonthly * 12);
        keepPercentEl.textContent = (totalGross ? (netMonthly / totalGross) * 100 : 0).toFixed(1) + '%';
        churnPatronsEl.textContent = patronsLost + ' patron' + (patronsLost === 1 ? '' : 's') + '/month';
        churnRevenueEl.textContent = formatMoney(revenueAtRisk) + ' at risk';

        tierBreakdownBody.innerHTML = '';
        tierRows.forEach(function(row) {
            var tr = document.createElement('tr');
            tr.innerHTML = '<td>' + escapeHtml(row.name) + '</td>' +
                '<td>' + formatMoney(row.price) + (row.usesMicroRate ? ' *' : '') + '</td>' +
                '<td>' + row.patrons + '</td>' +
                '<td>' + formatMoney(row.gross) + '</td>' +
                '<td style="color:#ef4444;">-' + formatMoney(row.fees) + '</td>' +
                '<td style="color:#22c55e;font-weight:600;">' + formatMoney(row.net) + '</td>';
            tierBreakdownBody.appendChild(tr);
        });
        if (!tierRows.length) {
            var emptyRow = document.createElement('tr');
            emptyRow.innerHTML = '<td colspan="6" style="text-align:center;color:#9ca3af;">Enter tier pricing and patron counts above</td>';
            tierBreakdownBody.appendChild(emptyRow);
        }
        microNote.style.display = tierRows.some(function(row) { return row.usesMicroRate; }) ? 'block' : 'none';
        copyBtn.dataset.net = formatMoney(netMonthly);
        copyBtn.dataset.patrons = totalPatrons;
        copyBtn.dataset.plan = plan.label;
    }

    copyBtn.addEventListener('click', function() {
        var result = 'Estimated Patreon net: ' + this.dataset.net + '/month | ' + this.dataset.patrons + ' patrons | ' + this.dataset.plan + ' plan';
        var button = this;
        function showCopied() {
            button.classList.add('copied');
            button.innerHTML = '<i class="fas fa-check"></i> Copied to Clipboard!';
            setTimeout(function() {
                button.classList.remove('copied');
                button.innerHTML = '<i class="fas fa-copy"></i> Copy Result';
            }, 2000);
        }
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(result).then(showCopied).catch(function() { fallbackCopy(result); showCopied(); });
        } else {
            fallbackCopy(result);
            showCopied();
        }
    });

    function fallbackCopy(value) {
        var textarea = document.createElement('textarea');
        textarea.value = value;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }

    function formatMoney(num) {
        return '$' + Math.max(0, num).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function escapeHtml(value) {
        var div = document.createElement('div');
        div.textContent = value;
        return div.innerHTML;
    }

    document.querySelectorAll('.faq-question').forEach(function(question) {
        question.addEventListener('click', function() {
            var answer = this.nextElementSibling;
            var isActive = answer.classList.contains('active');
            document.querySelectorAll('.faq-answer').forEach(function(item) { item.classList.remove('active'); });
            document.querySelectorAll('.faq-question').forEach(function(item) { item.classList.remove('active'); });
            if (!isActive) { answer.classList.add('active'); question.classList.add('active'); }
        });
    });

    var firstQuestion = document.querySelector('.faq-question');
    if (firstQuestion) firstQuestion.click();
    calculate();
});
