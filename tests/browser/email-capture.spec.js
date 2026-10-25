import fs from 'node:fs';
import { test, expect } from '@playwright/test';

const embedUrl = 'https://subscribe-forms.beehiiv.com/v3/forms/93dec953-d143-4aec-bd65-eb8e9570c42e';
const configuredScript = fs.readFileSync('assets/js/email-capture.js', 'utf8');
const flagOffScript = configuredScript.replace(
    /const BEEHIIV_EMBED_URL = ".*";/,
    'const BEEHIIV_EMBED_URL = "";',
);

for (const width of [320, 1280]) {
    test(`built homepage capture is inert at ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        const externalRequests = [];
        page.on('request', (request) => {
            if (!request.url().startsWith('http://127.0.0.1:4312/')) externalRequests.push(request.url());
        });
        await page.route('**/assets/js/email-capture.js', async (route) => {
            await route.fulfill({ contentType: 'application/javascript', body: flagOffScript });
        });
        await page.goto('/', { waitUntil: 'networkidle' });
        const block = page.locator('[data-email-capture]');
        await expect(block).toHaveCount(0);
        await expect(page.locator('iframe')).toHaveCount(0);
        expect(externalRequests).toEqual([]);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    });
}

test('built homepage capture stays hidden without JavaScript', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 900 } });
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:4312/');
    await expect(page.locator('[data-email-capture]')).toBeHidden();
    await expect(page.locator('iframe')).toHaveCount(0);
    await context.close();
});

for (const route of ['/', '/tools/patreon-revenue/', '/tools/stan-store-calculator/']) {
    test(`built ${route} capture uses the configured Beehiiv form on desktop`, async ({ page }) => {
        await page.setViewportSize({ width: 1280, height: 900 });
        await page.goto(route, { waitUntil: 'domcontentloaded' });
        const iframe = page.locator('[data-email-capture] iframe');
        await expect(iframe).toHaveAttribute('src', embedUrl);
        await expect(iframe).toBeVisible();
    });
}
