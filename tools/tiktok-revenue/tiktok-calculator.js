// TikTok Creator Earnings Calculator - JavaScript

// CPM rates by niche (per 1,000 views)
    // TikTok earnings rates (2026 data)
    const creatorFundRates = {
        'base': 0.00002, // $0.02 per 1000 views
        'max': 0.00004   // $0.04 per 1000 views for top performers
    };
    
    // LIVE gift conversion (2026)
    const giftRates = {
        'diamondValue': 0.05, // $0.05 per diamond to creator
        'platformCut': 0.50   // 50% platform fee on gifts
    };
    
    // Brand deal rates by follower count (2026)
    const brandDealRates = {
        '10000': 100,    // 10K-50K followers
        '50000': 500,    // 50K-100K followers
        '100000': 1500,  // 100K-500K followers
        '500000': 5000,  // 500K-1M followers
        '1000000': 15000 // 1M+ followers
    };

// Brand deal rates per 1,000 followers
    'lifestyle': 30     // $30 per 1K followers
};

// LIVE gift earnings multiplier based on engagement
const liveGiftMultipliers = {
    'low': 0.5,     // 0-5% engagement
    'medium': 1,    // 5-10% engagement
    'high': 1.5,    // 10-15% engagement
    'very-high': 2  // 15%+ engagement
};

// Chart instance
let earningsChart = null;

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    console.log('TikTok Calculator loaded');
    
    // Initialize calculator
    initializeCalculator();
    
    // Initialize FAQ accordion
    initializeFAQ();
    
    // Calculate initial earnings
    calculateEarnings();
});

function initializeCalculator() {
    const calculateBtn = document.getElementById('calculateBtn');
    const inputs = document.querySelectorAll('#followers, #views, #frequency, #engagement, #niche, #liveHours');
    
    // Add event listeners
    calculateBtn.addEventListener('click', calculateEarnings);
    
    inputs.forEach(input => {
        input.addEventListener('input', calculateEarnings);
        input.addEventListener('change', calculateEarnings);
    });
    
    // Initialize Chart.js
    initializeChart();
}

function initializeChart() {
    const ctx = document.getElementById('earningsChart').getContext('2d');
    
    earningsChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Creator Fund', 'LIVE Gifts', 'Brand Deals'],
            datasets: [{
                data: [0, 0, 0],
                backgroundColor: [
                    '#69C9D0', // TikTok teal
                    '#EE1D52', // TikTok pink
                    '#000000'  // TikTok black
                ],
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
                        font: {
                            size: 12
                        },
                        padding: 20
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const percentage = context.parsed || 0;
                            return `${label}: $${value.toFixed(2)} (${percentage.toFixed(1)}%)`;
                        }
                    }
                }
            },
            cutout: '60%'
        }
    });
}

function calculateEarnings() {
    // Get input values
    const followers = parseInt(document.getElementById('followers').value) || 0;
    const viewsPerVideo = parseInt(document.getElementById('views').value) || 0;
    const videosPerWeek = parseInt(document.getElementById('frequency').value) || 0;
    const engagementRate = parseFloat(document.getElementById('engagement').value) || 0;
    const niche = document.getElementById('niche').value;
    const liveHoursPerWeek = parseFloat(document.getElementById('liveHours').value) || 0;
    
    // Calculate monthly views
    const videosPerMonth = videosPerWeek * 4.33; // Average weeks per month
    const monthlyViews = viewsPerVideo * videosPerMonth;
    
    // 1. Creator Fund Earnings
    const cpm = cpmRates[niche]?.avg || 0.03;
    const creatorFundEarnings = (monthlyViews / 1000) * cpm;
    
    // Adjust for engagement
    const engagementMultiplier = 1 + (engagementRate / 100) * 0.5; // 50% bonus for high engagement
    const adjustedCreatorFund = creatorFundEarnings * engagementMultiplier;
    
    // 2. LIVE Gift Earnings
    let liveGiftMultiplier = 1;
    if (engagementRate < 5) liveGiftMultiplier = liveGiftMultipliers.low;
    else if (engagementRate < 10) liveGiftMultiplier = liveGiftMultipliers.medium;
    else if (engagementRate < 15) liveGiftMultiplier = liveGiftMultipliers.high;
    else liveGiftMultiplier = liveGiftMultipliers['very-high'];
    
    // Base rate: $10 per hour for average creators
    const liveGiftEarnings = liveHoursPerWeek * 4.33 * 10 * liveGiftMultiplier;
    
    // 3. Brand Deal Earnings
    const brandDealRate = brandDealRates[niche] || 25;
    const followersInThousands = followers / 1000;
    
    // Assume 1 brand deal per month for smaller creators, more for larger
    let brandDealsPerMonth = 1;
    if (followers > 50000) brandDealsPerMonth = 2;
    if (followers > 100000) brandDealsPerMonth = 3;
    if (followers > 500000) brandDealsPerMonth = 4;
    if (followers > 1000000) brandDealsPerMonth = 5;
    
    const brandDealEarnings = followersInThousands * brandDealRate * brandDealsPerMonth;
    
    // Calculate totals
    const totalEarnings = adjustedCreatorFund + liveGiftEarnings + brandDealEarnings;
    
    // Update UI
    updateResults(adjustedCreatorFund, liveGiftEarnings, brandDealEarnings, totalEarnings);
    updateBreakdown(adjustedCreatorFund, liveGiftEarnings, brandDealEarnings, monthlyViews, videosPerMonth, followers);
    updateChart(adjustedCreatorFund, liveGiftEarnings, brandDealEarnings);
}

