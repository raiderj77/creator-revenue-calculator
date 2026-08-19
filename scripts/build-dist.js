import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const DIST_DIRECTORY_NAME = "dist";
const DIST = path.resolve(ROOT, DIST_DIRECTORY_NAME);

const PUBLIC_FILES = [
  "404.html",
  "index.html",
  "about.html",
  "accessibility.html",
  "affiliate-disclosure.html",
  "contact.html",
  "cookies.html",
  "privacy.html",
  "terms.html",
  "4839d80770efc0e2a0d1233e321b2c43.txt",
  "ae01c4e060cc5f379845f7cdd6fe8d32.txt",
  "d84d23abe820200fa734d1d5e1108593.txt",
  "ads.txt",
  "llms.txt",
  "manifest.json",
  "robots.txt",
  "sitemap.xml",
  "assets/css/accessibility-audit-fixes.css",
  "assets/css/print-results.css",
  "assets/css/style.css",
  "assets/images/favicon.svg",
  "assets/images/logo.png",
  "assets/images/og-image.png",
  "assets/js/creator-mix-calculator.js",
  "assets/js/main.js",
  "assets/js/theme.js",
  "assets/vendor/fontawesome/LICENSE.txt",
  "assets/vendor/fontawesome/css/subset.css",
  "assets/vendor/fontawesome/webfonts/crc-icons-brands.woff2",
  "assets/vendor/fontawesome/webfonts/crc-icons-solid.woff2",
  "downloads/creator-revenue-tracker.xlsx",
  "downloads/patreon-income-tracker.csv",
  "tools/affiliate-calculator/index.html",
  "tools/affiliate-calculator/affiliate-calculator.css",
  "tools/affiliate-calculator/affiliate-calculator.js",
  "tools/affiliate-calculator/slider-sync.js",
  "tools/affiliate-calculator/tools-shared.css",
  "tools/engagement-rate/index.html",
  "tools/engagement-rate/engagement-calculator.css",
  "tools/engagement-rate/engagement-calculator.js",
  "tools/instagram-revenue/index.html",
  "tools/instagram-revenue/instagram-calculator.css",
  "tools/instagram-revenue/instagram-calculator.js",
  "tools/instagram-revenue/tools-shared.css",
  "tools/newsletter-revenue/index.html",
  "tools/newsletter-revenue/newsletter-calculator.css",
  "tools/newsletter-revenue/newsletter-calculator.js",
  "tools/patreon-revenue/index.html",
  "tools/patreon-revenue/patreon-calculator.css",
  "tools/patreon-revenue/patreon-calculator.js",
  "tools/patreon-revenue/slider-sync.js",
  "tools/podcast-revenue/index.html",
  "tools/podcast-revenue/podcast-calculator.css",
  "tools/podcast-revenue/podcast-calculator.js",
  "tools/podcast-revenue/tools-shared.css",
  "tools/sponsorship-rate/index.html",
  "tools/sponsorship-rate/sponsorship-calculator.css",
  "tools/sponsorship-rate/sponsorship-calculator.js",
  "tools/tiktok-revenue/index.html",
  "tools/tiktok-revenue/tiktok-calculator.css",
  "tools/tiktok-revenue/tiktok-calculator.js",
  "tools/tiktok-revenue/tools-shared.css",
  "tools/twitch-revenue/index.html",
  "tools/twitch-revenue/twitch-calculator.css",
  "tools/twitch-revenue/twitch-calculator.js",
  "tools/twitch-revenue/tools-shared.css",
  "tools/ugc-rate/index.html",
  "tools/ugc-rate/ugc-calculator.css",
  "tools/ugc-rate/ugc-calculator.js",
  "tools/youtube-ad-revenue/index.html",
  "tools/youtube-ad-revenue/youtube-calculator.css",
  "tools/youtube-ad-revenue/youtube-calculator.js",
].sort();

const EXPECTED_FILES = new Set(PUBLIC_FILES);
const CHECK_ONLY = process.argv.includes("--check");
const SITE_ORIGIN = "https://creatorrevenuecalculator.com";
const REPOSITORY_ONLY_PREFIXES = [
  ".github/",
  ".claude/",
  ".githooks/",
  "blog/",
  "content/",
  "context/",
  "data_sources/",
  "docs/",
  "guide/",
  "public/",
  "scripts/",
  "tools/finance-youtube-revenue/",
  "tools/gaming-youtube-revenue/",
];
const REPOSITORY_ONLY_EXTENSIONS = new Set([".md", ".py", ".sh", ".yaml", ".yml"]);

