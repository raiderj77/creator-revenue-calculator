// YouTube Ad Revenue Calculator 2026 — FIXED
// Matches actual HTML element IDs in index.html

(function() {
    'use strict';

    // ── CPM Data by Niche (2026 rates) ──
    const cpmData = {
        finance:       { baseCPM: 23.50, min: 2, max: 45, label: "Finance & Investing" },
        technology:    { baseCPM: 16.50, min: 8, max: 25, label: "Technology & Software" },
        health:        { baseCPM: 12.50, min: 5, max: 20, label: "Health & Wellness" },
        gaming:        { baseCPM: 5.50,  min: 3, max: 8,  label: "Gaming & Esports" },
        beauty:        { baseCPM: 8.00,  min: 4, max: 12, label: "Beauty & Fashion" },
        education:     { baseCPM: 10.50, min: 6, max: 15, label: "Education & Learning" },
        entertainment: { baseCPM: 4.00,  min: 2, max: 6,  label: "Entertainment & Comedy" },
        food:          { baseCPM: 5.50,  min: 3, max: 8,  label: "Food & Cooking" },
        travel:        { baseCPM: 7.00,  min: 4, max: 10, label: "Travel & Adventure" },
        sports:        { baseCPM: 5.00,  min: 3, max: 7,  label: "Sports & Fitness" }
    };

    // ── Location multipliers (2026) ──
    const locationMultipliers = {
        us:        1.3,
        uk:        1.2,
        canada:    1.15,
        australia: 1.1,
        germany:   1.05,
        france:    1.05,
        other:     1.0
    };

    // ── Video length multipliers ──
    const videoLengthMultipliers = {
        short:       0.8,
        medium:      1.0,
        long:        1.3,
        'very-long': 1.6
    };

    // YouTube revenue split
    const YOUTUBE_FEE = 0.45;
    const CREATOR_SHARE = 0.55;

    // Engagement multiplier
    function getEngagementMultiplier(rate) {
        if (rate >= 10) return 1.25;
        if (rate >= 7)  return 1.15;
        if (rate >= 5)  return 1.1;
        if (rate >= 3)  return 1.05;
        return 1.0;
    }

    // Format currency
    function formatMoney(num) {
        if (num >= 1000000) return '$' + (num / 1000000).toFixed(2) + 'M';
        if (num >= 10000)   return '$' + (num / 1000).toFixed(1) + 'K';
        if (num >= 1000)    return '$' + num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        return '$' + num.toFixed(2);
    }

    // Format number with commas
    function formatNum(num) {
        return num.toLocaleString('en-US');
    }

    // ── Get elements by their ACTUAL HTML IDs ──
    const els = {
        views:            document.getElementById('views'),
        viewsSlider:      document.getElementById('views-slider'),
        niche:            document.getElementById('niche'),
        videoLength:      document.getElementById('video-length'),
        audienceLocation: document.getElementById('audience-location'),
        engagementRate:   document.getElementById('engagement-rate'),
        engagementSlider: document.getElementById('engagement-slider'),
        calculateBtn:     document.getElementById('calculate-btn'),
        resetBtn:         document.getElementById('reset-btn'),
        // Result displays
        cpmRate:          document.getElementById('cpm-rate'),
        resultViews:      document.getElementById('result-views'),
        monthlyRevenue:   document.getElementById('monthly-revenue'),
        youtubeCut:       document.getElementById('youtube-cut'),
        yourEarnings:     document.getElementById('your-earnings'),
        annualEarnings:   document.getElementById('annual-earnings'),
        per1000:          document.getElementById('per-1000'),
        perView:          document.getElementById('per-view'),
        daily:            document.getElementById('daily')
    };

    // ── Sync sliders with number inputs ──
    function syncSlider(numberInput, sliderInput) {
        if (!numberInput || !sliderInput) return;

        numberInput.addEventListener('input', function() {
            sliderInput.value = this.value;
        });

        sliderInput.addEventListener('input', function() {
            numberInput.value = this.value;
            // Auto-calculate when slider moves
            calculate();
        });
    }

    syncSlider(els.views, els.viewsSlider);
    syncSlider(els.engagementRate, els.engagementSlider);

    // ── Main calculation ──
    function calculate() {
        try {
            const monthlyViews   = parseInt(els.views.value) || 10000;
            const niche          = els.niche.value || 'gaming';
            const videoLength    = els.videoLength.value || 'medium';
            const location       = els.audienceLocation.value || 'us';
            const engagementRate = parseFloat(els.engagementRate.value) || 5;

            // Get base CPM for niche
            const nicheData = cpmData[niche] || cpmData.gaming;
            let cpm = nicheData.baseCPM;

            // Apply location multiplier
            cpm *= (locationMultipliers[location] || 1.0);

            // Apply video length multiplier
            cpm *= (videoLengthMultipliers[videoLength] || 1.0);

            // Apply engagement multiplier
            cpm *= getEngagementMultiplier(engagementRate);

            // Calculate revenue
            const grossRevenue    = (monthlyViews / 1000) * cpm;
            const youtubeCut      = grossRevenue * YOUTUBE_FEE;
            const creatorEarnings = grossRevenue * CREATOR_SHARE;
            const annualEarnings  = creatorEarnings * 12;
            const dailyEarnings   = creatorEarnings / 30;
            const per1000Views    = creatorEarnings / (monthlyViews / 1000);
            const perViewAmount   = creatorEarnings / monthlyViews;

            // Update the display
            if (els.cpmRate)        els.cpmRate.textContent        = formatMoney(cpm);
            if (els.resultViews)    els.resultViews.textContent    = formatNum(monthlyViews);
            if (els.monthlyRevenue) els.monthlyRevenue.textContent = formatMoney(grossRevenue);
            if (els.youtubeCut)     els.youtubeCut.textContent     = formatMoney(youtubeCut);
            if (els.yourEarnings)   els.yourEarnings.textContent   = formatMoney(creatorEarnings);
            if (els.annualEarnings) els.annualEarnings.textContent = formatMoney(annualEarnings);
            if (els.per1000)        els.per1000.textContent        = formatMoney(per1000Views);
            if (els.perView)        els.perView.textContent        = '$' + perViewAmount.toFixed(4);
            if (els.daily)          els.daily.textContent          = formatMoney(dailyEarnings);

        } catch (err) {
            console.error('YouTube Calculator error:', err);
        }
    }

    // ── Reset to defaults ──
    function resetCalculator() {
        if (els.views)            { els.views.value = 10000; }
        if (els.viewsSlider)      { els.viewsSlider.value = 10000; }
        if (els.niche)            { els.niche.selectedIndex = 0; }
        if (els.videoLength)      { els.videoLength.selectedIndex = 0; }
        if (els.audienceLocation) { els.audienceLocation.selectedIndex = 0; }
        if (els.engagementRate)   { els.engagementRate.value = 5; }
        if (els.engagementSlider) { els.engagementSlider.value = 5; }
        calculate();
    }

    // ── Event listeners ──
    if (els.calculateBtn) {
        els.calculateBtn.addEventListener('click', function(e) {
            e.preventDefault();
            calculate();
        });
    }

    if (els.resetBtn) {
        els.resetBtn.addEventListener('click', function(e) {
            e.preventDefault();
            resetCalculator();
        });
    }

    // Also recalculate when dropdowns change
    if (els.niche)            els.niche.addEventListener('change', calculate);
    if (els.videoLength)      els.videoLength.addEventListener('change', calculate);
    if (els.audienceLocation) els.audienceLocation.addEventListener('change', calculate);

    // Also recalculate when number inputs change (typing)
    if (els.views)          els.views.addEventListener('change', calculate);
    if (els.engagementRate) els.engagementRate.addEventListener('change', calculate);

    // Run initial calculation
    calculate();

    console.log('YouTube Calculator 2026 loaded — IDs matched ✓');

})();
