// Podcast revenue scenario calculator.

document.addEventListener('DOMContentLoaded', function() {
    const downloadsInput = document.getElementById('downloadsPerEpisode');
    const episodesInput = document.getElementById('episodesPerMonth');
    const adCpmInput = document.getElementById('adCpm');
    const creatorShareInput = document.getElementById('creatorShare');
    const sponsorCpmInput = document.getElementById('sponsorCpm');
    const preRollInput = document.getElementById('preRollAds');
    const midRollInput = document.getElementById('midRollAds');
    const postRollInput = document.getElementById('postRollAds');
    const calculateBtn = document.getElementById('calculateBtn');

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
    const per1000DownloadsResult = document.getElementById('per1000Downloads');
    const perEpisodeResult = document.getElementById('perEpisode');
    const perAdSlotResult = document.getElementById('perAdSlot');
    const monthlyDownloadsResult = document.getElementById('monthlyDownloads');

    const placementMultipliers = {
        'pre-roll': 0.8,
        'mid-roll': 1,
        'post-roll': 0.7
    };

    initFAQ();
    calculateBtn.addEventListener('click', calculate);
    [
        downloadsInput,
        episodesInput,
        adCpmInput,
        creatorShareInput,
        sponsorCpmInput,
        preRollInput,
        midRollInput,
        postRollInput
    ].forEach(input => {
        input.addEventListener('input', calculate);
        input.addEventListener('change', calculate);
    });
    calculate();

    function numericValue(input, fallback = 0) {
        const value = Number(input.value);
        return Number.isFinite(value) ? value : fallback;
    }

    function calculate() {
        const downloadsPerEpisode = Math.max(0, numericValue(downloadsInput));
        const episodesPerMonth = Math.max(0, numericValue(episodesInput));
        const adCpm = Math.max(0, numericValue(adCpmInput));
        const creatorShare = Math.min(100, Math.max(0, numericValue(creatorShareInput))) / 100;
        const sponsorCpm = Math.max(0, numericValue(sponsorCpmInput));
        const preRollAds = Math.max(0, numericValue(preRollInput));
        const midRollAds = Math.max(0, numericValue(midRollInput));
        const postRollAds = Math.max(0, numericValue(postRollInput));
        const monthlyDownloads = downloadsPerEpisode * episodesPerMonth;

        const preRollRevenue = calculateAdRevenue(downloadsPerEpisode, episodesPerMonth, preRollAds, adCpm, creatorShare, 'pre-roll');
        const midRollRevenue = calculateAdRevenue(downloadsPerEpisode, episodesPerMonth, midRollAds, adCpm, creatorShare, 'mid-roll');
        const postRollRevenue = calculateAdRevenue(downloadsPerEpisode, episodesPerMonth, postRollAds, adCpm, creatorShare, 'post-roll');
        const sponsorshipRevenue = sponsorCpm > 0
            ? (downloadsPerEpisode / 1000) * sponsorCpm * episodesPerMonth
            : 0;
        const totalAdRevenue = preRollRevenue + midRollRevenue + postRollRevenue;
        const totalRevenue = totalAdRevenue + sponsorshipRevenue;

        updateResults(preRollRevenue, midRollRevenue, postRollRevenue, sponsorshipRevenue, totalRevenue, sponsorCpm);
        updateBreakdownStats(
            totalRevenue,
            totalAdRevenue,
            monthlyDownloads,
            episodesPerMonth,
            preRollAds + midRollAds + postRollAds
        );
    }

    function calculateAdRevenue(downloadsPerEpisode, episodesPerMonth, adCount, cpm, creatorShare, adType) {
        const multiplier = placementMultipliers[adType] || 1;
        return (downloadsPerEpisode / 1000) * cpm * multiplier * adCount * creatorShare * episodesPerMonth;
    }

    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    function updateResults(preRollRevenue, midRollRevenue, postRollRevenue, sponsorshipRevenue, totalRevenue, sponsorCpm) {
        preRollResult.textContent = formatCurrency(preRollRevenue);
        preRollDetail.textContent = `${preRollInput.value || 0} slots per episode`;
        midRollResult.textContent = formatCurrency(midRollRevenue);
        midRollDetail.textContent = `${midRollInput.value || 0} slots per episode`;
        postRollResult.textContent = formatCurrency(postRollRevenue);
        postRollDetail.textContent = `${postRollInput.value || 0} slots per episode`;
        sponsorshipsResult.textContent = formatCurrency(sponsorshipRevenue);
        sponsorshipsDetail.textContent = sponsorCpm > 0
            ? `$${sponsorCpm.toFixed(2)} net sponsor CPM entered`
            : 'Excluded until you enter a signed-deal CPM';
        totalEarningsResult.textContent = formatCurrency(totalRevenue);
        totalDetail.textContent = 'Monthly scenario, not a forecast';
    }

    function updateBreakdownStats(totalRevenue, totalAdRevenue, monthlyDownloads, episodesPerMonth, slotsPerEpisode) {
        const per1000Downloads = monthlyDownloads > 0 ? (totalRevenue / monthlyDownloads) * 1000 : 0;
        const perEpisode = episodesPerMonth > 0 ? totalRevenue / episodesPerMonth : 0;
        const monthlyAdSlots = slotsPerEpisode * episodesPerMonth;
        const perAdSlot = monthlyAdSlots > 0 ? totalAdRevenue / monthlyAdSlots : 0;

        per1000DownloadsResult.textContent = `$${per1000Downloads.toFixed(2)}`;
        perEpisodeResult.textContent = `$${perEpisode.toFixed(2)}`;
        perAdSlotResult.textContent = `$${perAdSlot.toFixed(2)}`;
        monthlyDownloadsResult.textContent = Math.round(monthlyDownloads).toLocaleString();
    }

    function initFAQ() {
        const faqQuestions = document.querySelectorAll('.faq-question');
        faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                const answer = question.nextElementSibling;
                const isActive = answer.classList.contains('active');
                document.querySelectorAll('.faq-answer').forEach(item => item.classList.remove('active'));
                document.querySelectorAll('.faq-question').forEach(item => item.classList.remove('active'));
                if (!isActive) {
                    answer.classList.add('active');
                    question.classList.add('active');
                }
            });
        });
        if (faqQuestions.length > 0) faqQuestions[0].click();
    }

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

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(event) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;
            event.preventDefault();
            if (navMenu && navMenu.classList.contains('active')) navMenu.classList.remove('active');
            window.scrollTo({ top: targetElement.offsetTop - 80, behavior: 'smooth' });
        });
    });
});
