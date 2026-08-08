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
  if ([
    ".git",
    "blog",
    "content",
    "node_modules",
    "scripts",
    "finance-youtube-revenue",
    "gaming-youtube-revenue",
  ].includes(entry.name)) return [];
  const absolute = path.join(dir, entry.name);
  return entry.isDirectory() ? walk(absolute) : [absolute];
});

const publicFiles = [
  ...walk(root).filter((file) => /\.(html|js|css)$/.test(file)),
  path.join(root, "vercel.json"),
];
const publicText = publicFiles.map((file) => fs.readFileSync(file, "utf8")).join("\n");
const sitemap = read("sitemap.xml");
const llmsText = read("llms.txt");
const privacy = read("privacy.html");
const cookies = read("cookies.html");
const affiliateDisclosure = read("affiliate-disclosure.html");
const vercel = read("vercel.json");
const vercelConfig = JSON.parse(vercel);
const siteStyles = read("assets/css/style.css");
const accessibilityStyles = read("assets/css/accessibility-audit-fixes.css");
const mobileStyles = siteStyles.slice(
  siteStyles.indexOf("@media (max-width: 768px)"),
  siteStyles.indexOf("@media (max-width: 480px)"),
);
const themeScript = read("assets/js/theme.js");
const printStyles = read("assets/css/print-results.css");
const home = read("index.html");
const guidePage = read("guide/index.html");
const retiredToolPages = new Map([
  ["tools/finance-youtube-revenue/index.html", read("tools/finance-youtube-revenue/index.html")],
  ["tools/gaming-youtube-revenue/index.html", read("tools/gaming-youtube-revenue/index.html")],
]);
const mainScript = read("assets/js/main.js");
const aboutPage = read("about.html");
const contactPage = read("contact.html");
const accessibilityPage = read("accessibility.html");
const termsPage = read("terms.html");
const affiliatePage = read("tools/affiliate-calculator/index.html");
const affiliateScript = read("tools/affiliate-calculator/affiliate-calculator.js");
const newsletterPage = read("tools/newsletter-revenue/index.html");
const newsletterScript = read("tools/newsletter-revenue/newsletter-calculator.js");
const podcastPage = read("tools/podcast-revenue/index.html");
const podcastScript = read("tools/podcast-revenue/podcast-calculator.js");
const patreonPage = read("tools/patreon-revenue/index.html");
const patreonScript = read("tools/patreon-revenue/patreon-calculator.js");
const sponsorshipPage = read("tools/sponsorship-rate/index.html");
const sponsorshipScript = read("tools/sponsorship-rate/sponsorship-calculator.js");
const ugcPage = read("tools/ugc-rate/index.html");
const ugcScript = read("tools/ugc-rate/ugc-calculator.js");
const ugcStyles = read("tools/ugc-rate/ugc-calculator.css");
const youtubePage = read("tools/youtube-ad-revenue/index.html");
const youtubeScript = read("tools/youtube-ad-revenue/youtube-calculator.js");
const twitchPage = read("tools/twitch-revenue/index.html");
const twitchScript = read("tools/twitch-revenue/twitch-calculator.js");
const tiktokPage = read("tools/tiktok-revenue/index.html");
const tiktokScript = read("tools/tiktok-revenue/tiktok-calculator.js");
const instagramPage = read("tools/instagram-revenue/index.html");
const instagramScript = read("tools/instagram-revenue/instagram-calculator.js");
const engagementPage = read("tools/engagement-rate/index.html");
const engagementScript = read("tools/engagement-rate/engagement-calculator.js");
const maintainedCorePages = new Map([
  ["index.html", home],
  ["about.html", aboutPage],
  ["contact.html", contactPage],
  ["privacy.html", privacy],
  ["cookies.html", cookies],
  ["terms.html", termsPage],
  ["accessibility.html", accessibilityPage],
  ["affiliate-disclosure.html", affiliateDisclosure],
]);
const maintainedToolPages = new Map([
  ["tools/affiliate-calculator/index.html", affiliatePage],
  ["tools/engagement-rate/index.html", engagementPage],
  ["tools/instagram-revenue/index.html", instagramPage],
  ["tools/newsletter-revenue/index.html", newsletterPage],
  ["tools/patreon-revenue/index.html", patreonPage],
  ["tools/podcast-revenue/index.html", podcastPage],
  ["tools/sponsorship-rate/index.html", sponsorshipPage],
  ["tools/ugc-rate/index.html", ugcPage],
  ["tools/tiktok-revenue/index.html", tiktokPage],
  ["tools/twitch-revenue/index.html", twitchPage],
  ["tools/youtube-ad-revenue/index.html", youtubePage],
]);
const maintainedPages = new Map([...maintainedCorePages, ...maintainedToolPages]);

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
pass((sitemap.match(/<url>/g) || []).length === 19, "sitemap contains the 11 maintained calculators and eight current core pages");
pass(!sitemap.includes("/blog/"), "retired articles are absent from the sitemap");
pass(!sitemap.includes("/guide/"), "unverified paid guide is absent from the sitemap");
pass(/<meta\s+name="robots"\s+content="noindex, nofollow">/i.test(guidePage), "retired guide remains explicitly noindex even outside the production redirect layer");
pass(
  ["/tools/finance-youtube-revenue/", "/tools/gaming-youtube-revenue/"]
    .every((route) => !sitemap.includes(route)),
  "retired benchmark-driven YouTube tools are absent from the sitemap",
);
pass(sitemap.includes("/tools/ugc-rate/"), "restored UGC quote worksheet is publicly discoverable");
pass(sitemap.includes("/affiliate-disclosure.html"), "affiliate disclosure is publicly discoverable");
const legacyGscRedirects = {
  "/about": "/about.html",
  "/contact": "/contact.html",
  "/privacy": "/privacy.html",
  "/terms": "/terms.html",
  "/cookies": "/cookies.html",
  "/accessibility": "/accessibility.html",
  "/affiliate-disclosure": "/affiliate-disclosure.html",
  "/tools/creator-calculator": "/#tools",
  "/calculator": "/#tools",
  "/calculator/": "/#tools",
  "/calculator/instagram": "/tools/instagram-revenue/",
};
for (const [source, destination] of Object.entries(legacyGscRedirects)) {
  pass(
    vercelConfig.redirects?.some((redirect) => (
      redirect.source === source
        && redirect.destination === destination
        && redirect.permanent === true
    )),
    `${source} permanently redirects to its current canonical destination`,
  );
}
pass(
  vercelConfig.redirects?.filter((redirect) => redirect.source.startsWith("/blog") && redirect.destination === "/#tools").length === 4,
  "retired article routes with and without trailing slashes permanently redirect to calculators",
);
pass(
  vercelConfig.redirects?.some((redirect) => (
    redirect.source === "/blog/:path*"
      && redirect.destination === "/#tools"
      && redirect.permanent === true
  )),
  "every descendant of the legacy article archive is covered by a permanent wildcard redirect",
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
for (const [base, destination] of Object.entries({
  "/tools/finance-youtube-revenue": "/tools/youtube-ad-revenue/",
  "/tools/gaming-youtube-revenue": "/tools/youtube-ad-revenue/",
})) {
  for (const source of [base, `${base}/`, `${base}/index.html`]) {
    pass(
      vercelConfig.redirects?.some((redirect) => redirect.source === source && redirect.destination === destination && redirect.permanent === true),
      `${source} permanently redirects to a maintained explicit-input tool`,
    );
  }
}
pass(
  [...retiredToolPages.values()].every((page) => /<meta\s+name="robots"\s+content="noindex, nofollow">/i.test(page)),
  "retired YouTube tool files remain noindex if served outside the production redirect layer",
);
pass(
  !vercelConfig.redirects?.some((redirect) => redirect.source.startsWith("/tools/ugc-rate")),
  "UGC quote routes are no longer redirected to the sponsorship worksheet",
);
pass(vercelConfig.outputDirectory === ".", "Vercel publishes the static site root instead of the verification-files directory");
pass(vercel.includes("frame-src 'none'"), "production policy blocks third-party frames");
const frameHeaders = (vercelConfig.headers || [])
  .flatMap((rule) => rule.headers || [])
  .filter((header) => String(header.key).toLowerCase() === "x-frame-options");
pass(
  frameHeaders.length > 0 && frameHeaders.every((header) => String(header.value).toUpperCase() === "DENY"),
  "all production X-Frame-Options rules match the master DENY policy",
);
pass(!fs.existsSync(path.join(root, "llms-full.txt")) && !llmsText.includes("/blog/"), "AI discovery does not promote the retired article archive");
pass(!llmsText.includes("/guide/"), "AI discovery does not promote the retired paid guide");
pass(
  [privacy, cookies, affiliateDisclosure].every((page) => !page.includes('href="/guide/"')),
  "trust and privacy navigation does not route visitors through the retired guide",
);
pass(
  [home, aboutPage, contactPage, privacy, cookies, termsPage, accessibilityPage, affiliateDisclosure].every((page) => (
    /<a\b(?=[^>]*\bclass="skip-nav")(?=[^>]*\bhref="#main-content")[^>]*>Skip to main content<\/a>/.test(page)
  )),
  "all eight core pages provide a consistently styled skip link",
);
pass(/has not been approved by Google AdSense/i.test(privacy), "privacy notice accurately states AdSense status");
pass(/Google Analytics is optional and remains blocked until you explicitly allow it/i.test(privacy), "privacy notice accurately states analytics status");
pass(/script is not downloaded/i.test(cookies), "cookie notice accurately states denied-consent behavior");
const requiredAmazonStatement = "As an Amazon Associate I earn from qualifying purchases";
pass(affiliateDisclosure.includes(requiredAmazonStatement), "Amazon Associates relationship uses the required site disclosure");
for (const [file, page] of [
  ["tools/affiliate-calculator/index.html", affiliatePage],
  ["tools/podcast-revenue/index.html", podcastPage],
  ["tools/youtube-ad-revenue/index.html", youtubePage],
]) {
  const firstAmazonLink = page.search(/href="https:\/\/(?:www\.)?amazon\.com\/[^\"]*tag=creatorcalc-20/i);
  const nearbyDisclosure = page.indexOf(requiredAmazonStatement);
  pass(
    firstAmazonLink > 0 && nearbyDisclosure >= 0 && nearbyDisclosure < firstAmazonLink,
    `${file} places the clear Amazon commission disclosure before its first paid link`,
  );
}
pass(!publicText.includes("tag=ytearnings-20"), "creator pages do not reuse FiberTools' Amazon tracking ID");
const creatorAffiliateAnchors = [...publicText.matchAll(/<a\b[^>]*href="[^"]*tag=creatorcalc-20[^"]*"[^>]*>/gi)].map((match) => match[0]);
pass(creatorAffiliateAnchors.length >= 3, "maintained creator-equipment links remain available");
pass(
  creatorAffiliateAnchors.every((anchor) => /rel="[^"]*nofollow[^"]*"/i.test(anchor) && /rel="[^"]*sponsored[^"]*"/i.test(anchor)),
  "every Creator Amazon link is qualified with nofollow and sponsored",
);
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
pass(sponsorshipPage.includes('id="baseFee" min="0" max="1000000" step="25" value="0"'), "sponsorship worksheet supplies no default base fee");
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
const ugcInputIds = [
  "baseFee",
  "deliverables",
  "productionCosts",
  "revisionsFee",
  "rawFootageFee",
  "usageRightsFee",
  "exclusivityFee",
  "rushFee",
];
const ugcMoneyInputIds = ugcInputIds.filter((id) => id !== "deliverables");
pass(
  ugcInputIds.every((id) => ugcPage.includes(`id="${id}"`)),
  "UGC worksheet exposes creation, quantity, cost, revision, asset, rights, exclusivity, and rush inputs",
);
pass(
  ugcPage.includes('id="deliverables" min="1" max="1000" step="1" value="1"')
    && ugcMoneyInputIds.every((id) => new RegExp(`id="${id}"[^>]*value="0"`).test(ugcPage)),
  "UGC worksheet uses one deliverable and zero for every monetary default",
);
pass(
  ugcPage.includes('id="deliverables" min="1" max="1000" step="1"')
    && ugcScript.includes("deliverables: { label: 'Number of deliverables', min: 1, max: 1000, step: 1, whole: true }")
    && ugcScript.includes("rules.whole && !Number.isInteger(value)"),
  "UGC deliverable count must be a whole number from 1 through 1,000",
);
pass(
  ugcMoneyInputIds.every((id) => ugcPage.includes(`id="${id}" min="0" max="1000000" step="0.01"`))
    && ugcScript.includes("value < rules.min || value > rules.max")
    && ugcScript.includes("!isStepAligned(value, rules.min, rules.step)"),
  "UGC money inputs reject negative, over-limit, and sub-cent values",
);
pass(
  ugcScript.includes("rawValue === ''")
    && ugcScript.includes("!Number.isFinite(value)")
    && !ugcScript.includes("function nonNegativeNumber")
    && !ugcScript.includes("Math.max(1")
    && !ugcScript.includes("Math.floor("),
  "UGC input parsing rejects invalid values without silent fallback, clamping, or flooring",
);
pass(
  ugcInputIds.every((id) => ugcScript.includes(`var ${id} = validation.values.${id};`)),
  "UGC calculations use the exact validated values displayed in all eight fields",
);
pass(
  ugcScript.includes("contentSubtotal = baseFee * deliverables")
    && ugcScript.includes("addOns = productionCosts + revisionsFee + rawFootageFee + usageRightsFee + exclusivityFee + rushFee")
    && ugcScript.includes("quoteTotal = contentSubtotal + addOns"),
  "UGC quote formula uses only the eight visible user inputs",
);
pass(
  ugcInputIds.every((id) => ugcPage.includes(`aria-describedby="${id}Hint ${id}Error"`)
    && ugcPage.includes(`id="${id}Error" aria-live="polite"`))
    && ugcScript.includes("input.setAttribute('aria-invalid', 'true')")
    && ugcScript.includes("errorElement.textContent = error"),
  "UGC invalid fields expose accessible inline errors tied to each input",
);
pass(
  ugcScript.includes("contentSubtotalOutput.textContent = '—'")
    && ugcScript.includes("quoteTotalOutput.textContent = '—'")
    && ugcScript.includes("copyButton.disabled = true")
    && ugcScript.includes("delete copyButton.dataset.summary")
    && ugcScript.includes("if (focusFirstInvalid) validation.invalidInputs[0].focus()")
    && ugcScript.includes("calculateButton.addEventListener('click', function () { calculate(true); })")
    && ugcScript.includes("inputs[key].addEventListener('input', function () { calculate(false); })")
    && ugcStyles.includes('input[type="number"][aria-invalid="true"]')
    && ugcStyles.includes(".copy-rate-card:disabled"),
  "UGC invalid state clears results, disables copying, and focuses only after an explicit calculation",
);
pass(
  ugcPage.includes("A $100 creation fee × 2 deliverables, plus $20 production, $30 revisions, $40 raw footage or variants, $50 usage rights, $60 exclusivity, and $70 rush equals a $470 quote scenario."),
  "UGC worked example demonstrates the $470 acceptance calculation",
);
pass(
  !/\$150|\$300|2(?:–|-)3x|per month|industry standard|typically charge|real 2026 rate|guaranteed/i.test(ugcPage + "\n" + ugcScript),
  "UGC worksheet contains no retired benchmark, multiplier, monthly-income, standard, or guarantee claims",
);
pass(
  ugcPage.includes("Quote worksheet, not a market-rate recommendation, guarantee, or contract; it does not provide legal, tax, or financial advice.")
    && ugcPage.includes("What the Result Excludes")
    && ugcPage.includes('datetime="2026-08-03"'),
  "UGC worksheet displays its review date, exclusions, and decision-use limitations",
);
pass(
  ugcPage.includes("<title>UGC Rate Calculator | Quote Content, Usage &amp; Add-Ons</title>")
    && ugcPage.includes('content="Build a UGC quote from your own creation fee, deliverables, revisions, usage rights, raw footage, exclusivity, and rush terms. No hidden market rates."'),
  "UGC search title and description match the approved query-focused metadata",
);
const ugcSchemas = jsonLdDocuments(ugcPage);
pass(
  ["WebApplication", "FAQPage", "BreadcrumbList"].every((type) => ugcSchemas.some((document) => document["@type"] === type)),
  "UGC page provides WebApplication, FAQ, and breadcrumb structured data",
);
const ugcFaqPairs = [
  ["Does this calculator supply a UGC market rate?", "No. It totals only the creation fee, deliverable count, costs, and add-ons you enter. It does not infer a price from experience, followers, platform, niche, or an industry benchmark."],
  ["What should I put in the base creation fee?", "Enter a fee you selected using your own production time, costs, prior accepted offers, documented results, and business requirements. The worksheet does not choose or validate that fee."],
  ["Why are usage rights and exclusivity separate?", "Usage rights define how a client may reuse the content. Exclusivity limits work you may do for specified competitors or categories. Separate amounts keep those different permissions and restrictions visible."],
  ["What does the quote total exclude?", "The total excludes anything you do not enter, including taxes, payment processing, insurance, shipping, travel, licensing, and professional review. Add applicable items to the written quote."],
  ["Does this worksheet replace a contract or professional advice?", "No. It is an arithmetic quote worksheet, not a contract, and does not provide legal, tax, or financial advice. Review material or unclear terms with an appropriately qualified professional."],
];
pass(
  ugcFaqPairs.every(([question, answer]) => ugcPage.split(question).length === 3 && ugcPage.split(answer).length === 3),
  "UGC visible FAQ questions and answers exactly match the FAQ schema",
);
pass(
  ugcPage.includes('class="results-card" aria-live="polite" aria-atomic="true"')
    && ugcPage.includes('id="copyQuote"')
    && ugcScript.includes("navigator.clipboard.writeText")
    && ugcScript.includes("event.key === 'Enter' || event.key === ' '")
    && ugcScript.includes("setAttribute('aria-expanded', 'true')"),
  "UGC results, copy action, and keyboard-native FAQ controls expose accessible state",
);
pass(
  !/(amazon\.com|tag=creatorcalc-20|googlesyndication|adsbygoogle|etsy\.com)/i.test(ugcPage),
  "UGC worksheet makes no ad, affiliate, Amazon, or storefront request",
);
pass(
  home.includes('href="/tools/ugc-rate/"')
    && sponsorshipPage.includes('href="/tools/ugc-rate/"')
    && ugcPage.includes('href="/tools/sponsorship-rate/"'),
  "homepage, sponsorship worksheet, and UGC worksheet cross-link the restored tool",
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
pass(affiliateScript.includes("adjustedMonthlyCommissions = monthlyCommissions"), "affiliate revenue is not multiplied by the number of programs");
pass(
  affiliateScript.includes("monthlySales = monthlyTraffic * (validatedConversionRate / 100)")
    && affiliateScript.includes("dailyCommissions = adjustedMonthlyCommissions * 12 / 365")
    && affiliateScript.includes("weeklyCommissions = adjustedMonthlyCommissions * 12 / 52")
    && !affiliateScript.includes("Math.floor(monthlyTraffic"),
  "affiliate expected sales and time-period equivalents avoid hidden rounding and four-week-month assumptions",
);
pass(
  ["monthlyTraffic", "conversionRate", "averageOrderValue", "commissionRate"]
    .every((id) => affiliatePage.includes(`id="${id}"`) && new RegExp(`id="${id}"[^>]*value="0"`).test(affiliatePage)),
  "affiliate scenario exposes its four arithmetic inputs with zero defaults",
);
pass(
  !/2026 data|commission data included|2026 affiliate data|Avg Conversion Rate|industryBenchmarks|Amazon\s*~?\s*4%|\$50\s*(?:-|to)\s*\$200/i.test(affiliatePage + affiliateScript),
  "affiliate page and script contain no dated or hidden commission benchmarks",
);
pass(
  [
    "subscriberMode",
    "paidSubscribers",
    "listSize",
    "conversionRate",
    "monthlyPrice",
    "platformFeePercent",
    "completedSponsorships",
    "netPerSponsorship",
    "confirmedReferrals",
    "netPerReferral",
    "otherMonthlyCosts",
  ].every((id) => newsletterPage.includes(`id="${id}"`)),
  "newsletter scenario exposes every subscriber, revenue, fee, and cost input",
);
const newsletterNumberInputs = [...newsletterPage.matchAll(/<input\s+type="number"[^>]*>/gi)].map((match) => match[0]);
pass(
  newsletterNumberInputs.length === 10 && newsletterNumberInputs.every((input) => /\bvalue="0"/.test(input)),
  "newsletter scenario gives all ten numeric inputs zero defaults",
);
pass(
  newsletterPage.includes('<option value="direct" selected>Enter paid subscribers directly</option>')
    && newsletterPage.includes('<option value="derived">Use list size and my conversion assumption</option>')
    && newsletterScript.includes("Math.round(listSize * conversionRate / 100)"),
  "newsletter supports a direct paid-subscriber count or an explicit user-supplied conversion scenario",
);
pass(
  newsletterScript.includes("grossSubscriptions = paidSubscribers * monthlyPrice")
    && newsletterScript.includes("platformFee = grossSubscriptions * platformFeePercent / 100")
    && newsletterScript.includes("sponsorshipRevenue = completedSponsorships * netPerSponsorship")
    && newsletterScript.includes("referralRevenue = confirmedReferrals * netPerReferral")
    && newsletterScript.includes("totalMonthly = netSubscriptions + sponsorshipRevenue + referralRevenue - otherMonthlyCosts"),
  "newsletter result is calculated only from visible user inputs",
);
pass(
  !/Substack|Beehiiv|ConvertKit|Ghost|platformData|Free Forever|full.?time|target\s*=\s*5000|\$5,?000\s+(?:monthly|per month)|\$50,?000\s*(?:-|to)\s*\$500,?000|\$25\s*(?:-|to)\s*\$75|2\s*(?:-|to)\s*5%/i.test(newsletterPage + newsletterScript),
  "newsletter page and script contain no platform table, income target, or supplied conversion and sponsorship benchmarks",
);
pass(!fs.existsSync(path.join(root, "tools/newsletter-revenue/slider-sync.js")), "newsletter tool contains no obsolete duplicate slider code");
pass(
  twitchPage.includes('id="netPerSubscriber"')
    && twitchPage.includes('id="netAdRevenuePerThousand"')
    && twitchPage.includes('id="sponsorshipRevenueInput"'),
  "Twitch scenario asks for visible dashboard and contract values",
);
pass(
  twitchScript.includes("bitsUsed * 0.01")
    && twitchScript.includes("subscribers = count('subscribers')")
    && twitchScript.includes("bitsUsed = count('bitsPerMonth')")
    && twitchScript.includes("adImpressions = count('adImpressions')")
    && !/cpmRates|sponsorshipRates|getCategoryMultiplier|avgViewers/.test(twitchScript),
  "Twitch calculation uses whole-count inputs, the published Bits baseline, and no viewer, niche, ad, or sponsor multipliers",
);
pass(
  tiktokPage.includes('id="qualifiedViews"')
    && tiktokPage.includes('id="rewardPerThousand"')
    && tiktokPage.includes('id="netBrandDealFee"'),
  "TikTok scenario asks for qualified-view, dashboard, and completed-deal values",
);
pass(
  !/Creator Fund|creatorFundRates|cpmRates|brandDealRates|liveGiftMultipliers|engagementMultiplier/i.test(tiktokScript)
    && tiktokScript.includes("qualifiedViews = count('qualifiedViews')")
    && tiktokScript.includes("brandDealsCount = count('brandDealsCount')")
    && tiktokScript.includes("qualifiedViews / 1000 * rewardPerThousand"),
  "TikTok calculation uses whole-count inputs and no former-fund, follower, niche, engagement, or gift multipliers",
);
pass(
  instagramPage.includes('id="netBrandDealFee"')
    && instagramPage.includes('id="netCommissionPerSale"')
    && instagramPage.includes('id="platformBonusNet"'),
  "Instagram scenario asks for completed-work, affiliate-report, and dashboard values",
);
pass(
  !/nicheRates|getEngagementMultiplier|baseRatePerFollower|sponsoredPosts|calculateReelsBonus/i.test(instagramScript)
    && instagramScript.includes("brandDealsCount = count('brandDealsCount')")
    && instagramScript.includes("affiliateSales = count('affiliateSales')")
    && instagramScript.includes("affiliateSales * netCommissionPerSale"),
  "Instagram calculation uses whole-count inputs and no follower, niche, engagement, sponsored-post, or Reels payout assumptions",
);
pass(
  engagementPage.includes("follower-based")
    && engagementPage.includes("view-based")
    && !/top 1%|adds ~40%|double your sponsorship rate|vs\. platform average|benchmarks based on 2026/i.test(engagementPage),
  "engagement page explains both formulas without unsupported tiers or sponsorship premiums",
);
pass(
  engagementScript.includes("likes + comments + shares + saves")
    && !/benchmarkData|sponsorshipImpact|modifier|tier|Ã/i.test(engagementScript),
  "engagement calculation is transparent arithmetic with no hidden benchmark data",
);
pass(/\.about-stats\s*{\s*grid-template-columns:\s*1fr;\s*}/.test(mobileStyles), "homepage trust statistics collapse to one column on phones");
pass(/\.stat-content\s*{[^}]*min-width:\s*0;/s.test(siteStyles), "homepage statistic text can shrink without forcing horizontal scrolling");
pass(
  accessibilityStyles.includes("minmax(0, 1fr)")
    && accessibilityStyles.includes("overflow-wrap: anywhere")
    && /\.input-panel,[\s\S]*?min-width:\s*0;/.test(accessibilityStyles),
  "shared accessibility styles keep calculator grids, panels, and long email links inside phone viewports",
);
pass(
  /html\[data-theme="dark"\]\s+body\.calculator-page/.test(accessibilityStyles)
    && /html\[data-theme="dark"\][\s\S]*?\.input-panel[\s\S]*?background:\s*#1e293b\s*!important/.test(accessibilityStyles)
    && /html\[data-theme="dark"\][\s\S]*?input[\s\S]*?background:\s*#0f172a\s*!important/.test(accessibilityStyles),
  "shared accessibility styles provide dark calculator surfaces and form controls",
);
const resultCards = [...publicText.matchAll(/<div\s+class="results-card"[^>]*>/g)].map((match) => match[0]);
pass(
  resultCards.length === 11 && resultCards.every((card) => /aria-live="polite"/.test(card)),
  "all 11 maintained calculator result cards remain present and announce updates politely",
);
pass(themeScript.includes("Print Results") && themeScript.includes("window.print()"), "calculator result cards expose browser printing");
pass(themeScript.includes("data-printable-results") && printStyles.includes("body:has([data-printable-results]) *"), "print output is isolated to calculator results");
pass(printStyles.includes(".copy-result") && printStyles.includes(".share-buttons"), "print output excludes copy and sharing controls");
pass(!mainScript.includes("card.style.opacity = '0'"), "homepage calculator cards remain visible without scroll-triggered JavaScript");
pass(
  !/Free, accurate revenue calculators|real 2026 data from actual creators|Always free|Free Forever|Based on actual creator reports and industry benchmarks|TikTok Creator Fund|Reels Play/.test(home),
  "homepage avoids unsupported accuracy, sourcing, historical-program, and future-price claims",
);
const homeApplicationSchema = jsonLdDocuments(home).find((document) => document["@type"] === "WebApplication");
pass(
  homeApplicationSchema?.name === "Creator Revenue Calculator"
    && homeApplicationSchema?.description === "A collection of browser-based creator revenue scenario calculators that use visible, user-supplied platform, contract, payout, fee, and cost inputs."
    && !/Free YouTube Income Estimator|Estimate earnings, CPM rates, and monetization potential/.test(home),
  "homepage WebApplication schema describes the full explicit-input calculator collection",
);
const maintainedNonAuthorPages = [
  home,
  contactPage,
  accessibilityPage,
  termsPage,
  affiliatePage,
  newsletterPage,
  patreonPage,
  sponsorshipPage,
  youtubePage,
].join("\n");
pass(
  !/"@type"\s*:\s*"Person"/.test(maintainedNonAuthorPages)
    && (publicText.match(/"@type"\s*:\s*"Person"/g) || []).length === 1
    && /"@type"\s*:\s*"Person"[\s\S]*?"name"\s*:\s*"Jason Ramirez"/.test(aboutPage),
  "only the real public about-page author retains Person schema",
);
pass(
  aboutPage.includes("About Jason Ramirez")
    && aboutPage.includes("CADC-II counselor")
    && aboutPage.includes("Creator Revenue Calculator"),
  "owner-approved public name, credentials, and site organization remain on the About page",
);
pass(
  !/Prunedale|addressLocality|addressRegion|Your Friendly Developer|\bLLC\b/i.test(aboutPage),
  "About metadata, schema, and copy omit the author's exact location and private company identity",
);
pass(
  [affiliatePage, engagementPage, instagramPage, newsletterPage, patreonPage, podcastPage, sponsorshipPage, ugcPage, tiktokPage, twitchPage, youtubePage].every((page) => (
    page.includes('<meta name="author" content="Creator Revenue Calculator">')
      && /"author"\s*:\s*\{\s*"@type"\s*:\s*"Organization",\s*"name"\s*:\s*"Creator Revenue Calculator",\s*"url"\s*:\s*"https:\/\/creatorrevenuecalculator\.com\/"/s.test(page)
  )),
  "all 11 maintained tools use site-level author metadata and Organization schema",
);
pass(!/Built by a digital marketing professional/i.test(publicText), "generic invented author credentials are absent from public pages");
pass(
  !/respond(?:s|ed|ing)?[^.\n]{0,80}\bwithin\s+\d+\s+hours|Most messages receive a reply within|incorporate the most requested features/i.test(contactPage),
  "contact page makes no unsupported response-time or roadmap-delivery promises",
);
for (const [file, html] of maintainedPages) {
  const title = html.match(/<title>([^<]+)<\/title>/i)?.[1].trim() || "";
  const canonical = tagAttributes(html, "link").find((attributes) => attributes.rel === "canonical")?.href;
  const expectedAuthor = file === "about.html" ? "Jason Ramirez" : "Creator Revenue Calculator";
  const completeMetadata = title.length > 0
    && metaContent(html, "name", "description")
    && metaContent(html, "name", "robots")?.includes("max-snippet:-1")
    && metaContent(html, "name", "author") === expectedAuthor
    && canonical
    && metaContent(html, "property", "og:title")
    && metaContent(html, "property", "og:description")
    && metaContent(html, "property", "og:type")
    && metaContent(html, "property", "og:url") === canonical
    && metaContent(html, "property", "og:image")
    && metaContent(html, "name", "twitter:card")
    && metaContent(html, "name", "twitter:title")
    && metaContent(html, "name", "twitter:description")
    && metaContent(html, "name", "twitter:image");
  pass(Boolean(completeMetadata), `${file} provides complete index, author, canonical, Open Graph, and Twitter metadata`);
  pass(title.length > 0 && title.length < 60, `${file} title remains below 60 characters`);
}
pass(
  [...maintainedToolPages.values()].every((page) => /<body\b[^>]*\bclass="[^"]*\bcalculator-page\b[^"]*"/i.test(page)),
  "all 11 maintained calculators opt into the shared mobile and dark-mode contract",
);
const maintainedProductPages = [
  home,
  affiliatePage,
  engagementPage,
  instagramPage,
  newsletterPage,
  patreonPage,
  podcastPage,
  sponsorshipPage,
  ugcPage,
  tiktokPage,
  twitchPage,
  youtubePage,
].join("\n");
pass(
  !/\/tools\/(?:finance-youtube-revenue|gaming-youtube-revenue)\//.test(maintainedProductPages),
  "maintained product pages do not link visitors to retired benchmark-driven YouTube tools",
);
pass(
  !/based on publicly available platform data|industry data and updated 2026 rates|Data is for estimation purposes only|public benchmarks rather than affiliate compensation|calculators use publicly available data, industry averages/i.test(publicText),
  "public pages do not claim that explicit-input scenarios come from supplied platform or industry data",
);
pass(!mainScript.includes("IntersectionObserver"), "homepage statistics render their final values without animated zero states");
pass(
  mainScript.includes("isOpen ? 'Close navigation' : 'Open navigation'")
    && mainScript.includes("setMobileMenuLabel(!isOpen)")
    && mainScript.includes("setMobileMenuLabel(false)"),
  "mobile navigation announces whether the toggle will open or close the menu",
);
pass(
  home.includes("Studio Inputs")
    && home.includes("No Niche Multiplier")
    && !/CPM Calculator|Niche Analysis/.test(home),
  "homepage describes the YouTube worksheet without retired CPM or niche-analysis claims",
);
pass(
  /\.skip-nav\s*\{[^}]*top:\s*-6rem;/s.test(accessibilityStyles)
    && /\.skip-nav:focus\s*\{[^}]*top:\s*1rem;/s.test(accessibilityStyles),
  "skip navigation remains hidden until keyboard focus",
);
pass(/\.hero \.subtitle\s*\{[^}]*#e5e7eb/s.test(accessibilityStyles), "hero supporting copy keeps readable contrast on dark backgrounds");
pass(
  /@media \(prefers-reduced-motion: reduce\)/.test(accessibilityStyles)
    && /animation-duration:\s*0\.01ms !important/.test(accessibilityStyles)
    && /transition-duration:\s*0\.01ms !important/.test(accessibilityStyles),
  "shared accessibility styles honor reduced-motion preferences",
);
pass(
  [newsletterScript, patreonScript, sponsorshipScript, ugcScript, youtubeScript].every((script) => (
    /setAttribute\(['"]aria-expanded['"],\s*['"]false['"]\)/.test(script)
      && /setAttribute\(['"]aria-expanded['"],\s*['"]true['"]\)/.test(script)
  )),
  "maintained accordion FAQs expose their open and closed state",
);
pass(!/^MANAGERDOMAIN=/im.test(read("ads.txt")), "ads.txt does not name the publisher itself as an external monetization manager");
pass(
  !/fibertools\.app|mindchecktools\.com|flipmycase\.com|contractextract\.com|medicalbillreader\.com|524tracker\.com/.test(publicText),
  "maintained public pages do not publish a template-wide portfolio link ring",
);
pass(podcastPage.includes('id="sponsorCpm"') && podcastPage.includes('value="0"'), "podcast calculator excludes direct sponsorship revenue by default");
pass(podcastPage.includes('id="adCpm"') && podcastPage.includes('id="creatorShare"'), "podcast calculator asks for explicit contract CPM and creator share inputs");
pass(
  podcastPage.includes('id="adCpm" min="0" max="1000" step="0.01" value="0"')
    && podcastPage.includes('id="creatorShare" min="0" max="100" step="0.1" value="0"'),
  "podcast variable contract and creator-share rates start at zero",
);
pass(
  !/nicheRates|placementMultipliers|updateRevenueSplitVisualization/.test(podcastScript)
    && podcastScript.includes("downloadsPerEpisode = wholeValue(downloadsInput)")
    && podcastScript.includes("return (downloadsPerEpisode / 1000) * cpm * adCount * creatorShare * episodesPerMonth"),
  "podcast calculator uses whole-count inputs and no niche, placement, or missing-chart multipliers",
);
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
  pass(
    new RegExp(`id="tierPrice${tier}"[^>]*value="0"`).test(patreonPage)
      && new RegExp(`id="tierPatrons${tier}"[^>]*value="0"`).test(patreonPage),
    `Patreon tier ${tier} price and patron count start at zero`,
  );
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

function tagAttributes(html, tagName) {
  const elements = [...html.matchAll(new RegExp(`<${tagName}\\b[^>]*>`, "gi"))].map((match) => match[0]);
  return elements.map((element) => Object.fromEntries(
    [...element.matchAll(/([:\w-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)]
      .map((match) => [match[1].toLowerCase(), match[2] ?? match[3] ?? ""]),
  ));
}

function metaContent(html, attributeName, attributeValue) {
  const expectedName = attributeName.toLowerCase();
  return tagAttributes(html, "meta")
    .find((attributes) => attributes[expectedName]?.toLowerCase() === attributeValue.toLowerCase())
    ?.content;
}

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

function jsonLdDocuments(html) {
  return [...html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)]
    .map((match) => {
      try { return JSON.parse(match[1]); } catch { return null; }
    })
    .filter(Boolean);
}
