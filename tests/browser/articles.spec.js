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

for (const route of ['/articles/', '/articles/patreon-income-tracker/']) {
  for (const theme of ['light', 'dark']) {
    test(`${route} is mobile-safe and accessible in ${theme} mode`, async ({ page }) => {
      await page.addInitScript(selectedTheme => localStorage.setItem('theme', selectedTheme), theme);
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(route);

      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('main')).toBeVisible();
      await page.evaluate(async () => {
        await Promise.all(document.getAnimations()
          .filter(animation => animation.effect?.getComputedTiming().iterations !== Infinity)
          .map(animation => animation.finished.catch(() => {})));
      });
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
}

test('article hub exposes one reviewed guide and the maintained calculator directory', async ({ page }) => {
  await page.goto('/articles/');
  await expect(page.getByRole('link', { name: 'Patreon Income Tracker: A Monthly Reconciliation Guide' })).toHaveAttribute('href', '/articles/patreon-income-tracker/');
  await expect(page.getByRole('link', { name: 'free calculator directory' })).toHaveAttribute('href', '/#tools');
  await expect(page.locator('main')).toContainText('They do not publish hidden benchmarks, fabricated earnings, or guarantees.');
});

test('Patreon tracker guide keeps records, scenarios, sources, and privacy limits distinct', async ({ page, request }) => {
  await page.goto('/articles/patreon-income-tracker/');

  await expect(page.locator('.article-answer')).toContainText('record actual gross membership revenue');
  await expect(page.locator('[data-synthetic-example="true"]')).toContainText('not a benchmark');
  await expect(page.locator('#sources [data-source-id]')).toHaveCount(4);
  await expect(page.getByRole('link', { name: 'Download the blank CSV' })).toHaveAttribute('href', '/downloads/patreon-income-tracker.csv');
  await expect(page.getByRole('link', { name: 'Open the Patreon calculator' })).toHaveAttribute('href', '/tools/patreon-revenue/');
  await expect(page.locator('.article-disclaimer')).toContainText('not financial or tax advice');

  const tracker = await request.get('/downloads/patreon-income-tracker.csv');
  expect(tracker.ok()).toBe(true);
  expect(await tracker.text()).toContain('gross_membership_revenue');

  const jsonLd = await page.locator('script[type="application/ld+json"]').allTextContents();
  const nodes = jsonLd.map(value => JSON.parse(value));
  const article = nodes.find(node => node['@type'] === 'Article');
  expect(article).toMatchObject({
    headline: 'Patreon Income Tracker: A Monthly Reconciliation Guide',
    datePublished: '2026-09-07',
    dateModified: '2026-09-07',
    isAccessibleForFree: true,
  });
});

test('article mobile navigation opens with keyboard-safe destinations', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto('/articles/patreon-income-tracker/');

  const menu = page.locator('.mobile-menu-toggle');
  await expect(menu).toHaveAttribute('aria-label', 'Open navigation');
  const menuContrast = await menu.evaluate((button) => {
    const parse = value => (value.match(/[\d.]+/g) || []).slice(0, 3).map(Number);
    const luminance = value => {
      const channels = parse(value).map(channel => {
        const normalized = channel / 255;
        return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
    };
    const foreground = luminance(getComputedStyle(button).color);
    const background = luminance(getComputedStyle(document.querySelector('.navbar')).backgroundColor);
    return (Math.max(foreground, background) + 0.05) / (Math.min(foreground, background) + 0.05);
  });
  expect(menuContrast).toBeGreaterThanOrEqual(4.5);
  await menu.focus();
  await page.keyboard.press('Enter');
  await expect(menu).toHaveAttribute('aria-expanded', 'true');
  await expect(menu).toHaveAttribute('aria-label', 'Close navigation');
  const primaryNavigation = page.getByRole('navigation', { name: 'Primary navigation' });
  await expect(primaryNavigation.getByRole('link', { name: 'Articles', exact: true })).toBeVisible();
  await expect(primaryNavigation.getByRole('link', { name: 'About', exact: true })).toBeVisible();
  await expect(primaryNavigation.getByRole('link', { name: 'Contact', exact: true })).toBeVisible();
  const linksFitViewport = await primaryNavigation.locator('.nav-menu a').evaluateAll((links) => links.every((link) => {
    const rect = link.getBoundingClientRect();
    return rect.left >= 0 && rect.right <= window.innerWidth && rect.height >= 44;
  }));
  expect(linksFitViewport).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
