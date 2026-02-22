// Instagram Revenue Calculator 2026 - JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const followersInput = document.getElementById('followers');
    const engagementInput = document.getElementById('engagementRate');
    const postsPerWeekInput = document.getElementById('postsPerWeek');
    const reelsPerWeekInput = document.getElementById('reelsPerWeek');
    const liveHoursInput = document.getElementById('liveHours');
    const nicheSelect = document.getElementById('niche');
    const calculateBtn = document.getElementById('calculateBtn');
    
    // Result elements
    const brandDealsResult = document.getElementById('brandDeals');
    const brandDealsDetail = document.getElementById('brandDealsDetail');
    const reelsBonusResult = document.getElementById('reelsBonus');
    const reelsBonusDetail = document.getElementById('reelsBonusDetail');
    const badgeIncomeResult = document.getElementById('badgeIncome');
    const badgeIncomeDetail = document.getElementById('badgeIncomeDetail');
    const affiliateRevenueResult = document.getElementById('affiliateRevenue');
    const affiliateRevenueDetail = document.getElementById('affiliateRevenueDetail');
    const totalEarningsResult = document.getElementById('totalEarnings');
    const totalDetail = document.getElementById('totalDetail');
    
    // Breakdown elements
    const perFollowerResult = document.getElementById('perFollower');
    const perPostResult = document.getElementById('perPost');
    const perReelResult = document.getElementById('perReel');
    const engagementMultiplierResult = document.getElementById('engagementMultiplier');
    
    // CPM rates by niche (2026 data)
    const nicheRates = {
        'fashion-beauty': { cpm: 35, brandDealMultiplier: 1.3 },
        'fitness-health': { cpm: 30, brandDealMultiplier: 1.2 },
        'travel-lifestyle': { cpm: 25, brandDealMultiplier: 1.4 },
        'food-cooking': { cpm: 20, brandDealMultiplier: 1.1 },
        'technology-gadgets': { cpm: 40, brandDealMultiplier: 1.5 },
        'parenting-family': { cpm: 25, brandDealMultiplier: 1.0 },
        'gaming-entertainment': { cpm: 15, brandDealMultiplier: 0.9 },
        'education-learning': { cpm: 30, brandDealMultiplier: 1.2 },
        'art-creativity': { cpm: 20, brandDealMultiplier: 1.1 },
        'sports-athletics': { cpm: 25, brandDealMultiplier: 1.1 },
        'pets-animals': { cpm: 15, brandDealMultiplier: 0.8 }
    };
    
    // Initialize FAQ functionality
    initFAQ();
    
    // Set up event listeners
    calculateBtn.addEventListener('click', calculate);
    
    // Calculate on input changes
    [followersInput, engagementInput, postsPerWeekInput, reelsPerWeekInput, liveHoursInput, nicheSelect].forEach(input => {
        input.addEventListener('input', calculate);
        input.addEventListener('change', calculate);
    });
    
    // Initial calculation
    calculate();
    
    // Main calculation function
    function calculate() {
        // Get input values
        const followers = parseInt(followersInput.value) || 0;
        const engagementRate = parseFloat(engagementInput.value) || 0;
        const postsPerWeek = parseInt(postsPerWeekInput.value) || 0;
        const reelsPerWeek = parseInt(reelsPerWeekInput.value) || 0;
        const liveHoursPerWeek = parseInt(liveHoursInput.value) || 0;
        const niche = nicheSelect.value;
        
        // Calculate monthly values (assuming 4 weeks per month)
        const postsPerMonth = postsPerWeek * 4;
        const reelsPerMonth = reelsPerWeek * 4;
        const liveHoursPerMonth = liveHoursPerWeek * 4;
        
        // 1. Brand Deal Revenue
        const brandDeals = calculateBrandDeals(followers, engagementRate, postsPerMonth, niche);
        
        // 2. Reels Bonus Revenue
        const reelsBonus = calculateReelsBonus(reelsPerMonth, followers, engagementRate);
        
        // 3. Badge Income from Instagram Live
        const badgeIncome = calculateBadgeIncome(liveHoursPerMonth, followers);
        
        // 4. Affiliate Revenue
        const affiliateRevenue = calculateAffiliateRevenue(followers, engagementRate, niche);
        
        // 5. Calculate totals
        const totalRevenue = brandDeals + reelsBonus + badgeIncome + affiliateRevenue;
        
        // Update UI with results
        updateResults(brandDeals, reelsBonus, badgeIncome, affiliateRevenue, totalRevenue);
        
        // Update breakdown stats
        updateBreakdownStats(brandDeals, reelsBonus, totalRevenue, followers, postsPerMonth, reelsPerMonth, engagementRate);
    }
    
    function calculateBrandDeals(followers, engagementRate, postsPerMonth, niche) {
        // Base rate: $10 per 1,000 followers per post
        const baseRatePerPost = (followers / 1000) * 10;
        
        // Engagement multiplier
        const engagementMultiplier = getEngagementMultiplier(engagementRate);
        
        // Niche multiplier
        const nicheMultiplier = nicheRates[niche]?.brandDealMultiplier || 1.0;
        
        // Calculate monthly brand deal revenue
        // Assuming 20% of posts are sponsored (industry average)
        const sponsoredPosts = postsPerMonth * 0.2;
        
        return baseRatePerPost * engagementMultiplier * nicheMultiplier * sponsoredPosts;
    }
    
    function calculateReelsBonus(reelsPerMonth, followers, engagementRate) {
        // Reels bonus eligibility and rates
        if (followers < 1000 || reelsPerMonth < 4) return 0;
        
        // Base bonus: $0.01 per view (estimated)
        const avgViewsPerReel = calculateAvgViews(followers, engagementRate);
        const baseBonusPerReel = avgViewsPerReel * 0.01;
        
        // Engagement multiplier for bonus eligibility
        const engagementMultiplier = getEngagementMultiplier(engagementRate);
        
        // Not all reels get bonus - assuming 50% qualify
        const qualifyingReels = reelsPerMonth * 0.5;
        
        return baseBonusPerReel * engagementMultiplier * qualifyingReels;
    }
    
    function calculateBadgeIncome(liveHoursPerMonth, followers) {
        if (followers < 10000 || liveHoursPerMonth < 1) return 0;
        
        // Badge income calculation
        // Average badges per hour: 1 badge per 100 concurrent viewers
        const avgConcurrentViewers = followers * 0.01; // 1% of followers watch live
        const badgesPerHour = avgConcurrentViewers / 100;
        
        // Average badge value: $2.50 (mix of 1, 2, and 3 heart badges)
        const revenuePerBadge = 2.50;
        
        return badgesPerHour * revenuePerBadge * liveHoursPerMonth;
    }
    
    function calculateAffiliateRevenue(followers, engagementRate, niche) {
        // Affiliate revenue based on followers and engagement
        const baseRatePerFollower = 0.01; // $0.01 per follower per month
        const engagementMultiplier = getEngagementMultiplier(engagementRate);
        
        // Niche multiplier for affiliate conversions
        const nicheMultiplier = getAffiliateNicheMultiplier(niche);
        
        // Conversion rate: 0.5% of followers make purchases
        const convertingFollowers = followers * 0.005;
        
        return baseRatePerFollower * followers * engagementMultiplier * nicheMultiplier;
    }
    
    function calculateAvgViews(followers, engagementRate) {
        // Estimate average views per reel based on followers and engagement
        const baseReach = followers * 0.15; // 15% of followers see reel
        const engagementBoost = 1 + (engagementRate / 10); // Higher engagement = more reach
        
        return baseReach * engagementBoost;
    }
    
    function getEngagementMultiplier(engagementRate) {
        // Engagement rate multiplier for earnings
        if (engagementRate >= 10) return 2.0;
        if (engagementRate >= 7) return 1.5;
        if (engagementRate >= 5) return 1.2;
        if (engagementRate >= 3) return 1.0;
        return 0.8; // Below 3% engagement
    }
    
    function getAffiliateNicheMultiplier(niche) {
        // Affiliate conversion rates by niche
        const multipliers = {
            'fashion-beauty': 1.5,
            'fitness-health': 1.3,
            'travel-lifestyle': 1.4,
            'food-cooking': 1.2,
            'technology-gadgets': 1.6,
            'parenting-family': 1.1,
            'gaming-entertainment': 0.9,
            'education-learning': 1.3,
            'art-creativity': 1.1,
            'sports-athletics': 1.2,
            'pets-animals': 0.8
        };
        
        return multipliers[niche] || 1.0;
    }
    
    function updateResults(brandDeals, reelsBonus, badgeIncome, affiliateRevenue, totalRevenue) {
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
        brandDealsResult.textContent = formatCurrency(brandDeals);
        brandDealsDetail.textContent = `${Math.round(postsPerWeekInput.value || 0)} posts/week`;
        
        reelsBonusResult.textContent = formatCurrency(reelsBonus);
        reelsBonusDetail.textContent = `${Math.round(reelsPerWeekInput.value || 0)} reels/week`;
        
        badgeIncomeResult.textContent = formatCurrency(badgeIncome);
        badgeIncomeDetail.textContent = `${Math.round(liveHoursInput.value || 0)} live hours/week`;
        
        affiliateRevenueResult.textContent = formatCurrency(affiliateRevenue);
        affiliateRevenueDetail.textContent = `${nicheSelect.options[nicheSelect.selectedIndex].text}`;
        
        totalEarningsResult.textContent = formatCurrency(totalRevenue);
        totalDetail.textContent = 'Net monthly earnings';
    }
    
    function updateBreakdownStats(brandDeals, reelsBonus, totalRevenue, followers, postsPerMonth, reelsPerMonth, engagementRate) {
        // Calculate per-follower earnings
        const perFollower = followers > 0 ? totalRevenue / followers : 0;
        perFollowerResult.textContent = `$${perFollower.toFixed(4)}`;
        
        // Calculate per-post earnings
        const perPost = postsPerMonth > 0 ? brandDeals / postsPerMonth : 0;
        perPostResult.textContent = `$${perPost.toFixed(2)}`;
        
        // Calculate per-reel earnings
        const perReel = reelsPerMonth > 0 ? reelsBonus / reelsPerMonth : 0;
        perReelResult.textContent = `$${perReel.toFixed(2)}`;
        
        // Engagement multiplier
        const engagementMultiplier = getEngagementMultiplier(engagementRate);
        engagementMultiplierResult.textContent = `${engagementMultiplier.toFixed(1)}x`;
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