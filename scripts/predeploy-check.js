/**
 * predeploy-check.js, Empire Build Standards compliance check for creatorrevenuecalculator.com
 * Validates: ads.txt, robots.txt, llms.txt, legal pages, trust navigation, security headers
 * Exit code 1 on failure, 0 on pass.
 */

import { readFileSync, existsSync, readdirSync } from "fs";
import { resolve, dirname, relative } from "path";
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

function htmlFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if ([".git", "node_modules"].includes(entry.name)) return [];
    const absolute = resolve(directory, entry.name);
    if (entry.isDirectory()) return htmlFiles(absolute);
    return entry.isFile() && entry.name.endsWith(".html") ? [absolute] : [];
  });
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
  if (/^MANAGERDOMAIN=/im.test(content)) {
    fail("MANAGERDOMAIN must not name the publisher itself; add it only for a real primary or exclusive monetization manager");
  } else {
    pass("No unsupported MANAGERDOMAIN declaration");
  }
});

// ---------------------------------------------------------------------------
// 2. robots.txt, AI crawlers + Bingbot crawl-delay
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
// 4. Trust and legal pages
// ---------------------------------------------------------------------------
check("Legal pages", () => {
  const pages = ["privacy", "terms", "about", "contact", "cookies", "accessibility", "affiliate-disclosure"];
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
// 5. Privacy-sensitive scripts and retired-source quarantine
// ---------------------------------------------------------------------------
check("Privacy-safe static output", () => {
  const prohibitedHtmlPatterns = [
    /<script\b[^>]*src=["'][^"']*googletagmanager\.com/i,
    /\bgtag\s*\(\s*["']config["']/i,
    /clarity\.ms|\bclarity\s*\(/i,
    /Cookiebot/i,
    /pagead2\.googlesyndication\.com|\badsbygoogle\b/i,
  ];
  const offenders = htmlFiles(ROOT).filter((file) => {
    const content = readFileSync(file, "utf-8");
    return prohibitedHtmlPatterns.some((pattern) => pattern.test(content));
  });
  if (offenders.length === 0) {
    pass("No HTML file bypasses the shared consent manager or loads disabled ad/session-replay code");
  } else {
    offenders.forEach((file) => fail(`${relative(ROOT, file)} contains a prohibited direct tracking or advertising loader`));
  }

  const ignorePath = resolve(ROOT, ".vercelignore");
  if (!existsSync(ignorePath)) {
    fail(".vercelignore missing; retired source files could be uploaded");
    return;
  }
  const ignored = readFileSync(ignorePath, "utf-8")
    .split(/\r?\n/)
    .map((line) => line.trim().replace(/\/$/, ""));
  for (const retiredPath of ["blog", "content", "guide", "tools/finance-youtube-revenue", "tools/gaming-youtube-revenue"]) {
    if (ignored.includes(retiredPath)) {
      pass(`${retiredPath} is excluded from deployable output`);
    } else {
      fail(`${retiredPath} must be listed in .vercelignore`);
    }
  }
});

// ---------------------------------------------------------------------------
// 6. Trust navigation
// ---------------------------------------------------------------------------
check("Trust navigation", () => {
  let pageContent = "";
  const indexPath = resolve(ROOT, "index.html");
  if (existsSync(indexPath)) pageContent = readFileSync(indexPath, "utf-8");
  else return fail("index.html missing");

  const trustPages = [
    "/about.html",
    "/contact.html",
    "/privacy.html",
    "/terms.html",
    "/accessibility.html",
    "/affiliate-disclosure.html",
  ];
  for (const page of trustPages) {
    if (pageContent.includes(page)) {
      pass(`Homepage links ${page}`);
    } else {
      fail(`Homepage does not link ${page}`);
    }
  }
});

// ---------------------------------------------------------------------------
// 7. Security headers
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
  if (!configContent) return fail("No next.config or vercel.json found, security headers not configured");

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

  const vercelPath = resolve(ROOT, "vercel.json");
  if (!existsSync(vercelPath)) {
    fail("vercel.json missing; cannot verify the master X-Frame-Options policy");
    return;
  }

  try {
    const vercelConfig = JSON.parse(readFileSync(vercelPath, "utf-8"));
    const frameHeaders = (vercelConfig.headers || [])
      .flatMap((rule) => rule.headers || [])
      .filter((header) => String(header.key).toLowerCase() === "x-frame-options");
    if (frameHeaders.length > 0 && frameHeaders.every((header) => String(header.value).toUpperCase() === "DENY")) {
      pass("X-Frame-Options matches the master DENY policy");
    } else {
      fail("X-Frame-Options must be DENY in every Vercel header rule");
    }
  } catch (error) {
    fail(`vercel.json could not be parsed: ${error.message}`);
  }
});

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------
console.log("\n" + "=".repeat(50));
if (failures > 0) {
  console.error(`\n💥 ${failures} check(s) FAILED, fix before deploying.\n`);
  process.exit(1);
} else {
  console.log("\n🎉 All predeploy checks passed.\n");
  process.exit(0);
}
