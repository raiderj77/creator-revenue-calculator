/**
 * Email Capture for Creator Revenue Calculator
 * Uses Loops.so public form endpoint (no API key needed client-side)
 */
(function() {
  'use strict';

  // Replace with your Loops.so form ID from dashboard
  var LOOPS_FORM_ID = 'FORM_ID_HERE';
  var LOOPS_ENDPOINT = 'https://app.loops.so/api/newsletter-form/' + LOOPS_FORM_ID;

  function initEmailCapture() {
    var forms = document.querySelectorAll('.email-capture');
    forms.forEach(function(container) {
      var input = container.querySelector('input[type="email"]');
      var button = container.querySelector('button');
      var errorEl = container.querySelector('.email-capture-error');
      var source = container.getAttribute('data-source') || 'creatorrevenuecalc';
      var leadMagnet = container.getAttribute('data-lead-magnet') || '';

      if (!input || !button) return;

      function handleSubmit() {
        var email = input.value.trim();
        if (!email || email.indexOf('@') === -1) {
          if (errorEl) errorEl.textContent = 'Please enter a valid email address';
          return;
        }

        button.disabled = true;
        button.textContent = 'Sending...';
        if (errorEl) errorEl.textContent = '';

        fetch(LOOPS_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email,
            source: source,
            leadMagnet: leadMagnet,
            userGroup: 'Empire'
          })
        })
        .then(function(res) {
          if (!res.ok) throw new Error('Subscription failed');
          container.innerHTML = '<div class="email-capture-success"><span style="font-size:1.5rem">&#10003;</span><p>Check your inbox — your results are on the way.</p></div>';
        })
        .catch(function() {
          button.disabled = false;
          button.textContent = container.getAttribute('data-button-text') || 'Send My Projection';
          if (errorEl) errorEl.textContent = 'Something went wrong. Please try again.';
        });
      }

      button.addEventListener('click', handleSubmit);
      input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') handleSubmit();
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEmailCapture);
  } else {
    initEmailCapture();
  }
})();
