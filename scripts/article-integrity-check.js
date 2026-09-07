import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SITE_ORIGIN = "https://creatorrevenuecalculator.com";
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, "content", "published-articles.json"), "utf8"));
let failures = 0;

function pass(condition, message) {
  console.log(`${condition ? "PASS" : "FAIL"} ${message}`);
  if (!condition) failures += 1;
}

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, ...relativePath.split("/")), "utf8");
}

function validDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
}

function validOptionalDate(value) {
  return value === null || value === undefined || validDate(value);
}

function attributes(source) {
  const result = {};
  for (const match of source.matchAll(/([:\w-]+)\s*=\s*(["'])(.*?)\2/gs)) {
    result[match[1].toLowerCase()] = match[3];
  }
  return result;
}

function metaContent(html, key, value) {
  for (const match of html.matchAll(/<meta\b([^>]*)>/gi)) {
    const attrs = attributes(match[1]);
    if (attrs[key] === value) return attrs.content || "";
  }
  return "";
}

function canonicalHref(html) {
  for (const match of html.matchAll(/<link\b([^>]*)>/gi)) {
    const attrs = attributes(match[1]);
    if (attrs.rel === "canonical") return attrs.href || "";
  }
  return "";
}

function stripTags(value) {
  return value
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function flattenJsonLd(value) {
  if (Array.isArray(value)) return value.flatMap(flattenJsonLd);
  if (!value || typeof value !== "object") return [];
  return [value, ...flattenJsonLd(value["@graph"] || [])];
}

function jsonLdNodes(html) {
  const nodes = [];
  for (const match of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      nodes.push(...flattenJsonLd(JSON.parse(match[1])));
    } catch {
      failures += 1;
      console.error("FAIL published article contains invalid JSON-LD");
    }
  }
  return nodes;
}

function hasType(node, type) {
  const types = Array.isArray(node?.["@type"]) ? node["@type"] : [node?.["@type"]];
  return types.includes(type);
}

function routeFromPath(filePath) {
  return `/${filePath.replace(/index\.html$/, "")}`;
}

function markdownFiles(relativeDirectory) {
  const directory = path.join(ROOT, ...relativeDirectory.split("/"));
  return fs.readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => `${relativeDirectory}/${entry.name}`);
}

const editorialPlaybooks = [
  ...markdownFiles(".claude/commands").filter((file) => !file.endsWith("/scrub.md") && !file.endsWith("/session-start.md")),
  ...markdownFiles(".claude/agents"),
];
const articleTemplate = read("docs/templates/article-page.html");
const internalLinkMap = read("context/internal-links-map.md");
const mappedRoutes = [...internalLinkMap.matchAll(/^- `([^`]+)`/gm)].map((match) => match[1]);
const unsafeDirectivePattern = /keyword density|word count|posts? per week|articles? per week|publishing cadence|authority score|traffic forecast|click forecast|revenue forecast|fictional (?:person|name|story)|invented (?:score|metric|story|outcome)|publish (?:immediately|asap|automatically)|src\/app\/blog|next\.js|faqpage schema|howto schema/i;
const explicitSafetyPattern = /\b(?:do not|don't|never|avoid|prohibit(?:ed)?|without|cannot|must not|no required|no fixed|rather than|not a|not an)\b/i;
const unsafeEditorialLines = editorialPlaybooks.flatMap((file) => read(file)
  .split(/\r?\n/)
  .map((line, index) => ({ file, line: index + 1, text: line.trim() }))
  .filter((entry) => unsafeDirectivePattern.test(entry.text) && !explicitSafetyPattern.test(entry.text)));

pass(editorialPlaybooks.length >= 20, "the maintained editorial command and agent playbooks are present");
pass(
  editorialPlaybooks.every((file) => read(file).includes("docs/editorial-publishing.md")),
  "every maintained editorial playbook defers to the evidence-led publishing standard",
);
pass(
  unsafeEditorialLines.length === 0,
  `editorial playbooks contain no active manipulation, fabrication, quota, or auto-publication directives${unsafeEditorialLines.length ? `: ${JSON.stringify(unsafeEditorialLines)}` : ""}`,
);
pass(
  read("context/brand-voice.md").includes("static, browser-first")
    && read("context/seo-guidelines.md").includes("developers.google.com/search/docs/fundamentals/ai-optimization-guide")
    && read("context/internal-links-map.md").includes("/articles/")
    && read("context/target-keywords.md").includes("Captured: 2026-09-06")
    && read("context/style-guide.md").includes("synthetic example"),
  "site context describes the real stack, current evidence, maintained routes, and synthetic-example rules",
);
pass(
  [
    '<body class="article-page">',
    'class="skip-nav"',
    'class="navbar"',
    'class="article-answer"',
    'class="btn btn-primary"',
    'data-published="DATE_PUBLISHED_ISO"',
    'data-reviewed="DATE_REVIEWED_ISO"',
    'data-next-review="DATE_NEXT_REVIEW_ISO"',
    'data-source-id="SOURCE_ID"',
    'data-synthetic-example="true"',
    'href="/downloads/RELEVANT_DOWNLOAD"',
    '"@id": "https://creatorrevenuecalculator.com/articles/ARTICLE_SLUG/"',
    '<meta name="author" content="Creator Revenue Calculator">',
  ].every((token) => articleTemplate.includes(token))
    && !articleTemplate.includes('class="skip-link"')
    && !articleTemplate.includes('data-example="synthetic"'),
  "article template matches the shared visual shell and publication contract",
);
pass(
  validOptionalDate(null) && validOptionalDate(undefined) && validOptionalDate("2026-09-06") && !validOptionalDate("unknown"),
  "source update dates may be absent but cannot be invented or stored as ambiguous text",
);
pass(manifest.version === 1, "article registry uses the supported schema version");
pass(Array.isArray(manifest.articles) && manifest.articles.length > 0, "article registry contains at least one reviewed publication");
pass(manifest.hub?.path === "articles/index.html" && manifest.hub?.canonical === `${SITE_ORIGIN}/articles/`, "article hub has one canonical path");
pass(validDate(manifest.hub?.lastModified), "article hub has a real modification date");

const slugs = new Set();
const paths = new Set();
const canonicals = new Set();
const titles = new Set();
const sitemap = read("sitemap.xml");
const llms = read("llms.txt");
const home = read("index.html");
const hub = read(manifest.hub.path);
const vercel = JSON.parse(read("vercel.json"));
const redirectSources = new Set((vercel.redirects || []).map((redirect) => redirect.source));
const sitemapRoutes = [...sitemap.matchAll(/<loc>(https:\/\/creatorrevenuecalculator\.com[^<]*)<\/loc>/g)]
  .map((match) => new URL(match[1]).pathname);
const mappedPageRoutes = mappedRoutes.filter((route) => !route.startsWith("/downloads/"));
const mappedDownloadRoutes = mappedRoutes.filter((route) => route.startsWith("/downloads/"));

pass(
  sitemapRoutes.length === mappedPageRoutes.length
    && sitemapRoutes.every((route) => mappedPageRoutes.includes(route))
    && mappedPageRoutes.every((route) => sitemapRoutes.includes(route))
    && mappedDownloadRoutes.every((route) => fs.existsSync(path.join(ROOT, ...route.slice(1).split("/")))),
  "maintained internal-link map exactly matches sitemap pages and real downloadable resources",
);

pass(home.includes('href="/articles/"'), "homepage provides a static path to the article hub");
pass(sitemap.includes(`<loc>${manifest.hub.canonical}</loc><lastmod>${manifest.hub.lastModified}</lastmod>`), "sitemap includes the article hub with its real date");
pass(llms.includes(manifest.hub.canonical), "assistant discovery lists the article hub without special-ranking claims");

for (const article of manifest.articles) {
  const prefix = `article ${article.slug || "(missing slug)"}`;
  const expectedPath = `articles/${article.slug}/index.html`;
  const expectedCanonical = `${SITE_ORIGIN}${routeFromPath(expectedPath)}`;
  const route = routeFromPath(expectedPath);

  pass(article.status === "published", `${prefix} is explicitly approved for the public registry`);
  pass(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(article.slug || ""), `${prefix} uses a stable lowercase slug`);
  pass(article.path === expectedPath, `${prefix} path is derived from its slug`);
  pass(article.canonical === expectedCanonical, `${prefix} canonical is derived from its path`);
  pass(!slugs.has(article.slug) && !paths.has(article.path) && !canonicals.has(article.canonical) && !titles.has(article.title), `${prefix} has unique identity fields`);
  slugs.add(article.slug);
  paths.add(article.path);
  canonicals.add(article.canonical);
  titles.add(article.title);

  pass(typeof article.title === "string" && article.title.length >= 20 && article.title.length < 60, `${prefix} title is descriptive and concise`);
  pass(typeof article.description === "string" && article.description.length >= 100 && article.description.length <= 180, `${prefix} description states the page's actual value`);
  pass([article.datePublished, article.dateModified, article.reviewedOn, article.nextReviewOn].every(validDate), `${prefix} publication and review dates are valid`);
  pass(article.datePublished <= article.dateModified && article.reviewedOn <= article.nextReviewOn, `${prefix} date order is coherent`);
  pass(
    ["search_console", "platform_change", "direct_evidence"].includes(article.opportunity?.type),
    `${prefix} has a permitted evidence trigger`,
  );
  pass(typeof article.opportunity?.decision === "string" && article.opportunity.decision.length >= 60, `${prefix} records why a separate article is useful`);
  if (article.opportunity?.type === "search_console") {
    pass(
      [article.opportunity.periodStart, article.opportunity.periodEnd, article.opportunity.capturedOn].every(validDate)
        && Number.isInteger(article.opportunity.clicks)
        && Number.isInteger(article.opportunity.impressions)
        && article.opportunity.impressions > 0
        && Number.isFinite(article.opportunity.ctrPercent)
        && Number.isFinite(article.opportunity.averagePosition),
      `${prefix} stores aggregate Search Console evidence without visitor data`,
    );
  }
  if (article.opportunity?.type === "platform_change") {
    pass(
      validDate(article.opportunity.capturedOn)
        && /^https:\/\//.test(article.opportunity.primarySourceUrl || "")
        && typeof article.opportunity.changeSummary === "string"
        && article.opportunity.changeSummary.length >= 60,
      `${prefix} records a dated primary-source platform change`,
    );
  }
  if (article.opportunity?.type === "direct_evidence") {
    pass(
      validDate(article.opportunity.capturedOn)
        && ["funnel_observation", "user_report"].includes(article.opportunity.evidenceKind)
        && Number.isInteger(article.opportunity.observationCount)
        && article.opportunity.observationCount > 0
        && typeof article.opportunity.evidenceSummary === "string"
        && article.opportunity.evidenceSummary.length >= 60,
      `${prefix} stores aggregate direct evidence without personal or visitor-level data`,
    );
  }

  pass(article.calculatorPath?.startsWith("/tools/") && article.downloadPath?.startsWith("/downloads/"), `${prefix} has relevant product and offline next steps`);
  pass(Array.isArray(article.discoveryPages) && article.discoveryPages.length > 0, `${prefix} has at least one contextual discovery page`);
  pass(Array.isArray(article.sources) && article.sources.length >= 2 && article.sources.some((source) => source.kind === "primary"), `${prefix} has a primary-source ledger`);

  const sourceIds = new Set();
  for (const source of article.sources || []) {
    pass(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(source.id || "") && !sourceIds.has(source.id), `${prefix} source ${source.id || "(missing id)"} has a unique stable id`);
    sourceIds.add(source.id);
    pass(["primary", "secondary"].includes(source.kind), `${prefix} source ${source.id} declares its evidence class`);
    pass(/^https:\/\//.test(source.url || "") && !source.url.includes(SITE_ORIGIN), `${prefix} source ${source.id} uses an external HTTPS URL`);
    pass(validOptionalDate(source.sourceUpdatedOn) && validDate(source.checkedOn), `${prefix} source ${source.id} records a checked date and any available update date`);
    pass(Array.isArray(source.claims) && source.claims.length > 0 && source.claims.every((claim) => typeof claim === "string" && claim.length >= 30), `${prefix} source ${source.id} names the claims it supports`);
  }

  pass(fs.existsSync(path.join(ROOT, ...article.path.split("/"))), `${prefix} HTML exists`);
  if (!fs.existsSync(path.join(ROOT, ...article.path.split("/")))) continue;
  const html = read(article.path);
  const title = stripTags(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || "");
  const h1Matches = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)];

  pass(title === article.title, `${prefix} title matches the registry`);
  pass(h1Matches.length === 1 && stripTags(h1Matches[0][1]) === article.title, `${prefix} has one registry-matched H1`);
  pass(metaContent(html, "name", "description") === article.description, `${prefix} description matches the registry`);
  pass(metaContent(html, "name", "robots") === "index, follow, max-snippet:-1", `${prefix} permits normal indexing and snippets`);
  pass(metaContent(html, "name", "author") === "Creator Revenue Calculator", `${prefix} uses truthful organization attribution`);
  pass(canonicalHref(html) === article.canonical && metaContent(html, "property", "og:url") === article.canonical, `${prefix} canonical and social URL agree`);
  pass(html.includes('href="/assets/js/theme.js"') || html.includes('src="/assets/js/theme.js"'), `${prefix} uses the shared consent and theme controller`);
  pass(html.includes('href="/assets/css/accessibility-audit-fixes.css"') && html.includes('href="/assets/css/articles.css"'), `${prefix} uses shared accessible article styles`);
  pass(html.includes(`data-published="${article.datePublished}"`) && html.includes(`data-reviewed="${article.reviewedOn}"`) && html.includes(`data-next-review="${article.nextReviewOn}"`), `${prefix} visibly exposes publication, review, and next-review dates`);
  pass(html.includes(`href="${article.calculatorPath}"`) && html.includes(`href="${article.downloadPath}"`), `${prefix} links the related calculator and blank tracker`);
  pass(hub.includes(`href="${route}"`) && hub.includes(article.title), `${prefix} is represented on the visible article hub`);
  pass(sitemap.includes(`<loc>${article.canonical}</loc><lastmod>${article.dateModified}</lastmod>`), `${prefix} is present in the sitemap with its real modification date`);
  pass(llms.includes(article.canonical), `${prefix} is present in the assistant-facing site summary`);
  pass(!redirectSources.has(route) && !redirectSources.has(route.replace(/\/$/, "")), `${prefix} does not collide with a redirect`);
  pass((article.discoveryPages || []).every((file) => read(file).includes(`href="${route}"`)), `${prefix} has contextual static internal discovery`);

  for (const source of article.sources || []) {
    pass(
      html.includes(`data-source-id="${source.id}"`)
        && html.includes(`href="${source.url}"`)
        && html.includes(source.title),
      `${prefix} visibly cites source ${source.id}`,
    );
  }

  const nodes = jsonLdNodes(html);
  const articleNode = nodes.find((node) => hasType(node, "Article"));
  const breadcrumbs = nodes.find((node) => hasType(node, "BreadcrumbList"));
  pass(
    articleNode?.headline === article.title
      && articleNode?.description === article.description
      && articleNode?.datePublished === article.datePublished
      && articleNode?.dateModified === article.dateModified
      && articleNode?.mainEntityOfPage?.["@id"] === article.canonical
      && articleNode?.author?.["@type"] === "Organization"
      && articleNode?.author?.name === "Creator Revenue Calculator",
    `${prefix} Article schema matches visible registry facts`,
  );
  pass(
    Array.isArray(breadcrumbs?.itemListElement)
      && breadcrumbs.itemListElement.at(-1)?.item === article.canonical
      && breadcrumbs.itemListElement.at(-1)?.name === article.title,
    `${prefix} breadcrumb schema matches the visible destination`,
  );

  const highRiskBlocks = [...html.matchAll(/<(p|li|td|dd)\b([^>]*)>([\s\S]*?)<\/\1>/gi)].filter((match) => {
    const text = stripTags(match[3]);
    if (/^(?:©\s*)?\d{4}\s+Creator Revenue Calculator/.test(text)) return false;
    if (/^(?:Published|Sources reviewed|Next scheduled review):/i.test(text)) return false;
    return /(?:[$€£]\s*\d|\b\d+(?:\.\d+)?\s*%|\b\d+\s*(?:-|–|to)\s*\d+\s+(?:business\s+)?(?:days?|hours?|months?|years?))/i.test(text);
  });
  pass(
    highRiskBlocks.every((match) => {
      const attrs = attributes(match[2]);
      return sourceIds.has(attrs["data-source-id"]) || attrs["data-synthetic-example"] === "true";
    }),
    `${prefix} annotates every exact monetary, percentage, or time-range claim as sourced or synthetic`,
  );

  pass(
    !/keyword density|AI watermark|make (?:the )?content appear human|guaranteed (?:income|earnings|revenue)|rank(?:ing)?\s*(?:#|number\s*)?1|fictional (?:story|creator)|\b(?:Sarah|Marcus|Acme Corp)\b/i.test(html),
    `${prefix} contains no legacy manipulation, guarantee, or invented-story instructions`,
  );
  pass(!/pagead2\.googlesyndication\.com|\badsbygoogle\b|email-capture|testimonial/i.test(html), `${prefix} adds no ad loader, capture form, or testimonial claim`);
  pass(html.includes('id="sources"') && html.includes("Examples are synthetic") && html.includes("not financial or tax advice"), `${prefix} exposes sources, synthetic-example limits, and the appropriate disclaimer`);
}

if (failures > 0) {
  console.error(`\nArticle integrity checks failed: ${failures}`);
  process.exit(1);
}

console.log(`\nArticle integrity checks passed (${manifest.articles.length} published article${manifest.articles.length === 1 ? "" : "s"}).`);
