import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../tools/ugc-rate/ugc-calculator.js', import.meta.url), 'utf8');
const theme = fs.readFileSync(new URL('../assets/js/theme.js', import.meta.url), 'utf8');
const releaseFunction = source.slice(source.indexOf('    function validKitRelease('), source.indexOf('    function createKitOffer('));
const context = vm.createContext({});
vm.runInContext(releaseFunction, context);
const now = Date.parse('2026-09-18T12:00:00.000Z');
const release = () => ({ startsAt: '2026-09-18T11:00:00.000Z', expiresAt: '2026-09-19T11:00:00.000Z', releaseRef: 'ugc-kit-synthetic-test', productEvidenceSha256: 'a'.repeat(64) });

test('committed pilot remains disabled and has one review-only release declaration', () => {
  assert.equal((source.match(/var UGC_KIT_RELEASE = null;/g) || []).length, 1);
  assert.equal(context.validKitRelease(null, now), false);
  assert.equal(context.validKitRelease(release(), now), true);
});
test('expired, future and excessive windows fail closed', () => {
  assert.equal(context.validKitRelease(release(), Date.parse(release().expiresAt)), false);
  assert.equal(context.validKitRelease(release(), Date.parse(release().startsAt) - 1), false);
  assert.equal(context.validKitRelease({ ...release(), expiresAt: '2027-01-01T11:00:00.000Z' }, now), false);
});
test('calendar normalization, timezone omission and nonfinite clocks fail', () => {
  for (const startsAt of ['2026-02-30T11:00:00.000Z', '2026-09-18T11:00:00', 'today', null, {}, 0]) {
    assert.equal(context.validKitRelease({ ...release(), startsAt }, now), false);
  }
  for (const clock of [NaN, Infinity, '2026-09-18', true]) assert.equal(context.validKitRelease(release(), clock), false);
});
test('evidence and reference are required and extra authority is rejected', () => {
  for (const value of [null, true, 'approved', {}, 'a'.repeat(63)]) {
    assert.equal(context.validKitRelease({ ...release(), productEvidenceSha256: value }, now), false);
  }
  assert.equal(context.validKitRelease({ ...release(), allowPayments: true }, now), false);
  assert.equal(context.validKitRelease({ ...release(), releaseRef: '../../outside' }, now), false);
});
test('offer destination is one fixed, query-free listing, not arbitrary input', () => {
  assert.ok(source.includes("link.href = 'https://www.etsy.com/listing/4549759149/';"));
  assert.ok(source.includes("link.referrerPolicy = 'no-referrer';"));
  const offerCode = source.slice(source.indexOf('    // UGC_KIT_RELEASE'), source.indexOf('    Object.keys(inputs).forEach(function (key) {\n        inputs[key].addEventListener'));
  for (const forbidden of ['URLSearchParams', 'localStorage', 'fetch(', 'innerHTML', 'gtag(', 'eval(']) {
    // The no-localStorage sentence in the comment is not execution.
    if (forbidden !== 'localStorage') assert.equal(offerCode.includes(forbidden), false, forbidden);
  }
});
test('math and free action labels remain the existing explicit-input design', () => {
  assert.ok(source.includes('var contentSubtotal = baseFee * deliverables;'));
  assert.ok(source.includes('var addOns = productionCosts + revisionsFee + rawFootageFee + usageRightsFee + exclusivityFee + rushFee;'));
  assert.ok(source.includes('var quoteTotal = contentSubtotal + addOns;'));
  assert.ok(source.includes("copyButton.addEventListener('click', copySummary);"));
  assert.ok(source.includes("if (focusFirstInvalid) resultsCard.focus();"));
});

function analytics(options = {}) {
  const calls = [];
  const window = {
    location: { pathname: options.path || '/tools/ugc-rate/' },
    localStorage: { getItem() { if (options.storageFails) throw new Error('SYNTHETIC_PRIVATE'); return options.consent === undefined ? 'granted' : options.consent; } },
    gtag: (...args) => { if (options.gtagFails) throw new Error('SYNTHETIC_PRIVATE'); calls.push(args); },
    'ga-disable-fixture': options.disabled === true,
  };
  const scope = vm.createContext({ window, analyticsEnabled: options.enabled !== false, analyticsScriptLoaded: options.loaded !== false,
    consentStorageAvailable: options.storageAvailable !== false, measurementId: 'fixture', storageKey: 'fixture',
    globalPrivacyControlIsActive: () => options.gpc === true });
  vm.runInContext(theme.slice(theme.indexOf('  // UGC pilot only.'), theme.indexOf('  function saveChoice(choice) {')), scope);
  return { window, calls };
}
test('offer commands have exactly two arguments and no payload', () => {
  const { window, calls } = analytics();
  assert.equal(window.crcTrackOfferEvent('ugc_kit_offer_viewed'), true);
  assert.equal(window.crcTrackOfferEvent('ugc_kit_offer_clicked'), true);
  assert.deepEqual(calls, [['event', 'ugc_kit_offer_viewed'], ['event', 'ugc_kit_offer_clicked']]);
});
test('duplicate events per document are not sent again', () => {
  const { window, calls } = analytics();
  for (let i = 0; i < 4; i++) {
    window.crcTrackOfferEvent('ugc_kit_offer_viewed');
    window.crcTrackOfferEvent('ugc_kit_offer_clicked');
  }
  assert.equal(calls.length, 2);
});
test('click cannot arrive before a counted view through this helper', () => {
  const { window, calls } = analytics();
  assert.equal(window.crcTrackOfferEvent('ugc_kit_offer_clicked'), false);
  assert.equal(calls.length, 0);
});
for (const [label, options] of Object.entries({
  denied: { consent: 'denied' }, undecided: { consent: null }, gpc: { gpc: true }, disabled: { disabled: true },
  pendingScript: { loaded: false }, failedInitialization: { enabled: false },
  storageReadError: { storageFails: true }, storageUnavailable: { storageAvailable: false },
  wrongPage: { path: '/tools/sponsorship-rate/' }, providerError: { gtagFails: true },
})) {
  test(`no offer event when ${label}`, () => {
    const { window, calls } = analytics(options);
    assert.equal(window.crcTrackOfferEvent('ugc_kit_offer_viewed'), false);
    assert.equal(calls.length, 0);
  });
}
test('extra arguments, names and coercible objects are rejected', () => {
  const { window, calls } = analytics();
  assert.equal(window.crcTrackOfferEvent('ugc_kit_offer_viewed', { amount: 470 }), false);
  for (const value of ['purchase', 'toString', null, true, {}, 'SYNTHETIC_PRIVATE']) {
    assert.equal(window.crcTrackOfferEvent(value), false);
  }
  assert.equal(calls.length, 0);
});
test('privacy notice and consent prompt describe the proposed offer events', () => {
  const privacy = fs.readFileSync(new URL('../privacy.html', import.meta.url), 'utf8');
  assert.ok(privacy.includes('generic offer-viewed and offer-clicked action names'));
  assert.ok(theme.includes('optional paid-kit offer view/click actions'));
  assert.ok(theme.includes('page_location: sanitizedPageLocation()'));
});
