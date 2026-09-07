import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const REGISTRY_PATH = path.join(ROOT, "content", "recommended-products.json");
const PAGE_PATH = path.join(ROOT, "recommended-products", "index.html");
const SCRIPT_PATH = path.join(ROOT, "assets", "js", "recommended-products.js");
const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, "utf8"));
const html = fs.readFileSync(PAGE_PATH, "utf8");
const clientScript = fs.readFileSync(SCRIPT_PATH, "utf8");
let failures = 0;

function pass(condition, message) {
  console.log(`${condition ? "PASS" : "FAIL"} ${message}`);
  if (!condition) failures += 1;
}

function validDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value || "") && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
}

function safeHttpsUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password && !url.hash;
  } catch {
    return false;
  }
}

function attributes(source) {
  const result = {};
  for (const match of source.matchAll(/([:\w-]+)\s*=\s*(["'])(.*?)\2/gs)) {
    result[match[1].toLowerCase()] = match[3];
  }
  return result;
}

function recommendationCards() {
  return [...html.matchAll(/<article\b([^>]*data-recommendation-card[^>]*)>([\s\S]*?)<\/article>/gi)]
    .map((match) => ({ attributes: attributes(match[1]), html: match[2] }));
}

function anchors(source) {
  return [...source.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)]
    .map((match) => ({ attributes: attributes(match[1]), text: match[2].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() }));
}

pass(registry.version === 1, "recommended-product registry uses the supported schema version");
pass(validDate(registry.lastReviewed), "recommended-product registry has a valid review date");
pass(typeof registry.selectionPolicy === "string" && registry.selectionPolicy.length >= 120, "selection policy records the editorial and commercial standard");
pass(Array.isArray(registry.items) && registry.items.length > 0, "registry contains creator-workflow options without an arbitrary maximum");

const ids = new Set();
for (const item of registry.items) {
  const prefix = `registry item ${item.id || "(missing id)"}`;
  pass(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.id || ""), `${prefix} has a stable id`);
  pass(!ids.has(item.id), `${prefix} id is unique`);
  ids.add(item.id);
  pass(typeof item.name === "string" && item.name.length >= 3, `${prefix} has a name`);
  pass(["hardware", "software"].includes(item.kind), `${prefix} has a supported kind`);
  pass(Array.isArray(item.categories) && item.categories.length >= 2 && new Set(item.categories).size === item.categories.length, `${prefix} has distinct workflow categories`);
  pass(["amazon-associate", "saas-affiliate", "none"].includes(item.relationship), `${prefix} has an explicit commercial relationship`);
  pass(safeHttpsUrl(item.destinationUrl) && safeHttpsUrl(item.evidenceUrl), `${prefix} uses safe HTTPS destination and evidence URLs`);
  pass(validDate(item.checkedOn) && item.checkedOn === registry.lastReviewed, `${prefix} records the current review date`);

  const destination = new URL(item.destinationUrl);
  if (item.relationship === "amazon-associate") {
    const attributionValues = destination.searchParams.getAll("tag");
    pass(destination.hostname === "www.amazon.com" && /^\/dp\/[A-Z0-9]{10}$/.test(destination.pathname), `${prefix} uses a direct Amazon product destination`);
    pass(attributionValues.length === 1 && attributionValues[0].trim().length > 0 && [...destination.searchParams.keys()].length === 1, `${prefix} has one non-empty Amazon attribution parameter and no extras`);
    pass(item.affiliateProgramStatus === undefined, `${prefix} does not carry a SaaS application status`);
  } else if (item.relationship === "saas-affiliate") {
    pass(destination.hostname === "vidiq.com" && destination.pathname.length > 1 && destination.search === "", `${prefix} uses the provided official-domain SaaS referral URL without added parameters`);
    pass(item.affiliateProgramStatus === "active-link-provided", `${prefix} has an explicitly provided active affiliate link`);
  } else {
    pass(destination.search === "", `${prefix} is a clean direct link with no referral or campaign query`);
    pass(typeof item.affiliateProgramStatus === "string" && /not-(?:approved|enrolled)$/.test(item.affiliateProgramStatus), `${prefix} cannot imply an approved software relationship`);
  }
}

for (const category of ["audio", "video", "lighting", "mounting", "storage", "power"]) {
  const optionCount = registry.items.filter((item) => item.categories.includes(category)).length;
  pass(optionCount >= 2, `${category} workflow offers multiple choices instead of one default product`);
}

const cards = recommendationCards();
const cardIds = cards.map((card) => card.attributes["data-recommendation-id"]);
pass(cards.length === registry.items.length, "static page renders every registry item with no pagination or item cap");
pass(new Set(cardIds).size === cards.length, "static recommendation cards have unique ids");
pass(registry.items.every((item) => cardIds.includes(item.id)) && cardIds.every((id) => ids.has(id)), "page and registry contain the same recommendation ids");
pass(html.includes("As an Amazon Associate I earn from qualifying purchases."), "Amazon disclosure appears before the product catalog");
pass(html.indexOf("As an Amazon Associate I earn from qualifying purchases.") < html.indexOf('class="recommendation-cta paid-link"'), "Amazon disclosure precedes the first paid link");
pass(html.includes("All other software links are not affiliate links today."), "non-affiliate software relationships are stated plainly");
pass(html.includes("Amazon hardware buttons and the vidIQ software button on this page are affiliate links."), "current paid hardware and software relationships are stated plainly");
pass(!/TubeBuddy/i.test(html), "closed TubeBuddy program is absent from the new catalog");
pass(!/\b(?:Product|Review|Offer|AggregateRating|FAQPage)\b/.test([...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map((match) => match[1]).join("\n")), "structured data avoids unsupported product, review, offer, rating, and FAQ claims");

for (const item of registry.items) {
  const card = cards.find((candidate) => candidate.attributes["data-recommendation-id"] === item.id);
  if (!card) continue;
  const cardLinks = anchors(card.html);
  const destination = cardLinks.find((link) => link.attributes.href === item.destinationUrl);
  pass(Boolean(destination), `card ${item.id} renders its exact registry destination`);
  if (!destination) continue;
  const rel = new Set((destination.attributes.rel || "").split(/\s+/).filter(Boolean));
  pass(destination.attributes.target === "_blank" && rel.has("noopener") && rel.has("noreferrer"), `card ${item.id} protects its new-tab destination`);
  if (item.relationship !== "none") {
    pass(["nofollow", "sponsored"].every((token) => rel.has(token)), `card ${item.id} qualifies its paid link`);
    pass(/paid link/i.test(destination.text), `card ${item.id} labels compensation in the link text`);
    pass(/recommendation-label paid/i.test(card.html), `card ${item.id} carries a visible paid relationship label`);
  } else {
    pass(!rel.has("nofollow") && !rel.has("sponsored"), `card ${item.id} remains an ordinary non-commercial external link`);
    pass(/non-affiliate link/i.test(destination.text), `card ${item.id} labels the direct link as non-affiliate`);
    pass(/recommendation-label direct/i.test(card.html), `card ${item.id} carries a visible no-commission label`);
  }
}

pass(!/\bfetch\s*\(|XMLHttpRequest|sendBeacon|localStorage|sessionStorage/i.test(clientScript), "catalog filtering has no network or storage behavior");
pass(!/\.slice\s*\(|\.splice\s*\(/.test(clientScript), "catalog filtering does not truncate the product list");

if (failures) {
  console.error(`\n${failures} recommended-product integrity check(s) failed.`);
  process.exit(1);
}

console.log(`\nRecommended-product integrity passed for ${registry.items.length} options.`);
