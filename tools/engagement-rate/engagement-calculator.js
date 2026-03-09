// Engagement Rate Calculator 2026 - JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // --- 2026 ENGAGEMENT RATE BENCHMARK DATA ---

    var benchmarkData = {
        'instagram': {
            label: 'Instagram',
            low: 1, average: 3, good: 6, excellent: 6,
            avgMid: 2.0,
            showShares: true, showViews: false,
            tiers: [
                { name: 'Low',       max: 1,    color: '#ef4444', icon: 'fa-arrow-down' },
                { name: 'Average',   max: 3,    color: '#f59e0b', icon: 'fa-minus' },
                { name: 'Good',      max: 6,    color: '#22c55e', icon: 'fa-arrow-up' },
                { name: 'Excellent', max: 12,   color: '#3b82f6', icon: 'fa-fire' },
                { name: 'Viral',     max: Infinity, color: '#8b5cf6', icon: 'fa-bolt' }
            ]
        },
        'tiktok': {
            label: 'TikTok',
            low: 3, average: 8, good: 15, excellent: 15,
            avgMid: 5.5,
            showShares: true, showViews: true,
            tiers: [
                { name: 'Low',       max: 3,    color: '#ef4444', icon: 'fa-arrow-down' },
                { name: 'Average',   max: 8,    color: '#f59e0b', icon: 'fa-minus' },
                { name: 'Good',      max: 15,   color: '#22c55e', icon: 'fa-arrow-up' },
                { name: 'Excellent', max: 30,   color: '#3b82f6', icon: 'fa-fire' },
                { name: 'Viral',     max: Infinity, color: '#8b5cf6', icon: 'fa-bolt' }
            ]
        },
        'youtube': {
            label: 'YouTube',
            low: 1, average: 3, good: 7, excellent: 7,
            avgMid: 2.0,
            showShares: false, showViews: true,
            tiers: [
                { name: 'Low',       max: 1,    color: '#ef4444', icon: 'fa-arrow-down' },
                { name: 'Average',   max: 3,    color: '#f59e0b', icon: 'fa-minus' },
                { name: 'Good',      max: 7,    color: '#22c55e', icon: 'fa-arrow-up' },
                { name: 'Excellent', max: 14,   color: '#3b82f6', icon: 'fa-fire' },
                { name: 'Viral',     max: Infinity, color: '#8b5cf6', icon: 'fa-bolt' }
            ]
        },
        'twitter': {
            label: 'Twitter/X',
            low: 0.5, average: 1, good: 3, excellent: 3,
            avgMid: 0.75,
            showShares: true, showViews: false,
            tiers: [
                { name: 'Low',       max: 0.5,  color: '#ef4444', icon: 'fa-arrow-down' },
                { name: 'Average',   max: 1,    color: '#f59e0b', icon: 'fa-minus' },
                { name: 'Good',      max: 3,    color: '#22c55e', icon: 'fa-arrow-up' },
                { name: 'Excellent', max: 6,    color: '#3b82f6', icon: 'fa-fire' },
                { name: 'Viral',     max: Infinity, color: '#8b5cf6', icon: 'fa-bolt' }
            ]
        },
        'linkedin': {
            label: 'LinkedIn',
            low: 1, average: 4, good: 8, excellent: 8,
            avgMid: 2.5,
            showShares: true, showViews: false,
            tiers: [
                { name: 'Low',       max: 1,    color: '#ef4444', icon: 'fa-arrow-down' },
                { name: 'Average',   max: 4,    color: '#f59e0b', icon: 'fa-minus' },
                { name: 'Good',      max: 8,    color: '#22c55e', icon: 'fa-arrow-up' },
                { name: 'Excellent', max: 16,   color: '#3b82f6', icon: 'fa-fire' },
                { name: 'Viral',     max: Infinity, color: '#8b5cf6', icon: 'fa-bolt' }
            ]
        }
    };

    var sponsorshipImpact = {
        'Low':       { text: 'Low engagement typically reduces your sponsorship value by 20\u201340%. Focus on building genuine audience interaction before pitching brands.', modifier: '-20\u201340%' },
        'Average':   { text: 'Average engagement is the baseline brands expect. You can negotiate standard sponsorship rates for your follower count.', modifier: 'Baseline' },
        'Good':      { text: 'Good engagement adds ~40% to your base sponsorship rate. Brands actively seek creators with above-average engagement \u2014 it signals a loyal, responsive audience.', modifier: '+~40%' },
        'Excellent': { text: 'Excellent engagement can double your sponsorship rate. At this level, your audience is highly active and brands will pay a premium for access to them.', modifier: '+80\u2013120%' },
        'Viral':     { text: 'Viral-level engagement puts you in the top 1% of creators. You can command 2\u20133x standard sponsorship rates and should be pitching premium brand partnerships.', modifier: '+150\u2013200%' }
    };

    // --- DOM ELEMENTS ---
    var platformSelect = document.getElementById('platform');
    var followersInput = document.getElementById('followers');
    var likesInput = document.getElementById('likes');
    var commentsInput = document.getElementById('comments');
    var sharesInput = document.getElementById('shares');
    var viewsInput = document.getElementById('views');
    var sharesGroup = document.getElementById('sharesGroup');
    var viewsGroup = document.getElementById('viewsGroup');
    var calculateBtn = document.getElementById('calculateBtn');

    // Result elements
    var engagementRateDisplay = document.getElementById('engagementRate');
    var viewBasedRateDisplay = document.getElementById('viewBasedRate');
    var viewBasedRow = document.getElementById('viewBasedRow');
    var tierBadge = document.getElementById('tierBadge');
    var benchmarkComparison = document.getElementById('benchmarkComparison');
    var benchmarkMultiple = document.getElementById('benchmarkMultiple');
    var sponsorshipImpactText = document.getElementById('sponsorshipImpact');
    var sponsorshipModifier = document.getElementById('sponsorshipModifier');
    var explanationText = document.getElementById('explanationText');
    var copyBtn = document.getElementById('copyResult');

    // Breakdown elements
    var totalEngagements = document.getElementById('totalEngagements');
    var followerCount = document.getElementById('followerCount');
    var formulaDisplay = document.getElementById('formulaDisplay');

    // --- CONDITIONAL VISIBILITY ---
    platformSelect.addEventListener('change', function() {
        var platform = benchmarkData[this.value];
        sharesGroup.classList.toggle('visible', platform.showShares);
        viewsGroup.classList.toggle('visible', platform.showViews);
        if (!platform.showShares) sharesInput.value = 0;
        if (!platform.showViews) viewsInput.value = 0;
        calculate();
    });

    // Set initial visibility
    var initialPlatform = benchmarkData[platformSelect.value];
    sharesGroup.classList.toggle('visible', initialPlatform.showShares);
    viewsGroup.classList.toggle('visible', initialPlatform.showViews);

    // --- EVENT LISTENERS ---
    calculateBtn.addEventListener('click', calculate);
    [platformSelect, followersInput, likesInput, commentsInput, sharesInput, viewsInput].forEach(function(el) {
        el.addEventListener('input', calculate);
        el.addEventListener('change', calculate);
    });

    // Initial calculation
    calculate();

    // --- MAIN CALCULATION ---
    function calculate() {
        var platform = platformSelect.value;
        var followers = parseInt(followersInput.value) || 0;
        var likes = parseInt(likesInput.value) || 0;
        var comments = parseInt(commentsInput.value) || 0;
        var shares = parseInt(sharesInput.value) || 0;
        var views = parseInt(viewsInput.value) || 0;

        var data = benchmarkData[platform];

        // Prevent division by zero
        if (followers === 0) {
            engagementRateDisplay.textContent = '0.00%';
            tierBadge.textContent = 'Enter Data';
            tierBadge.style.background = '#6b7280';
            benchmarkComparison.textContent = 'Enter your follower count and engagement metrics to see your results.';
            benchmarkMultiple.textContent = '--';
            sponsorshipImpactText.textContent = 'Enter your data above to see how your engagement rate affects your sponsorship value.';
            sponsorshipModifier.textContent = '--';
            explanationText.textContent = 'Fill in the fields above and we\'ll calculate your engagement rate instantly.';
            totalEngagements.textContent = '0';
            followerCount.textContent = '0';
            formulaDisplay.textContent = '(0 + 0 + 0) / 0 \u00d7 100 = 0%';
            viewBasedRow.style.display = 'none';
            updateCopyData(data.label, '0', 'N/A', '0');
            return;
        }

        // Calculate engagement rate
        var totalEng = likes + comments + (data.showShares ? shares : 0);
        var er = (totalEng / followers) * 100;

        // Determine tier
        var tier = getTier(er, data.tiers);

        // Benchmark comparison
        var multiple = er / data.avgMid;

        // Update UI
        engagementRateDisplay.textContent = er.toFixed(2) + '%';

        // View-based ER for TikTok/YouTube
        if (data.showViews && views > 0) {
            var viewER = ((likes + comments) / views) * 100;
            viewBasedRateDisplay.textContent = viewER.toFixed(2) + '%';
            viewBasedRow.style.display = 'flex';
        } else {
            viewBasedRow.style.display = 'none';
        }

        // Tier badge
        tierBadge.textContent = tier.name;
        tierBadge.style.background = tier.color;
        tierBadge.innerHTML = '<i class="fas ' + tier.icon + '"></i> ' + tier.name;

        // Benchmark comparison
        if (multiple >= 1) {
            benchmarkComparison.textContent = 'Your rate is ' + multiple.toFixed(1) + 'x the ' + data.label + ' average. ';
            if (tier.name === 'Viral') {
                benchmarkComparison.textContent += 'You\'re in the top 1% of ' + data.label + ' creators.';
            } else if (tier.name === 'Excellent') {
                benchmarkComparison.textContent += 'You\'re well above the platform benchmark.';
            } else if (tier.name === 'Good') {
                benchmarkComparison.textContent += 'You\'re outperforming most creators on ' + data.label + '.';
            }
        } else {
            benchmarkComparison.textContent = 'Your rate is ' + multiple.toFixed(1) + 'x the ' + data.label + ' average. There\'s room to improve your engagement strategy.';
        }
        benchmarkMultiple.textContent = multiple.toFixed(1) + 'x';
        benchmarkMultiple.style.color = tier.color;

        // Sponsorship impact
        var impact = sponsorshipImpact[tier.name];
        sponsorshipImpactText.textContent = impact.text;
        sponsorshipModifier.textContent = impact.modifier;
        sponsorshipModifier.style.color = tier.color;

        // Plain English explanation
        explanationText.textContent = getExplanation(er, tier.name, data.label, followers);

        // Breakdown
        totalEngagements.textContent = totalEng.toLocaleString('en-US');
        followerCount.textContent = followers.toLocaleString('en-US');
        var sharesText = data.showShares ? shares.toLocaleString('en-US') : '0';
        formulaDisplay.textContent = '(' + likes.toLocaleString('en-US') + ' + ' + comments.toLocaleString('en-US') + ' + ' + sharesText + ') / ' + followers.toLocaleString('en-US') + ' \u00d7 100 = ' + er.toFixed(2) + '%';

        // Store data for copy
        updateCopyData(data.label, er.toFixed(2), tier.name, followers);
    }

    function getTier(er, tiers) {
        for (var i = 0; i < tiers.length; i++) {
            if (er < tiers[i].max) return tiers[i];
        }
        return tiers[tiers.length - 1];
    }

    function getExplanation(er, tierName, platformLabel, followers) {
        var followerStr = formatFollowers(followers);

        if (tierName === 'Low') {
            return 'With a ' + er.toFixed(2) + '% engagement rate and ' + followerStr + ' followers on ' + platformLabel + ', your audience interaction is below the platform average. This could mean your content isn\'t reaching your followers (algorithm issue) or isn\'t resonating (content issue). Try posting at peak hours, using stronger hooks in your first 3 seconds, and asking direct questions to encourage comments.';
        } else if (tierName === 'Average') {
            return 'Your ' + er.toFixed(2) + '% engagement rate on ' + platformLabel + ' is right at the platform average for ' + followerStr + ' followers. You have a solid foundation. To move into the "Good" tier, focus on creating more shareable content, responding to every comment within the first hour, and experimenting with content formats that drive saves and shares.';
        } else if (tierName === 'Good') {
            return 'A ' + er.toFixed(2) + '% engagement rate on ' + platformLabel + ' with ' + followerStr + ' followers puts you above most creators on the platform. Your audience is actively engaging with your content. This is the sweet spot for brand deals \u2014 you have both reach and resonance. Use this rate as leverage when negotiating sponsorship rates.';
        } else if (tierName === 'Excellent') {
            return 'At ' + er.toFixed(2) + '% engagement on ' + platformLabel + ' with ' + followerStr + ' followers, you\'re significantly outperforming the platform average. Your audience is highly loyal and responsive. Brands will pay a premium for this level of engagement. Make sure your media kit highlights this rate prominently.';
        } else {
            return 'A ' + er.toFixed(2) + '% engagement rate on ' + platformLabel + ' is exceptional \u2014 you\'re in viral territory with ' + followerStr + ' followers. This level of engagement is extremely rare and indicates your content is being heavily shared and saved. You can command top-tier sponsorship rates and should be selective about brand partnerships.';
        }
    }

    function formatFollowers(num) {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    }

    function updateCopyData(platform, er, tier, followers) {
        copyBtn.dataset.platform = platform;
        copyBtn.dataset.er = er;
        copyBtn.dataset.tier = tier;
        copyBtn.dataset.followers = followers;
    }

    // --- COPY RESULT ---
    copyBtn.addEventListener('click', function() {
        var text = 'My ' + this.dataset.platform + ' engagement rate: ' +
                   this.dataset.er + '% | ' + this.dataset.tier +
                   ' | ' + formatFollowers(parseInt(this.dataset.followers)) + ' followers';

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
