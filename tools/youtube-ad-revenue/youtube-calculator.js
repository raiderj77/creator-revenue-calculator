// YouTube Ad Revenue Calculator - Specific JavaScript

// Wait for main site JS to load
window.addEventListener('load', function() {
    // CPM Data by Niche (2024 rates based on creator reports)
    const cpmData = {
        finance: { baseCPM: 25.00, range: "$15-50", label: "Finance & Investing" },
        tech: { baseCPM: 20.00, range: "$12-40", label: "Technology & Software" },
        business: { baseCPM: 18.00, range: "$10-35", label: "Business & Marketing" },
        education: { baseCPM: 12.00, range: "$8-25", label: "Education & Learning" },
        gaming: { baseCPM: 5.00, range: "$3-10", label: "Gaming" },
        entertainment: { baseCPM: 6.00, range: "$4-12", label: "Entertainment & Movies" },
        lifestyle: { baseCPM: 7.00, range: "$3-15", label: "Lifestyle & Vlogs" },
        travel: { baseCPM: 4.00, range: "$2-8", label: "Travel & Adventure" },
        fitness: { baseCPM: 8.00, range: "$5-15", label: "Fitness & Health" },
        food: { baseCPM: 6.50, range: "$4-12", label: "Food & Cooking" },
        music: { baseCPM: 4.50, range: "$3-9", label: "Music & Audio" },
        comedy: { baseCPM: 2.50, range: "$1-5", label: "Comedy & Humor" },
        kids: { baseCPM: 1.50, range: "$0.50-3", label: "Kids & Family" }
    };

    // Location multipliers
    const locationMultipliers = {
        us: 1.3,    // United States (highest CPM)
        uk: 1.25,   // United Kingdom
        ca: 1.2,    // Canada
        au: 1.15,   // Australia
        eu: 1.1,    // Europe
        other: 1.0  // Other countries
    };

    // Video length multipliers (longer videos can have more ads)
    const videoLengthMultipliers = {
        short: 0.8,      // Under 5 minutes
        medium: 1.0,     // 5-15 minutes (baseline)
        long: 1.2,       // 15-30 minutes
        'very-long': 1.4 // 30+ minutes
    };

    // Engagement rate bonus (higher engagement = better watch time = more revenue)
    function getEngagementMultiplier(engagementRate) {
        if (engagementRate >= 15) return 1.2;
        if (engagementRate >= 10) return 1.15;
        if (engagementRate >= 7) return 1.1;
        if (engagementRate >= 5) return 1.05;
        return 1.0;
    }

    // DOM Elements
    const viewsInput = document.getElementById('views');
    const viewsSlider = document.getElementById('views-slider');
    const nicheSelect = document.getElementById('niche');
    const videoLengthSelect = document.getElementById('video-length');
    const audienceLocationSelect = document.getElementById('audience-location');
    const engagementInput = document.getElementById('engagement-rate');
    const engagementSlider = document.getElementById('engagement-slider');
    const calculateBtn = document.getElementById('calculate-btn');
    const resetBtn = document.getElementById('reset-btn');

    // Result Elements
    const cpmRateElement = document.getElementById('cpm-rate');
    const resultViewsElement = document.getElementById('result-views');
    const monthlyRevenueElement = document.getElementById('monthly-revenue');
    const youtubeCutElement = document.getElementById('youtube-cut');
    const yourEarningsElement = document.getElementById('your-earnings');
    const annualEarningsElement = document.getElementById('annual-earnings');
    const per1000Element = document.getElementById('per-1000');
    const perViewElement = document.getElementById('per-view');
    const dailyElement = document.getElementById('daily');

    // Initialize
    setupEventListeners();
    calculateEarnings(); // Initial calculation with default values

    // Setup event listeners
    function setupEventListeners() {
        // Sync number input with slider
        viewsInput.addEventListener('input', function() {
            viewsSlider.value = this.value;
            calculateEarnings();
        });

        viewsSlider.addEventListener('input', function() {
            viewsInput.value = this.value;
            calculateEarnings();
        });

        // Sync engagement input with slider
        engagementInput.addEventListener('input', function() {
            engagementSlider.value = this.value;
            calculateEarnings();
        });

        engagementSlider.addEventListener('input', function() {
            engagementInput.value = this.value;
            calculateEarnings();
        });

        // Calculate on any select change
        nicheSelect.addEventListener('change', calculateEarnings);
        videoLengthSelect.addEventListener('change', calculateEarnings);
        audienceLocationSelect.addEventListener('change', calculateEarnings);

        // Calculate button
        calculateBtn.addEventListener('click', calculateEarnings);

        // Reset button
        resetBtn.addEventListener('click', function() {
            viewsInput.value = 10000;
            viewsSlider.value = 10000;
            nicheSelect.value = 'gaming';
            videoLengthSelect.value = 'medium';
            audienceLocationSelect.value = 'other';
            engagementInput.value = 5;
            engagementSlider.value = 5;
            calculateEarnings();
        });

        // Share buttons
        document.querySelectorAll('.share-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const platform = this.classList.contains('twitter') ? 'twitter' :
                               this.classList.contains('facebook') ? 'facebook' : 'reddit';
                shareResults(platform);
            });
        });
    }

    // Main calculation function
    function calculateEarnings() {
        // Get input values
        const monthlyViews = parseInt(viewsInput.value) || 0;
        const niche = nicheSelect.value;
        const videoLength = videoLengthSelect.value;
        const audienceLocation = audienceLocationSelect.value;
        const engagementRate = parseFloat(engagementInput.value) || 5;

        // Validate inputs
        if (monthlyViews < 1000) {
            alert('Please enter at least 1,000 monthly views');
            viewsInput.value = 1000;
            viewsSlider.value = 1000;
            return;
        }

        // Calculate adjusted CPM
        const baseCPM = cpmData[niche].baseCPM;
        const locationMultiplier = locationMultipliers[audienceLocation];
        const videoLengthMultiplier = videoLengthMultipliers[videoLength];
        const engagementMultiplier = getEngagementMultiplier(engagementRate);

        const adjustedCPM = baseCPM * locationMultiplier * videoLengthMultiplier * engagementMultiplier;

        // Calculate revenue
        const cpmCount = monthlyViews / 1000; // Number of CPMs
        const grossRevenue = cpmCount * adjustedCPM; // Total revenue before YouTube's cut
        const youtubesCut = grossRevenue * 0.45; // YouTube takes 45%
        const yourEarnings = grossRevenue * 0.55; // You keep 55%

        // Calculate breakdown
        const earningsPer1000 = yourEarnings / cpmCount;
        const earningsPerView = yourEarnings / monthlyViews;
        const dailyEarnings = yourEarnings / 30.44; // Average days per month
        const annualEarnings = yourEarnings * 12;

        // Update UI
        updateResults({
            monthlyViews,
            adjustedCPM,
            grossRevenue,
            youtubesCut,
            yourEarnings,
            annualEarnings,
            earningsPer1000,
            earningsPerView,
            dailyEarnings
        });
    }

    // Update results in the UI
    function updateResults(results) {
        // Format numbers
        const formatCurrency = (amount) => {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(amount);
        };

        const formatNumber = (num) => {
            return new Intl.NumberFormat('en-US').format(num);
        };

        const formatSmallCurrency = (amount) => {
            if (amount < 0.01) {
                return '$' + amount.toFixed(4);
            }
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 4,
                maximumFractionDigits: 4
            }).format(amount);
        };

        // Update elements
        cpmRateElement.textContent = formatCurrency(results.adjustedCPM);
        resultViewsElement.textContent = formatNumber(results.monthlyViews);
        monthlyRevenueElement.textContent = formatCurrency(results.grossRevenue);
        youtubeCutElement.textContent = formatCurrency(results.youtubesCut);
        yourEarningsElement.textContent = formatCurrency(results.yourEarnings);
        annualEarningsElement.textContent = formatCurrency(results.annualEarnings);
        per1000Element.textContent = formatCurrency(results.earningsPer1000);
        perViewElement.textContent = formatSmallCurrency(results.earningsPerView);
        dailyElement.textContent = formatCurrency(results.dailyEarnings);

        // Update page title with results for sharing
        updatePageTitle(results.yourEarnings, results.monthlyViews);
    }

    // Update page title with calculated results
    function updatePageTitle(monthlyEarnings, monthlyViews) {
        const earningsText = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(monthlyEarnings);

        document.title = `YouTube Earnings: ${earningsText}/month from ${monthlyViews.toLocaleString()} views | Calculator`;
    }

    // Share results function
    function shareResults(platform) {
        const monthlyEarnings = document.getElementById('your-earnings').textContent;
        const monthlyViews = document.getElementById('result-views').textContent;
        const cpmRate = document.getElementById('cpm-rate').textContent;

        const message = `I calculated my YouTube earnings: ${monthlyEarnings}/month from ${monthlyViews} views (${cpmRate} CPM). Try the free calculator: ${window.location.href}`;

        let shareUrl = '';
        
        switch(platform) {
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;
                break;
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(message)}`;
                break;
            case 'reddit':
                shareUrl = `https://www.reddit.com/submit?url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(message.substring(0, 300))}`;
                break;
        }

        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');
        }
    }

    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + Enter to calculate
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            calculateEarnings();
        }
        
        // Escape to reset
        if (e.key === 'Escape') {
            e.preventDefault();
            resetBtn.click();
        }
    });

    // Add input validation
    viewsInput.addEventListener('blur', function() {
        let value = parseInt(this.value);
        if (isNaN(value) || value < 1000) {
            this.value = 1000;
        } else if (value > 10000000) {
            this.value = 10000000;
        }
        calculateEarnings();
    });

    engagementInput.addEventListener('blur', function() {
        let value = parseFloat(this.value);
        if (isNaN(value) || value < 1) {
            this.value = 1;
        } else if (value > 20) {
            this.value = 20;
        }
        calculateEarnings();
    });

    // Initialize tooltips
    function initTooltips() {
        const tooltips = document.querySelectorAll('.tooltip');
        tooltips.forEach(tooltip => {
            const text = tooltip.getAttribute('data-tooltip');
            if (text) {
                tooltip.addEventListener('mouseenter', function(e) {
                    const tooltipEl = document.createElement('div');
                    tooltipEl.className = 'tooltip-text';
                    tooltipEl.textContent = text;
                    tooltipEl.style.position = 'absolute';
                    tooltipEl.style.background = '#1f2937';
                    tooltipEl.style.color = 'white';
                    tooltipEl.style.padding = '0.5rem';
                    tooltipEl.style.borderRadius = '4px';
                    tooltipEl.style.fontSize = '0.875rem';
                    tooltipEl.style.zIndex = '1000';
                    tooltipEl.style.maxWidth = '200px';
                    
                    document.body.appendChild(tooltipEl);
                    
                    const rect = tooltip.getBoundingClientRect();
                    tooltipEl.style.left = rect.left + 'px';
                    tooltipEl.style.top = (rect.top - tooltipEl.offsetHeight - 10) + 'px';
                    
                    tooltip._tooltipEl = tooltipEl;
                });
                
                tooltip.addEventListener('mouseleave', function() {
                    if (tooltip._tooltipEl) {
                        tooltip._tooltipEl.remove();
                    }
                });
            }
        });
    }

    // Initialize tooltips
    initTooltips();

    // Initialize FAQ accordion
    initFAQAccordion();

    // Log initialization
    console.log('YouTube Ad Revenue Calculator initialized');
    console.log('CPM data loaded for', Object.keys(cpmData).length, 'niches');
});

// FAQ Accordion Functionality
function initFAQAccordion() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const icon = this.querySelector('i');
            
            // Toggle active class on question
            this.classList.toggle('active');
            
            // Toggle open class on answer
            answer.classList.toggle('open');
            
            // Toggle icon rotation
            if (answer.classList.contains('open')) {
                icon.style.transform = 'rotate(180deg)';
            } else {
                icon.style.transform = 'rotate(0deg)';
            }
            
            // Close other FAQ items (optional - remove if you want multiple open)
            faqQuestions.forEach(otherQuestion => {
                if (otherQuestion !== this) {
                    otherQuestion.classList.remove('active');
                    const otherAnswer = otherQuestion.nextElementSibling;
                    const otherIcon = otherQuestion.querySelector('i');
                    otherAnswer.classList.remove('open');
                    otherIcon.style.transform = 'rotate(0deg)';
                }
            });
        });
    });
    
    // Open first FAQ by default
    if (faqQuestions.length > 0) {
        faqQuestions[0].click();
    }
    
    console.log('FAQ accordion initialized with', faqQuestions.length, 'questions');
}