// YouTube Ad Revenue Calculator 2026 - Specific JavaScript

// Wait for main site JS to load
window.addEventListener('load', function() {
    console.log('YouTube Calculator 2026 loaded');
    
    // CPM Data by Niche (2026 rates based on industry reports)
    const cpmData = {
        finance: { baseCPM: 23.50, min: 2, max: 45, range: "$2-45", label: "Finance & Investing" },
        technology: { baseCPM: 16.50, min: 8, max: 25, range: "$8-25", label: "Technology & Software" },
        health: { baseCPM: 12.50, min: 5, max: 20, range: "$5-20", label: "Health & Wellness" },
        gaming: { baseCPM: 5.50, min: 3, max: 8, range: "$3-8", label: "Gaming & Esports" },
        beauty: { baseCPM: 8.00, min: 4, max: 12, range: "$4-12", label: "Beauty & Fashion" },
        education: { baseCPM: 10.50, min: 6, max: 15, range: "$6-15", label: "Education & Learning" },
        entertainment: { baseCPM: 4.00, min: 2, max: 6, range: "$2-6", label: "Entertainment & Comedy" },
        food: { baseCPM: 5.50, min: 3, max: 8, range: "$3-8", label: "Food & Cooking" },
        travel: { baseCPM: 7.00, min: 4, max: 10, range: "$4-10", label: "Travel & Adventure" },
        sports: { baseCPM: 5.00, min: 3, max: 7, range: "$3-7", label: "Sports & Fitness" }
    };

    // Location multipliers (2026 data)
    const locationMultipliers = {
        us: 1.3,      // United States (highest CPM)
        uk: 1.2,      // United Kingdom
        canada: 1.15, // Canada
        australia: 1.1, // Australia
        germany: 1.05, // Germany
        france: 1.05,  // France
        other: 1.0    // Other countries
    };

    // Video length multipliers (2026 - longer videos can have more ads)
    const videoLengthMultipliers = {
        short: 0.8,      // Under 5 minutes
        medium: 1.0,     // 5-15 minutes (baseline)
        long: 1.3,       // 15-30 minutes (mid-roll ads enabled)
        'very-long': 1.6 // 30+ minutes (multiple mid-roll ads)
    };

    // YouTube revenue split (2026)
    const YOUTUBE_PLATFORM_FEE = 0.45; // 45% to YouTube
    const CREATOR_SHARE = 0.55;        // 55% to creator

    // Engagement rate bonus (2026 - higher engagement = better watch time = more revenue)
    function getEngagementMultiplier(engagementRate) {
        if (engagementRate >= 10) return 1.25;
        if (engagementRate >= 7) return 1.15;
        if (engagementRate >= 5) return 1.1;
        if (engagementRate >= 3) return 1.05;
        return 1.0;
    }

    // Sponsorship rates per 1,000 subscribers (2026)
    function getSponsorshipRate(subscribers, niche) {
        const baseRate = 10; // $10 per 1,000 subscribers
        
        // Niche multipliers
        const nicheMultipliers = {
            finance: 2.5,
            technology: 2.0,
            health: 1.8,
            education: 1.7,
            beauty: 1.6,
            travel: 1.4,
            sports: 1.3,
            food: 1.2,
            gaming: 1.1,
            entertainment: 1.0
        };
        
        const multiplier = nicheMultipliers[niche] || 1.0;
        const subscribersInThousands = subscribers / 1000;
        
        // Sponsorship frequency based on channel size
        let dealsPerMonth = 1;
        if (subscribers > 50000) dealsPerMonth = 2;
        if (subscribers > 100000) dealsPerMonth = 3;
        if (subscribers > 500000) dealsPerMonth = 4;
        if (subscribers > 1000000) dealsPerMonth = 5;
        
        return baseRate * multiplier * subscribersInThousands * dealsPerMonth;
    }

    // Membership revenue (2026)
    function getMembershipRevenue(subscribers) {
        if (subscribers < 1000) return 0; // Need 1,000 subs for memberships
        
        // Percentage of subscribers who become members
        let membershipRate = 0.001; // 0.1% for small channels
        
        if (subscribers > 10000) membershipRate = 0.002;  // 0.2%
        if (subscribers > 50000) membershipRate = 0.003;  // 0.3%
        if (subscribers > 100000) membershipRate = 0.004; // 0.4%
        if (subscribers > 500000) membershipRate = 0.005; // 0.5%
        if (subscribers > 1000000) membershipRate = 0.006; // 0.6%
        
        const memberCount = subscribers * membershipRate;
        const averageMonthlyFee = 4.99; // Average membership tier
        
        return memberCount * averageMonthlyFee;
    }

    // DOM Elements
    const monthlyViewsInput = document.getElementById('monthlyViews');
    const nicheSelect = document.getElementById('niche');
    const audienceLocationSelect = document.getElementById('audienceLocation');
    const engagementInput = document.getElementById('engagement');
    const videoLengthSelect = document.getElementById('videoLength');
    const subscribersInput = document.getElementById('subscribers');
    const calculateBtn = document.getElementById('calculateBtn');

    // Result elements
    const adRevenueElement = document.getElementById('adRevenue');
    const adRevenueDetailElement = document.getElementById('adRevenueDetail');
    const sponsorshipsElement = document.getElementById('sponsorships');
    const sponsorshipsDetailElement = document.getElementById('sponsorshipsDetail');
    const membershipsElement = document.getElementById('memberships');
    const membershipsDetailElement = document.getElementById('membershipsDetail');
    const totalEarningsElement = document.getElementById('totalEarnings');
    const totalDetailElement = document.getElementById('totalDetail');
    
    // Breakdown elements
    const cpmRateElement = document.getElementById('cpmRate');
    const per1kViewsElement = document.getElementById('per1kViews');
    const youtubeFeeElement = document.getElementById('youtubeFee');
    const creatorShareElement = document.getElementById('creatorShare');

    // Initialize calculator
    function initializeCalculator() {
        // Add event listeners
        calculateBtn.addEventListener('click', calculateEarnings);
        
        const inputs = [monthlyViewsInput, nicheSelect, audienceLocationSelect, engagementInput, videoLengthSelect, subscribersInput];
        inputs.forEach(input => {
            input.addEventListener('input', calculateEarnings);
            input.addEventListener('change', calculateEarnings);
        });
        
        // Calculate initial earnings
        calculateEarnings();
        
        // Console greeting
        console.log('%c📺 YouTube Ad Revenue Calculator 2026', 'color: #ff0000; font-size: 16px; font-weight: bold;');
        console.log('%cUpdated with 2026 CPM rates and 55/45 revenue split', 'color: #666;');
        console.log('%chttps://creatorrevenuecalculator.com/tools/youtube-ad-revenue/', 'color: #ff0000;');
    }

    // Calculate earnings
    function calculateEarnings() {
        // Get input values
        const monthlyViews = parseInt(monthlyViewsInput.value) || 0;
        const niche = nicheSelect.value;
        const audienceLocation = audienceLocationSelect.value;
        const engagementRate = parseFloat(engagementInput.value) || 0;
        const videoLength = videoLengthSelect.value;
        const subscribers = parseInt(subscribersInput.value) || 0;
        
        // Get base CPM for niche
        const nicheData = cpmData[niche] || cpmData.entertainment;
        const baseCPM = nicheData.baseCPM;
        
        // Apply multipliers
        const locationMultiplier = locationMultipliers[audienceLocation] || 1.0;
        const videoLengthMultiplier = videoLengthMultipliers[videoLength] || 1.0;
        const engagementMultiplier = getEngagementMultiplier(engagementRate);
        
        // Calculate gross CPM (before YouTube fee)
        const grossCPM = baseCPM * locationMultiplier * videoLengthMultiplier * engagementMultiplier;
        
        // Calculate gross ad revenue
        const grossAdRevenue = (monthlyViews / 1000) * grossCPM;
        
        // Apply YouTube platform fee (45%)
        const youtubeFeeAmount = grossAdRevenue * YOUTUBE_PLATFORM_FEE;
        const netAdRevenue = grossAdRevenue * CREATOR_SHARE;
        
        // Calculate other revenue streams
        const sponsorshipRevenue = getSponsorshipRate(subscribers, niche);
        const membershipRevenue = getMembershipRevenue(subscribers);
        
        // Calculate total earnings
        const totalEarnings = netAdRevenue + sponsorshipRevenue + membershipRevenue;
        
        // Calculate per 1,000 views (net)
        const netPer1kViews = monthlyViews > 0 ? (netAdRevenue / monthlyViews) * 1000 : 0;
        
        // Update UI
        updateResults(netAdRevenue, sponsorshipRevenue, membershipRevenue, totalEarnings);
        updateBreakdown(grossCPM, netPer1kViews, youtubeFeeAmount, grossAdRevenue);
    }

    // Update results in UI
    function updateResults(adRevenue, sponsorships, memberships, total) {
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
        adRevenueElement.textContent = formatter.format(adRevenue);
        adRevenueDetailElement.textContent = `Net after 45% YouTube fee`;
        
        sponsorshipsElement.textContent = formatter.format(sponsorships);
        sponsorshipsDetailElement.textContent = `Estimated brand deals`;
        
        membershipsElement.textContent = formatter.format(memberships);
        membershipsDetailElement.textContent = `Channel members & Super Chat`;
        
        totalEarningsElement.textContent = formatter.format(total);
        totalDetailElement.textContent = `Total monthly net earnings`;
    }

    // Update breakdown stats
    function updateBreakdown(grossCPM, netPer1kViews, youtubeFeeAmount, grossAdRevenue) {
        // Format numbers
        const currencyFormatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        
        // Update breakdown elements
        cpmRateElement.textContent = currencyFormatter.format(grossCPM);
        per1kViewsElement.textContent = currencyFormatter.format(netPer1kViews);
        youtubeFeeElement.textContent = '45%';
        creatorShareElement.textContent = '55%';
        
        // Update revenue split visual if it exists
        updateRevenueSplitVisual(youtubeFeeAmount, grossAdRevenue * CREATOR_SHARE);
    }

    // Update revenue split visual
    function updateRevenueSplitVisual(youtubeFee, creatorEarnings) {
        const splitBar = document.querySelector('.split-bar');
        if (!splitBar) return;
        
        const total = youtubeFee + creatorEarnings;
        const youtubePercentage = total > 0 ? (youtubeFee / total) * 100 : 45;
        const creatorPercentage = total > 0 ? (creatorEarnings / total) * 100 : 55;
        
        const creatorElement = splitBar.querySelector('.split-creator');
        const youtubeElement = splitBar.querySelector('.split-youtube');
        
        if (creatorElement) {
            creatorElement.style.width = `${creatorPercentage}%`;
            creatorElement.querySelector('span').textContent = `Creator: ${creatorPercentage.toFixed(0)}%`;
        }
        
        if (youtubeElement) {
            youtubeElement.style.width = `${youtubePercentage}%`;
            youtubeElement.querySelector('span').textContent = `YouTube: ${youtubePercentage.toFixed(0)}%`;
        }
    }

    // Initialize FAQ accordion
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

    // Initialize everything
    initializeCalculator();
    initializeFAQ();
});