function fail(message) {
  throw new Error(message);
}

function toPosix(relativePath) {
  return relativePath.split(path.sep).join("/");
}

function assertSafeLayout() {
  if (path.dirname(DIST) !== ROOT || path.basename(DIST) !== DIST_DIRECTORY_NAME) {
    fail(`Refusing to operate on unexpected output path: ${DIST}`);
  }

  if (fs.existsSync(DIST) && (!fs.lstatSync(DIST).isDirectory() || fs.lstatSync(DIST).isSymbolicLink())) {
    fail(`Refusing to replace non-directory or linked output path: ${DIST}`);
  }

  if (new Set(PUBLIC_FILES).size !== PUBLIC_FILES.length) {
    fail("Public-file allowlist contains duplicates");
  }

  const caseFoldedPaths = PUBLIC_FILES.map((relativePath) => relativePath.toLowerCase());
  if (new Set(caseFoldedPaths).size !== caseFoldedPaths.length) {
    fail("Public-file allowlist contains a case-insensitive path collision");
  }

  for (const relativePath of PUBLIC_FILES) {
    if (relativePath !== path.posix.normalize(relativePath)
      || path.posix.isAbsolute(relativePath)
      || relativePath.startsWith("../")
      || relativePath.includes("/../")) {
      fail(`Unsafe public-file path: ${relativePath}`);
    }

    const basename = path.posix.basename(relativePath);
    if (relativePath.split("/").some((segment) => segment.startsWith("."))
      || REPOSITORY_ONLY_PREFIXES.some((prefix) => relativePath.startsWith(prefix))
      || REPOSITORY_ONLY_EXTENSIONS.has(path.posix.extname(relativePath).toLowerCase())
      || /^(?:package(?:-lock)?\.json|requirements(?:-[^.]+)?\.txt|vercel\.json|CNAME)$/i.test(basename)) {
      fail(`Repository-only path cannot enter the public-file allowlist: ${relativePath}`);
    }

    const source = path.resolve(ROOT, ...relativePath.split("/"));
    if (!source.startsWith(`${ROOT}${path.sep}`)) fail(`Public file escapes repository root: ${relativePath}`);
    if (!fs.existsSync(source)) fail(`Allowlisted public file is missing: ${relativePath}`);
    if (!fs.realpathSync(source).startsWith(`${fs.realpathSync(ROOT)}${path.sep}`)) {
      fail(`Public file resolves outside repository root: ${relativePath}`);
    }
    const stats = fs.lstatSync(source);
    if (!stats.isFile() || stats.isSymbolicLink()) fail(`Public file must be a regular file: ${relativePath}`);
  }
}

function walkFiles(directory, base = directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(directory, entry.name);
    const relativePath = toPosix(path.relative(base, absolute));
    const stats = fs.lstatSync(absolute);
    if (stats.isSymbolicLink()) fail(`Deployment output contains a symbolic link: ${relativePath}`);
    return stats.isDirectory() ? walkFiles(absolute, base) : [relativePath];
  });
}

