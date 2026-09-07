import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => {
    localStorage.setItem('creatorrevenuecalculator:analytics-consent', 'denied');
  });
  await context.route('**/*', route => (
    new URL(route.request().url()).hostname === '127.0.0.1'
      ? route.continue()
      : route.abort()
  ));
});

for (const scenario of [
  { name: 'mobile light', theme: 'light', width: 390, height: 844 },
  { name: 'mobile dark', theme: 'dark', width: 390, height: 844 },
  { name: 'desktop light', theme: 'light', width: 1280, height: 900 },
  { name: 'desktop dark', theme: 'dark', width: 1280, height: 900 },
]) {
  test(`recommended products is accessible in ${scenario.name}`, async ({ page }) => {
    await page.addInitScript(selectedTheme => localStorage.setItem('theme', selectedTheme), scenario.theme);
    await page.setViewportSize({ width: scenario.width, height: scenario.height });
    await page.goto('/recommended-products/');

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Recommended Products and Tools for Creators');
    await expect(page.locator('[data-recommendation-card]')).toHaveCount(32);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(results.violations.map(violation => ({
      id: violation.id,
      targets: violation.nodes.map(node => node.target),
    }))).toEqual([]);
  });
}

test('filters all static options locally without truncating the catalog', async ({ page }) => {
  await page.goto('/recommended-products/');

  const cards = page.locator('[data-recommendation-card]');
  await expect(cards).toHaveCount(32);
  await expect(page.locator('[data-recommendation-card]:visible')).toHaveCount(32);

  await page.getByRole('button', { name: 'Hardware', exact: true }).click();
  await expect(page.locator('[data-recommendation-card]:visible')).toHaveCount(20);
  await expect(page.locator('#filter-status')).toHaveText('Showing 20 of 32 options.');

  for (const category of ['Audio', 'Video', 'Lighting', 'Mounts', 'Storage', 'Power']) {
    await page.getByRole('button', { name: category, exact: true }).click();
    expect(await page.locator('[data-recommendation-card]:visible').count()).toBeGreaterThanOrEqual(2);
  }

  await page.getByRole('button', { name: 'Software', exact: true }).click();
  await expect(page.locator('[data-recommendation-card]:visible')).toHaveCount(12);

  await page.getByLabel('Search the catalog').fill('newsletter');
  await expect(page.locator('[data-recommendation-card]:visible')).toHaveCount(2);

  await page.getByLabel('Search the catalog').fill('not-a-real-catalog-item');
  await expect(page.locator('[data-recommendation-card]:visible')).toHaveCount(0);
  await expect(page.locator('#no-filter-results')).toBeVisible();

  await page.getByRole('button', { name: 'Clear', exact: true }).click();
  await expect(page.locator('[data-recommendation-card]:visible')).toHaveCount(32);
});

test('paid and direct destinations remain visibly and technically distinct', async ({ page }) => {
  await page.goto('/recommended-products/');

  const paidLinks = page.locator('.recommendation-cta.paid-link');
  const directLinks = page.locator('.recommendation-cta.direct-link');
  await expect(paidLinks).toHaveCount(21);
  await expect(directLinks).toHaveCount(11);
  await expect(page.getByText('As an Amazon Associate I earn from qualifying purchases.', { exact: false })).toBeVisible();
  await expect(page.getByText('All other software links are not affiliate links today.', { exact: false })).toBeVisible();

  for (const link of await paidLinks.all()) {
    const rel = (await link.getAttribute('rel') || '').split(/\s+/);
    expect(rel).toEqual(expect.arrayContaining(['nofollow', 'sponsored', 'noopener', 'noreferrer']));
    expect(await link.textContent()).toContain('paid link');
    const url = new URL(await link.getAttribute('href'));
    if (url.hostname === 'www.amazon.com') {
      expect(url.searchParams.getAll('tag')).toHaveLength(1);
      expect(url.searchParams.get('tag')).not.toBe('');
    } else {
      expect(url.hostname).toBe('vidiq.com');
      expect(url.pathname).not.toBe('/');
      expect(url.search).toBe('');
    }
  }

  for (const link of await directLinks.all()) {
    const rel = (await link.getAttribute('rel') || '').split(/\s+/);
    expect(rel).not.toEqual(expect.arrayContaining(['nofollow', 'sponsored']));
    expect(rel).toEqual(expect.arrayContaining(['noopener', 'noreferrer']));
    expect(await link.textContent()).toContain('non-affiliate link');
    expect(new URL(await link.getAttribute('href')).search).toBe('');
  }
});

test('the catalog is complete and readable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4312/recommended-products/');

  await expect(page.locator('[data-recommendation-card]')).toHaveCount(32);
  await expect(page.locator('[data-recommendation-card]:visible')).toHaveCount(32);
  await expect(page.locator('.recommended-filter')).toBeHidden();
  await context.close();
});

test('catalog load is privacy-safe before any outbound link is chosen', async ({ browser }) => {
  const context = await browser.newContext();
  const externalRequests = [];
  await context.addInitScript(() => {
    localStorage.setItem('creatorrevenuecalculator:analytics-consent', 'denied');
  });
  const page = await context.newPage();
  page.on('request', request => {
    if (new URL(request.url()).hostname !== '127.0.0.1') externalRequests.push(request.url());
  });
  await page.goto('http://127.0.0.1:4312/recommended-products/');
  await page.waitForLoadState('networkidle');
  expect(externalRequests).toEqual([]);
  await context.close();
});
