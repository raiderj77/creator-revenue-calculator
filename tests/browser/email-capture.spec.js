import { test, expect } from '@playwright/test';
import fs from 'node:fs';

const emailCaptureTemplate = fs.readFileSync('assets/js/email-capture.js', 'utf8');
const beehiivEmbedToken = '__NEXT_PUBLIC_BEEHIIV_EMBED_URL__';
const beehiivEmbedUrl = 'https://subscribe-forms.beehiiv.com/v3/forms/93dec953-d143-4aec-bd65-eb8e9570c42e';
const flagOffScript = emailCaptureTemplate.replace(beehiivEmbedToken, '');
const configuredScript = emailCaptureTemplate.replace(beehiivEmbedToken, beehiivEmbedUrl);

async function serveEmailCapture(page, script) {
    await page.route('**/assets/js/email-capture.js', (route) => route.fulfill({
        contentType: 'application/javascript',
        body: script,
    }));
}

for (const width of [320, 1280]) {
    test(`built homepage capture is inert at ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await serveEmailCapture(page, flagOffScript);
        const externalRequests = [];
        page.on('request', (request) => {
            if (!request.url().startsWith('http://127.0.0.1:4312/')) externalRequests.push(request.url());
        });
        await page.goto('/', { waitUntil: 'networkidle' });
        const block = page.locator('[data-email-capture]');
        await expect(block).toHaveCount(0);
        await expect(page.locator('iframe')).toHaveCount(0);
        expect(externalRequests).toEqual([]);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    });
}

for (const path of ['/', '/tools/patreon-revenue/', '/tools/stan-store-calculator/']) {
    test(`built capture renders configured Beehiiv form on ${path}`, async ({ page }) => {
        await page.setViewportSize({ width: 1280, height: 900 });
        await serveEmailCapture(page, configuredScript);
        await page.goto(path, { waitUntil: 'networkidle' });
        const iframe = page.locator('[data-email-capture] iframe');
        await expect(iframe).toHaveCount(1);
        await expect(iframe).toBeVisible();
        await expect(iframe).toHaveAttribute('src', beehiivEmbedUrl);
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
