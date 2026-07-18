import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
let failures = 0;
const pass = (condition, message) => {
  console.log(`${condition ? "PASS" : "FAIL"} ${message}`);
  if (!condition) failures += 1;
};
const read = (relative) => fs.readFileSync(path.join(root, relative), "utf8");
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  if ([".git", "blog", "content", "node_modules", "scripts"].includes(entry.name)) return [];
  const absolute = path.join(dir, entry.name);
  return entry.isDirectory() ? walk(absolute) : [absolute];
});

const publicFiles = [
  ...walk(root).filter((file) => /\.(html|js|css)$/.test(file)),
  path.join(root, "vercel.json"),
];
const publicText = publicFiles.map((file) => fs.readFileSync(file, "utf8")).join("\n");
const sitemap = read("sitemap.xml");
const privacy = read("privacy.html");
const cookies = read("cookies.html");
const affiliateDisclosure = read("affiliate-disclosure.html");
const vercel = read("vercel.json");
const vercelConfig = JSON.parse(vercel);
const siteStyles = read("assets/css/style.css");
const mobileStyles = siteStyles.slice(
  siteStyles.indexOf("@media (max-width: 768px)"),
  siteStyles.indexOf("@media (max-width: 480px)"),
);
const themeScript = read("assets/js/theme.js");
const printStyles = read("assets/css/print-results.css");
const home = read("index.html");
const mainScript = read("assets/js/main.js");
const podcastPage = read("tools/podcast-revenue/index.html");
const podcastScript = read("tools/podcast-revenue/podcast-calculator.js");
const patreonPage = read("tools/patreon-revenue/index.html");
const patreonScript = read("tools/patreon-revenue/patreon-calculator.js");

