/**
 * build-blog.mjs — Static blog generator for creatorrevenuecalculator.com
 *
 * Reads markdown files from content/blog/, converts to HTML, and writes
 * to blog/[slug]/index.html. Also updates sitemap.xml.
 *
 * Usage: node scripts/build-blog.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import html from "remark-html";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CONTENT_DIR = path.join(ROOT, "content", "blog");
const BLOG_OUTPUT_DIR = path.join(ROOT, "blog");
const SITEMAP_PATH = path.join(ROOT, "sitemap.xml");
const BASE_URL = "https://creatorrevenuecalculator.com";
const TODAY = new Date().toISOString().slice(0, 10);

// ── Helpers ──────────────────────────────────────────────────────────────────

function slugFromFilename(filename) {
  return filename.replace(/\.md$/, "").replace(/^\d{4}-\d{2}-\d{2}-/, "");
}

function parseKeywords(raw) {
  if (Array.isArray(raw)) return raw.map(String);
  if (typeof raw === "string") return raw.split(",").map((k) => k.trim()).filter(Boolean);
  return [];
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// ── Read posts ────────────────────────────────────────────────────────────────

function getAllPosts() {
  if (!fs.existsSync(CONTENT_DIR)) {
    console.warn(`⚠ content/blog/ not found — nothing to build.`);
    return [];
  }

  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md"));
  const postMap = new Map(); // slug → latest-date post data

  for (const filename of files) {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, filename), "utf-8");
    const { data, content } = matter(raw);

    // Skip if explicitly not published
    if (data.status && data.status !== "published") continue;

    const slug = (data.slug) || slugFromFilename(filename);
    const dateStr = data.date || "";

    // Deduplicate by slug — keep the most recent date version
    if (postMap.has(slug)) {
      const existing = postMap.get(slug);
      const existingDate = existing.date ? new Date(existing.date).getTime() : 0;
      const thisDate = dateStr ? new Date(dateStr).getTime() : 0;
      if (thisDate <= existingDate) continue;
    }

    postMap.set(slug, {
      slug,
      title: data.title || "",
      date: dateStr,
      description: data.description || "",
      keywords: parseKeywords(data.keywords),
      content,
      filename,
    });
  }

  return Array.from(postMap.values())
    .filter((p) => p.title)
    .sort((a, b) => {
      const da = a.date ? new Date(a.date).getTime() : 0;
      const db = b.date ? new Date(b.date).getTime() : 0;
      return db - da;
    });
}

// ── Convert markdown to HTML ──────────────────────────────────────────────────

async function markdownToHtml(mdContent) {
  const result = await remark()
    .use(remarkGfm)
    .use(html, { sanitize: false })
    .process(mdContent);
  return result.toString();
}

// ── Generate post HTML ────────────────────────────────────────────────────────

function generatePostHtml(post, bodyHtml) {
  const canonicalUrl = `${BASE_URL}/blog/${post.slug}/`;
  const ogImage = `${BASE_URL}/assets/images/og-image.png`;
  const titleEsc = escapeHtml(post.title);
  const descEsc = escapeHtml(post.description || post.title);
  const keywordsStr = post.keywords.length
    ? escapeHtml(post.keywords.join(", "))
    : "";
  const dateDisplay = formatDate(post.date);
  const dateIso = post.date || TODAY;

  const blogPostingSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description || post.title,
    datePublished: dateIso,
    dateModified: dateIso,
    url: canonicalUrl,
    mainEntityOfPage: canonicalUrl,
    image: ogImage,
    author: {
      "@type": "Organization",
      name: "Creator Revenue Calculator",
      url: BASE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Creator Revenue Calculator",
      url: BASE_URL,
    },
    keywords: post.keywords.join(", "),
  }, null, 2);

  const breadcrumbSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${BASE_URL}/blog/` },
      { "@type": "ListItem", position: 3, name: post.title, item: canonicalUrl },
    ],
  }, null, 2);

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="index, follow, max-snippet:-1">
    <link rel="canonical" href="${canonicalUrl}">
    <script src="/assets/js/theme.js"></script>
    <title>${titleEsc}</title>
    <meta name="description" content="${descEsc}">
    ${keywordsStr ? `<meta name="keywords" content="${keywordsStr}">` : ""}

    <!-- Open Graph -->
    <meta property="og:title" content="${titleEsc}">
    <meta property="og:description" content="${descEsc}">
    <meta property="og:type" content="article">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:image" content="${ogImage}">
    <meta property="article:published_time" content="${dateIso}">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${titleEsc}">
    <meta name="twitter:description" content="${descEsc}">
    <meta name="twitter:image" content="${ogImage}">

    <!-- Structured Data: BlogPosting -->
    <script type="application/ld+json">
${blogPostingSchema}
    </script>

    <!-- Structured Data: BreadcrumbList -->
    <script type="application/ld+json">
${breadcrumbSchema}
    </script>

    <link rel="stylesheet" href="/assets/css/style.css">
    <style>
        :root { --bg: #fff; --text: #111827; --card-bg: #ffffff; }
        [data-theme="dark"] { --bg: #0f172a; --text: #f1f5f9; --card-bg: #1e293b; }
        .article-container {
            max-width: 860px;
            margin: 40px auto;
            padding: 0 20px;
        }
        .article-card {
            background: var(--card-bg);
            border-radius: 16px;
            padding: 50px 60px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.08);
            line-height: 1.8;
            color: var(--text);
        }
        @media (max-width: 600px) {
            .article-card { padding: 28px 20px; }
        }
        .breadcrumb {
            font-size: 0.85rem;
            color: #888;
            margin-bottom: 20px;
        }
        .breadcrumb a { color: #6366f1; text-decoration: none; }
        .breadcrumb a:hover { text-decoration: underline; }
        .breadcrumb span { margin: 0 6px; color: #bbb; }
        .article-card h1 {
            font-size: 2.2rem;
            color: #4f46e5;
            margin-bottom: 8px;
            line-height: 1.25;
        }
        .article-meta {
            font-size: 0.85rem;
            color: #888;
            margin-bottom: 28px;
        }
        .revenue-disclaimer {
            background: #fffbeb;
            border-left: 4px solid #f59e0b;
            padding: 14px 18px;
            border-radius: 0 8px 8px 0;
            margin-bottom: 28px;
            font-size: 0.88rem;
            color: #92400e;
        }
        [data-theme="dark"] .revenue-disclaimer {
            background: #1c1a0f;
            border-left-color: #d97706;
            color: #fcd34d;
        }
        /* Prose styles for rendered markdown */
        .prose h2 {
            font-size: 1.55rem;
            color: #4f46e5;
            margin-top: 44px;
            margin-bottom: 16px;
        }
        .prose h3 {
            font-size: 1.15rem;
            color: var(--text);
            margin-top: 24px;
            margin-bottom: 10px;
            font-weight: 600;
        }
        .prose h4 {
            font-size: 1rem;
            color: var(--text);
            margin-top: 18px;
            margin-bottom: 8px;
            font-weight: 600;
        }
        .prose p { margin-bottom: 18px; }
        .prose ul, .prose ol {
            margin: 16px 0 18px 28px;
        }
        .prose li { margin-bottom: 8px; }
        .prose strong { font-weight: 700; }
        .prose em { font-style: italic; }
        .prose a { color: #6366f1; }
        .prose a:hover { text-decoration: underline; }
        .prose blockquote {
            border-left: 4px solid #6366f1;
            padding: 12px 20px;
            margin: 24px 0;
            background: #f0f0ff;
            border-radius: 0 8px 8px 0;
            color: #444;
            font-style: italic;
        }
        [data-theme="dark"] .prose blockquote {
            background: #1e1b4b;
            color: #c7d2fe;
        }
        .prose table {
            width: 100%;
            border-collapse: collapse;
            margin: 24px 0;
            font-size: 0.95rem;
            overflow-x: auto;
            display: block;
        }
        .prose th {
            background: #6366f1;
            color: white;
            padding: 12px 16px;
            text-align: left;
        }
        .prose td {
            padding: 10px 16px;
            border-bottom: 1px solid #eee;
        }
        .prose tr:nth-child(even) td { background: #f8f8ff; }
        [data-theme="dark"] .prose td { border-bottom-color: #334155; }
        [data-theme="dark"] .prose tr:nth-child(even) td { background: #1e1b4b; }
        .prose code {
            background: #f3f4f6;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 0.875em;
            font-family: 'Courier New', monospace;
        }
        [data-theme="dark"] .prose code { background: #374151; color: #e2e8f0; }
        .prose pre {
            background: #1f2937;
            color: #e2e8f0;
            padding: 20px;
            border-radius: 8px;
            overflow-x: auto;
            margin: 24px 0;
        }
        .prose pre code { background: none; padding: 0; color: inherit; }
        .prose hr {
            border: none;
            border-top: 2px solid #e5e7eb;
            margin: 36px 0;
        }
        .cta-box {
            background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
            color: white;
            border-radius: 12px;
            padding: 28px 32px;
            text-align: center;
            margin: 36px 0;
        }
        .cta-box h3 { color: white; margin: 0 0 10px; font-size: 1.25rem; }
        .cta-box p { color: rgba(255,255,255,0.88); margin-bottom: 18px; }
        .cta-box a {
            display: inline-block;
            background: white;
            color: #4f46e5;
            padding: 12px 32px;
            border-radius: 50px;
            text-decoration: none;
            font-weight: 700;
            font-size: 1rem;
        }
        .attribution {
            font-size: 0.82rem;
            color: #aaa;
            border-top: 1px solid #eee;
            padding-top: 18px;
            margin-top: 40px;
        }
        [data-theme="dark"] .attribution { border-top-color: #334155; }
        .nav-back {
            margin: 20px 0 0;
            font-size: 0.9rem;
        }
        .nav-back a { color: rgba(255,255,255,0.85); text-decoration: none; }
        .nav-back a:hover { text-decoration: underline; }
    </style>
    <!-- Microsoft Clarity -->
    <script type="text/javascript">
    (function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window,document,"clarity","script","vsqobt7va0");
    </script>
    <!-- Google Analytics 4 -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-144KWSY4TP"></script>
    <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-144KWSY4TP');</script>
</head>
<body>
    <div style="background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); padding: 16px 20px; display: flex; align-items: center; justify-content: space-between;">
        <a href="/" style="color: white; text-decoration: none; font-weight: 700; font-size: 1.1rem;">&#x1F4CA; Creator Revenue Calculator</a>
        <nav class="nav-back"><a href="/blog/">&#x2190; All Articles</a></nav>
    </div>

    <div class="article-container">
        <div class="article-card">

            <nav class="breadcrumb" aria-label="Breadcrumb">
                <a href="/">Home</a>
                <span aria-hidden="true">/</span>
                <a href="/blog/">Blog</a>
                <span aria-hidden="true">/</span>
                <span>${titleEsc}</span>
            </nav>

            <h1>${titleEsc}</h1>
            <p class="article-meta">${dateDisplay ? `Published ${dateDisplay} &middot; ` : ""}Creator Revenue Calculator &middot; Built by a digital marketing professional</p>

            <div class="revenue-disclaimer" role="note">
                <strong>Revenue Disclaimer:</strong> Revenue estimates are approximations based on publicly available data. Actual earnings may vary significantly.
            </div>

            <article class="prose">
                ${bodyHtml}
            </article>

            <div class="cta-box">
                <h3>Calculate Your Revenue Potential</h3>
                <p>Use our free tools to estimate earnings based on your platform, audience size, and niche.</p>
                <a href="/">Try the Free Calculator &rarr;</a>
            </div>

            <p class="attribution">Built by a digital marketing professional &middot; <a href="/about.html">About</a> &middot; <a href="/privacy.html">Privacy</a></p>

        </div>
    </div>

    <div style="background: #1e1b4b; color: white; padding: 28px 20px; text-align: center; margin-top: 48px;">
        <p style="font-size: 0.9rem; margin-bottom: 8px;">
            <a href="https://creatorrevenuecalculator.com" style="color:rgba(255,255,255,0.85);text-decoration:none;font-weight:600;">Creator Revenue Calculator</a> &middot;
            <a href="https://fibertools.app" style="color:rgba(255,255,255,0.7);text-decoration:none;">FiberTools</a> &middot;
            <a href="https://mindchecktools.com" style="color:rgba(255,255,255,0.7);text-decoration:none;">MindCheck Tools</a> &middot;
            <a href="https://flipmycase.com" style="color:rgba(255,255,255,0.7);text-decoration:none;">FlipMyCase</a> &middot;
            <a href="https://contractextract.com" style="color:rgba(255,255,255,0.7);text-decoration:none;">ContractExtract</a> &middot;
            <a href="https://medicalbillreader.com" style="color:rgba(255,255,255,0.7);text-decoration:none;">Medical Bill Reader</a>
        </p>
        <p style="color:rgba(255,255,255,0.5);font-size:0.8rem;">All calculations are estimates. Not financial advice.</p>
    </div>
</body>
</html>`;
}

// ── Update sitemap ────────────────────────────────────────────────────────────

function updateSitemap(posts) {
  if (!fs.existsSync(SITEMAP_PATH)) {
    console.warn("⚠ sitemap.xml not found — skipping sitemap update.");
    return;
  }

  let sitemap = fs.readFileSync(SITEMAP_PATH, "utf-8");

  let added = 0;
  for (const post of posts) {
    const url = `${BASE_URL}/blog/${post.slug}/`;
    if (sitemap.includes(url)) continue;

    const entry = `
  <url>
    <loc>${url}</loc>
    <lastmod>${post.date || TODAY}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;

    // Insert before </urlset>
    sitemap = sitemap.replace("</urlset>", `${entry}\n</urlset>`);
    added++;
  }

  fs.writeFileSync(SITEMAP_PATH, sitemap, "utf-8");
  if (added > 0) {
    console.log(`  ✅ sitemap.xml — added ${added} new URL(s)`);
  } else {
    console.log(`  ✅ sitemap.xml — all URLs already present`);
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log("\n📝 Building blog from content/blog/...\n");

  const posts = getAllPosts();

  if (posts.length === 0) {
    console.log("  No published posts found.");
    return;
  }

  console.log(`  Found ${posts.length} post(s) to build.\n`);

  let built = 0;
  let skipped = 0;

  for (const post of posts) {
    const outputDir = path.join(BLOG_OUTPUT_DIR, post.slug);
    const outputFile = path.join(outputDir, "index.html");

    // Don't overwrite manually crafted existing posts
    if (fs.existsSync(outputFile)) {
      // Check if it was generated by this script (has our generator marker)
      const existing = fs.readFileSync(outputFile, "utf-8");
      if (!existing.includes("<!-- generated:build-blog -->")) {
        console.log(`  ⏭  Skipping ${post.slug} — manually crafted HTML exists`);
        skipped++;
        continue;
      }
    }

    const bodyHtml = await markdownToHtml(post.content);
    const postHtml = generatePostHtml(post, bodyHtml);
    // Inject generator marker for future runs
    const finalHtml = postHtml.replace(
      "<!DOCTYPE html>",
      "<!DOCTYPE html>\n<!-- generated:build-blog -->"
    );

    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(outputFile, finalHtml, "utf-8");
    console.log(`  ✅ blog/${post.slug}/index.html`);
    built++;
  }

  console.log(`\n  Built: ${built} | Skipped (manual): ${skipped}`);

  updateSitemap(posts);

  console.log("\n✨ Blog build complete.\n");
}

main().catch((err) => {
  console.error("Build failed:", err);
  process.exit(1);
});
