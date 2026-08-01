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
const sponsorshipPage = read("tools/sponsorship-rate/index.html");
const sponsorshipScript = read("tools/sponsorship-rate/sponsorship-calculator.js");
const youtubePage = read("tools/youtube-ad-revenue/index.html");
const youtubeScript = read("tools/youtube-ad-revenue/youtube-calculator.js");

pass(!/(adsbygoogle|adsense-container|googlesyndication|clarity\.ms|Cookiebot|G-144KWSY4TP)/i.test(publicText), "unapproved ads, legacy analytics, and session replay are absent from public product pages");
pass(themeScript.includes("analytics-consent") && themeScript.includes("send_page_view: false"), "Google Analytics is controlled by the shared opt-in manager");
pass(
  themeScript.includes("navigator.globalPrivacyControl === true")
    && themeScript.includes("if (globalPrivacyControlIsActive()) choice = 'denied'")
    && themeScript.includes("if (!gpcActive) actions.appendChild(allow)"),
  "Global Privacy Control overrides saved analytics consent and removes the allow action",
);
pass(themeScript.includes("window.location.pathname") && !themeScript.includes("window.location.search"), "analytics page views exclude URL query strings");
pass(!/input\.value|FormData|resultCards/.test(themeScript.slice(themeScript.indexOf("var measurementId"))), "analytics cannot read calculator inputs or results");
pass(/googletagmanager\.com/.test(vercel) && /google-analytics\.com/.test(vercel), "production policy allows only the approved analytics hosts");
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
const searchIntentRedirects = {
  "/blog/how-much-do-patreon-creators-make-2026": "/tools/patreon-revenue/",
  "/blog/how-much-do-youtubers-with-100k-subscribers-make.html": "/tools/youtube-ad-revenue/",
  "/blog/how-much-do-newsletter-writers-make": "/tools/newsletter-revenue/",
  "/blog/how-much-do-tiktok-creators-make-2026": "/tools/tiktok-revenue/",
};
for (const [source, destination] of Object.entries(searchIntentRedirects)) {
  const redirectIndex = vercelConfig.redirects?.findIndex((redirect) => redirect.source === source && redirect.destination === destination && redirect.permanent === true) ?? -1;
  const fallbackIndex = vercelConfig.redirects?.findIndex((redirect) => redirect.source === "/blog/:path*") ?? -1;
  pass(redirectIndex >= 0 && redirectIndex < fallbackIndex, `${source} permanently redirects to its maintained calculator before the generic blog fallback`);
}
pass(
  vercelConfig.redirects?.filter((redirect) => redirect.source.startsWith("/guide") && redirect.destination === "/#tools").length === 3,
  "unverified paid guide routes permanently redirect to the free calculators",
);
pass(vercelConfig.outputDirectory === ".", "Vercel publishes the static site root instead of the verification-files directory");
pass(vercel.includes("frame-src 'none'"), "production policy blocks third-party frames");
pass(!fs.existsSync(path.join(root, "llms-full.txt")) && !read("llms.txt").includes("/blog/"), "AI discovery does not promote the retired article archive");
pass(/has not been approved by Google AdSense/i.test(privacy), "privacy notice accurately states AdSense status");
pass(/Google Analytics is optional and remains blocked until you explicitly allow it/i.test(privacy), "privacy notice accurately states analytics status");
pass(/script is not downloaded/i.test(cookies), "cookie notice accurately states denied-consent behavior");
pass(affiliateDisclosure.includes("As an Amazon Associate, we earn from qualifying purchases"), "Amazon Associates relationship is plainly disclosed");
pass(!publicText.includes("tag=ytearnings-20"), "creator pages do not reuse FiberTools' Amazon tracking ID");
pass((publicText.match(/tag=creatorcalc-20/g) || []).length === 26, "all 26 creator-equipment links use the dedicated Amazon tracking ID");
for (const retiredAsin of ["B07NQKQN7H", "B086T4KMNX", "B08F7PTF53"]) {
  pass(!publicText.includes(retiredAsin), `retired Amazon product ${retiredAsin} is not linked`);
}
for (const currentAsin of ["B00N1YPXW2", "B085TFF7M1", "B01LXDNNBW"]) {
  pass(youtubePage.includes(currentAsin), `verified Amazon product ${currentAsin} remains linked from the YouTube tool`);
}
for (const retiredUrl of ["elgato.com/en/partner", "nzxt.com/partner"]) {
  pass(!publicText.includes(retiredUrl), `retired external destination ${retiredUrl} is not linked`);
}
pass(!/AdSense (?:typically )?represents (?:only )?30 to 50 percent/i.test(publicText), "homepage does not invent a universal AdSense revenue mix");
pass(!/brand sponsorships \(\$500 to \$50,000\+/i.test(publicText), "homepage does not publish an unsupported sponsorship range");
pass(!/sponsorship rates typically range from \$10 to \$50/i.test(publicText), "homepage does not publish an unsupported sponsorship CPM");
pass(
  ["baseFee", "deliverables", "productionCosts", "usageRightsPct", "exclusivityPct", "rushPct"]
    .every((id) => sponsorshipPage.includes(`id="${id}"`)),
  "sponsorship worksheet asks for explicit creator fees, costs, and contract adjustments",
);
pass(
  sponsorshipPage.includes("This tool does not supply a market rate")
    && sponsorshipPage.includes("based only on your entries, not a market-rate recommendation"),
  "sponsorship worksheet clearly labels results as user-supplied scenarios",
);
pass(
  !/followers.{0,12}1,000|per 1K followers|finance niche premium|real 2026 rate data|\$18 CPM|\$25 CPM|\$50\+ CPM/i.test(sponsorshipPage),
  "sponsorship page does not publish unsupported follower, niche, or podcast benchmarks",
);
pass(
  !/platformData|nicheData|tierBenchmarks|engagementMultiplier|podcastDownloads/i.test(sponsorshipScript),
  "sponsorship calculation contains no hidden platform, niche, engagement, or podcast multipliers",
);
pass(
  sponsorshipScript.includes("contentSubtotal = baseFee * deliverables")
    && sponsorshipScript.includes("quoteTotal = contentSubtotal + addOns"),
  "sponsorship quote total is calculated only from visible user inputs",
);
pass(hasOfficialEarningsOverview(), "homepage links the official YouTube earnings authority");
pass(
  youtubePage.includes('id="views"')
    && youtubePage.includes('id="ad-revenue-per-thousand"')
    && youtubePage.includes('id="ad-revenue-per-thousand" min="0" max="100000" step="0.01" value="0"'),
  "YouTube calculator requires explicit views and a zero-default post-share revenue assumption",
);
pass(
  youtubePage.includes("The calculator does not supply a CPM, RPM, niche rate, or forecast")
    && youtubePage.includes("No niche, location, engagement, video-length, or claimed industry rate is added behind the scenes"),
  "YouTube calculator clearly labels results as user-supplied scenarios",
);
pass(
  !/actual creator reports|2026 CPM|CPM rates by niche|finance.{0,20}\$|gaming.{0,20}\$|global average|most creators earn|typical earnings/i.test(youtubePage),
  "YouTube page does not publish unsupported CPM, niche, or creator-earnings benchmarks",
);
pass(
  !/cpmData|locationMultipliers|videoLengthMultipliers|getEngagementMultiplier|CREATOR_SHARE|YOUTUBE_FEE/i.test(youtubeScript),
  "YouTube calculation contains no hidden niche, location, length, engagement, or platform-share multipliers",
);
pass(
  youtubeScript.includes("monthlyRevenue = monthlyViews / 1000 * postShareRevenuePerThousand")
    && youtubeScript.includes("annualRevenue = monthlyRevenue * 12"),
  "YouTube scenario is calculated only from the two visible user inputs",
);
pass(
  [
    "https://support.google.com/youtube/answer/9314357?hl=en",
    "https://support.google.com/youtube/answer/72902?hl=en",
    "https://support.google.com/youtube/answer/12504220?hl=en",
  ].every((source) => youtubePage.includes(source)),
  "YouTube page links the official RPM, partner earnings, and Shorts policies",
);
pass(
  !fs.existsSync(path.join(root, "tools/youtube-ad-revenue/data-sources-section.html"))
    && !fs.existsSync(path.join(root, "tools/youtube-ad-revenue/youtube-data-sources.md"))
    && !fs.existsSync(path.join(root, "tools/youtube-ad-revenue/submissions-log.md"))
    && !fs.existsSync(path.join(root, "tools/youtube-ad-revenue/slider-sync.js")),
  "obsolete YouTube benchmark content, submission copy, and duplicate slider code are removed",
);
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

function hasOfficialEarningsOverview() {
  const hrefs = [...read("index.html").matchAll(/\bhref="([^"]+)"/gi)].map((match) => match[1]);
  return hrefs.some((href) => {
    try {
      const url = new URL(href);
      return url.protocol === "https:"
        && url.hostname === "support.google.com"
        && url.pathname === "/youtube/answer/72902"
        && url.search === ""
        && url.hash === "";
    } catch {
      return false;
    }
  });
}
