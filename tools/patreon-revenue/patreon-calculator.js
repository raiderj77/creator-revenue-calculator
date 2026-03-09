// Patreon Revenue Calculator 2026 - JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // --- 2026 PATREON FEE DATA ---

    var planData = {
        'starter':  { label: 'Starter',  rate: 0.08 },
        'pro':      { label: 'Pro',      rate: 0.12 },
        'premium':  { label: 'Premium',  rate: 0.15 }
    };

    // Payment processing fees
    var STANDARD_RATE = 0.029;
    var STANDARD_FLAT = 0.30;
    var MICRO_RATE = 0.05;
    var MICRO_FLAT = 0.10;
    var MICRO_THRESHOLD = 3.00;

    // --- DOM ELEMENTS ---
    var planSelect = document.getElementById('plan');
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

    // Result elements
    var grossMonthlyEl = document.getElementById('grossMonthly');
    var platformFeeEl = document.getElementById('platformFee');
    var platformFeePctEl = document.getElementById('platformFeePct');
    var processingFeeEl = document.getElementById('processingFee');
    var totalFeesEl = document.getElementById('totalFees');
    var netMonthlyEl = document.getElementById('netMonthly');
    var netAnnualEl = document.getElementById('netAnnual');
    var keepPercentEl = document.getElementById('keepPercent');
    var churnPatronsEl = document.getElementById('churnPatrons');
    var churnRevenueEl = document.getElementById('churnRevenue');
    var tierBreakdownBody = document.getElementById('tierBreakdownBody');
    var copyBtn = document.getElementById('copyResult');

    // --- EVENT LISTENERS ---
    calculateBtn.addEventListener('click', calculate);

    var allInputs = [planSelect, churnInput];
    tierInputs.forEach(function(tier) {
        allInputs.push(tier.name, tier.price, tier.patrons);
    });
    allInputs.forEach(function(el) {
        el.addEventListener('input', calculate);
        el.addEventListener('change', calculate);
    });

    // Initial calculation
    calculate();

    // --- MAIN CALCULATION ---
    function calculate() {
        var plan = planData[planSelect.value];
        var churnRate = parseFloat(churnInput.value) || 0;

        var totalGross = 0;
        var totalPlatformFee = 0;
        var totalProcessingFee = 0;
        var totalPatrons = 0;
        var tierRows = [];

        for (var i = 0; i < tierInputs.length; i++) {
            var tierName = tierInputs[i].name.value || ('Tier ' + (i + 1));
            var price = parseFloat(tierInputs[i].price.value) || 0;
            var patrons = parseInt(tierInputs[i].patrons.value) || 0;

            if (price === 0 || patrons === 0) continue;

            var gross = price * patrons;
            var pFee = gross * plan.rate;

            // Processing fee per patron
            var procRate, procFlat;
            if (price < MICRO_THRESHOLD) {
                procRate = MICRO_RATE;
                procFlat = MICRO_FLAT;
            } else {
                procRate = STANDARD_RATE;
                procFlat = STANDARD_FLAT;
            }
            var procFeePerPatron = (price * procRate) + procFlat;
            var procFeeTotal = procFeePerPatron * patrons;

            var tierNet = gross - pFee - procFeeTotal;

            totalGross += gross;
            totalPlatformFee += pFee;
            totalProcessingFee += procFeeTotal;
            totalPatrons += patrons;

            tierRows.push({
                name: tierName,
                price: price,
                patrons: patrons,
                gross: gross,
                platformFee: pFee,
                processingFee: procFeeTotal,
                net: tierNet,
                isMicro: price < MICRO_THRESHOLD
            });
        }

        var totalFees = totalPlatformFee + totalProcessingFee;
        var netMonthly = totalGross - totalFees;
        var netAnnual = netMonthly * 12;
        var keepPct = totalGross > 0 ? (netMonthly / totalGross) * 100 : 0;

        // Churn
        var patronsLost = Math.round(totalPatrons * (churnRate / 100));
        var avgRevenuePerPatron = totalPatrons > 0 ? netMonthly / totalPatrons : 0;
        var revenueAtRisk = avgRevenuePerPatron * patronsLost;

        // --- UPDATE UI ---
        grossMonthlyEl.textContent = formatMoney(totalGross);
        platformFeeEl.textContent = '-' + formatMoney(totalPlatformFee);
        platformFeePctEl.textContent = plan.label + ' plan (' + Math.round(plan.rate * 100) + '%)';
        processingFeeEl.textContent = '-' + formatMoney(totalProcessingFee);
        totalFeesEl.textContent = '-' + formatMoney(totalFees);
        netMonthlyEl.textContent = formatMoney(netMonthly);
        netAnnualEl.textContent = formatMoney(netAnnual);
        keepPercentEl.textContent = keepPct.toFixed(1) + '%';

        churnPatronsEl.textContent = patronsLost + ' patron' + (patronsLost !== 1 ? 's' : '') + '/month';
        churnRevenueEl.textContent = formatMoney(revenueAtRisk) + ' at risk';

        // Tier breakdown table
        tierBreakdownBody.innerHTML = '';
        tierRows.forEach(function(row) {
            var tr = document.createElement('tr');
            var microNote = row.isMicro ? ' *' : '';
            tr.innerHTML =
                '<td>' + escapeHtml(row.name) + '</td>' +
                '<td>' + formatMoney(row.price) + microNote + '</td>' +
                '<td>' + row.patrons + '</td>' +
                '<td>' + formatMoney(row.gross) + '</td>' +
                '<td style="color:#ef4444;">-' + formatMoney(row.platformFee + row.processingFee) + '</td>' +
                '<td style="color:#22c55e;font-weight:600;">' + formatMoney(row.net) + '</td>';
            tierBreakdownBody.appendChild(tr);
        });

        if (tierRows.length === 0) {
            var emptyRow = document.createElement('tr');
            emptyRow.innerHTML = '<td colspan="6" style="text-align:center;color:#9ca3af;">Enter tier pricing and patron counts above</td>';
            tierBreakdownBody.appendChild(emptyRow);
        }

        // Show micropayment note if any tier is under $3
        var hasMicro = tierRows.some(function(r) { return r.isMicro; });
        var microNote = document.getElementById('microNote');
        if (microNote) {
            microNote.style.display = hasMicro ? 'block' : 'none';
        }

        // Store data for copy
        copyBtn.dataset.net = formatMoney(netMonthly);
        copyBtn.dataset.patrons = totalPatrons;
        copyBtn.dataset.plan = plan.label;
    }

    // --- COPY RESULT ---
    copyBtn.addEventListener('click', function() {
        var text = 'My Patreon earns ' + this.dataset.net + '/month net | ' +
                   this.dataset.patrons + ' total patrons | ' +
                   this.dataset.plan + ' plan';

        var btn = this;
        navigator.clipboard.writeText(text).then(function() {
            btn.classList.add('copied');
            btn.innerHTML = '<i class="fas fa-check"></i> Copied to Clipboard!';
            setTimeout(function() {
                btn.classList.remove('copied');
                btn.innerHTML = '<i class="fas fa-copy"></i> Copy Result';
            }, 2000);
        }).catch(function() {
            var textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            btn.classList.add('copied');
            btn.innerHTML = '<i class="fas fa-check"></i> Copied to Clipboard!';
            setTimeout(function() {
                btn.classList.remove('copied');
                btn.innerHTML = '<i class="fas fa-copy"></i> Copy Result';
            }, 2000);
        });
    });

    // --- HELPERS ---
    function formatMoney(num) {
        if (num < 0) return '-$' + Math.abs(num).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        return '$' + num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function escapeHtml(str) {
        var div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // --- FAQ ---
    var faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(function(question) {
        question.addEventListener('click', function() {
            var answer = this.nextElementSibling;
            var isActive = answer.classList.contains('active');

            document.querySelectorAll('.faq-answer').forEach(function(ans) {
                ans.classList.remove('active');
            });
            document.querySelectorAll('.faq-question').forEach(function(q) {
                q.classList.remove('active');
            });

            if (!isActive) {
                answer.classList.add('active');
                question.classList.add('active');
            }
        });
    });

    if (faqQuestions.length > 0) {
        faqQuestions[0].click();
    }
});
