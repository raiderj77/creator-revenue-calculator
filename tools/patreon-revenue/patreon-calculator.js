// Patreon Revenue Calculator - fee model reviewed against Patreon Help Center on 2026-08-09.

document.addEventListener('DOMContentLoaded', function() {
    var planData = {
        standard: { label: 'Standard', rate: 0.10, legacy: false },
        founders: { label: 'Legacy Founders (original USD processing)', rate: 0.05, legacy: true },
        'founders-standard': { label: 'Legacy Founders (standard processing)', rate: 0.05, legacy: false },
        pro: { label: 'Legacy Pro', rate: 0.08, legacy: true },
        merch: { label: 'Legacy Pro + Merch', rate: 0.11, legacy: true }
    };

    var processingData = {
        card: {
            label: 'Card or Apple Pay',
            standardRate: 0.029,
            standardFlat: 0.30,
            microRate: 0.05,
            microFlat: 0.10,
            foundersRate: 0.016,
            foundersFlat: 0.30
        },
        us: {
            label: 'US PayPal or Venmo',
            standardRate: 0.029,
            standardFlat: 0.30,
            microRate: 0.05,
            microFlat: 0.10,
            foundersRate: 0.0265,
            foundersFlat: 0.28
        },
        nonus: {
            label: 'Non-US PayPal or Venmo',
            standardRate: 0.039,
            standardFlat: 0.30,
            microRate: 0.06,
            microFlat: 0.10,
            foundersRate: 0.0265,
            foundersFlat: 0.28
        }
    };

    var form = document.getElementById('patreonCalculatorForm');
    var planSelect = document.getElementById('plan');
    var processingSelect = document.getElementById('processingProfile');
    var churnInput = document.getElementById('churn');
    var targetInput = document.getElementById('targetTakeHome');
    var validationStatus = document.getElementById('calculatorValidationStatus');
    var resultsCard = document.getElementById('patreonResults');
    var tierInputs = [];

    for (var i = 1; i <= 4; i++) {
        tierInputs.push({
            name: document.getElementById('tierName' + i),
            price: document.getElementById('tierPrice' + i),
            patrons: document.getElementById('tierPatrons' + i)
        });
    }

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
    var targetGapEl = document.getElementById('targetGap');
    var netPerPatronEl = document.getElementById('netPerPatron');
    var additionalPatronsEl = document.getElementById('additionalPatrons');
    var targetSolverDetailEl = document.getElementById('targetSolverDetail');
    var tierBreakdownBody = document.getElementById('tierBreakdownBody');
    var copyBtn = document.getElementById('copyResult');
    var copyStatus = document.getElementById('copyStatus');
    var microNote = document.getElementById('microNote');
    var moneyFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    var numericRules = [
        { input: churnInput, label: 'Monthly churn rate', min: 0, max: 50, step: 0.5, whole: false },
        { input: targetInput, label: 'Target monthly take-home', min: 0, max: 100000000, step: 0.01, whole: false }
    ];

    tierInputs.forEach(function(tier, index) {
        numericRules.push({ input: tier.price, label: 'Tier ' + (index + 1) + ' monthly price', min: 0, max: 10000, step: 0.01, whole: false });
        numericRules.push({ input: tier.patrons, label: 'Tier ' + (index + 1) + ' patron count', min: 0, max: 100000, step: 1, whole: true });
    });

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        var outcome = calculate(true);
        if (!outcome.valid) return;

        resultsCard.focus();
        trackEvent('calculator_completed');
    });

    var allInputs = [planSelect, processingSelect, churnInput, targetInput];
    tierInputs.forEach(function(tier) {
        allInputs.push(tier.name, tier.price, tier.patrons);
    });
    allInputs.forEach(function(input) {
        input.addEventListener('input', function() { calculate(false); });
        input.addEventListener('change', function() { calculate(false); });
    });

    function calculate(requirePaidTier) {
        var validation = validateInputs();
        if (!validation.valid) {
            clearResults();
            if (requirePaidTier && validation.firstInvalid) validation.firstInvalid.focus();
            return { valid: false };
        }

        var planKey = planSelect.value;
        var plan = planData[planKey];
        var processing = processingData[processingSelect.value];
        var churnRate = validation.values.get(churnInput);
        var targetTakeHome = validation.values.get(targetInput);
        var totalGross = 0;
        var totalPlatformFee = 0;
        var totalProcessingFee = 0;
        var totalPatrons = 0;
        var tierRows = [];

        tierInputs.forEach(function(tier, index) {
            var price = validation.values.get(tier.price);
            var patrons = validation.values.get(tier.patrons);
            if (price === 0 && patrons === 0) return;

            var tierName = tier.name.value.trim() || ('Tier ' + (index + 1));
            var gross = price * patrons;
            var platformFee = gross * plan.rate;
            var processingTerms = getProcessingTerms(planKey, price, processing);
            var processingFee = ((price * processingTerms.rate) + processingTerms.flat) * patrons;
            var net = gross - platformFee - processingFee;

            totalGross += gross;
            totalPlatformFee += platformFee;
            totalProcessingFee += processingFee;
            totalPatrons += patrons;
            tierRows.push({
                name: tierName,
                price: price,
                patrons: patrons,
                gross: gross,
                fees: platformFee + processingFee,
                net: net,
                usesMicroRate: processingTerms.kind === 'micro'
            });
        });

        if (requirePaidTier && tierRows.length === 0) {
            validationStatus.textContent = 'Enter a price and patron count for at least one tier before calculating a scenario.';
            tierInputs[0].price.focus();
            clearResults();
            return { valid: false };
        }

        validationStatus.textContent = '';
        var totalFees = totalPlatformFee + totalProcessingFee;
        var netMonthly = totalGross - totalFees;
        var patronsLost = Math.round(totalPatrons * churnRate / 100);
        var revenueAffected = totalPatrons > 0 ? (netMonthly / totalPatrons) * patronsLost : 0;
        var netPerPatron = totalPatrons > 0 ? netMonthly / totalPatrons : null;

        grossMonthlyEl.textContent = formatMoney(totalGross);
        platformFeeEl.textContent = '-' + formatMoney(totalPlatformFee);
        platformFeePctEl.textContent = plan.label + ' (' + (plan.rate * 100).toFixed(0) + '%)';
        processingFeeEl.textContent = '-' + formatMoney(totalProcessingFee);
        processingFeeLabelEl.textContent = describeProcessing(planKey, processing);
        totalFeesEl.textContent = '-' + formatMoney(totalFees);
        netMonthlyEl.textContent = formatMoney(netMonthly);
        netAnnualEl.textContent = formatMoney(netMonthly * 12);
        keepPercentEl.textContent = (totalGross > 0 ? (netMonthly / totalGross) * 100 : 0).toFixed(1) + '%';
        churnPatronsEl.textContent = patronsLost + ' patron' + (patronsLost === 1 ? '' : 's') + '/month';
        churnRevenueEl.textContent = formatMoney(revenueAffected) + ' affected';

        renderTargetSolver(targetTakeHome, netMonthly, netPerPatron);
        renderTierRows(tierRows);
        microNote.style.display = tierRows.some(function(row) { return row.usesMicroRate; }) ? 'block' : 'none';

        if (tierRows.length > 0) {
            copyBtn.disabled = false;
            copyBtn.dataset.summary = 'Modeled Patreon net: ' + formatMoney(netMonthly) + '/month | ' + totalPatrons + ' patrons | ' + plan.label + ' | ' + processing.label;
        } else {
            copyBtn.disabled = true;
            delete copyBtn.dataset.summary;
        }

        copyStatus.textContent = '';
        return { valid: true };
    }

    function validateInputs() {
        var values = new Map();
        var firstInvalid = null;
        var firstMessage = '';

        numericRules.forEach(function(rule) {
            rule.input.setCustomValidity('');
            rule.input.removeAttribute('aria-invalid');
            var rawValue = rule.input.value.trim();
            var value = Number(rawValue);
            var message = '';

            if (rawValue === '' || !Number.isFinite(value)) {
                message = rule.label + ' must be a number.';
            } else if (value < rule.min || value > rule.max) {
                message = rule.label + ' must be between ' + rule.min + ' and ' + rule.max + '.';
            } else if (rule.whole && !Number.isInteger(value)) {
                message = rule.label + ' must be a whole number.';
            } else if (!isStepAligned(value, rule.min, rule.step)) {
                message = rule.label + ' must use increments of ' + rule.step + '.';
            }

            if (message) {
                rule.input.setCustomValidity(message);
                rule.input.setAttribute('aria-invalid', 'true');
                if (!firstInvalid) {
                    firstInvalid = rule.input;
                    firstMessage = message;
                }
            } else {
                values.set(rule.input, value);
            }
        });

        if (!firstInvalid) {
            tierInputs.some(function(tier, index) {
                var price = values.get(tier.price);
                var patrons = values.get(tier.patrons);
                if ((price === 0 && patrons > 0) || (price > 0 && patrons === 0)) {
                    firstInvalid = price === 0 ? tier.price : tier.patrons;
                    firstMessage = 'Tier ' + (index + 1) + ' needs both a price above zero and a patron count above zero, or both fields set to zero.';
                    firstInvalid.setCustomValidity(firstMessage);
                    firstInvalid.setAttribute('aria-invalid', 'true');
                    return true;
                }
                return false;
            });
        }

        if (!planData[planSelect.value] || !processingData[processingSelect.value]) {
            firstMessage = 'Choose a listed Patreon plan and USD payment method.';
            firstInvalid = planSelect;
        }

        validationStatus.textContent = firstMessage;
        return { valid: !firstInvalid, firstInvalid: firstInvalid, values: values };
    }

    function isStepAligned(value, minimum, step) {
        var increments = (value - minimum) / step;
        return Math.abs(increments - Math.round(increments)) < 0.0000001;
    }

    function getProcessingTerms(planKey, price, processing) {
        if (planKey === 'founders') {
            return { rate: processing.foundersRate, flat: processing.foundersFlat, kind: 'founders' };
        }

        if ((planKey === 'pro' || planKey === 'merch') && price <= 3) {
            return { rate: processing.microRate, flat: processing.microFlat, kind: 'micro' };
        }

        return { rate: processing.standardRate, flat: processing.standardFlat, kind: 'standard' };
    }

    function describeProcessing(planKey, processing) {
        if (planKey === 'founders') {
            return processing.label + '; original Founders USD rate';
        }
        if (planKey === 'pro' || planKey === 'merch') {
            return processing.label + '; tier-level legacy rates';
        }
        return processing.label + '; standard rate';
    }

    function renderTargetSolver(target, netMonthly, netPerPatron) {
        var gap = target - netMonthly;
        targetGapEl.textContent = target === 0 ? formatMoney(0) : formatMoney(gap > 0 ? gap : 0);
        netPerPatronEl.textContent = netPerPatron === null ? '\u2014' : formatMoney(netPerPatron);

        if (target === 0) {
            additionalPatronsEl.textContent = '\u2014';
            targetSolverDetailEl.textContent = 'Enter your own target to solve from the current entered tier mix.';
        } else if (netPerPatron === null) {
            additionalPatronsEl.textContent = '\u2014';
            targetSolverDetailEl.textContent = 'Enter at least one paid tier to calculate a weighted net amount per patron.';
        } else if (netMonthly >= target) {
            additionalPatronsEl.textContent = '0';
            targetSolverDetailEl.textContent = 'The current modeled net meets or exceeds the entered target.';
        } else if (netPerPatron <= 0) {
            additionalPatronsEl.textContent = '\u2014';
            targetSolverDetailEl.textContent = 'The current entered tier mix has no positive modeled net per patron, so it cannot solve this target.';
        } else {
            var additionalPatrons = Math.ceil(gap / netPerPatron);
            additionalPatronsEl.textContent = additionalPatrons.toLocaleString('en-US');
            targetSolverDetailEl.textContent = 'Gap divided by current weighted net per patron, rounded up. Assumes the same entered tier mix and fee profile.';
        }
    }

    function renderTierRows(rows) {
        tierBreakdownBody.textContent = '';

        if (rows.length === 0) {
            var emptyRow = document.createElement('tr');
            var emptyCell = document.createElement('td');
            emptyCell.colSpan = 6;
            emptyCell.style.textAlign = 'center';
            emptyCell.style.color = '#9ca3af';
            emptyCell.textContent = 'Enter a price and patron count for at least one tier';
            emptyRow.appendChild(emptyCell);
            tierBreakdownBody.appendChild(emptyRow);
            return;
        }

        rows.forEach(function(row) {
            var tableRow = document.createElement('tr');
            appendCell(tableRow, row.name);
            appendCell(tableRow, formatMoney(row.price) + (row.usesMicroRate ? ' *' : ''));
            appendCell(tableRow, row.patrons.toLocaleString('en-US'));
            appendCell(tableRow, formatMoney(row.gross));
            appendCell(tableRow, '-' + formatMoney(row.fees), '#ef4444', false);
            appendCell(tableRow, formatMoney(row.net), row.net < 0 ? '#b91c1c' : '#15803d', true);
            tierBreakdownBody.appendChild(tableRow);
        });
    }

    function appendCell(row, value, color, bold) {
        var cell = document.createElement('td');
        cell.textContent = value;
        if (color) cell.style.color = color;
        if (bold) cell.style.fontWeight = '600';
        row.appendChild(cell);
    }

    function clearResults() {
        grossMonthlyEl.textContent = '\u2014';
        platformFeeEl.textContent = '\u2014';
        processingFeeEl.textContent = '\u2014';
        totalFeesEl.textContent = '\u2014';
        netMonthlyEl.textContent = '\u2014';
        netAnnualEl.textContent = '\u2014';
        keepPercentEl.textContent = '\u2014';
        churnPatronsEl.textContent = '\u2014';
        churnRevenueEl.textContent = '\u2014';
        targetGapEl.textContent = '\u2014';
        netPerPatronEl.textContent = '\u2014';
        additionalPatronsEl.textContent = '\u2014';
        targetSolverDetailEl.textContent = 'Correct the highlighted input to calculate this scenario.';
        renderTierRows([]);
        microNote.style.display = 'none';
        copyBtn.disabled = true;
        delete copyBtn.dataset.summary;
        copyStatus.textContent = '';
    }

    copyBtn.addEventListener('click', function() {
        var summary = copyBtn.dataset.summary;
        if (!summary) {
            copyStatus.textContent = 'Calculate a valid paid-tier scenario before copying.';
            return;
        }

        copyStatus.textContent = 'Copying scenario summary...';
        copyText(summary).then(function(copied) {
            if (!copied) {
                copyStatus.textContent = 'Could not copy automatically. Select the visible results and copy them manually.';
                return;
            }

            copyStatus.textContent = 'Scenario summary copied.';
            copyBtn.textContent = 'Copied';
            trackEvent('result_copied');
            window.setTimeout(function() {
                copyBtn.textContent = 'Copy Result';
            }, 2000);
        });
    });

    function copyText(value) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            return navigator.clipboard.writeText(value).then(function() {
                return true;
            }).catch(function() {
                return fallbackCopy(value);
            });
        }
        return Promise.resolve(fallbackCopy(value));
    }

    function fallbackCopy(value) {
        var textarea = document.createElement('textarea');
        textarea.value = value;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        var copied = false;
        try {
            copied = document.execCommand('copy');
        } catch (error) {
            copied = false;
        }
        document.body.removeChild(textarea);
        return copied;
    }

    function formatMoney(value) {
        return moneyFormatter.format(value);
    }

    function trackEvent(eventName) {
        if (typeof window.crcTrackEvent === 'function') {
            window.crcTrackEvent(eventName);
        }
    }

    var faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(function(question) {
        question.setAttribute('aria-expanded', 'false');
        var answer = question.nextElementSibling;
        if (answer) answer.setAttribute('aria-hidden', 'true');

        question.addEventListener('click', function() {
            var selectedAnswer = question.nextElementSibling;
            var isActive = selectedAnswer.classList.contains('active');

            document.querySelectorAll('.faq-answer').forEach(function(item) {
                item.classList.remove('active');
                item.setAttribute('aria-hidden', 'true');
            });
            faqQuestions.forEach(function(item) {
                item.classList.remove('active');
                item.setAttribute('aria-expanded', 'false');
            });

            if (!isActive) {
                selectedAnswer.classList.add('active');
                selectedAnswer.setAttribute('aria-hidden', 'false');
                question.classList.add('active');
                question.setAttribute('aria-expanded', 'true');
            }
        });
    });

    if (faqQuestions.length > 0) faqQuestions[0].click();
    calculate(false);
});
