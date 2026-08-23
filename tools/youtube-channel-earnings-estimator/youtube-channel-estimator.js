(function () {
  'use strict';

  var page = document.body;
  var lookupButton = document.getElementById('lookupChannel');
  var status = document.getElementById('lookupStatus');
  var results = document.getElementById('estimatorResults');
  var channelInput = document.getElementById('channelInput');
  var privacyAccepted = document.getElementById('privacyAccepted');
  var website = document.getElementById('website');
  var productionClientEnabled = page.dataset.apiEnabled === 'true';
  var currentPayload = null;

  var publicOutput = {
    thumbnail: document.getElementById('channelThumbnail'),
    name: document.getElementById('channelName'),
    id: document.getElementById('channelId'),
    subscribers: document.getElementById('subscriberCount'),
    views: document.getElementById('channelViewCount'),
    videos: document.getElementById('publicVideoCount'),
    uploads: document.getElementById('recentUploadCount'),
    retrieved: document.getElementById('retrievalDate')
  };
  var estimateOutput = {
    dailyActivity: document.getElementById('dailyActivity'),
    monthlyActivity: document.getElementById('monthlyActivity'),
    lowMonthly: document.getElementById('lowMonthly'),
    middleMonthly: document.getElementById('middleMonthly'),
    highMonthly: document.getElementById('highMonthly'),
    lowAnnual: document.getElementById('lowAnnual'),
    middleAnnual: document.getElementById('middleAnnual'),
    highAnnual: document.getElementById('highAnnual')
  };

  function formatNumber(value) {
    return Number(value).toLocaleString('en-US', { maximumFractionDigits: 0 });
  }

  function formatMoney(value) {
    return Number(value).toLocaleString('en-US', {
      style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2
    });
  }

  function clearEstimate() {
    Object.keys(estimateOutput).forEach(function (key) { estimateOutput[key].textContent = '—'; });
  }

  function clearResult() {
    Object.keys(publicOutput).forEach(function (key) {
      if (key === 'thumbnail') {
        publicOutput.thumbnail.hidden = true;
        publicOutput.thumbnail.removeAttribute('src');
      } else {
        publicOutput[key].textContent = '—';
      }
    });
    clearEstimate();
    document.getElementById('channelName').textContent = 'No current result';
    document.getElementById('viewPeriodMethod').textContent = 'Recent public uploads; no current result';
    document.getElementById('dataQualityLevel').textContent = 'Coverage facts only; no accuracy score';
  }

  function numberInput(id) {
    var input = document.getElementById(id);
    var value = Number(input.value);
    if (input.value.trim() === '' || !Number.isFinite(value) || !input.checkValidity()) {
      input.setAttribute('aria-invalid', 'true');
      throw new Error('Review the highlighted assumption.');
    }
    input.removeAttribute('aria-invalid');
    return value;
  }

  function rateRange(prefix) {
    var range = {
      low: numberInput(prefix + 'Low'),
      middle: numberInput(prefix + 'Middle'),
      high: numberInput(prefix + 'High')
    };
    if (range.low > range.middle || range.middle > range.high) {
      throw new Error('Each RPM range must run from low to middle to high.');
    }
    return range;
  }

  function appliedRange() {
    var contentMix = document.getElementById('contentMix').value;
    var longForm = rateRange('long');
    var shorts = rateRange('shorts');
    var unknown = rateRange('unknown');
    if (contentMix === 'mostly-long-form') return longForm;
    if (contentMix === 'mostly-shorts') return shorts;
    if (contentMix === 'unknown') {
      if ((longForm.high > 0 || shorts.high > 0)
        && (unknown.low > Math.min(longForm.low, shorts.low)
          || unknown.high < Math.max(longForm.high, shorts.high))) {
        throw new Error('Unknown mix must use the broadest displayed low-to-high range.');
      }
      return unknown;
    }
    var longPercent = numberInput('longFormPercent');
    if (longPercent > 100) throw new Error('Long-form share must be from 0 to 100 percent.');
    var longShare = longPercent / 100;
    var shortsShare = 1 - longShare;
    return {
      low: longForm.low * longShare + shorts.low * shortsShare,
      middle: longForm.middle * longShare + shorts.middle * shortsShare,
      high: longForm.high * longShare + shorts.high * shortsShare
    };
  }

  function buildActivity(publicData, retrievedAt) {
    var lookbackDays = Number(document.getElementById('lookbackDays').value);
    var end = new Date(retrievedAt);
    var start = new Date(end.getTime() - lookbackDays * 86400000);
    var included = publicData.recentUploads.filter(function (upload) {
      var published = new Date(upload.publishedAt);
      return published >= start && published <= end;
    });
    var visibleViews = included.reduce(function (sum, upload) { return sum + Number(upload.viewCount); }, 0);
    return {
      included: included.length,
      daily: visibleViews / lookbackDays,
      monthly: visibleViews / lookbackDays * 30,
      lookbackDays: lookbackDays
    };
  }

  function renderPublicData(payload, activity) {
    var data = payload.publicData;
    publicOutput.name.textContent = data.channelName;
    publicOutput.id.textContent = data.channelId;
    publicOutput.subscribers.textContent = data.subscriberCountHidden ? 'Hidden by channel' : formatNumber(data.subscriberCount);
    publicOutput.views.textContent = formatNumber(data.channelViewCount);
    publicOutput.videos.textContent = formatNumber(data.publicVideoCount);
    publicOutput.uploads.textContent = formatNumber(activity.included);
    publicOutput.retrieved.textContent = new Date(payload.retrievedAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
    if (data.thumbnailUrl) {
      publicOutput.thumbnail.src = data.thumbnailUrl;
      publicOutput.thumbnail.alt = data.channelName + ' public channel thumbnail';
      publicOutput.thumbnail.hidden = false;
    }
    document.getElementById('viewPeriodMethod').textContent = activity.lookbackDays + '-day recent-upload proxy; older catalog excluded';
    var unavailable = Number(payload.coverage && payload.coverage.unavailableRecentUploadCount || 0);
    document.getElementById('dataQualityLevel').textContent = unavailable > 0
      ? activity.included + ' qualifying uploads used; ' + unavailable + ' recent upload statistics unavailable'
      : activity.included + ' qualifying public uploads sampled; no accuracy score';
  }

  function renderEstimate(activity) {
    estimateOutput.dailyActivity.textContent = formatNumber(activity.daily);
    estimateOutput.monthlyActivity.textContent = formatNumber(activity.monthly);
    if (document.getElementById('monetizationAssumption').value !== 'hypothetical-monetized-views') return;
    var rpm = appliedRange();
    var monthly = {
      low: activity.monthly / 1000 * rpm.low,
      middle: activity.monthly / 1000 * rpm.middle,
      high: activity.monthly / 1000 * rpm.high
    };
    estimateOutput.lowMonthly.textContent = formatMoney(monthly.low);
    estimateOutput.middleMonthly.textContent = formatMoney(monthly.middle);
    estimateOutput.highMonthly.textContent = formatMoney(monthly.high);
    estimateOutput.lowAnnual.textContent = formatMoney(monthly.low * 12);
    estimateOutput.middleAnnual.textContent = formatMoney(monthly.middle * 12);
    estimateOutput.highAnnual.textContent = formatMoney(monthly.high * 12);
  }

  function refreshVisibleAssumptions() {
    if (!currentPayload) return;
    clearEstimate();
    try {
      var activity = buildActivity(currentPayload.publicData, currentPayload.retrievedAt);
      renderPublicData(currentPayload, activity);
      renderEstimate(activity);
      status.textContent = document.getElementById('monetizationAssumption').value === 'hypothetical-monetized-views'
        ? 'Estimate updated locally from your visible assumptions.'
        : 'Public data retained. Revenue is not modeled with the current selection.';
    } catch (error) {
      clearEstimate();
      status.textContent = error.message || 'Review the visible assumptions.';
    }
  }

  async function requestChannel() {
    if (!productionClientEnabled) return;
    clearResult();
    status.textContent = '';
    lookupButton.disabled = true;
    try {
      if (!privacyAccepted.checked) throw new Error('Agree to the API-client privacy notice before requesting public data.');
      var response = await fetch('/api/youtube-channel-estimator', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-crc-estimator-request': 'browser-v1'
        },
        body: JSON.stringify({
          channel: channelInput.value,
          privacyAccepted: privacyAccepted.checked,
          website: website.value
        })
      });
      var payload = await response.json();
      if (!response.ok) throw new Error(payload.message || 'Public channel data is unavailable.');
      currentPayload = payload;
      var activity = buildActivity(currentPayload.publicData, currentPayload.retrievedAt);
      renderPublicData(currentPayload, activity);
      clearEstimate();
      renderEstimate(activity);
      status.textContent = 'Public data and independent scenario updated.';
      results.focus();
      if (typeof window.crcTrackEvent === 'function') {
        window.crcTrackEvent('calculator_completed');
      }
    } catch (error) {
      currentPayload = null;
      clearResult();
      status.textContent = error.message || 'Public channel data is unavailable.';
    } finally {
      lookupButton.disabled = false;
    }
  }

  if (productionClientEnabled) {
    lookupButton.disabled = false;
    lookupButton.textContent = 'Retrieve public channel data';
    status.textContent = '';
    lookupButton.addEventListener('click', requestChannel);
    [
      'lookbackDays', 'contentMix', 'longFormPercent',
      'longLow', 'longMiddle', 'longHigh',
      'shortsLow', 'shortsMiddle', 'shortsHigh',
      'unknownLow', 'unknownMiddle', 'unknownHigh',
      'monetizationAssumption'
    ].forEach(function (id) {
      var control = document.getElementById(id);
      control.addEventListener('input', refreshVisibleAssumptions);
      control.addEventListener('change', refreshVisibleAssumptions);
    });
    channelInput.addEventListener('input', function () {
      if (!currentPayload) return;
      currentPayload = null;
      clearResult();
      status.textContent = 'Channel input changed. Retrieve public data again before calculating.';
    });
  }
})();
