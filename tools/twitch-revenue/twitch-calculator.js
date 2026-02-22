// Twitch Revenue Calculator 2026 - JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const avgViewersInput = document.getElementById('avgViewers');
    const subscribersInput = document.getElementById('subscribers');
    const bitsPerMonthInput = document.getElementById('bitsPerMonth');
    const streamHoursInput = document.getElementById('streamHours');
    const gameCategorySelect = document.getElementById('gameCategory');
    const calculateBtn = document.getElementById('calculateBtn');
    
    // Result elements
    const subscriptionsResult = document.getElementById('subscriptions');
    const subscriptionsDetail = document.getElementById('subscriptionsDetail');
    const bitsResult = document.getElementById('bits');
    const bitsDetail = document.getElementById('bitsDetail');
    const adRevenueResult = document.getElementById('adRevenue');
    const adRevenueDetail = document.getElementById('adRevenueDetail');
    const sponsorshipsResult = document.getElementById('sponsorships');
    const sponsorshipsDetail = document.getElementById('sponsorshipsDetail');
    const totalEarningsResult = document.getElementById('totalEarnings');
    const totalDetail = document.getElementById('totalDetail');
    
    // Breakdown elements
    const perSubscriberResult = document.getElementById('perSubscriber');
    const per100BitsResult = document.getElementById('per100Bits');
    const perHourResult = document.getElementById('perHour');
    const twitchFeeResult = document.getElementById('twitchFee');
    
    // CPM rates by game category (2026 data)
    // CPM rates by game category (2026 data)
    const cpmRates = {
        'just-chatting': { min: 3, max: 8, avg: 5.5 },
        'valorant': { min: 4, max: 10, avg: 7 },
        'league': { min: 3, max: 9, avg: 6 },
        'fortnite': { min: 2, max: 7, avg: 4.5 },
        'minecraft': { min: 2, max: 6, avg: 4 },
        'csgo': { min: 3, max: 8, avg: 5.5 },
        'dota': { min: 4, max: 12, avg: 8 },
        'among-us': { min: 2, max: 5, avg: 3.5 },
        'variety': { min: 2, max: 6, avg: 4 },
        'creative': { min: 3, max: 7, avg: 5 },
        'music': { min: 2, max: 5, avg: 3.5 },
        'irl': { min: 3, max: 8, avg: 5.5 }
    };
    
    // Sponsorship rates by average viewers (2026 data)
    const sponsorshipRates = {
        '50': 50,    // 50-100 viewers
        '100': 200,  // 100-500 viewers
        '500': 1000, // 500-1,000 viewers
        '1000': 2500, // 1,000-5,000 viewers
        '5000': 10000, // 5,000-10,000 viewers
        '10000': 25000 // 10,000+ viewers
    };
    
    // Sponsorship rates by average viewers (2026 data)
    const sponsorshipRates = {
        '50': 50,    // 50-100 viewers
        '100': 200,  // 100-500 viewers
        '500': 1000, // 500-1,000 viewers
        '1000': 2500, // 1,000-5,000 viewers
        '5000': 10000, // 5,000-10,000 viewers
        '10000': 25000 // 10,000+ viewers
    };
    
    // Initialize FAQ functionality
    initFAQ();
    
    // Set up event listeners
    calculateBtn.addEventListener('click', calculateEarnings);
    
    // Calculate on input changes
    [avgViewersInput, subscribersInput, bitsPerMonthInput, streamHoursInput, gameCategorySelect].forEach(input => {
        input.addEventListener('input', calculateEarnings);
        input.addEventListener('change', calculateEarnings);
    });
    
    // Initial calculation
    calculateEarnings();
    
    // Main calculation function
    function calculateEarnings() {
        // Get input values
        const avgViewers = parseInt(avgViewersInput.value) || 0;
        const subscribers = parseInt(subscribersInput.value) || 0;
        const bitsPerMonth = parseInt(bitsPerMonthInput.value) || 0;
        const streamHoursPerWeek = parseInt(streamHoursInput.value) || 0;
        const gameCategory = gameCategorySelect.value;
        
        // Calculate monthly stream hours (assuming 4 weeks per month)
        const streamHoursPerMonth = streamHoursPerWeek * 4;
        
        // 1. Subscription Revenue
        // Tier distribution: 90% Tier 1, 8% Tier 2, 2% Tier 3
        const tier1Subs = subscribers * 0.9;
        const tier2Subs = subscribers * 0.08;
        const tier3Subs = subscribers * 0.02;
        
        // Streamer gets 50% of subscription price
        const subscriptionRevenue = (tier1Subs * 2.50) + (tier2Subs * 5.00) + (tier3Subs * 12.50);
        
        // 2. Bits Revenue
        // Streamer gets ~$0.80 per 100 bits (after Twitch fee)
        const bitsRevenue = (bitsPerMonth / 100) * 0.80;
        
        // 3. Ad Revenue
        // Get CPM rate for selected game category
        const cpmRate = cpmRates[gameCategory]?.avg || 5;
        
        // Calculate ad impressions
        // Assumptions: 3 minutes of ads per hour, 1 ad per minute, 1 viewer = 1 impression
        const adsPerHour = 3; // 3 minutes of ads per hour
        const impressionsPerHour = avgViewers * adsPerHour;
        const monthlyImpressions = impressionsPerHour * streamHoursPerMonth;
        
        // Calculate ad revenue (CPM = cost per 1000 impressions)
        // Streamer gets 55% of ad revenue (standard Twitch split)
        const grossAdRevenue = (monthlyImpressions / 1000) * cpmRate;
        const adRevenue = grossAdRevenue * 0.55; // 55% to streamer
        
        // 4. Sponsorship Revenue
        let sponsorshipRevenue = 0;
        if (avgViewers >= 10000) {
            sponsorshipRevenue = sponsorshipRates['10000'];
        } else if (avgViewers >= 5000) {
            sponsorshipRevenue = sponsorshipRates['5000'];
        } else if (avgViewers >= 1000) {
            sponsorshipRevenue = sponsorshipRates['1000'];
        } else if (avgViewers >= 500) {
            sponsorshipRevenue = sponsorshipRates['500'];
        } else if (avgViewers >= 100) {
            sponsorshipRevenue = sponsorshipRates['100'];
        } else if (avgViewers >= 50) {
            sponsorshipRevenue = sponsorshipRates['50'];
        }
        
        // Adjust sponsorship based on game category
        const categoryMultiplier = getCategoryMultiplier(gameCategory);
        sponsorshipRevenue *= categoryMultiplier;
        
        // 5. Calculate totals
        const totalRevenue = subscriptionRevenue + bitsRevenue + adRevenue + sponsorshipRevenue;
        
        // Update UI with results
        updateResults(subscriptionRevenue, bitsRevenue, adRevenue, sponsorshipRevenue, totalRevenue);
        
        // Update breakdown stats
        updateBreakdownStats(subscriptionRevenue, bitsRevenue, totalRevenue, subscribers, bitsPerMonth, streamHoursPerMonth);
        
        // Update revenue split visualization
        updateRevenueSplitVisualization(subscriptionRevenue, bitsRevenue, adRevenue, sponsorshipRevenue);
    }
    
    function updateResults(subscriptionRevenue, bitsRevenue, adRevenue, sponsorshipRevenue, totalRevenue) {
        // Format currency
        const formatCurrency = (amount) => {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(amount);
        };
        
        // Update main results
        subscriptionsResult.textContent = formatCurrency(subscriptionRevenue);
        subscriptionsDetail.textContent = `${Math.round(subscribersInput.value || 0)} subscribers`;
        
        bitsResult.textContent = formatCurrency(bitsRevenue);
        bitsDetail.textContent = `${Math.round(bitsPerMonthInput.value || 0)} bits/month`;
        
        adRevenueResult.textContent = formatCurrency(adRevenue);
        adRevenueDetail.textContent = `${gameCategorySelect.options[gameCategorySelect.selectedIndex].text}`;
        
        sponsorshipsResult.textContent = formatCurrency(sponsorshipRevenue);
        sponsorshipsDetail.textContent = `${Math.round(avgViewersInput.value || 0)} avg viewers`;
        
        totalEarningsResult.textContent = formatCurrency(totalRevenue);
        totalDetail.textContent = 'Net monthly earnings';
    }
    
    function updateBreakdownStats(subscriptionRevenue, bitsRevenue, totalRevenue, subscribers, bitsPerMonth, streamHoursPerMonth) {
        // Calculate per-subscriber earnings
        const perSubscriber = subscribers > 0 ? subscriptionRevenue / subscribers : 0;
        perSubscriberResult.textContent = `$${perSubscriber.toFixed(2)}`;
        
        // Calculate per-100-bits earnings
        const per100Bits = bitsPerMonth > 0 ? (bitsRevenue / bitsPerMonth) * 100 : 0;
        per100BitsResult.textContent = `$${per100Bits.toFixed(2)}`;
        
        // Calculate per-hour earnings
        const perHour = streamHoursPerMonth > 0 ? totalRevenue / streamHoursPerMonth : 0;
        perHourResult.textContent = `$${perHour.toFixed(2)}`;
        
        // Twitch fee is fixed at 50% for most streamers
        twitchFeeResult.textContent = '50%';
    }
    
    function updateRevenueSplitVisualization(subscriptionRevenue, bitsRevenue, adRevenue, sponsorshipRevenue) {
        // Calculate total gross revenue (before Twitch fees)
        const totalGross = subscriptionRevenue * 2 + bitsRevenue * 2 + adRevenue / 0.55;
        
        // Calculate streamer share percentage
        const streamerShare = ((subscriptionRevenue + bitsRevenue + adRevenue + sponsorshipRevenue) / totalGross) * 100;
        const twitchShare = 100 - streamerShare;
        
        // Update visualization
        const streamerBar = document.querySelector('.split-creator');
        const twitchBar = document.querySelector('.split-twitch');
        
        streamerBar.style.width = `${streamerShare}%`;
        streamerBar.querySelector('span').textContent = `Streamer: ${Math.round(streamerShare)}%`;
        
        twitchBar.style.width = `${twitchShare}%`;
        twitchBar.querySelector('span').textContent = `Twitch: ${Math.round(twitchShare)}%`;
    }
    
    function getCategoryMultiplier(category) {
        // Sponsorship multiplier based on game category
        const multipliers = {
            'just-chatting': 1.2,  // High sponsorship potential
            'valorant': 1.5,       // Very high
            'league': 1.4,         // Very high
            'fortnite': 1.1,       // High
            'minecraft': 0.9,      // Medium
            'csgo': 1.2,           // High
            'dota': 1.3,           // High
            'among-us': 0.8,       // Low-medium
            'variety': 1.0,        // Medium
            'creative': 1.1,       // Medium
            'music': 0.9,          // Low-medium
            'irl': 1.2             // Medium-high
        };
        
        return multipliers[category] || 1.0;
    }
    
    function initFAQ() {
        const faqQuestions = document.querySelectorAll('.faq-question');
        
        faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                const answer = question.nextElementSibling;
                const isActive = answer.classList.contains('active');
                
                // Close all other FAQ answers
                document.querySelectorAll('.faq-answer').forEach(ans => {
                    ans.classList.remove('active');
                });
                
                // Remove active class from all questions
                document.querySelectorAll('.faq-question').forEach(q => {
                    q.classList.remove('active');
                });
                
                // Toggle current FAQ
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
    }
    
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileMenuToggle.innerHTML = navMenu.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                }
                
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});