(function () {
    'use strict';

    var viewsInput = document.getElementById('views');
    var rateInput = document.getElementById('ad-revenue-per-thousand');
    var calculateButton = document.getElementById('calculate-btn');
    var resetButton = document.getElementById('reset-btn');

    var output = {
        views: document.getElementById('result-views'),
        rate: document.getElementById('rate-input'),
        monthly: document.getElementById('monthly-revenue'),
        annual: document.getElementById('annual-earnings'),
        perView: document.getElementById('per-view'),
        daily: document.getElementById('daily'),
        formula: document.getElementById('formula-summary')
    };

    function readNonNegativeNumber(input) {
        var value = Number(input && input.value);
        return Number.isFinite(value) && value >= 0 ? value : 0;
    }

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

    function calculate() {
        var monthlyViews = readNonNegativeNumber(viewsInput);
        var postShareRevenuePerThousand = readNonNegativeNumber(rateInput);
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
    }

    function reset() {
        viewsInput.value = '10000';
        rateInput.value = '0';
        calculate();
    }

    [viewsInput, rateInput].forEach(function (input) {
        input.addEventListener('input', calculate);
        input.addEventListener('change', calculate);
    });

    calculateButton.addEventListener('click', calculate);
    resetButton.addEventListener('click', reset);

    var faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(function (question) {
        question.addEventListener('click', function () {
            var answer = this.nextElementSibling;
            var wasActive = answer.classList.contains('active');

            document.querySelectorAll('.faq-answer').forEach(function (item) {
                item.classList.remove('active');
            });
            document.querySelectorAll('.faq-question').forEach(function (item) {
                item.classList.remove('active');
            });

            if (!wasActive) {
                answer.classList.add('active');
                this.classList.add('active');
            }
        });
    });

    if (faqQuestions.length > 0) {
        faqQuestions[0].click();
    }

    calculate();
})();