function sha256(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function routeToFile(requestPath) {
  const pathname = requestPath.split(/[?#]/, 1)[0];
  if (!pathname || pathname === "/") return "index.html";
  const withoutLeadingSlash = pathname.replace(/^\/+/, "");
  return pathname.endsWith("/") ? `${withoutLeadingSlash}index.html` : withoutLeadingSlash;
}

function localRequestPath(rawValue, sourceFile) {
  const value = rawValue.trim();
  if (!value || value.startsWith("#") || /^(?:data|blob|javascript|mailto|tel):/i.test(value)) return null;
  if (value.startsWith("//")) return null;

  if (/^https?:\/\//i.test(value)) {
    const url = new URL(value);
    if (url.origin !== SITE_ORIGIN) return null;
    return url.pathname;
  }

  const requestPath = value.split(/[?#]/, 1)[0];
  if (!requestPath) return "/";
  if (requestPath.startsWith("/")) return requestPath;
  return `/${path.posix.normalize(path.posix.join(path.posix.dirname(sourceFile), requestPath))}`;
}

function verifyHtmlReferences(vercelConfig) {
  const redirectSources = new Set((vercelConfig.redirects || []).map((redirect) => redirect.source));
  const htmlFiles = PUBLIC_FILES.filter((relativePath) => relativePath.endsWith(".html"));

  for (const relativePath of htmlFiles) {
    const html = fs.readFileSync(path.join(DIST, ...relativePath.split("/")), "utf8");
    for (const match of html.matchAll(/\b(?:href|src)\s*=\s*["']([^"']+)["']/gi)) {
      const requestPath = localRequestPath(match[1], relativePath);
      if (!requestPath) continue;
      const target = routeToFile(requestPath);
      if (!EXPECTED_FILES.has(target) && !redirectSources.has(requestPath.split(/[?#]/, 1)[0])) {
        fail(`${relativePath} references a local path outside the public allowlist: ${match[1]}`);
      }
    }

    for (const match of html.matchAll(/\bsrcset\s*=\s*["']([^"']+)["']/gi)) {
      for (const candidate of match[1].split(",")) {
        const rawValue = candidate.trim().split(/\s+/, 1)[0];
        const requestPath = localRequestPath(rawValue, relativePath);
        if (!requestPath) continue;
        const target = routeToFile(requestPath);
        if (!EXPECTED_FILES.has(target)) {
          fail(`${relativePath} references a local srcset path outside the public allowlist: ${rawValue}`);
        }
      }
    }

    for (const match of html.matchAll(/https:\/\/creatorrevenuecalculator\.com(?:\/[A-Za-z0-9._~!$&'()*+,;=:@%\/-]*)?(?:\?[^\s"'<>]*)?(?:#[^\s"'<>]*)?/g)) {
      const requestPath = localRequestPath(match[0], relativePath);
      const target = routeToFile(requestPath);
      if (!EXPECTED_FILES.has(target) && !redirectSources.has(requestPath)) {
        fail(`${relativePath} contains a same-origin URL outside the public allowlist: ${match[0]}`);
      }
    }
  }
}

function verifyManifestReferences() {
  const manifest = JSON.parse(fs.readFileSync(path.join(DIST, "manifest.json"), "utf8"));
  const references = [manifest.start_url, ...(manifest.icons || []).map((icon) => icon.src)];
  for (const value of references) {
    const requestPath = localRequestPath(String(value || ""), "manifest.json");
    if (!requestPath) continue;
    const target = routeToFile(requestPath);
    if (!EXPECTED_FILES.has(target)) fail(`manifest.json references a missing public path: ${value}`);
  }
}

function verifyCssReferences() {
  for (const relativePath of PUBLIC_FILES.filter((file) => file.endsWith(".css"))) {
    const css = fs.readFileSync(path.join(DIST, ...relativePath.split("/")), "utf8");
    for (const match of css.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/gi)) {
      const requestPath = localRequestPath(match[1], relativePath);
      if (!requestPath) continue;
      const target = routeToFile(requestPath);
      if (!EXPECTED_FILES.has(target)) fail(`${relativePath} references a missing public asset: ${match[1]}`);
    }
  }
}

function verifyScriptReferences() {
  for (const relativePath of PUBLIC_FILES.filter((file) => file.endsWith(".js"))) {
    const script = fs.readFileSync(path.join(DIST, ...relativePath.split("/")), "utf8");
    for (const match of script.matchAll(/["'](\/assets\/[^"']+)["']/g)) {
      const target = routeToFile(match[1]);
      if (!EXPECTED_FILES.has(target)) fail(`${relativePath} references a missing public asset: ${match[1]}`);
    }
  }
}

function verifySitemapAndRedirects(vercelConfig) {
  const sitemap = fs.readFileSync(path.join(DIST, "sitemap.xml"), "utf8");
  const sitemapUrls = [...sitemap.matchAll(/<loc>(https:\/\/creatorrevenuecalculator\.com[^<]*)<\/loc>/g)]
    .map((match) => new URL(match[1]));
  if (sitemapUrls.length !== 19) fail(`Expected 19 sitemap URLs, found ${sitemapUrls.length}`);
  for (const url of sitemapUrls) {
    const target = routeToFile(url.pathname);
    if (!EXPECTED_FILES.has(target)) fail(`Sitemap URL is absent from the public allowlist: ${url.href}`);
  }

  if ((vercelConfig.redirects || []).length !== 58) {
    fail(`Expected 58 configured redirects, found ${(vercelConfig.redirects || []).length}`);
  }

  for (const redirect of vercelConfig.redirects || []) {
    if (!String(redirect.destination).startsWith("/")) continue;
    const target = routeToFile(redirect.destination);
    if (!EXPECTED_FILES.has(target)) fail(`Redirect destination is absent from the public allowlist: ${redirect.destination}`);
  }
}

function verifyDist() {
  if (!fs.existsSync(DIST)) fail("dist/ is missing; run npm run build:dist first");
  const actualFiles = walkFiles(DIST).sort();
  if (JSON.stringify(actualFiles) !== JSON.stringify(PUBLIC_FILES)) {
    const missing = PUBLIC_FILES.filter((file) => !actualFiles.includes(file));
    const unexpected = actualFiles.filter((file) => !EXPECTED_FILES.has(file));
    fail(`dist/ differs from the public allowlist; missing=${JSON.stringify(missing)} unexpected=${JSON.stringify(unexpected)}`);
  }

  for (const relativePath of PUBLIC_FILES) {
    const source = path.join(ROOT, ...relativePath.split("/"));
    const output = path.join(DIST, ...relativePath.split("/"));
    if (sha256(source) !== sha256(output)) fail(`Public output differs from source: ${relativePath}`);
  }

  const vercelConfig = JSON.parse(fs.readFileSync(path.join(ROOT, "vercel.json"), "utf8"));
  if (vercelConfig.outputDirectory !== DIST_DIRECTORY_NAME) {
    fail(`vercel.json must set outputDirectory to ${DIST_DIRECTORY_NAME}`);
  }
  if (vercelConfig.buildCommand !== "npm run build") fail("vercel.json must run the verified production build");
  const headerRules = vercelConfig.headers || [];
  if (headerRules.length !== 1) fail(`Expected one security-header rule, found ${headerRules.length}`);
  const headerNames = new Set((headerRules[0]?.headers || []).map((header) => header.key.toLowerCase()));
  const requiredHeaders = [
    "content-security-policy",
    "permissions-policy",
    "referrer-policy",
    "strict-transport-security",
    "x-content-type-options",
    "x-frame-options",
  ];
  for (const headerName of requiredHeaders) {
    if (!headerNames.has(headerName)) fail(`Required security header is missing: ${headerName}`);
  }
  verifyHtmlReferences(vercelConfig);
  verifyCssReferences();
  verifyScriptReferences();
  verifyManifestReferences();
  verifySitemapAndRedirects(vercelConfig);

  const forbidden = [
    ".github/workflows/quality.yml",
    "CLAUDE.md",
    "EMPIRE_BUILD_STANDARDS.md",
    "README.md",
    "SECURITY.md",
    ".vercelignore",
    "CNAME",
    "context/seo-guidelines.md",
    "data_sources/modules/google_analytics.py",
    "package.json",
    "public/2dddf30d179aa496fea9bdacffa89d34.txt",
    "scripts/quality-check.js",
    "tools/podcast-revenue/podcast-data-sources.md",
    "vercel.json",
  ];
  for (const relativePath of forbidden) {
    if (actualFiles.includes(relativePath)) fail(`Repository-only file leaked into dist/: ${relativePath}`);
  }

  const totalBytes = PUBLIC_FILES.reduce((sum, relativePath) => (
    sum + fs.statSync(path.join(DIST, ...relativePath.split("/"))).size
  ), 0);
  console.log(`Verified fail-closed dist/: ${PUBLIC_FILES.length} files, ${totalBytes.toLocaleString("en-US")} bytes.`);
}

function buildDist() {
  assertSafeLayout();
  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST, { recursive: true });
  for (const relativePath of PUBLIC_FILES) {
    const source = path.join(ROOT, ...relativePath.split("/"));
    const output = path.join(DIST, ...relativePath.split("/"));
    fs.mkdirSync(path.dirname(output), { recursive: true });
    fs.copyFileSync(source, output);
  }
  verifyDist();
}

assertSafeLayout();
if (CHECK_ONLY) verifyDist();
else buildDist();
