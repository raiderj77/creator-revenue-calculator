(function () {
  'use strict';

  var ids = ['platform', 'followers', 'views', 'likes', 'comments', 'shares', 'saves'];

  function number(id) {
    var element = document.getElementById(id);
    var parsed = element ? Number.parseFloat(element.value) : 0;
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
  }

  function text(id, value) {
    var element = document.getElementById(id);
    if (element) element.textContent = value;
  }

  function percent(numerator, denominator) {
    return denominator > 0 ? numerator / denominator * 100 : null;
  }

  function formatRate(value) {
    return value === null ? 'Not available' : value.toFixed(2) + '%';
  }

  function inputIsValid(input) {
    if (!input || input.value.trim() === '' || !input.checkValidity()) return false;
    return input.tagName === 'SELECT' || Number.isFinite(Number(input.value));
  }

  function validateInputs(shouldFocus) {
    var firstInvalid = null;
    ids.forEach(function (id) {
      var input = document.getElementById(id);
      if (inputIsValid(input)) {
        input.removeAttribute('aria-invalid');
      } else {
        input.setAttribute('aria-invalid', 'true');
        if (!firstInvalid) firstInvalid = input;
      }
    });

    if (!firstInvalid) return true;

    var label = document.querySelector('label[for="' + firstInvalid.id + '"]');
    text('engagementFormStatus', 'Review ' + (label ? label.textContent.trim() : 'the highlighted field') + '. Use a value within the displayed range and increment.');
    if (shouldFocus) firstInvalid.focus();
    return false;
  }

  function clearResults() {
    ['engagementRate', 'viewBasedRate', 'totalEngagements', 'followerCount', 'formulaDisplay'].forEach(function (id) {
      text(id, '—');
    });
    var copyButton = document.getElementById('copyResult');
    if (copyButton) {
      copyButton.dataset.result = '';
      copyButton.disabled = true;
    }
    document.getElementById('engagementResults').classList.add('has-invalid-inputs');
  }

  function calculate(shouldFocus) {
    if (!validateInputs(Boolean(shouldFocus))) {
      clearResults();
      return false;
    }

    var followers = number('followers');
    var views = number('views');
    var likes = number('likes');
    var comments = number('comments');
    var shares = number('shares');
    var saves = number('saves');
    var total = likes + comments + shares + saves;
    var followerRate = percent(total, followers);
    var viewRate = percent(total, views);

    text('engagementRate', formatRate(followerRate));
    text('viewBasedRate', formatRate(viewRate));
    text('totalEngagements', Math.round(total).toLocaleString('en-US'));
    text('followerCount', Math.round(followers).toLocaleString('en-US'));
    text('formulaDisplay', followers > 0
      ? '(' + [likes, comments, shares, saves].map(function (value) { return Math.round(value).toLocaleString('en-US'); }).join(' + ') + ') ÷ ' + Math.round(followers).toLocaleString('en-US') + ' × 100 = ' + formatRate(followerRate)
      : 'Enter followers or subscribers to calculate a follower-based rate.');

    var copyButton = document.getElementById('copyResult');
    if (copyButton) {
      copyButton.dataset.result = 'Follower-based engagement rate: ' + formatRate(followerRate) + '; view-based engagement rate: ' + formatRate(viewRate) + '; selected engagements: ' + Math.round(total).toLocaleString('en-US') + '.';
      copyButton.disabled = false;
    }
    document.getElementById('engagementResults').classList.remove('has-invalid-inputs');
    text('engagementFormStatus', shouldFocus ? 'Rates updated from your entries.' : '');
    return true;
  }

  document.addEventListener('DOMContentLoaded', function () {
    ids.forEach(function (id) {
      var element = document.getElementById(id);
      if (element) element.addEventListener(element.tagName === 'SELECT' ? 'change' : 'input', function () { calculate(false); });
    });
    var button = document.getElementById('calculateBtn');
    if (button) {
      button.addEventListener('click', function () {
        if (calculate(true)) {
          document.getElementById('engagementResults').focus();
          if (typeof window.crcTrackEvent === 'function') {
            window.crcTrackEvent('calculator_completed');
          }
        }
      });
    }
    var copyButton = document.getElementById('copyResult');
    if (copyButton) {
      copyButton.addEventListener('click', function () {
        if (!navigator.clipboard || !copyButton.dataset.result) return;
        navigator.clipboard.writeText(copyButton.dataset.result).then(function () {
          var previous = copyButton.textContent;
          copyButton.textContent = 'Copied';
          if (typeof window.crcTrackEvent === 'function') {
            window.crcTrackEvent('result_copied');
          }
          window.setTimeout(function () { copyButton.textContent = previous; }, 1500);
        }).catch(function () {});
      });
    }
    calculate(false);
  });
})();
