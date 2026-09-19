import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs';

const script = fs.readFileSync('tools/ugc-rate/ugc-calculator.js', 'utf8');
const sourceMarker = 'var UGC_KIT_RELEASE = null;';
const routePath = '/tools/ugc-rate/';
const names = ['ugc_kit_offer_viewed', 'ugc_kit_offer_clicked'];

async function setup(page, context, options = {}) {
  const requests = [];
  await context.route('**/*', route => {
    const url = new URL(route.request().url());
    if (url.origin === 'http://127.0.0.1:4312') return route.continue();
    requests.push(url.href);
    if (url.origin === 'https://www.googletagmanager.com' && url.pathname === '/gtag/js' && !options.loaderFails) {
      return route.fulfill({ contentType: 'application/javascript', body: '/* synthetic tag: no external requests */' });
    }
    return route.abort();
  });
  await page.addInitScript(({ choice, gpc, storageFails, noObserver }) => {
    if (choice) localStorage.setItem('creatorrevenuecalculator:analytics-consent', choice);
    Object.defineProperty(navigator, 'globalPrivacyControl', { configurable: true, get: () => gpc });
    if (storageFails) Storage.prototype.getItem = () => { throw new Error('synthetic unavailable storage'); };
    if (noObserver) window.IntersectionObserver = undefined;
    window.fixtureClipboard = [];
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async value => { window.fixtureClipboard.push(value); } } });
    window.fixturePrints = 0;
    window.print = () => { window.fixturePrints++; };
  }, { choice: options.choice ?? 'denied', gpc: options.gpc === true, storageFails: options.storageFails === true, noObserver: options.noObserver === true });
  if (options.active) {
    const now = Math.floor(Date.now() / 1000) * 1000;
    const release = {
      startsAt: new Date(now - 60000).toISOString(),
      expiresAt: new Date(now + 3600000).toISOString(),
      releaseRef: 'ugc-kit-synthetic-browser-test', productEvidenceSha256: 'a'.repeat(64),
      ...options.release,
    };
    expect(script.split(sourceMarker)).toHaveLength(2);
    // In-memory test substitution only. No runtime query/environment activation.
    await page.route('http://127.0.0.1:4312/tools/ugc-rate/ugc-calculator.js', route => route.fulfill({
      contentType: 'application/javascript', body: script.replace(sourceMarker, `var UGC_KIT_RELEASE = ${JSON.stringify(release)};`),
    }));
  }
  await page.goto(routePath + '?campaign=SYNTHETIC_PRIVATE#SYNTHETIC_PRIVATE');
  return requests;
}
async function complete(page) {
  await page.locator('#baseFee').fill('100');
  await page.locator('#deliverables').fill('2');
  for (const [key, value] of Object.entries({productionCosts: '20', revisionsFee: '30', rawFootageFee: '40', usageRightsFee: '50', exclusivityFee: '60', rushFee: '70'})) {
    await page.locator('#' + key).fill(value);
  }
  await page.locator('#calculateBtn').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#quoteTotal')).toHaveText('$470.00');
}
async function offerEvents(page) {
  return page.evaluate(() => (window.dataLayer || []).map(row => Array.from(row)).filter(row => row[0] === 'event' && /^ugc_kit_offer_/.test(row[1])));
}
async function preventExternalNavigation(page) {
  // Observe a genuine user activation without opening a store or initiating payment.
  // This listener is registered after the product listener, so defaultPrevented
  // records whether product code blocked the link before the harness safely does.
  await page.locator('#ugcKitLink').evaluate(link => {
    window.fixtureOfferLinkDefaultPrevented = [];
    link.addEventListener('click', event => {
      window.fixtureOfferLinkDefaultPrevented.push(event.defaultPrevented);
      event.preventDefault();
    });
  });
}
async function linkPreventionStates(page) {
  return page.evaluate(() => window.fixtureOfferLinkDefaultPrevented || []);
}

