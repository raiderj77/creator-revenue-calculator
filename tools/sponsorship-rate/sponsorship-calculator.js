// Sponsorship Rate Calculator 2026 - JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // --- 2026 RATE DATA ---

    var platformData = {
        'youtube-dedicated':   { name: 'YouTube Dedicated Video', multiplier: 2.5, min: 1000 },
        'youtube-integration': { name: 'YouTube Integration',     multiplier: 1.5, min: 500 },
        'youtube-shorts':      { name: 'YouTube Shorts',          multiplier: 0.4, min: 50 },
        'tiktok-video':        { name: 'TikTok Video',            multiplier: 1.5, min: 25 },
        'instagram-reel':      { name: 'Instagram Reel',          multiplier: 1.5, min: 25 },
        'instagram-feed':      { name: 'Instagram Feed Post',     multiplier: 1.0, min: 20 },
        'instagram-story':     { name: 'Instagram Story',         multiplier: 0.3, min: 10 },
        'instagram-carousel':  { name: 'Instagram Carousel',      multiplier: 0.8, min: 20 },
        'podcast-preroll':     { name: 'Podcast Pre-roll (15s)',   multiplier: 1.0, min: 50, cpm: 18 },
        'podcast-midroll':     { name: 'Podcast Mid-roll (30s)',   multiplier: 1.0, min: 100, cpm: 25 },
        'podcast-dedicated':   { name: 'Podcast Dedicated Episode', multiplier: 1.0, min: 250, cpm: 50 }
    };

    var nicheData = {
        'finance':    { name: 'Finance/Investing',         multiplier: 2.0 },
        'tech':       { name: 'Tech/Software',             multiplier: 1.8 },
        'business':   { name: 'Business/Entrepreneurship', multiplier: 1.7 },
        'health':     { name: 'Health/Fitness',            multiplier: 1.4 },
        'beauty':     { name: 'Beauty/Skincare',           multiplier: 1.3 },
        'gaming':     { name: 'Gaming',                    multiplier: 1.2 },
        'lifestyle':  { name: 'Lifestyle/Fashion',         multiplier: 1.0 },
        'food':       { name: 'Food/Cooking',              multiplier: 1.0 },
        'travel':     { name: 'Travel',                    multiplier: 0.9 }
    };

    var dealTypeData = {
        'dedicated':   { name: 'Dedicated Post/Video', multiplier: 1.75 },
        'integration': { name: 'Integration/Mention',   multiplier: 1.0 },
        'series':      { name: 'Series (3+ posts)',     multiplier: 0.85 },
        'exclusivity': { name: 'w/ Exclusivity Clause', multiplier: 1.35 }
    };

    // Engagement benchmarks by tier: [low_good, high_good]
    var tierBenchmarks = {
        'nano':  { label: 'Nano (1K–10K)',       min: 1000,    max: 10000,    good: [5, 8],   low: 2 },
        'micro': { label: 'Micro (10K–100K)',     min: 10000,   max: 100000,   good: [3, 6],   low: 1.5 },
        'mid':   { label: 'Mid-tier (100K–500K)', min: 100000,  max: 500000,   good: [2, 4],   low: 1 },
        'macro': { label: 'Macro (500K–1M)',      min: 500000,  max: 1000000,  good: [1, 3],   low: 0.5 },
        'mega':  { label: 'Mega (1M+)',           min: 1000000, max: Infinity, good: [0.5, 2], low: 0.3 }
    };

    var negotiationTips = {
        'nano':  'Lead with your engagement rate and niche focus. Nano creators with 5%+ engagement are often more valuable per dollar than mega influencers. Propose a trial post with a performance bonus.',
        'micro': 'Lead with engagement rate — brands pay more for 5%+ engagement than raw follower count. Package 2–3 deliverables together (post + stories + reel) to increase deal value by 40–60%.',
        'mid':   'You have negotiating power. Request usage rights fees separately (+25–50%) and always push for 30-day exclusivity limits. Ask for the brand\'s budget first — never anchor low.',
        'macro': 'Negotiate usage rights, exclusivity windows, and whitelisting fees as separate line items. A single macro deal should cover 3–5x what a single sponsored post pays. Build long-term ambassador deals.',
        'mega':  'At your level, work with a talent manager. Charge separately for content creation, usage rights, exclusivity, and whitelisting. Ambassador deals (3–6 month contracts) are more valuable than one-offs.'
    };

    // --- DOM ELEMENTS ---
    var followersInput = document.getElementById('followers');
    var engagementInput = document.getElementById('engagementRate');
    var platformSelect = document.getElementById('platform');
    var nicheSelect = document.getElementById('niche');
    var dealTypeSelect = document.getElementById('dealType');
    var podcastDownloadsInput = document.getElementById('podcastDownloads');
    var podcastGroup = document.getElementById('podcastGroup');
    var calculateBtn = document.getElementById('calculateBtn');

    // Result elements
    var rateLow = document.getElementById('rateLow');
    var rateRecommended = document.getElementById('rateRecommended');
    var ratePremium = document.getElementById('ratePremium');
    var factorsContainer = document.getElementById('rateFactors');
    var tierBadge = document.getElementById('tierBadge');
    var tierBenchmarkText = document.getElementById('tierBenchmark');
    var negotiationText = document.getElementById('negotiationTip');
    var monthlyEstimate = document.getElementById('monthlyEstimate');
    var monthlyDetail = document.getElementById('monthlyDetail');
    var copyBtn = document.getElementById('copyRateCard');

    // --- PODCAST TOGGLE ---
    platformSelect.addEventListener('change', function() {
        var isPodcast = this.value.startsWith('podcast-');
        podcastGroup.classList.toggle('visible', isPodcast);
    });

    // --- EVENT LISTENERS ---
    calculateBtn.addEventListener('click', calculate);
    [followersInput, engagementInput, platformSelect, nicheSelect, dealTypeSelect, podcastDownloadsInput].forEach(function(el) {
        el.addEventListener('input', calculate);
        el.addEventListener('change', calculate);
    });

    // Initial calculation
    calculate();

    // --- MAIN CALCULATION ---
    function calculate() {
        var followers = parseInt(followersInput.value) || 0;
        var engagement = parseFloat(engagementInput.value) || 0;
        var platform = platformSelect.value;
        var niche = nicheSelect.value;
        var dealType = dealTypeSelect.value;
        var podcastDownloads = parseInt(podcastDownloadsInput.value) || 0;

        var pData = platformData[platform];
        var nData = nicheData[niche];
        var dData = dealTypeData[dealType];
        var tier = getTier(followers);
        var tData = tierBenchmarks[tier];

        var baseRate;
        var factors = [];
        var isPodcast = platform.startsWith('podcast-');

        if (isPodcast) {
            // Podcast: CPM model
            baseRate = (podcastDownloads / 1000) * pData.cpm * nData.multiplier;
            factors.push({ label: pData.name + ' CPM', value: '$' + pData.cpm, type: 'neutral' });
            factors.push({ label: nData.name + ' niche', value: nData.multiplier + 'x', type: nData.multiplier > 1 ? 'positive' : nData.multiplier < 1 ? 'negative' : 'neutral' });
        } else {
            // Social: follower-based model
            baseRate = (followers / 1000) * engagement * pData.multiplier * nData.multiplier;

            // Platform factor
            if (pData.multiplier > 1) {
                factors.push({ label: pData.name + ' platform', value: '+' + Math.round((pData.multiplier - 1) * 100) + '%', type: 'positive' });
            } else if (pData.multiplier < 1) {
                factors.push({ label: pData.name + ' platform', value: Math.round((pData.multiplier - 1) * 100) + '%', type: 'negative' });
            } else {
                factors.push({ label: pData.name + ' platform', value: '1.0x base', type: 'neutral' });
            }

            // Niche factor
            if (nData.multiplier > 1) {
                factors.push({ label: nData.name + ' niche', value: '+' + Math.round((nData.multiplier - 1) * 100) + '%', type: 'positive' });
            } else if (nData.multiplier < 1) {
                factors.push({ label: nData.name + ' niche', value: Math.round((nData.multiplier - 1) * 100) + '%', type: 'negative' });
            } else {
                factors.push({ label: nData.name + ' niche', value: '1.0x base', type: 'neutral' });
            }
        }

        // Engagement premium/penalty
        var engagementMultiplier = 1.0;
        if (engagement >= tData.good[1]) {
            engagementMultiplier = 1.5;
            factors.push({ label: 'Engagement above benchmark (' + engagement + '%)', value: '+50%', type: 'positive' });
        } else if (engagement >= tData.good[0]) {
            engagementMultiplier = 1.2;
            factors.push({ label: 'Good engagement (' + engagement + '%)', value: '+20%', type: 'positive' });
        } else if (engagement >= tData.low) {
            engagementMultiplier = 1.0;
            factors.push({ label: 'Average engagement (' + engagement + '%)', value: '0%', type: 'neutral' });
        } else {
            engagementMultiplier = 0.75;
            factors.push({ label: 'Below benchmark engagement (' + engagement + '%)', value: '-25%', type: 'negative' });
        }

        baseRate *= engagementMultiplier;

        // Deal type adjustment
        if (dData.multiplier !== 1.0) {
            baseRate *= dData.multiplier;
            if (dData.multiplier > 1) {
                factors.push({ label: dData.name, value: '+' + Math.round((dData.multiplier - 1) * 100) + '%', type: 'positive' });
            } else {
                factors.push({ label: dData.name + ' discount', value: Math.round((dData.multiplier - 1) * 100) + '%', type: 'negative' });
            }
        }

        // Apply floor
        baseRate = Math.max(baseRate, pData.min);

        // Calculate range
        var low = Math.round(baseRate * 0.7);
        var recommended = Math.round(baseRate);
        var premium = Math.round(baseRate * 1.4);

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

        // Tier badge
        tierBadge.textContent = tData.label;
        tierBadge.className = 'tier-badge ' + tier;
        tierBenchmarkText.innerHTML = 'Good engagement for your tier: <strong>' + tData.good[0] + '–' + tData.good[1] + '%</strong>. Your rate: <strong>' + engagement + '%</strong>';

        // Negotiation tip
        negotiationText.textContent = negotiationTips[tier];

        // Monthly estimate (2 deals/month)
        var monthly = recommended * 2;
        monthlyEstimate.textContent = formatMoney(monthly);
        monthlyDetail.textContent = 'Based on 2 deals/month at your recommended rate (' + formatMoney(recommended) + ' each)';

        // Store data for copy button
        copyBtn.dataset.platform = pData.name;
        copyBtn.dataset.low = formatMoney(low);
        copyBtn.dataset.high = formatMoney(premium);
        copyBtn.dataset.niche = nData.name;
        copyBtn.dataset.engagement = engagement;
        copyBtn.dataset.tier = tData.label;
    }

    // --- COPY RATE CARD ---
    copyBtn.addEventListener('click', function() {
        var text = 'My ' + this.dataset.platform + ' sponsorship rate: ' +
                   this.dataset.low + '–' + this.dataset.high +
                   ' | ' + this.dataset.niche + ' niche' +
                   ' | ' + this.dataset.engagement + '% engagement' +
                   ' | ' + this.dataset.tier + ' creator';

        var btn = this;
        navigator.clipboard.writeText(text).then(function() {
            btn.classList.add('copied');
            btn.innerHTML = '<i class="fas fa-check"></i> Copied to Clipboard!';
            setTimeout(function() {
                btn.classList.remove('copied');
                btn.innerHTML = '<i class="fas fa-copy"></i> Copy Rate Card';
            }, 2000);
        }).catch(function() {
            // Fallback for older browsers
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
    function getTier(followers) {
        if (followers >= 1000000) return 'mega';
        if (followers >= 500000) return 'macro';
        if (followers >= 100000) return 'mid';
        if (followers >= 10000) return 'micro';
        return 'nano';
    }

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

    // Open first FAQ by default
    if (faqQuestions.length > 0) {
        faqQuestions[0].click();
    }
});
