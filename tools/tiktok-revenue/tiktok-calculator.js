// TikTok Creator Earnings Calculator - JavaScript

// CPM rates by niche (per 1,000 views) - 2026 data
const cpmRates = {
    'business': { avg: 0.04, min: 0.02, max: 0.06 },
    'education': { avg: 0.035, min: 0.02, max: 0.05 },
    'fitness': { avg: 0.03, min: 0.015, max: 0.05 },
    'food': { avg: 0.025, min: 0.01, max: 0.04 },
    'beauty': { avg: 0.03, min: 0.015, max: 0.05 },
    'gaming': { avg: 0.02, min: 0.01, max: 0.03 },
    'travel': { avg: 0.025, min: 0.01, max: 0.04 },
    'entertainment': { avg: 0.015, min: 0.005, max: 0.03 },
    'dance': { avg: 0.012, min: 0.005, max: 0.02 },
    'lifestyle': { avg: 0.02, min: 0.01, max: 0.03 }
};

// TikTok earnings rates (2026 data)
const creatorFundRates = {
    'base': 0.00002,
    'max': 0.00004
};

// LIVE gift conversion (2026)
const giftRates = {
    'diamondValue': 0.05,
    'platformCut': 0.50
};

// Brand deal rates per 1,000 followers by niche (2026)
const brandDealRates = {
    'business': 50,
    'education': 45,
    'fitness': 40,
    'food': 35,
    'beauty': 40,
    'gaming': 30,
    'travel': 35,
    'entertainment': 25,
    'dance': 20,
    'lifestyle': 30
};

// LIVE gift earnings multiplier based on engagement
const liveGiftMultipliers = {
    'low': 0.5,
    'medium': 1,
    'high': 1.5,
    'very-high': 2
};

// Chart instance
let earningsChart = null;

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    console.log('TikTok Calculator loaded');
    initializeCalculator();
    initializeFAQ();
    calculateEarnings();
});

function initializeCalculator() {
    const calculateBtn = document.getElementById('calculateBtn');
    const inputs = document.querySelectorAll('#followers, #views, #frequency, #engagement, #niche, #liveHours');

    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateEarnings);
    }

    inputs.forEach(function(input) {
        input.addEventListener('input', calculateEarnings);
        input.addEventListener('change', calculateEarnings);
    });

    initializeChart();
}

function initializeChart() {
    var canvas = document.getElementById('earningsChart');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');

    earningsChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Creator Fund', 'LIVE Gifts', 'Brand Deals'],
            datasets: [{
                data: [0, 0, 0],
                backgroundColor: ['#69C9D0', '#EE1D52', '#000000'],
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#ffffff',
                        font: { size: 12 },
                        padding: 20
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            var label = context.label || '';
                            var value = context.raw || 0;
                            var percentage = context.parsed || 0;
                            return label + ': $' + value.toFixed(2) + ' (' + percentage.toFixed(1) + '%)';
                        }
                    }
                }
            },
            cutout: '60%'
        }
    });
}

function calculateEarnings() {
    var followers = parseInt(document.getElementById('followers').value) || 0;
    var viewsPerVideo = parseInt(document.getElementById('views').value) || 0;
    var videosPerWeek = parseInt(document.getElementById('frequency').value) || 0;
    var engagementRate = parseFloat(document.getElementById('engagement').value) || 0;
    var niche = document.getElementById('niche').value;
    var liveHoursPerWeek = parseFloat(document.getElementById('liveHours').value) || 0;

    var videosPerMonth = videosPerWeek * 4.33;
    var monthlyViews = viewsPerVideo * videosPerMonth;

    // 1. Creator Fund Earnings
    var cpm = cpmRates[niche] ? cpmRates[niche].avg : 0.03;
    var creatorFundEarnings = (monthlyViews / 1000) * cpm;
    var engagementMultiplier = 1 + (engagementRate / 100) * 0.5;
    var adjustedCreatorFund = creatorFundEarnings * engagementMultiplier;

    // 2. LIVE Gift Earnings
    var liveGiftMultiplier = 1;
    if (engagementRate < 5) liveGiftMultiplier = liveGiftMultipliers['low'];
    else if (engagementRate < 10) liveGiftMultiplier = liveGiftMultipliers['medium'];
    else if (engagementRate < 15) liveGiftMultiplier = liveGiftMultipliers['high'];
    else liveGiftMultiplier = liveGiftMultipliers['very-high'];

    var liveGiftEarnings = liveHoursPerWeek * 4.33 * 10 * liveGiftMultiplier;

    // 3. Brand Deal Earnings
    var brandDealRate = brandDealRates[niche] || 25;
    var followersInThousands = followers / 1000;

    var brandDealsPerMonth = 1;
    if (followers > 50000) brandDealsPerMonth = 2;
    if (followers > 100000) brandDealsPerMonth = 3;
    if (followers > 500000) brandDealsPerMonth = 4;
    if (followers > 1000000) brandDealsPerMonth = 5;

    var brandDealEarnings = followersInThousands * brandDealRate * brandDealsPerMonth;

    // Calculate totals
    var totalEarnings = adjustedCreatorFund + liveGiftEarnings + brandDealEarnings;

    // Update UI
    updateResults(adjustedCreatorFund, liveGiftEarnings, brandDealEarnings, totalEarnings);
    updateBreakdown(adjustedCreatorFund, liveGiftEarnings, brandDealEarnings, monthlyViews, videosPerMonth, followers);
    updateChart(adjustedCreatorFund, liveGiftEarnings, brandDealEarnings);
}

