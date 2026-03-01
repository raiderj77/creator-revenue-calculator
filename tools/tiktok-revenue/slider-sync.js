// slider-sync.js — Universal slider↔input sync for all calculators
// Drop this file into each tool folder and add a <script> tag BEFORE the tool's own JS
// <script src="slider-sync.js"></script>
//
// How it works: finds every <input type="range"> on the page,
// looks for its paired number input (by ID pattern: "X-slider" pairs with "X"),
// and syncs them both ways.

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {

        // Find all sliders on the page
        const sliders = document.querySelectorAll('input[type="range"]');

        sliders.forEach(function(slider) {
            // Figure out the paired number input
            // Pattern: slider ID is "something-slider", number input is "something"
            const sliderId = slider.id;
            if (!sliderId) return;

            let numberId = '';

            // Try removing "-slider" suffix
            if (sliderId.endsWith('-slider')) {
                numberId = sliderId.replace('-slider', '');
            }
            // Try removing "Slider" suffix (camelCase)
            else if (sliderId.endsWith('Slider')) {
                numberId = sliderId.replace('Slider', '');
            }
            // Try looking for data attribute
            else if (slider.dataset.for) {
                numberId = slider.dataset.for;
            }

            if (!numberId) return;

            const numberInput = document.getElementById(numberId);
            if (!numberInput) return;

            // Sync: when number input changes → update slider
            numberInput.addEventListener('input', function() {
                slider.value = this.value;
            });

            // Sync: when slider moves → update number input AND trigger calculation
            slider.addEventListener('input', function() {
                numberInput.value = this.value;

                // Trigger a 'change' event on the number input so the calculator picks it up
                numberInput.dispatchEvent(new Event('input', { bubbles: true }));
                numberInput.dispatchEvent(new Event('change', { bubbles: true }));
            });

            // Also sync on page load (in case values are pre-set)
            numberInput.value = slider.value;
        });

        console.log('Slider sync loaded — ' + sliders.length + ' sliders paired ✓');
    });
})();
