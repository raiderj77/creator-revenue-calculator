/**
 * predeploy-check.js — Empire Build Standards compliance check for creatorrevenuecalculator.com
 * Validates: ads.txt, robots.txt, llms.txt, legal pages, cross-site links, security headers
 * Exit code 1 on failure, 0 on pass.
 */

import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

let failures = 0;

function pass(msg) {
  console.log(`  ✅ ${msg}`);
}

function fail(msg) {
  console.error(`  ❌ ${msg}`);
  failures++;
}

function check(label, fn) {
  console.log(`\n🔍 ${label}`);
  fn();
}

// ---------------------------------------------------------------------------
// 1. ads.txt
// ---------------------------------------------------------------------------
check("ads.txt", () => {
  const p = resolve(ROOT, "ads.txt");
  if (!existsSync(p)) return fail("ads.txt missing");
  const content = readFileSync(p, "utf-8");
  if (content.includes("pub-7171402107622932")) {
    pass("Publisher ID present");
  } else {
    fail("Publisher ID pub-7171402107622932 not found in ads.txt");
  }
  if (/OWNERDOMAIN/i.test(content)) {
    pass("OWNERDOMAIN directive present");
  } else {
    fail("OWNERDOMAIN directive missing from ads.txt");
  }
});

// ---------------------------------------------------------------------------
// 2. robots.txt — AI crawlers + Bingbot crawl-delay
// ---------------------------------------------------------------------------
check("robots.txt", () => {
  const p = resolve(ROOT, "robots.txt");
  if (!existsSync(p)) return fail("robots.txt missing");
  const content = readFileSync(p, "utf-8");

  const requiredCrawlers = [
    "OAI-SearchBot",
    "ChatGPT-User",
    "Claude-SearchBot",
    "PerplexityBot",
    "Applebot-Extended",
    "DuckAssistBot",
    "Amazonbot",
  ];
  for (const crawler of requiredCrawlers) {
    if (content.includes(crawler)) {
      pass(`${crawler} rule present`);
    } else {
      fail(`${crawler} rule missing from robots.txt`);
    }
  }

  const blockedCrawlers = ["Bytespider", "Meta-ExternalAgent"];
  for (const crawler of blockedCrawlers) {
    if (content.includes(crawler)) {
      pass(`${crawler} blocked`);
    } else {
      fail(`${crawler} not blocked in robots.txt`);
    }
  }

  if (/Bingbot[\s\S]*?Crawl-delay:\s*10/i.test(content)) {
    pass("Bingbot Crawl-delay: 10");
  } else {
    fail("Bingbot Crawl-delay: 10 missing");
  }

  if (content.includes("sitemap.xml")) {
    pass("Sitemap reference present");
  } else {
    fail("Sitemap reference missing from robots.txt");
  }
});

// ---------------------------------------------------------------------------
// 3. llms.txt
// ---------------------------------------------------------------------------
check("llms.txt", () => {
  const p = resolve(ROOT, "llms.txt");
  if (!existsSync(p)) return fail("llms.txt missing");
  const content = readFileSync(p, "utf-8");
  if (content.length > 100) {
    pass("llms.txt present and has content");
  } else {
    fail("llms.txt exists but appears empty or too short");
  }
});

// ---------------------------------------------------------------------------
// 4. Legal pages (privacy, terms, about, contact)
// ---------------------------------------------------------------------------
check("Legal pages", () => {
  const pages = ["privacy", "terms", "about", "contact"];
  for (const page of pages) {
    const html = resolve(ROOT, `${page}.html`);
    const tsx = resolve(ROOT, `src/app/${page}/page.tsx`);
    const jsx = resolve(ROOT, `src/app/${page}/page.jsx`);
    if (existsSync(html) || existsSync(tsx) || existsSync(jsx)) {
      pass(`/${page} page exists`);
    } else {
      fail(`/${page} page missing`);
    }
  }
});

// ---------------------------------------------------------------------------
// 5. Cross-site sister links
// ---------------------------------------------------------------------------
check("Cross-site links", () => {
  // Check index.html for static sites, or Footer.tsx for Next.js
  let footerContent = "";
  const footerPath = resolve(ROOT, "src/components/Footer.tsx");
  const indexPath = resolve(ROOT, "index.html");
  if (existsSync(footerPath)) {
    footerContent = readFileSync(footerPath, "utf-8");
  } else if (existsSync(indexPath)) {
    footerContent = readFileSync(indexPath, "utf-8");
  } else {
    return fail("No Footer.tsx or index.html found to check sister links");
  }

  const sisterSites = [
    "mindchecktools.com",
    "flipmycase.com",
    "fibertools.app",
    "contractextract.com",
    "medicalbillreader.com",
    "524tracker.com",
  ];
  for (const site of sisterSites) {
    if (footerContent.includes(site)) {
      pass(`Link to ${site}`);
    } else {
      fail(`Missing cross-site link to ${site} in footer`);
    }
  }
});

// ---------------------------------------------------------------------------
// 6. Security headers
// ---------------------------------------------------------------------------
check("Security headers", () => {
  // Check next.config.* for Next.js sites, or vercel.json for static sites
  let configContent = "";
  for (const name of ["next.config.mjs", "next.config.js", "next.config.ts", "vercel.json"]) {
    const p = resolve(ROOT, name);
    if (existsSync(p)) {
      configContent = readFileSync(p, "utf-8");
      break;
    }
  }
  if (!configContent) return fail("No next.config or vercel.json found — security headers not configured");

  const requiredHeaders = [
    "Strict-Transport-Security",
    "X-Content-Type-Options",
    "X-Frame-Options",
    "Referrer-Policy",
    "Permissions-Policy",
    "Content-Security-Policy",
  ];
  for (const header of requiredHeaders) {
    if (configContent.includes(header)) {
      pass(`${header} configured`);
    } else {
      fail(`${header} missing from security headers config`);
    }
  }
});

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------
console.log("\n" + "=".repeat(50));
if (failures > 0) {
  console.error(`\n💥 ${failures} check(s) FAILED — fix before deploying.\n`);
  process.exit(1);
} else {
  console.log("\n🎉 All predeploy checks passed.\n");
  process.exit(0);
}