for (const viewport of [{ width: 1280, height: 900 }, { width: 390, height: 844 }]) {
  test(`UGC real page, optional offer and free controls at ${viewport.width}px`, async ({ page, context }) => {
    await page.setViewportSize(viewport);
    const requests = await setup(page, context, { active: true });
    await expect(page.locator('#ugcKitOffer')).toBeHidden();
    await page.locator('#calculateBtn').click();
    await expect(page.locator('#ugcKitOffer')).toBeHidden(); // zero defaults alone do not qualify.
    await complete(page);
    await expect(page.locator('#ugcResults')).toBeFocused();
    await expect(page.locator('#ugcKitOffer')).toBeVisible();
    const link = page.locator('#ugcKitLink');
    await expect(link).toHaveAttribute('href', 'https://www.etsy.com/listing/4549759149/');
    await expect(link).toHaveAttribute('referrerpolicy', 'no-referrer');
    await expect(page.locator('#ugcNextStep')).toBeVisible();
    await expect(page.locator('#ugcKitOffer')).toContainText('remain free');
    await page.locator('#copyQuote').click();
    expect(await page.evaluate(() => window.fixtureClipboard[0])).toContain('Quote total: $470.00');
    await page.locator('.print-results-button').click();
    expect(await page.evaluate(() => window.fixturePrints)).toBe(1);
    await link.scrollIntoViewIfNeeded();
    await link.focus();
    await expect(link).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const audit = await new AxeBuilder({ page }).include('#ugcKitOffer').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
    expect(audit.violations.map(v => ({ id: v.id, targets: v.nodes.map(n => n.target) }))).toEqual([]);
    await page.locator('#baseFee').fill('-1');
    await expect(page.locator('#ugcKitOffer')).toBeHidden();
    await expect(page.locator('#copyQuote')).toBeDisabled();
    await complete(page);
    await expect(page.locator('#ugcKitOffer')).toBeVisible();
    expect(await offerEvents(page)).toEqual([]);
    expect(requests).toEqual([]);
  });
}
test('committed release stays off even with URL and storage activation attempts', async ({ page, context }) => {
  await setup(page, context);
  await page.evaluate(() => localStorage.setItem('UGC_KIT_RELEASE', 'true'));
  await complete(page);
  await expect(page.locator('#ugcKitOffer')).toHaveCount(0);
  expect(await offerEvents(page)).toEqual([]);
});
test('opted-in view and link click send only generic names once per document', async ({ page, context }) => {
  await setup(page, context, { active: true, choice: 'granted' });
  await expect.poll(() => page.evaluate(() => window.crcOfferAnalyticsReady())).toBe(true);
  await complete(page);
  await page.locator('#ugcKitOffer').scrollIntoViewIfNeeded();
  await expect.poll(() => offerEvents(page)).toEqual([['event', names[0]]]);
  await preventExternalNavigation(page);
  await page.locator('#ugcKitLink').click();
  await page.locator('#ugcKitLink').click();
  expect(await offerEvents(page)).toEqual([['event', names[0]], ['event', names[1]]]);
  const commands = await page.evaluate(() => JSON.stringify(window.dataLayer));
  expect(commands).not.toContain('SYNTHETIC_PRIVATE');
  expect(commands).not.toContain('$470.00');
  expect(commands).not.toContain('4549759149');
});
test('undecided use is not tracked or replayed after a later consent grant', async ({ page, context }) => {
  await setup(page, context, { active: true, choice: '' });
  await complete(page);
  await page.locator('#ugcKitOffer').scrollIntoViewIfNeeded();
  await page.waitForTimeout(1100);
  expect(await offerEvents(page)).toEqual([]);
  await preventExternalNavigation(page);
  await page.locator('#ugcKitLink').click();
  expect(await offerEvents(page)).toEqual([]);
  await page.getByRole('button', { name: 'Allow analytics', exact: true }).click();
  await page.locator('#ugcKitOffer').scrollIntoViewIfNeeded();
  await expect.poll(() => offerEvents(page)).toEqual([['event', names[0]]]);
  expect((await offerEvents(page)).some(row => row[1] === names[1])).toBe(false);
});
test('denied analytics leaves a trusted store link activation unblocked', async ({ page, context }) => {
  await setup(page, context, { active: true, choice: 'denied' });
  await complete(page);
  await preventExternalNavigation(page);
  await page.locator('#ugcKitLink').click();
  expect(await linkPreventionStates(page)).toEqual([false]);
  expect(await offerEvents(page)).toEqual([]);
  expect(page.url()).toContain('/tools/ugc-rate/');
});
test('withdrawal stops offer events but not the free tool or store link', async ({ page, context }) => {
  await setup(page, context, { active: true, choice: 'granted' });
  await complete(page);
  await page.locator('#ugcKitOffer').scrollIntoViewIfNeeded();
  await expect.poll(() => offerEvents(page)).toEqual([['event', names[0]]]);
  await page.getByRole('button', { name: 'Privacy choices', exact: true }).click();
  await page.getByRole('button', { name: 'Continue without analytics', exact: true }).click();
  await preventExternalNavigation(page);
  await page.locator('#ugcKitLink').click();
  expect(await linkPreventionStates(page)).toEqual([false]);
  expect(await offerEvents(page)).toEqual([['event', names[0]]]);
  await expect(page.locator('#copyQuote')).toBeEnabled();
});
for (const [label, options] of Object.entries({ gpc: { gpc: true }, storageFailure: { storageFails: true }, tagFailure: { loaderFails: true } })) {
  test(`no offer events for ${label}`, async ({ page, context }) => {
    await setup(page, context, { active: true, choice: 'granted', ...options });
    await complete(page);
    await page.locator('#ugcKitOffer').scrollIntoViewIfNeeded();
    await preventExternalNavigation(page);
    await page.locator('#ugcKitLink').click();
    expect(await offerEvents(page)).toEqual([]);
    await expect(page.locator('#quoteTotal')).toHaveText('$470.00');
  });
}
test('invalid release records leave the offer unavailable', async ({ page, context }) => {
  await setup(page, context, { active: true, release: { productEvidenceSha256: null } });
  await complete(page);
  await expect(page.locator('#ugcKitOffer')).toHaveCount(0);
});
test('expiry revalidation cancels a stale link activation', async ({ page, context }) => {
  await setup(page, context, { active: true, choice: 'granted' });
  await complete(page);
  await expect(page.locator('#ugcKitLink')).toBeVisible();
  // Change the clock and dispatch within one task: the expiry observer cannot
  // hide the link between these steps. This is an explicitly synthetic event,
  // testing cancellation, not evidence of a native store navigation or purchase.
  const cancelled = await page.locator('#ugcKitLink').evaluate(link => {
    Date.now = () => Date.parse('2099-01-01T00:00:00Z');
    return !link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
  });
  expect(cancelled).toBe(true);
  await expect(page.locator('#ugcKitOffer')).toBeHidden();
  await expect(page.locator('#ugcKitLink')).not.toHaveAttribute('href');
  expect(page.url()).toContain('/tools/ugc-rate/');
});
test('resuming an expired page hides the offer without any link activation', async ({ page, context }) => {
  await setup(page, context, { active: true, choice: 'denied' });
  await complete(page);
  await expect(page.locator('#ugcKitOffer')).toBeVisible();
  await page.evaluate(() => {
    Date.now = () => Date.parse('2099-01-01T00:00:00Z');
    window.dispatchEvent(new Event('pageshow'));
  });
  await expect(page.locator('#ugcKitOffer')).toBeHidden();
  await expect(page.locator('#ugcKitLink')).not.toHaveAttribute('href');
  expect(await offerEvents(page)).toEqual([]);
});
test('absent visibility observer does not fabricate a passive view', async ({ page, context }) => {
  await setup(page, context, { active: true, choice: 'granted', noObserver: true });
  await expect.poll(() => page.evaluate(() => window.crcOfferAnalyticsReady())).toBe(true);
  await complete(page);
  await page.waitForTimeout(1100);
  expect(await offerEvents(page)).toEqual([]);
  await preventExternalNavigation(page);
  await page.locator('#ugcKitLink').click();
  expect(await offerEvents(page)).toEqual([['event', names[0]], ['event', names[1]]]);
});
