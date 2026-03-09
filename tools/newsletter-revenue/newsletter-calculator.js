// Newsletter & Substack Revenue Calculator 2026 - JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // --- 2026 PLATFORM FEE DATA ---

    var platformData = {
        'substack':       { label: 'Substack',           fee: 10,  note: '' },
        'beehiiv':        { label: 'Beehiiv',            fee: 0,   note: 'Creator plan $49/month (not deducted above)' },
        'convertkit':     { label: 'ConvertKit',         fee: 3.5, note: '' },
        'ghost-pro':      { label: 'Ghost Pro',          fee: 10,  note: '' },
        'ghost-self':     { label: 'Ghost (Self-Hosted)', fee: 0,  note: 'Server costs ~$10\u201320/month (not deducted above)' },
        'other':          { label: 'Other',              fee: 0,   note: 'Enter your platform fee manually' }
    };

    // --- DOM ELEMENTS ---
    var platformSelect = document.getElementById('platform');
    var subscribersInput = document.getElementById('subscribers');
    var conversionInput = document.getElementById('conversion');
    var priceInput = document.getElementById('price');
    var platformFeeInput = document.getElementById('platformFee');
    var platformNoteEl = document.getElementById('platformNote');
    var sponsorsInput = document.getElementById('sponsors');
    var sponsorRateInput = document.getElementById('sponsorRate');
    var issuesInput = document.getElementById('issues');
    var referralToggle = document.getElementById('referralToggle');
    var referralGroup = document.getElementById('referralGroup');
    var referralRateInput = document.getElementById('referralRate');
    var newSubsInput = document.getElementById('newSubs');
    var calculateBtn = document.getElementById('calculateBtn');

    // Result elements
    var paidSubsEl = document.getElementById('paidSubs');
    var grossSubEl = document.getElementById('grossSub');
    var feeDeductionEl = document.getElementById('feeDeduction');
    var feeDeductionPctEl = document.getElementById('feeDeductionPct');
    var netSubEl = document.getElementById('netSub');
    var sponsorRevenueEl = document.getElementById('sponsorRevenue');
    var referralRevenueEl = document.getElementById('referralRevenue');
    var referralRevenueRow = document.getElementById('referralRevenueRow');
    var totalMonthlyEl = document.getElementById('totalMonthly');
    var totalAnnualEl = document.getElementById('totalAnnual');
    var streamSubEl = document.getElementById('streamSub');
    var streamSubPctEl = document.getElementById('streamSubPct');
    var streamSubBar = document.getElementById('streamSubBar');
    var streamSponsorEl = document.getElementById('streamSponsor');
    var streamSponsorPctEl = document.getElementById('streamSponsorPct');
    var streamSponsorBar = document.getElementById('streamSponsorBar');
    var streamReferralEl = document.getElementById('streamReferral');
    var streamReferralPctEl = document.getElementById('streamReferralPct');
    var streamReferralBar = document.getElementById('streamReferralBar');
    var streamReferralRow = document.getElementById('streamReferralRow');
    var fulltimeSubsEl = document.getElementById('fulltimeSubs');
    var fulltimeDetailEl = document.getElementById('fulltimeDetail');
    var copyBtn = document.getElementById('copyResult');

    // --- PLATFORM CHANGE ---
    platformSelect.addEventListener('change', function() {
        var data = platformData[this.value];
        platformFeeInput.value = data.fee;
        if (data.note) {
            platformNoteEl.textContent = data.note;
            platformNoteEl.style.display = 'block';
        } else {
            platformNoteEl.style.display = 'none';
        }
        calculate();
    });

    // Set initial platform note
    var initData = platformData[platformSelect.value];
    if (initData.note) {
        platformNoteEl.textContent = initData.note;
        platformNoteEl.style.display = 'block';
    }

    // --- REFERRAL TOGGLE ---
    referralToggle.addEventListener('change', function() {
        referralGroup.classList.toggle('visible', this.value === 'yes');
        calculate();
    });

    // --- EVENT LISTENERS ---
    calculateBtn.addEventListener('click', calculate);
    var allInputs = [platformSelect, subscribersInput, conversionInput, priceInput, platformFeeInput, sponsorsInput, sponsorRateInput, issuesInput, referralToggle, referralRateInput, newSubsInput];
    allInputs.forEach(function(el) {
        el.addEventListener('input', calculate);
        el.addEventListener('change', calculate);
    });

    // Initial calculation
    calculate();

    // --- MAIN CALCULATION ---
    function calculate() {
        var platform = platformSelect.value;
        var totalSubs = parseInt(subscribersInput.value) || 0;
        var conversionRate = parseFloat(conversionInput.value) || 0;
        var price = parseFloat(priceInput.value) || 0;
        var feePct = parseFloat(platformFeeInput.value) || 0;
        var sponsors = parseInt(sponsorsInput.value) || 0;
        var sponsorRate = parseFloat(sponsorRateInput.value) || 0;
        var issues = parseInt(issuesInput.value) || 0;
        var referralsEnabled = referralToggle.value === 'yes';
        var referralRate = parseFloat(referralRateInput.value) || 0;
        var newSubs = parseInt(newSubsInput.value) || 0;

        var platformLabel = platformData[platform].label;

        // Paid subscribers
        var paidSubs = Math.round(totalSubs * (conversionRate / 100));

        // Subscription revenue
        var grossSub = paidSubs * price;
        var feeAmount = grossSub * (feePct / 100);
        var netSub = grossSub - feeAmount;

        // Sponsorship revenue
        var sponsorRevenue = sponsors * sponsorRate * issues;

        // Referral revenue
        var referralRevenue = referralsEnabled ? (newSubs * referralRate) : 0;

        // Totals
        var totalMonthly = netSub + sponsorRevenue + referralRevenue;
        var totalAnnual = totalMonthly * 12;

        // Stream percentages
        var subPct = totalMonthly > 0 ? (netSub / totalMonthly * 100) : 0;
        var sponsorPct = totalMonthly > 0 ? (sponsorRevenue / totalMonthly * 100) : 0;
        var referralPct = totalMonthly > 0 ? (referralRevenue / totalMonthly * 100) : 0;

        // Full-time estimate ($5K/month target)
        var target = 5000;
        var fulltimeSubs = 0;
        if (price > 0 && conversionRate > 0) {
            // Revenue per total subscriber from subscriptions only (net)
            var netPerPaidSub = price * (1 - feePct / 100);
            var paidSubsNeeded = Math.ceil(target / netPerPaidSub);
            fulltimeSubs = Math.ceil(paidSubsNeeded / (conversionRate / 100));
        }

        // --- UPDATE UI ---
        paidSubsEl.textContent = paidSubs.toLocaleString('en-US');
        grossSubEl.textContent = formatMoney(grossSub);
        feeDeductionEl.textContent = '-' + formatMoney(feeAmount);
        feeDeductionPctEl.textContent = platformLabel + ' (' + feePct + '%)';
        netSubEl.textContent = formatMoney(netSub);
        sponsorRevenueEl.textContent = formatMoney(sponsorRevenue);

        if (referralsEnabled) {
            referralRevenueEl.textContent = formatMoney(referralRevenue);
            referralRevenueRow.style.display = 'flex';
            streamReferralRow.style.display = 'flex';
        } else {
            referralRevenueRow.style.display = 'none';
            streamReferralRow.style.display = 'none';
        }

        totalMonthlyEl.textContent = formatMoney(totalMonthly);
        totalAnnualEl.textContent = formatMoney(totalAnnual);

        // Stream breakdown
        streamSubEl.textContent = formatMoney(netSub);
        streamSubPctEl.textContent = subPct.toFixed(0) + '%';
        streamSubBar.style.width = subPct + '%';

        streamSponsorEl.textContent = formatMoney(sponsorRevenue);
        streamSponsorPctEl.textContent = sponsorPct.toFixed(0) + '%';
        streamSponsorBar.style.width = sponsorPct + '%';

        streamReferralEl.textContent = formatMoney(referralRevenue);
        streamReferralPctEl.textContent = referralPct.toFixed(0) + '%';
        streamReferralBar.style.width = referralPct + '%';

        // Full-time estimate
        if (fulltimeSubs > 0) {
            fulltimeSubsEl.textContent = fulltimeSubs.toLocaleString('en-US') + ' total subscribers';
            var progress = totalSubs > 0 ? Math.min((totalSubs / fulltimeSubs) * 100, 100) : 0;
            fulltimeDetailEl.textContent = 'You need ' + fulltimeSubs.toLocaleString('en-US') + ' total subscribers at ' + conversionRate + '% conversion and $' + price + '/month to earn $5,000/month from subscriptions alone. You\u2019re ' + progress.toFixed(0) + '% of the way there.';
        } else {
            fulltimeSubsEl.textContent = 'Set pricing to calculate';
            fulltimeDetailEl.textContent = 'Enter your subscription price and conversion rate to see how many subscribers you need to go full-time.';
        }

        // Store data for copy
        copyBtn.dataset.total = formatMoney(totalMonthly);
        copyBtn.dataset.paid = paidSubs;
        copyBtn.dataset.platform = platformLabel;
    }

    // --- COPY RESULT ---
    copyBtn.addEventListener('click', function() {
        var text = 'My newsletter earns ' + this.dataset.total + '/month | ' +
                   this.dataset.paid + ' paid subscribers | ' +
                   this.dataset.platform;

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
