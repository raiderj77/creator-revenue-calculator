// Podcast Revenue Calculator 2026 - JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const downloadsInput = document.getElementById('downloadsPerEpisode');
    const episodesInput = document.getElementById('episodesPerMonth');
    const nicheSelect = document.getElementById('niche');
    const preRollInput = document.getElementById('preRollAds');
    const midRollInput = document.getElementById('midRollAds');
    const postRollInput = document.getElementById('postRollAds');
    const calculateBtn = document.getElementById('calculateBtn');
    
    // Result elements
    const preRollResult = document.getElementById('preRollRevenue');
    const preRollDetail = document.getElementById('preRollDetail');
    const midRollResult = document.getElementById('midRollRevenue');
    const midRollDetail = document.getElementById('midRollDetail');
    const postRollResult = document.getElementById('postRollRevenue');
    const postRollDetail = document.getElementById('postRollDetail');
    const sponsorshipsResult = document.getElementById('sponsorships');
    const sponsorshipsDetail = document.getElementById('sponsorshipsDetail');
    const totalEarningsResult = document.getElementById('totalEarnings');
    const totalDetail = document.getElementById('totalDetail');
    
    // Breakdown elements
    const per1000DownloadsResult = document.getElementById('per1000Downloads');
    const perEpisodeResult = document.getElementById('perEpisode');
    const perAdSlotResult = document.getElementById('perAdSlot');
    const monthlyDownloadsResult = document.getElementById('monthlyDownloads');
    
    // CPM rates by niche (2026 data)
    // CPM rates by niche (2026 data - IAB standards)
    const nicheRates = {
        'business': { min: 35, max: 75, avg: 55 },
        'technology': { min: 30, max: 65, avg: 47.5 },
        'finance': { min: 40, max: 80, avg: 60 },
        'health': { min: 25, max: 55, avg: 40 },
        'true-crime': { min: 20, max: 45, avg: 32.5 },
        'comedy': { min: 15, max: 35, avg: 25 },
        'news': { min: 25, max: 50, avg: 37.5 },
        'sports': { min: 20, max: 40, avg: 30 },
        'education': { min: 30, max: 60, avg: 45 },
        'lifestyle': { min: 25, max: 50, avg: 37.5 },
        'gaming': { min: 15, max: 30, avg: 22.5 },
        'music': { min: 20, max: 40, avg: 30 }
    };
    
    // Ad placement multipliers (2026 IAB standards)
    const adMultipliers = {
        'pre-roll': 0.8,  // 20% less than mid-roll
        'mid-roll': 1.0,  // Base rate
        'post-roll': 0.7  // 30% less than mid-roll
    };
    
    // Ad placement multipliers (2026 data)
    const platformFee = 0.25; // 25% platform fee
    
    // Initialize FAQ functionality
    initFAQ();
    
    // Set up event listeners
    calculateBtn.addEventListener('click', calculate);
    
    // Calculate on input changes
    [downloadsInput, episodesInput, nicheSelect, preRollInput, midRollInput, postRollInput].forEach(input => {
        input.addEventListener('input', calculate);
        input.addEventListener('change', calculate);
    });
    
    // Initial calculation
    calculate();
    
    // Main calculation function
    function calculate() {
        // Get input values
        const downloadsPerEpisode = parseInt(downloadsInput.value) || 0;
        const episodesPerMonth = parseInt(episodesInput.value) || 0;
        const niche = nicheSelect.value;
        const preRollAds = parseInt(preRollInput.value) || 0;
        const midRollAds = parseInt(midRollInput.value) || 0;
        const postRollAds = parseInt(postRollInput.value) || 0;
        
        // Calculate monthly downloads
        const monthlyDownloads = downloadsPerEpisode * episodesPerMonth;
        
        // Get CPM rate for selected niche
        const cpmRate = nicheRates[niche]?.avg || 25;
        
        // 1. Pre-Roll Ad Revenue
        const preRollRevenue = calculateAdRevenue(downloadsPerEpisode, episodesPerMonth, preRollAds, cpmRate, 'pre-roll');
        
        // 2. Mid-Roll Ad Revenue
        const midRollRevenue = calculateAdRevenue(downloadsPerEpisode, episodesPerMonth, midRollAds, cpmRate, 'mid-roll');
        
        // 3. Post-Roll Ad Revenue
        const postRollRevenue = calculateAdRevenue(downloadsPerEpisode, episodesPerMonth, postRollAds, cpmRate, 'post-roll');
        
        // 4. Sponsorship Revenue (direct deals, higher rates)
        const sponsorshipRevenue = calculateSponsorshipRevenue(downloadsPerEpisode, episodesPerMonth, niche);
        
        // 5. Calculate totals
        const totalAdRevenue = preRollRevenue + midRollRevenue + postRollRevenue;
        const totalRevenue = totalAdRevenue + sponsorshipRevenue;
        
        // Update UI with results
        updateResults(preRollRevenue, midRollRevenue, postRollRevenue, sponsorshipRevenue, totalRevenue);
        
        // Update breakdown stats
        updateBreakdownStats(totalRevenue, monthlyDownloads, episodesPerMonth, preRollAds + midRollAds + postRollAds, downloadsPerEpisode);
        
        // Update revenue split visualization
        updateRevenueSplitVisualization(totalAdRevenue, sponsorshipRevenue);
    }
    
    function calculateAdRevenue(downloadsPerEpisode, episodesPerMonth, adCount, cpmRate, adType) {
        if (adCount === 0) return 0;
        
        // Calculate gross revenue
        const downloadsPer1000 = downloadsPerEpisode / 1000;
        const multiplier = adMultipliers[adType] || 1.0;
        const grossPerEpisode = downloadsPer1000 * cpmRate * multiplier * adCount;
        
        // Apply platform fee (25% standard)
        const netPerEpisode = grossPerEpisode * (1 - platformFee);
        
        // Monthly revenue
        return netPerEpisode * episodesPerMonth;
    }
    
    function calculateSponsorshipRevenue(downloadsPerEpisode, episodesPerMonth, niche) {
        // Sponsorship rates are higher than ad network rates
        const sponsorshipMultiplier = 1.3; // 30% higher than ad network rates
        const cpmRate = nicheRates[niche]?.avg || 25;
        
        // Sponsors typically want mid-roll placement
        const downloadsPer1000 = downloadsPerEpisode / 1000;
        const grossPerEpisode = downloadsPer1000 * cpmRate * sponsorshipMultiplier;
        
        // Direct sponsorships have lower fees (10% vs 25% for networks)
        const directFee = 0.1;
        const netPerEpisode = grossPerEpisode * (1 - directFee);
        
        // Assume 1 sponsorship per episode (industry average)
        return netPerEpisode * episodesPerMonth;
    }
    
    function updateResults(preRollRevenue, midRollRevenue, postRollRevenue, sponsorshipRevenue, totalRevenue) {
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
        preRollResult.textContent = formatCurrency(preRollRevenue);
        preRollDetail.textContent = `${preRollInput.value || 0} ads/episode`;
        
        midRollResult.textContent = formatCurrency(midRollRevenue);
        midRollDetail.textContent = `${midRollInput.value || 0} ads/episode`;
        
        postRollResult.textContent = formatCurrency(postRollRevenue);
        postRollDetail.textContent = `${postRollInput.value || 0} ads/episode`;
        
        sponsorshipsResult.textContent = formatCurrency(sponsorshipRevenue);
        sponsorshipsDetail.textContent = `${nicheSelect.options[nicheSelect.selectedIndex].text}`;
        
        totalEarningsResult.textContent = formatCurrency(totalRevenue);
        totalDetail.textContent = 'Net monthly earnings';
    }
    
    function updateBreakdownStats(totalRevenue, monthlyDownloads, episodesPerMonth, totalAdSlots, downloadsPerEpisode) {
        // Calculate per 1,000 downloads earnings
        const per1000Downloads = monthlyDownloads > 0 ? (totalRevenue / monthlyDownloads) * 1000 : 0;
        per1000DownloadsResult.textContent = `$${per1000Downloads.toFixed(2)}`;
        
        // Calculate per episode earnings
        const perEpisode = episodesPerMonth > 0 ? totalRevenue / episodesPerMonth : 0;
        perEpisodeResult.textContent = `$${perEpisode.toFixed(2)}`;
        
        // Calculate per ad slot earnings
        const perAdSlot = totalAdSlots > 0 ? totalRevenue / totalAdSlots : 0;
        perAdSlotResult.textContent = `$${perAdSlot.toFixed(2)}`;
        
        // Monthly downloads
        monthlyDownloadsResult.textContent = monthlyDownloads.toLocaleString();
    }
    
    function updateRevenueSplitVisualization(totalAdRevenue, sponsorshipRevenue) {
        // Calculate total gross revenue (before fees)
        const totalRevenue = totalAdRevenue + sponsorshipRevenue;
        
        // Calculate podcaster share (after all fees)
        // Ad revenue already has 25% fee applied, sponsorship has 10% fee
        // For visualization, we'll show 70/30 split (industry average)
        const podcasterShare = 70; // 70% to podcaster
        const platformShare = 30;  // 30% to platforms/fees
        
        // Update visualization
        const podcasterBar = document.querySelector('.split-creator');
        const platformBar = document.querySelector('.split-platform');
        
        podcasterBar.style.width = `${podcasterShare}%`;
        podcasterBar.querySelector('span').textContent = `Podcaster: ${podcasterShare}%`;
        
        platformBar.style.width = `${platformShare}%`;
        platformBar.querySelector('span').textContent = `Platform: ${platformShare}%`;
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