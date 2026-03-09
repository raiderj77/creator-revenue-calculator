// UGC Creator Rate Calculator 2026 - JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // --- 2026 UGC RATE DATA ---

    var experienceData = {
        'beginner':     { label: 'Beginner',     videoBase: 225,  photoBase: 135 },
        'intermediate': { label: 'Intermediate',  videoBase: 450,  photoBase: 270 },
        'established':  { label: 'Established',   videoBase: 1050, photoBase: 630 }
    };

    var videoLengthData = {
        '15s':   { label: '15 seconds', multiplier: 0.75 },
        '30s':   { label: '30 seconds', multiplier: 1.0 },
        '60s':   { label: '60 seconds', multiplier: 1.4 },
        '2min':  { label: '2+ minutes', multiplier: 2.0 }
    };

    var usageRightsData = {
        'organic':     { label: 'Organic Only',   multiplier: 1.0 },
        'paid-ads':    { label: 'Paid Ads',       multiplier: 1.75 },
        'whitelisting': { label: 'Whitelisting',  multiplier: 2.5 }
    };

    var revisionData = {
        '0': { label: '0 rounds',   addon: 0 },
        '1': { label: '1 round (included)', addon: 0 },
        '2': { label: '2 rounds',   addon: 75 },
        'unlimited': { label: 'Unlimited', addon: 200 }
    };

    var portfolioTips = {
        'beginner':     'Start by building a portfolio of 5–10 spec pieces for brands you love. Post them on social media and tag the brands. Many UGC creators land their first paid gig within 2–4 weeks of actively pitching.',
        'intermediate': 'You have leverage now. Start raising rates after every 10 completed projects. Package multi-deliverable bundles (3 videos + 3 photos) to increase deal value by 30–50%. Negotiate usage rights as a separate line item.',
        'established':  'At your level, retainer deals are more valuable than one-offs. Offer brands a monthly content package (8–12 pieces) at a slight discount per piece but guaranteed recurring income. Charge separately for concepts, scripting, and usage rights.'
    };

    // --- DOM ELEMENTS ---
    var contentTypeSelect = document.getElementById('contentType');
    var videoLengthSelect = document.getElementById('videoLength');
    var videoLengthGroup = document.getElementById('videoLengthGroup');
    var deliverablesInput = document.getElementById('deliverables');
    var usageRightsSelect = document.getElementById('usageRights');
    var revisionsSelect = document.getElementById('revisions');
    var experienceSelect = document.getElementById('experience');
    var rushSelect = document.getElementById('rush');
    var calculateBtn = document.getElementById('calculateBtn');

    // Result elements
    var rateLow = document.getElementById('rateLow');
    var rateRecommended = document.getElementById('rateRecommended');
    var ratePremium = document.getElementById('ratePremium');
    var factorsContainer = document.getElementById('rateFactors');
    var perUnitLabel = document.getElementById('perUnitLabel');
    var perUnitValue = document.getElementById('perUnitValue');
    var totalUnitsLabel = document.getElementById('totalUnitsLabel');
    var totalUnitsValue = document.getElementById('totalUnitsValue');
    var usageLineLabel = document.getElementById('usageLineLabel');
    var usageLineValue = document.getElementById('usageLineValue');
    var portfolioTipText = document.getElementById('portfolioTip');
    var monthlyEstimate = document.getElementById('monthlyEstimate');
    var monthlyDetail = document.getElementById('monthlyDetail');
    var copyBtn = document.getElementById('copyRateCard');

    // --- CONDITIONAL VISIBILITY ---
    contentTypeSelect.addEventListener('change', function() {
        var showVideo = this.value === 'video' || this.value === 'bundle';
        videoLengthGroup.classList.toggle('visible', showVideo);
    });

    // --- EVENT LISTENERS ---
    calculateBtn.addEventListener('click', calculate);
    [contentTypeSelect, videoLengthSelect, deliverablesInput, usageRightsSelect, revisionsSelect, experienceSelect, rushSelect].forEach(function(el) {
        el.addEventListener('input', calculate);
        el.addEventListener('change', calculate);
    });

    // Initial calculation
    calculate();

    // --- MAIN CALCULATION ---
    function calculate() {
        var contentType = contentTypeSelect.value;
        var videoLength = videoLengthSelect.value;
        var deliverables = parseInt(deliverablesInput.value) || 1;
        var usageRights = usageRightsSelect.value;
        var revisions = revisionsSelect.value;
        var experience = experienceSelect.value;
        var rush = rushSelect.value;

        var exp = experienceData[experience];
        var vLen = videoLengthData[videoLength];
        var usage = usageRightsData[usageRights];
        var rev = revisionData[revisions];

        var factors = [];
        var unitRate = 0;
        var unitLabel = '';
        var subtotal = 0;

        // 1. Calculate per-unit base rate
        if (contentType === 'video') {
            unitRate = exp.videoBase * vLen.multiplier;
            unitLabel = 'per video (' + vLen.label + ')';
            subtotal = unitRate * deliverables;

            if (vLen.multiplier !== 1.0) {
                var pct = Math.round((vLen.multiplier - 1) * 100);
                var sign = pct > 0 ? '+' : '';
                factors.push({ label: vLen.label + ' video length', value: sign + pct + '%', type: pct > 0 ? 'positive' : 'negative' });
            }
        } else if (contentType === 'photo') {
            unitRate = exp.photoBase;
            unitLabel = 'per photo';
            subtotal = unitRate * deliverables;
            factors.push({ label: 'Photo (60% of video rate)', value: formatMoney(unitRate), type: 'neutral' });
        } else {
            // Bundle: 3 videos + 3 photos per bundle unit
            var videoRate = exp.videoBase * vLen.multiplier;
            var photoRate = exp.photoBase;
            unitRate = (videoRate * 3) + (photoRate * 3);
            unitLabel = 'per bundle (3 videos + 3 photos)';
            subtotal = unitRate * deliverables;
            factors.push({ label: 'Bundle: 3 videos + 3 photos', value: formatMoney(unitRate), type: 'neutral' });
        }

        // Experience factor
        factors.push({ label: exp.label + ' experience level', value: formatMoney(exp.videoBase) + ' video base', type: experience === 'established' ? 'positive' : experience === 'beginner' ? 'neutral' : 'neutral' });

        // 2. Usage rights multiplier
        var afterUsage = subtotal * usage.multiplier;
        if (usage.multiplier > 1) {
            factors.push({ label: usage.label + ' usage rights', value: '+' + Math.round((usage.multiplier - 1) * 100) + '%', type: 'positive' });
        } else {
            factors.push({ label: usage.label + ' usage rights', value: 'Included', type: 'neutral' });
        }

        // 3. Revision add-on
        var revisionCost = rev.addon * deliverables;
        if (rev.addon > 0) {
            factors.push({ label: rev.label + ' revisions', value: '+' + formatMoney(revisionCost), type: 'negative' });
        }

        var beforeRush = afterUsage + revisionCost;

        // 4. Rush fee
        var rushMultiplier = rush === 'yes' ? 1.35 : 1.0;
        var total = beforeRush * rushMultiplier;
        if (rush === 'yes') {
            factors.push({ label: 'Rush delivery', value: '+35%', type: 'positive' });
        }

        // 5. Calculate range
        var low = Math.round(total * 0.8);
        var recommended = Math.round(total);
        var premium = Math.round(total * 1.3);

        // --- UPDATE UI ---
        rateLow.textContent = formatMoney(low);
        rateRecommended.textContent = formatMoney(recommended);
        ratePremium.textContent = formatMoney(premium);

        // Factors
        factorsContainer.innerHTML = '';
        factors.forEach(function(f) {
            var div = document.createElement('div');
            div.className = 'factor-item ' + f.type;
            div.innerHTML = '<span class="factor-label">' + f.label + '</span><span class="factor-value">' + f.value + '</span>';
            factorsContainer.appendChild(div);
        });

        // Per-deliverable breakdown
        perUnitLabel.textContent = 'Base rate ' + unitLabel + ':';
        perUnitValue.textContent = formatMoney(Math.round(unitRate));
        totalUnitsLabel.textContent = deliverables + ' deliverable' + (deliverables !== 1 ? 's' : '') + ' subtotal:';
        totalUnitsValue.textContent = formatMoney(Math.round(subtotal));
        usageLineLabel.textContent = 'After ' + usage.label.toLowerCase() + ' rights:';
        usageLineValue.textContent = formatMoney(Math.round(afterUsage));

        // Portfolio tip
        portfolioTipText.textContent = portfolioTips[experience];

        // Monthly estimate (4 projects/month)
        var monthly = recommended * 4;
        monthlyEstimate.textContent = formatMoney(monthly);
        monthlyDetail.textContent = 'Based on 4 projects/month at your recommended rate (' + formatMoney(recommended) + ' each)';

        // Store data for copy button
        var typeLabel = contentType === 'bundle' ? 'Bundle' : contentType === 'video' ? 'Video' : 'Photo';
        copyBtn.dataset.type = typeLabel;
        copyBtn.dataset.low = formatMoney(low);
        copyBtn.dataset.high = formatMoney(premium);
        copyBtn.dataset.quantity = deliverables;
        copyBtn.dataset.usage = usage.label;
        copyBtn.dataset.experience = exp.label;
    }

    // --- COPY RATE CARD ---
    copyBtn.addEventListener('click', function() {
        var text = 'UGC ' + this.dataset.type + ' rate: ' +
                   this.dataset.low + '–' + this.dataset.high +
                   ' | ' + this.dataset.quantity + ' deliverable' + (parseInt(this.dataset.quantity) !== 1 ? 's' : '') +
                   ' | ' + this.dataset.usage + ' rights' +
                   ' | ' + this.dataset.experience + ' creator';

        var btn = this;
        navigator.clipboard.writeText(text).then(function() {
            btn.classList.add('copied');
            btn.innerHTML = '<i class="fas fa-check"></i> Copied to Clipboard!';
            setTimeout(function() {
                btn.classList.remove('copied');
                btn.innerHTML = '<i class="fas fa-copy"></i> Copy Rate Card';
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
                btn.innerHTML = '<i class="fas fa-copy"></i> Copy Rate Card';
            }, 2000);
        });
    });

    // --- HELPERS ---
    function formatMoney(num) {
        if (num >= 1000000) return '$' + (num / 1000000).toFixed(1) + 'M';
        if (num >= 10000) return '$' + (num / 1000).toFixed(1) + 'K';
        return '$' + num.toLocaleString('en-US');
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