function updateResults(creatorFund, liveGifts, brandDeals, total) {
    var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency', currency: 'USD',
        minimumFractionDigits: 0, maximumFractionDigits: 0
    });

    var detailFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency', currency: 'USD',
        minimumFractionDigits: 2, maximumFractionDigits: 2
    });

    var el;

    el = document.getElementById('creatorFund');
    if (el) el.textContent = formatter.format(creatorFund);
    el = document.getElementById('creatorFundDetail');
    if (el) el.textContent = detailFormatter.format(creatorFund) + ' from video views';

    el = document.getElementById('liveGifts');
    if (el) el.textContent = formatter.format(liveGifts);
    el = document.getElementById('liveGiftsDetail');
    if (el) el.textContent = detailFormatter.format(liveGifts) + ' from streaming';

    el = document.getElementById('brandDeals');
    if (el) el.textContent = formatter.format(brandDeals);
    el = document.getElementById('brandDealsDetail');
    if (el) el.textContent = detailFormatter.format(brandDeals) + ' from sponsorships';

    el = document.getElementById('totalEarnings');
    if (el) el.textContent = formatter.format(total);
    el = document.getElementById('totalDetail');
    if (el) el.textContent = 'Total potential monthly earnings';
}

function updateBreakdown(creatorFund, liveGifts, brandDeals, monthlyViews, videosPerMonth, followers) {
    var total = creatorFund + liveGifts + brandDeals;
    var per1kViews = monthlyViews > 0 ? (creatorFund / monthlyViews) * 1000 : 0;
    var perVideo = videosPerMonth > 0 ? total / videosPerMonth : 0;
    var perFollower = followers > 0 ? total / followers : 0;

    var el;
    el = document.getElementById('per1kViews');
    if (el) el.textContent = '$' + per1kViews.toFixed(2);
    el = document.getElementById('perVideo');
    if (el) el.textContent = '$' + perVideo.toFixed(2);
    el = document.getElementById('perFollower');
    if (el) el.textContent = '$' + perFollower.toFixed(4);
}

function updateChart(creatorFund, liveGifts, brandDeals) {
    if (!earningsChart) return;
    var total = creatorFund + liveGifts + brandDeals;

    earningsChart.data.datasets[0].data = [creatorFund, liveGifts, brandDeals];
    earningsChart.options.plugins.tooltip.callbacks.label = function(context) {
        var label = context.label || '';
        var value = context.raw || 0;
        var percentage = total > 0 ? (value / total) * 100 : 0;
        return label + ': $' + value.toFixed(2) + ' (' + percentage.toFixed(1) + '%)';
    };
    earningsChart.update();
}

function initializeFAQ() {
    var faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(function(question) {
        question.addEventListener('click', function() {
            var answer = this.nextElementSibling;
            var icon = this.querySelector('i');

            this.classList.toggle('active');

            if (answer.classList.contains('open')) {
                answer.classList.remove('open');
                answer.style.maxHeight = null;
                icon.style.transform = 'rotate(0deg)';
            } else {
                answer.classList.add('open');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                icon.style.transform = 'rotate(180deg)';
            }

            faqQuestions.forEach(function(otherQuestion) {
                if (otherQuestion !== question) {
                    otherQuestion.classList.remove('active');
                    var otherAnswer = otherQuestion.nextElementSibling;
                    var otherIcon = otherQuestion.querySelector('i');
                    otherAnswer.classList.remove('open');
                    otherAnswer.style.maxHeight = null;
                    otherIcon.style.transform = 'rotate(0deg)';
                }
            });
        });

        var answer = question.nextElementSibling;
        if (answer && answer.classList.contains('open')) {
            answer.style.maxHeight = answer.scrollHeight + 'px';
            question.querySelector('i').style.transform = 'rotate(180deg)';
        }
    });
}

// Console greeting
console.log('%c🎵 TikTok Creator Earnings Calculator', 'color: #69C9D0; font-size: 16px; font-weight: bold;');
console.log('%cCalculate your TikTok earnings potential', 'color: #000000;');
console.log('%chttps://creatorrevenuecalculator.com/tools/tiktok-revenue/', 'color: #EE1D52;');
