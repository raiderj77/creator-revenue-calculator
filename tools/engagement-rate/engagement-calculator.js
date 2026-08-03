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

  function calculate() {
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
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    ids.forEach(function (id) {
      var element = document.getElementById(id);
      if (element) element.addEventListener(element.tagName === 'SELECT' ? 'change' : 'input', calculate);
    });
    var button = document.getElementById('calculateBtn');
    if (button) button.addEventListener('click', calculate);
    var copyButton = document.getElementById('copyResult');
    if (copyButton) {
      copyButton.addEventListener('click', function () {
        if (!navigator.clipboard || !copyButton.dataset.result) return;
        navigator.clipboard.writeText(copyButton.dataset.result).then(function () {
          var previous = copyButton.textContent;
          copyButton.textContent = 'Copied';
          window.setTimeout(function () { copyButton.textContent = previous; }, 1500);
        }).catch(function () {});
      });
    }
    calculate();
  });
})();