pass(!/(adsbygoogle|adsense-container|googlesyndication|googletagmanager|google-analytics|clarity\.ms|Cookiebot|G-144KWSY4TP)/i.test(publicText), "ads and tracking are absent from public product pages and deployment policy");
pass(!/(cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net)/i.test(publicText), "calculator code and presentation assets are served from the site itself");
pass(!/email-capture|Email me my revenue projection/i.test(publicText), "nonfunctional email collection UI is absent");
pass(!/AIza[0-9A-Za-z_-]{30,}/.test(publicText), "no browser API credential is published");
pass(!fs.existsSync(path.join(root, "tools/youtube-ad-revenue/channel-lookup.js")), "unmetered public YouTube API integration is removed");
pass(!fs.existsSync(path.join(root, "scripts/build-blog.mjs")) && !fs.existsSync(path.join(root, ".github/workflows/build-blog.yml")), "retired article archive cannot be republished automatically");
pass((sitemap.match(/<url>/g) || []).length === 21, "sitemap contains the 13 calculators and eight current core pages");
pass(!sitemap.includes("/blog/"), "retired articles are absent from the sitemap");
pass(!sitemap.includes("/guide/"), "unverified paid guide is absent from the sitemap");
pass(sitemap.includes("/affiliate-disclosure.html"), "affiliate disclosure is publicly discoverable");
pass(
  vercelConfig.redirects?.filter((redirect) => redirect.source.startsWith("/blog") && redirect.destination === "/#tools").length === 4,
  "retired article routes with and without trailing slashes permanently redirect to calculators",
);
pass(
  vercelConfig.redirects?.filter((redirect) => redirect.source.startsWith("/guide") && redirect.destination === "/#tools").length === 3,
  "unverified paid guide routes permanently redirect to the free calculators",
);
pass(vercelConfig.outputDirectory === ".", "Vercel publishes the static site root instead of the verification-files directory");
pass(vercel.includes("frame-src 'none'"), "production policy blocks third-party frames");
pass(!fs.existsSync(path.join(root, "llms-full.txt")) && !read("llms.txt").includes("/blog/"), "AI discovery does not promote the retired article archive");
pass(/has not been approved by Google AdSense/i.test(privacy), "privacy notice accurately states AdSense status");
pass(/Google Analytics and Microsoft Clarity are disabled/i.test(privacy), "privacy notice accurately states analytics status");
pass(/does not intentionally set advertising or analytics cookies/i.test(cookies), "cookie notice accurately states current behavior");
pass(affiliateDisclosure.includes("As an Amazon Associate, we earn from qualifying purchases"), "Amazon Associates relationship is plainly disclosed");
pass(!/AdSense (?:typically )?represents (?:only )?30 to 50 percent/i.test(publicText), "homepage does not invent a universal AdSense revenue mix");
pass(!/brand sponsorships \(\$500 to \$50,000\+/i.test(publicText), "homepage does not publish an unsupported sponsorship range");
pass(!/sponsorship rates typically range from \$10 to \$50/i.test(publicText), "homepage does not publish an unsupported sponsorship CPM");
pass(indexOfOfficialEarningsOverview(), "homepage links the official YouTube earnings authority");
pass(["favicon.svg", "logo.png", "og-image.png"].every((file) => fs.existsSync(path.join(root, "assets/images", file))), "favicon, logo, and social sharing artwork exist");
pass(read("tools/affiliate-calculator/affiliate-calculator.js").includes("adjustedMonthlyCommissions = monthlyCommissions"), "affiliate revenue is not multiplied by the number of programs");
pass(read("tools/instagram-revenue/instagram-calculator.js").includes("return 0"), "Instagram calculator does not invent a universal Reels payout");
pass(read("tools/twitch-revenue/twitch-calculator.js").includes("bitsPerMonth * 0.01"), "Twitch Bits use the published one-cent-per-Bit creator baseline");
pass(/\.about-stats\s*{\s*grid-template-columns:\s*1fr;\s*}/.test(mobileStyles), "homepage trust statistics collapse to one column on phones");
pass(/\.stat-content\s*{[^}]*min-width:\s*0;/s.test(siteStyles), "homepage statistic text can shrink without forcing horizontal scrolling");
pass((publicText.match(/class="results-card"/g) || []).length === 13, "all 13 calculator result cards remain present");
pass(themeScript.includes("Print Results") && themeScript.includes("window.print()"), "calculator result cards expose browser printing");
pass(themeScript.includes("data-printable-results") && printStyles.includes("body:has([data-printable-results]) *"), "print output is isolated to calculator results");
pass(printStyles.includes(".copy-result") && printStyles.includes(".share-buttons"), "print output excludes copy and sharing controls");
pass(!mainScript.includes("card.style.opacity = '0'"), "homepage calculator cards remain visible without scroll-triggered JavaScript");
pass(!/Free, accurate revenue calculators|real 2026 data from actual creators|Always free/.test(home), "homepage avoids unsupported accuracy, sourcing, and future-price claims");
pass(podcastPage.includes('id="sponsorCpm"') && podcastPage.includes('value="0"'), "podcast calculator excludes direct sponsorship revenue by default");
pass(podcastPage.includes('id="adCpm"') && podcastPage.includes('id="creatorShare"'), "podcast calculator asks for explicit contract CPM and creator share inputs");
pass(!podcastScript.includes("nicheRates") && !podcastScript.includes("updateRevenueSplitVisualization"), "podcast calculator does not invent niche rates or access a missing split chart");
pass(podcastScript.includes("monthlyAdSlots = slotsPerEpisode * episodesPerMonth"), "podcast per-slot output uses the monthly number of ad placements");
pass(patreonPage.includes('<option value="standard" selected="">Standard, 10% (new creators)</option>'), "Patreon calculator defaults new creators to the current 10% standard plan");
pass(!/Starter|Premium|12% platform fee|15% platform fee/.test(patreonPage), "Patreon page does not present discontinued plan tiers as current");
pass(patreonScript.includes("standard: { label: 'Standard', rate: 0.10, legacy: false }") && patreonScript.includes("price <= 3"), "Patreon calculator distinguishes standard and eligible legacy fee models");
pass(patreonScript.includes("standardRate: 0.029") && patreonScript.includes("standardRate: 0.039"), "Patreon calculator models documented USD processing profiles");
pass(patreonPage.includes("Creator-fees-overview") || patreonPage.includes("Creator-fees-overview".toLowerCase()), "Patreon calculator cites the official creator fee source");
for (let tier = 1; tier <= 4; tier += 1) {
  pass(patreonPage.includes(`id="tierName${tier}" aria-label="Tier ${tier} name"`), `Patreon tier ${tier} name has an accessible name`);
  pass(patreonPage.includes(`id="tierPrice${tier}" aria-label="Tier ${tier} monthly price in dollars"`), `Patreon tier ${tier} price has an accessible name`);
  pass(patreonPage.includes(`id="tierPatrons${tier}" aria-label="Tier ${tier} patron count"`), `Patreon tier ${tier} patron count has an accessible name`);
}

for (const file of publicFiles.filter((file) => file.endsWith(".html"))) {
  const html = fs.readFileSync(file, "utf8");
  const mainEnd = html.lastIndexOf("</main>");
  const footerStart = html.indexOf("<footer");
  pass(mainEnd === -1 || footerStart === -1 || mainEnd < footerStart, `${path.relative(root, file)} keeps the site footer outside main content`);
  if (/<html[\s>]/i.test(html)) pass(/href="\/assets\/images\/favicon\.svg"/i.test(html), `${path.relative(root, file)} declares the local favicon`);
  for (const match of html.matchAll(/(?:href|src)="(\/[^"#]+)"/g)) {
    const requestPath = match[1].split(/[?#]/)[0];
    const localPath = requestPath === "/"
      ? "index.html"
      : requestPath.endsWith("/")
        ? `${requestPath.slice(1)}index.html`
        : requestPath.slice(1);
    pass(fs.existsSync(path.join(root, localPath)), `${path.relative(root, file)} local reference ${requestPath} resolves`);
  }
  for (const match of html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)) {
    let valid = true;
    try { JSON.parse(match[1]); } catch { valid = false; }
    pass(valid, `${path.relative(root, file)} contains valid JSON-LD`);
  }
}

if (failures) process.exit(1);
console.log("\nAll product quality checks passed.");

function indexOfOfficialEarningsOverview() {
  return read("index.html").includes("https://support.google.com/youtube/answer/72902");
}
