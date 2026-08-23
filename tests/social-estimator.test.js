import assert from 'node:assert/strict';
import test from 'node:test';

import {
  SOCIAL_SCENARIO_LABELS,
  compatibilityHelp,
  isCompatibleScenario
} from '../tools/social-media-earnings-estimator/social-media-estimator.js';

const platformLabels = ['YouTube', 'Instagram', 'TikTok', 'Twitch', 'X', 'Facebook'];
const revenueStreamLabels = ['Patreon', 'Newsletter', 'Affiliate', 'Sponsorship', 'Products'];

test('platform payout scenarios accept only platform labels', () => {
  for (const label of platformLabels) assert.equal(isCompatibleScenario(label, 'platform'), true, label);
  for (const label of revenueStreamLabels) assert.equal(isCompatibleScenario(label, 'platform'), false, label);
});

test('sponsorship scenarios accept platforms, Newsletter, and Sponsorship only', () => {
  for (const label of platformLabels.concat(['Newsletter', 'Sponsorship'])) {
    assert.equal(isCompatibleScenario(label, 'sponsorship'), true, label);
  }
  for (const label of ['Patreon', 'Affiliate', 'Products']) {
    assert.equal(isCompatibleScenario(label, 'sponsorship'), false, label);
  }
});

test('direct-revenue scenarios accept every approved label', () => {
  assert.equal(SOCIAL_SCENARIO_LABELS.length, 11);
  for (const label of SOCIAL_SCENARIO_LABELS) assert.equal(isCompatibleScenario(label, 'direct'), true, label);
});

test('missing or unknown selections are rejected without inventing a fallback', () => {
  assert.equal(isCompatibleScenario('', 'platform'), false);
  assert.equal(isCompatibleScenario('YouTube', ''), false);
  assert.equal(isCompatibleScenario('Unknown', 'direct'), false);
  assert.equal(isCompatibleScenario('YouTube', 'connected'), false);
});

test('visible guidance describes each compatibility rule without a supplied rate', () => {
  assert.match(compatibilityHelp('platform'), /YouTube, Instagram, TikTok, Twitch, X, or Facebook/);
  assert.match(compatibilityHelp('sponsorship'), /platform, Newsletter, or Sponsorship/);
  assert.match(compatibilityHelp('direct'), /Any listed label/);
  assert.doesNotMatch(
    [compatibilityHelp('platform'), compatibilityHelp('sponsorship'), compatibilityHelp('direct')].join(' '),
    /\$|benchmark|average rate/i
  );
});
