// Affiliate Income Calculator 2026 - JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const monthlyTrafficInput = document.getElementById('monthlyTraffic');
    const conversionRateInput = document.getElementById('conversionRate');
    const averageOrderValueInput = document.getElementById('averageOrderValue');
    const commissionRateInput = document.getElementById('commissionRate');
    const affiliateProgramsInput = document.getElementById('affiliatePrograms');
    const calculateBtn = document.getElementById('calculateBtn');
    
    // Result elements
    const dailyEarningsResult = document.getElementById('dailyEarnings');
    const dailyDetail = document.getElementById('dailyDetail');
    const weeklyEarningsResult = document.getElementById('weeklyEarnings');
    const weeklyDetail = document.getElementById('weeklyDetail');
    const monthlyEarningsResult = document.getElementById('monthlyEarnings');
    const monthlyDetail = document.getElementById('monthlyDetail');
    const yearlyEarningsResult = document.getElementById('yearlyEarnings');
    const yearlyDetail = document.getElementById('yearlyDetail');
    const totalCommissionsResult = document.getElementById('totalCommissions');
    const totalDetail = document.getElementById('totalDetail');
    
    // Breakdown elements
    const perVisitorResult = document.getElementById('perVisitor');
    const perSaleResult = document.getElementById('perSale');
    const monthlySalesResult = document.getElementById('monthlySales');
    const commissionDisplayResult = document.getElementById('commissionDisplay');
    
    // Industry benchmarks (2026 data)
    const industryBenchmarks = {
        'conversionRates': {
            'beginner': 1,
            'intermediate': 2,
            'advanced': 3,
            'expert': 5
        },
        'commissionRates': {
            'digital': 30,
            'physical': 10,
            'services': 20,
            'subscriptions': 25
        },
        'averageOrderValues': {
            'digital': 50,
            'physical': 100,
            'services': 200,
            'subscriptions': 150
        }
    };
    
    // Initialize FAQ functionality
    initFAQ();
    
    // Set up event listeners
    calculateBtn.addEventListener('click', calculate);
    
    // Calculate on input changes
    [monthlyTrafficInput, conversionRateInput, averageOrderValueInput, commissionRateInput, affiliateProgramsInput].forEach(input => {
        input.addEventListener('input', calculate);
        input.addEventListener('change', calculate);
    });
    
    // Initial calculation
    calculate();
    
    // Main calculation function
    function calculate() {
        // Get input values
        const monthlyTraffic = parseInt(monthlyTrafficInput.value) || 0;
        const conversionRate = parseFloat(conversionRateInput.value) || 0;
        const averageOrderValue = parseFloat(averageOrderValueInput.value) || 0;
        const commissionRate = parseFloat(commissionRateInput.value) || 0;
        const affiliatePrograms = parseInt(affiliateProgramsInput.value) || 1;
        
        // Validate inputs
        const validatedConversionRate = Math.min(Math.max(conversionRate, 0), 100);
        const validatedCommissionRate = Math.min(Math.max(commissionRate, 0), 100);
        
        // 1. Calculate monthly sales
        const monthlySales = Math.floor(monthlyTraffic * (validatedConversionRate / 100));
        
        // 2. Calculate monthly revenue (before commission)
        const monthlyRevenue = monthlySales * averageOrderValue;
        
        // 3. Calculate monthly commissions
        const monthlyCommissions = monthlyRevenue * (validatedCommissionRate / 100);
        
        // 4. Apply program multiplier (more programs = potentially more earnings)
        const programMultiplier = getProgramMultiplier(affiliatePrograms);
        const adjustedMonthlyCommissions = monthlyCommissions * programMultiplier;
        
        // 5. Calculate other time periods
        const dailyCommissions = adjustedMonthlyCommissions / 30;
        const weeklyCommissions = adjustedMonthlyCommissions / 4;
        const yearlyCommissions = adjustedMonthlyCommissions * 12;
        
        // 6. Calculate total commissions (monthly as primary metric)
        const totalCommissions = adjustedMonthlyCommissions;
        
        // Update UI with results
        updateResults(dailyCommissions, weeklyCommissions, adjustedMonthlyCommissions, yearlyCommissions, totalCommissions);
        
        // Update breakdown stats
        updateBreakdownStats(adjustedMonthlyCommissions, monthlyTraffic, monthlySales, averageOrderValue, validatedCommissionRate);
        
        // Update revenue split visualization
        updateRevenueSplitVisualization(validatedCommissionRate);
    }
    
    function getProgramMultiplier(programCount) {
        // More programs can increase earnings, but with diminishing returns
        if (programCount <= 1) return 1.0;
        if (programCount <= 3) return 1.2;
        if (programCount <= 5) return 1.4;
        if (programCount <= 10) return 1.6;
        if (programCount <= 20) return 1.8;
        return 2.0; // Max 2x multiplier for 20+ programs
    }
    
    function updateResults(dailyCommissions, weeklyCommissions, monthlyCommissions, yearlyCommissions, totalCommissions) {
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
        dailyEarningsResult.textContent = formatCurrency(dailyCommissions);
        dailyDetail.textContent = 'Average per day';
        
        weeklyEarningsResult.textContent = formatCurrency(weeklyCommissions);
        weeklyDetail.textContent = 'Average per week';
        
        monthlyEarningsResult.textContent = formatCurrency(monthlyCommissions);
        monthlyDetail.textContent = 'Primary metric';
        
        yearlyEarningsResult.textContent = formatCurrency(yearlyCommissions);
        yearlyDetail.textContent = 'Annual projection';
        
        totalCommissionsResult.textContent = formatCurrency(totalCommissions);
        totalDetail.textContent = 'Monthly commissions';
    }
    
    function updateBreakdownStats(monthlyCommissions, monthlyTraffic, monthlySales, averageOrderValue, commissionRate) {
        // Calculate per visitor earnings
        const perVisitor = monthlyTraffic > 0 ? monthlyCommissions / monthlyTraffic : 0;
        perVisitorResult.textContent = `$${perVisitor.toFixed(4)}`;
        
        // Calculate per sale earnings
        const perSale = monthlySales > 0 ? monthlyCommissions / monthlySales : 0;
        perSaleResult.textContent = `$${perSale.toFixed(2)}`;
        
        // Monthly sales count
        monthlySalesResult.textContent = monthlySales.toLocaleString();
        
        // Commission rate display
        commissionDisplayResult.textContent = `${commissionRate}%`;
    }
    
    function updateRevenueSplitVisualization(commissionRate) {
        // Calculate revenue split (affiliate vs merchant)
        const affiliateShare = commissionRate;
        const merchantShare = 100 - commissionRate;
        
        // Update visualization
        const affiliateBar = document.querySelector('.split-affiliate');
        const merchantBar = document.querySelector('.split-merchant');
        
        affiliateBar.style.width = `${affiliateShare}%`;
        affiliateBar.querySelector('span').textContent = `Affiliate: ${affiliateShare}%`;
        
        merchantBar.style.width = `${merchantShare}%`;
        merchantBar.querySelector('span').textContent = `Merchant: ${merchantShare}%`;
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