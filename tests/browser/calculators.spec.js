import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test.beforeEach(async ({ context }) => {
  await context.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort());
});
for (const route of ['/tools/youtube-ad-revenue/', '/tools/patreon-revenue/', '/tools/newsletter-revenue/']) {
  test(`delayed icon fonts preserve layout and the page stays small: ${route}`, async ({ page }) => {
    await page.setViewportSize({width:412,height:823});
    await page.route('http://127.0.0.1:4312/**/*.woff2', async route => {
      await new Promise(resolve => setTimeout(resolve,400));
      await route.continue();
    });
    await page.addInitScript(() => {
      window.fixtureLayoutShift=0;
      new PerformanceObserver(list => { for(const entry of list.getEntries()) if(!entry.hadRecentInput) window.fixtureLayoutShift+=entry.value; }).observe({type:'layout-shift',buffered:true});
    });
    await page.goto(route);
    await page.evaluate(async () => { await document.fonts.ready; await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))); });
    expect(await page.evaluate(()=>window.fixtureLayoutShift)).toBeLessThanOrEqual(0.1);
    const bytes=await page.evaluate(()=>[...performance.getEntriesByType('navigation'),...performance.getEntriesByType('resource')].reduce((total,entry)=>total+entry.encodedBodySize,0));
    expect(bytes).toBeLessThan(500000);
    await expect(page.getByRole('button',{name:'Continue without analytics'})).toBeFocused();
  });
  test(`mobile accessibility and readable disclosure: ${route}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);
    await expect(page.locator('h1')).toBeVisible();
    await page.evaluate(async () => { await Promise.all(document.getAnimations().filter(a => a.effect?.getComputedTiming().iterations !== Infinity).map(a => a.finished.catch(() => {}))); });
    const result = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']).analyze();
    expect(result.violations.map(v => ({ id:v.id, targets:v.nodes.map(n => n.target) }))).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.locator('body')).toContainText(/estimate|scenario|illustrative/i);
  });
}
test('YouTube calculation, rounding, upper bounds, empty and negative input, keyboard and reset', async ({ page }) => {
  await page.goto('/tools/youtube-ad-revenue/');
  const views=page.locator('#views'), rate=page.locator('#ad-revenue-per-thousand');
  await views.fill('1000'); await rate.fill('2.35');
  await page.locator('#calculate-btn').focus(); await page.keyboard.press('Enter');
  await expect(page.locator('#monthly-revenue')).toHaveText('$2.35');
  await expect(page.locator('#annual-earnings')).toHaveText('$28.20');
  await expect(page.locator('#youtubeResults')).toBeFocused();
  for (const invalid of ['', '-1000', '1000000001']) {
    await views.fill(invalid); await page.locator('#calculate-btn').click();
    await expect(views).toHaveAttribute('aria-invalid','true');
    await expect(page.locator('#youtubeFormStatus')).not.toHaveText('');
  }
  await views.fill('1000000000'); await rate.fill('100000');
  await page.locator('#calculate-btn').click();
  await expect(page.locator('#monthly-revenue')).toHaveText('$100,000,000,000.00');
  await page.locator('#reset-btn').click();
  await expect(page.locator('#monthly-revenue')).toHaveText('$0.00');
});
test('Patreon visible USD fee assumptions reconcile gross, fees and annual amount', async ({ page }) => {
  await page.goto('/tools/patreon-revenue/');
  for (let i=1;i<=4;i++) {
    await page.locator('#tierPrice'+i).fill(i===1?'10':'0');
    await page.locator('#tierPatrons'+i).fill(i===1?'10':'0');
  }
  await page.locator('#plan').selectOption('standard');
  await page.locator('#processingProfile').selectOption('card');
  await page.locator('#tierPatrons1').press('Tab');
  await expect(page.locator('#grossMonthly')).toHaveText('$100.00');
  await expect(page.locator('#platformFee')).toContainText('10.00');
  await expect(page.locator('#processingFee')).toContainText('5.90');
  await expect(page.locator('#netMonthly')).toHaveText('$84.10');
  await expect(page.locator('#netAnnual')).toHaveText('$1,009.20');
  await page.locator('#tierPatrons1').fill('-1');
  await page.locator('#tierPatrons1').press('Tab');
  await expect(page.locator('#calculatorValidationStatus')).not.toHaveText('');
});

test('cross-platform results provide a privacy-safe blank tracker next step', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/tools/social-media-earnings-estimator/');
  await page.getByRole('button', { name: 'Continue without analytics' }).click();
  await expect(page.locator('#crc-analytics-choices')).toBeHidden();
  const tracker = page.getByRole('link', { name: 'Download the blank Creator Revenue Tracker' });
  await expect(tracker).toHaveAttribute('href', '/downloads/creator-revenue-tracker.xlsx');
  await expect(tracker).toHaveAttribute('download', 'creator-revenue-tracker.xlsx');
  await expect(page.locator('.result-next-step')).toContainText('Keep the scenario separate from actual income.');

  await page.locator('.scenario-platform').selectOption('YouTube');
  await page.locator('.scenario-type').selectOption('direct');
  await page.locator('.scenario-direct').fill('400');
  await page.locator('#calculateScenarios').click();
  await expect(page.locator('#monthlyTotal')).toHaveText('$400.00');
  await expect(page.locator('#scenarioResults')).toBeFocused();
  const focusedResultClearsStickyNav = await page.evaluate(() => {
    const navigation = document.querySelector('.navbar').getBoundingClientRect();
    const results = document.querySelector('#scenarioResults').getBoundingClientRect();
    return results.top >= navigation.bottom;
  });
  expect(focusedResultClearsStickyNav).toBe(true);
});