function updateResults(creatorFund, liveGifts, brandDeals, total) {
    // Format currency
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
    
    const detailFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    
    // Update result cards
    document.getElementById('creatorFund').textContent = formatter.format(creatorFund);
    document.getElementById('creatorFundDetail').textContent = `$${detailFormatter.format(creatorFund).replace('$', '')} from video views`;
    
    document.getElementById('liveGifts').textContent = formatter.format(liveGifts);
    document.getElementById('liveGiftsDetail').textContent = `$${detailFormatter.format(liveGifts).replace('$', '')} from streaming`;
    
    document.getElementById('brandDeals').textContent = formatter.format(brandDeals);
    document.getElementById('brandDealsDetail').textContent = `$${detailFormatter.format(brandDeals).replace('$', '')} from sponsorships`;
    
    document.getElementById('totalEarnings').textContent = formatter.format(total);
    document.getElementById('totalDetail').textContent = `Total potential monthly earnings`;
}

function updateBreakdown(creatorFund, liveGifts, brandDeals, monthlyViews, videosPerMonth, followers) {
    const total = creatorFund + liveGifts + brandDeals;
    
    // Calculate per unit metrics
    const per1kViews = monthlyViews > 0 ? (creatorFund / monthlyViews) * 1000 : 0;
    const perVideo = videosPerMonth > 0 ? total / videosPerMonth : 0;
    const perFollower = followers > 0 ? total / followers : 0;
    
    // Update breakdown stats
    document.getElementById('per1kViews').textContent = `$${per1kViews.toFixed(2)}`;
    document.getElementById('perVideo').textContent = `$${perVideo.toFixed(2)}`;
    document.getElementById('perFollower').textContent = `$${perFollower.toFixed(4)}`;
}

function updateChart(creatorFund, liveGifts, brandDeals) {
    if (!earningsChart) return;
    
    const total = creatorFund + liveGifts + brandDeals;
    
    // Update chart data
    earningsChart.data.datasets[0].data = [creatorFund, liveGifts, brandDeals];
    
    // Update percentages in tooltip
    earningsChart.options.plugins.tooltip.callbacks.label = function(context) {
        const label = context.label || '';
        const value = context.raw || 0;
        const percentage = total > 0 ? (value / total) * 100 : 0;
        return `${label}: $${value.toFixed(2)} (${percentage.toFixed(1)}%)`;
    };
    
    earningsChart.update();
}

function initializeFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const icon = this.querySelector('i');
            
            // Toggle active class
            this.classList.toggle('active');
            
            // Toggle answer visibility
            if (answer.classList.contains('open')) {
                answer.classList.remove('open');
                answer.style.maxHeight = null;
                icon.style.transform = 'rotate(0deg)';
            } else {
                answer.classList.add('open');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                icon.style.transform = 'rotate(180deg)';
            }
            
            // Close other FAQ items
            faqQuestions.forEach(otherQuestion => {
                if (otherQuestion !== this) {
                    otherQuestion.classList.remove('active');
                    const otherAnswer = otherQuestion.nextElementSibling;
                    const otherIcon = otherQuestion.querySelector('i');
                    otherAnswer.classList.remove('open');
                    otherAnswer.style.maxHeight = null;
                    otherIcon.style.transform = 'rotate(0deg)';
                }
            });
        });
        
        // Set initial max-height for open items
        const answer = question.nextElementSibling;
        if (answer.classList.contains('open')) {
            answer.style.maxHeight = answer.scrollHeight + 'px';
            question.querySelector('i').style.transform = 'rotate(180deg)';
        }
    });
}

// Console greeting
console.log('%c🎵 TikTok Creator Earnings Calculator', 'color: #69C9D0; font-size: 16px; font-weight: bold;');
console.log('%cCalculate your TikTok earnings potential', 'color: #000000;');
console.log('%chttps://creatorrevenuecalculator.com/tools/tiktok-revenue/', 'color: #EE1D52;');