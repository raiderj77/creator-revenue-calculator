(function () {
    'use strict';

    var viewsInput = document.getElementById('views');
    var rateInput = document.getElementById('ad-revenue-per-thousand');
    var calculateButton = document.getElementById('calculate-btn');
    var resetButton = document.getElementById('reset-btn');
    var resultsCard = document.getElementById('youtubeResults');
    var formStatus = document.getElementById('youtubeFormStatus');

    var output = {
        views: document.getElementById('result-views'),
        rate: document.getElementById('rate-input'),
        monthly: document.getElementById('monthly-revenue'),
        annual: document.getElementById('annual-earnings'),
        perView: document.getElementById('per-view'),
        daily: document.getElementById('daily'),
        formula: document.getElementById('formula-summary')
    };

    function formatMoney(value) {
        return value.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    function formatNumber(value) {
        return value.toLocaleString('en-US', {
            maximumFractionDigits: 0
        });
    }

    function inputIsValid(input) {
        return input && input.value.trim() !== '' && Number.isFinite(Number(input.value)) && input.checkValidity();
    }

    function validateInputs(shouldFocus) {
        var firstInvalid = null;
        [viewsInput, rateInput].forEach(function (input) {
            if (inputIsValid(input)) {
                input.removeAttribute('aria-invalid');
            } else {
                input.setAttribute('aria-invalid', 'true');
                if (!firstInvalid) firstInvalid = input;
            }
        });

        if (!firstInvalid) return true;

        var label = document.querySelector('label[for="' + firstInvalid.id + '"]');
        formStatus.textContent = 'Review ' + (label ? label.textContent.trim() : 'the highlighted field') + '. Use a value within the displayed range and increment.';
        if (shouldFocus) firstInvalid.focus();
        return false;
    }

    function clearResults() {
        Object.keys(output).forEach(function (key) { output[key].textContent = '—'; });
        resultsCard.classList.add('has-invalid-inputs');
    }

    function calculate(shouldFocus) {
        if (!validateInputs(Boolean(shouldFocus))) {
            clearResults();
            return false;
        }

        var monthlyViews = Number(viewsInput.value) || 0;
        var postShareRevenuePerThousand = Number(rateInput.value) || 0;
        var monthlyRevenue = monthlyViews / 1000 * postShareRevenuePerThousand;
        var annualRevenue = monthlyRevenue * 12;
        var perViewRevenue = postShareRevenuePerThousand / 1000;
        var dailyAverage = monthlyRevenue / 30;

        output.views.textContent = formatNumber(monthlyViews);
        output.rate.textContent = formatMoney(postShareRevenuePerThousand);
        output.monthly.textContent = formatMoney(monthlyRevenue);
        output.annual.textContent = formatMoney(annualRevenue);
        output.perView.textContent = '$' + perViewRevenue.toFixed(4);
        output.daily.textContent = formatMoney(dailyAverage);
        output.formula.textContent = '(' + formatNumber(monthlyViews) + ' ÷ 1,000) × ' + formatMoney(postShareRevenuePerThousand);
        resultsCard.classList.remove('has-invalid-inputs');
        formStatus.textContent = shouldFocus ? 'Scenario updated from your entries.' : '';
        return true;
    }

    function reset() {
        viewsInput.value = '0';
        rateInput.value = '0';
        calculate(false);
    }

    [viewsInput, rateInput].forEach(function (input) {
        input.addEventListener('input', function () { calculate(false); });
        input.addEventListener('change', function () { calculate(false); });
    });

    calculateButton.addEventListener('click', function () {
        if (calculate(true)) {
            document.getElementById('youtubeResults').focus();
            if (typeof window.crcTrackEvent === 'function') {
                window.crcTrackEvent('calculator_completed');
            }
        }
    });
    resetButton.addEventListener('click', reset);

    var faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(function (question) {
        question.setAttribute('aria-expanded', 'false');
        question.addEventListener('click', function () {
            var answer = this.nextElementSibling;
            var wasActive = answer.classList.contains('active');

            document.querySelectorAll('.faq-answer').forEach(function (item) {
                item.classList.remove('active');
            });
            document.querySelectorAll('.faq-question').forEach(function (item) {
                item.classList.remove('active');
                item.setAttribute('aria-expanded', 'false');
            });

            if (!wasActive) {
                answer.classList.add('active');
                this.classList.add('active');
                this.setAttribute('aria-expanded', 'true');
            }
        });
    });

    if (faqQuestions.length > 0) {
        faqQuestions[0].click();
    }

    calculate(false);
})();
