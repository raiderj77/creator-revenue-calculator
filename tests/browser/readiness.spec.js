import fs from 'node:fs';
import { test, expect } from '@playwright/test';
const routes = [...fs.readFileSync('sitemap.xml','utf8').matchAll(/<loc>https:\/\/creatorrevenuecalculator.com([^<]+)<\/loc>/g)].map(m=>m[1]);
test('all maintained routes keep navigation, verification and consent safe', async ({ browser }) => {
  test.setTimeout(120000);
  for (const route of routes) {
    const context = await browser.newContext({ viewport:{width:390,height:844} });
    const page = await context.newPage();
    const errors=[]; const trackers=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
    await context.route('**/*',r=>{
      const u=new URL(r.request().url());
      if(/googletagmanager|google-analytics|googlesyndication|doubleclick/.test(u.hostname))trackers.push(u.hostname);
      return u.hostname==='127.0.0.1'?r.continue():r.abort();
    });
    await page.goto(route);
    await expect(page.locator('meta[name="google-adsense-account"]')).toHaveAttribute('content','ca-pub-7171402107622932');
    await expect(page.locator('footer a[href^="/tools/"]')).toHaveCount(12);
    await expect(page.locator('.navbar a[href="/articles/"]')).toHaveCount(1);
    await page.getByRole('button',{name:'Continue without analytics'}).click();
    await page.getByRole('button',{name:'Open navigation'}).click();
    await expect(page.locator('.navbar a[href="/articles/"]')).toBeVisible();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),route).toBe(true);
    expect(trackers,route).toEqual([]);
    expect(errors,route).toEqual([]);
    if(route==='/articles/youtube-partner-program-2027/')await page.screenshot({path:'test-results/youtube-2027-mobile.png',fullPage:true});
    await context.close();
  }
});
