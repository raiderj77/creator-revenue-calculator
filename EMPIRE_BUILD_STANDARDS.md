# EMPIRE BUILD STANDARDS

> **Read this file before making ANY changes to ANY Empire site.**
> This is the single source of truth for all development, compliance, and deployment decisions across the Empire portfolio.
> Last updated: March 9, 2026

---

## Table of Contents

1. [Empire Overview](#1-empire-overview)
2. [Site Registry](#2-site-registry)
3. [Code Conventions](#3-code-conventions)
4. [AdSense & Monetization](#4-adsense--monetization)
5. [Google Search Essentials & Spam Policies](#5-google-search-essentials--spam-policies)
6. [Core Web Vitals](#6-core-web-vitals)
7. [E-E-A-T & YMYL Compliance](#7-e-e-a-t--ymyl-compliance)
8. [Structured Data (JSON-LD)](#8-structured-data-json-ld)
9. [Mobile-First Indexing](#9-mobile-first-indexing)
10. [Bing-Specific Optimization](#10-bing-specific-optimization)
11. [GEO / AI Discoverability](#11-geo--ai-discoverability)
12. [Privacy & Consent](#12-privacy--consent)
13. [Accessibility (WCAG 2.1 AA)](#13-accessibility-wcag-21-aa)
14. [Security Headers](#14-security-headers)
15. [Sitemaps, robots.txt & Metadata](#15-sitemaps-robotstxt--metadata)
16. [Deployment & Pre-Deploy Checklist](#16-deployment--pre-deploy-checklist)
17. [Universal Warnings](#17-universal-warnings)

---

## 1. Empire Overview

The Empire is a portfolio of 7 websites: 5 utility tools (ad-supported via Google AdSense) and 2 micro-SaaS properties. All run Next.js on Vercel.

### Shared Configuration

- **Framework**: Next.js (all sites)
- **Deployment**: Vercel (all sites)
- **Language**: TypeScript preferred, JavaScript acceptable
- **Styling**: Tailwind CSS preferred, CSS Modules acceptable
- **Package Manager**: npm
- **AdSense Publisher ID**: `ca-pub-7171402107622932`
- **ads.txt content**: `google.com, pub-7171402107622932, DIRECT, f08c47fec0942fa0`
- **Amazon Associates ID**: `ytearnings-20`
- **Attribution Rule**: NEVER use the site owner's personal name anywhere in public-facing content, code, comments, or metadata. Use generic professional credentials instead.

### Compliance Tiers

Every site is assigned a compliance tier that determines which additional requirements apply beyond the universal baseline.

**Tier 1 — Standard**: All 15 sections of this document apply at baseline.
Sites: flipmycase.com, creatorrevenuecalculator.com

**Tier 2 — YMYL-Adjacent**: Tier 1 + legal disclaimers, document privacy, enhanced data handling disclosures.
Sites: contractextract.com, 524tracker.com

**Tier 3 — Full YMYL**: Tier 2 + health data privacy (GDPR Article 9, WA MHMDA, MD MODPA), crisis resources on every page, licensed professional review attribution, Cookiebot CMP, non-personalized ad consideration, AAA accessibility consideration for cognitive accessibility.
Sites: mindchecktools.com, medicalbillreader.com

**Tier 4 — Micro-SaaS**: Additional API security, document upload handling/deletion policies, freemium model compliance, upload privacy notices.
Sites: contractextract.com, medicalbillreader.com

A site can be in multiple tiers (e.g., medicalbillreader.com is both Tier 3 and Tier 4).

### Required Files (Every Site)

Every Empire site must have these files in `public/`:
- `ads.txt` — AdSense authorized sellers
- `robots.txt` — Crawler configuration including AI crawlers (template in Section 15)
- `sitemap.xml` — Auto-generated, submitted to Google and Bing
- `llms.txt` — LLM-friendly site summary in Markdown (format in Section 11)

Every Empire site must have these pages:
- `/privacy` — Privacy Policy
- `/terms` — Terms of Service
- `/about` — About page with verifiable organizational info
- `/contact` — Contact information

---

## 2. Site Registry

### fibertools.app
- **Type**: Utility (ad-supported) | **Tier**: Standard
- **Purpose**: Fiber arts calculators and tools for knitters, crocheters, and fiber artists
- **Key Tools**: Yarn weight calculator, gauge calculator, Vintage Pattern Decoder
- **Monetization**: AdSense + Amazon Associates (`ytearnings-20`)
- **Attribution**: "Created by a fiber arts expert with 30+ years experience"
- **Schema Types**: Organization, WebSite, WebApplication (per tool), BreadcrumbList
- **Special Rules**:
  - US crochet terminology ONLY (US single crochet = UK double crochet, etc.)
  - Yarn weights follow CYC standard: Lace (0), Fingering (1), Sport (2), DK (3), Worsted (4), Bulky (5), Super Bulky (6), Jumbo (7)
  - Pattern abbreviations must be industry-standard (k = knit, p = purl, ch = chain, sc = single crochet, dc = double crochet)
  - Vintage patterns need era context and terminology notes
  - Affiliate links must include `rel="nofollow sponsored"`
  - Social accounts: Pinterest, Instagram, Bluesky

### mindchecktools.com
- **Type**: Utility (ad-supported) | **Tier**: Full YMYL
- **Purpose**: Mental health screening tools (PHQ-9, GAD-7, AUDIT, AUDIT-C, Mental Load Calculator)
- **Monetization**: AdSense only (NO affiliate links on health content). Consider non-personalized ads on screening pages. No ads adjacent to crisis resources.
- **Attribution**: "Reviewed by a Certified Drug and Alcohol Counselor (CADC-II)"
- **Schema Types**: Organization, WebSite, WebApplication (per tool), FAQPage, Person (reviewer), BreadcrumbList
- **Cookiebot CMP**: CBID `a9a99ccb-4863-4e33-a895-a6d5642f408d`, pub ID `pub-7171402107622932`. Must load before any tracking/ad scripts.
- **Validated Instruments** (NEVER modify questions or scoring):
  - PHQ-9: 9 questions, scored 0-27 (0-4 minimal, 5-9 mild, 10-14 moderate, 15-19 moderately severe, 20-27 severe)
  - GAD-7: 7 questions, scored 0-21 (0-4 minimal, 5-9 mild, 10-14 moderate, 15-21 severe)
  - AUDIT: 10 questions, scored 0-40 (0-7 low risk, 8-15 hazardous, 16-19 harmful, 20+ possible dependence)
  - AUDIT-C: 3 questions, scored 0-12 (men ≥4 positive, women ≥3 positive)
- **Required Crisis Resources** (on EVERY page, non-dismissible):
  - 988 Suicide & Crisis Lifeline (call or text 988)
  - Crisis Text Line (text HOME to 741741)
  - SAMHSA Helpline (1-800-662-4357)
- **Required Disclaimer** (on EVERY screening page): "This screening tool is for informational and educational purposes only. It is not a diagnostic tool and should not be used as a substitute for professional evaluation, diagnosis, or treatment."
- **Health Data Privacy**: Treat ALL screening data as sensitive. NEVER pass health data to advertising systems. Process client-side where possible. See Section 12 for full requirements.
- **Accessibility**: Consider AAA criteria for cognitive accessibility (vulnerable users). Screen reader announcements for all results.
- **Security**: Use `Referrer-Policy: no-referrer` on screening pages to prevent health URLs leaking to third parties.

### flipmycase.com
- **Type**: Utility (ad-supported) | **Tier**: Standard
- **Purpose**: Text case conversion tool (UPPERCASE, lowercase, Title Case, Sentence case, aLtErNaTiNg, camelCase, PascalCase, snake_case, kebab-case)
- **Monetization**: AdSense
- **Attribution**: "Built by an experienced web developer"
- **Schema Types**: Organization, WebSite, WebApplication, BreadcrumbList
- **Special Rules**: Client-side conversions only (no server round-trips). Performance is critical — conversions must be instant.

### creatorrevenuecalculator.com
- **Type**: Utility (ad-supported) | **Tier**: Standard
- **Purpose**: YouTube and creator platform income estimation
- **Monetization**: AdSense + Amazon Associates (`ytearnings-20`) for creator equipment
- **Attribution**: "Built by a digital marketing professional"
- **Schema Types**: Organization, WebSite, WebApplication, BreadcrumbList
- **Required Disclaimer**: "Revenue estimates are approximations based on publicly available CPM data and industry averages. Actual earnings may vary significantly."
- **Special Rules**: Show revenue ranges (low-mid-high) not single numbers. Allow custom CPM input. Explain what CPM means. Affiliate links must include `rel="nofollow sponsored"`.

### contractextract.com
- **Type**: Micro-SaaS | **Tier**: YMYL-Adjacent + Micro-SaaS
- **Purpose**: Legal contract key-terms extractor using Claude API
- **Monetization**: Freemium model + AdSense on marketing/landing pages
- **Attribution**: "Built by an experienced web professional"
- **Schema Types**: Organization, WebSite, SoftwareApplication, BreadcrumbList
- **Additional Dependencies**: `@anthropic-ai/sdk`, PDF/DOCX parsing libraries
- **Required Disclaimer**: "This tool extracts key terms from legal documents for informational purposes only. It is not a substitute for professional legal advice."
- **API Integration**: Server-side only (Next.js API routes). ANTHROPIC_API_KEY in Vercel env var. Rate limiting required. Graceful error handling. Loading state during extraction (10-30s for long documents).
- **Document Handling**: Accept PDF and DOCX. Parse server-side. Delete after processing. 10MB max. Visible privacy notice during upload.
- **Special Rules**: Never store contracts longer than necessary. Never present extraction as legal advice. API key in env vars ONLY.

### medicalbillreader.com
- **Type**: Micro-SaaS | **Tier**: Full YMYL + Micro-SaaS
- **Purpose**: Medical bill analysis and explanation
- **Monetization**: Freemium model + AdSense on marketing pages
- **Attribution**: "Built by an experienced web professional"
- **Schema Types**: Organization, WebSite, SoftwareApplication, BreadcrumbList
- **Required Disclaimer**: "This tool provides general explanations of medical billing codes and charges for informational purposes only. It is not financial or medical advice."
- **Health Data Privacy**: Medical bills contain sensitive personal and health information. Delete immediately after analysis. No logging bill contents. Visible privacy notice during upload. HIPAA-adjacent sensitivity. See Section 12.
- **Special Rules**: Identify CPT, ICD-10, HCPCS codes in plain language. Flag potential billing errors. Explain insurance columns (allowed amount, patient responsibility). Always caveat as informational only.
- **Security**: Use `Referrer-Policy: no-referrer` on analysis pages.

### 524tracker.com
- **Type**: Utility (ad-supported + affiliate) | **Tier**: YMYL-Adjacent
- **Purpose**: Credit card application rules tracker — Chase 5/24, Amex once-per-lifetime, Citi 8/65, Bank of America 2/3/4, Capital One, and other bank velocity rules. Users log card applications; tool calculates eligibility and drop-off dates. All data stored in localStorage only.
- **Key Tools**: 5/24 & Bank Rules Tracker, Card Value Calculator, Best Cards by Category, Top Cards (affiliate), Rules Guide, Blog, FAQ
- **Monetization**: AdSense (pub-7171402107622932) + affiliate (CJ Affiliate)
- **Schema Types**: Organization, WebSite, WebApplication, FAQPage, BreadcrumbList
- **Tech Stack**: Next.js, React 19, Tailwind CSS 4, TypeScript, Vercel
- **Attribution**: "Built by an experienced web professional"
- **Required Disclaimers**: "This tool is for informational purposes only and does not constitute financial advice"
- **Special Rules**:
  - All card tracking data stored in localStorage only — never transmitted
  - Affiliate relationships must be disclosed on all card recommendation pages
  - Never guarantee card approval or bonus eligibility
  - Bank rules change frequently — pages must include last-verified dates
  - No financial advice — informational only

### Cross-Site Links

Every site footer links to the other 6 sister sites (never to itself):
- [FiberTools](https://fibertools.app)
- [MindCheck Tools](https://mindchecktools.com)
- [FlipMyCase](https://flipmycase.com)
- [Creator Revenue Calculator](https://creatorrevenuecalculator.com)
- [ContractExtract](https://contractextract.com)
- [Medical Bill Reader](https://medicalbillreader.com)
- [524 Tracker](https://524tracker.com)

---

## 3. Code Conventions

### Components & Architecture
- Functional components with hooks only (no class components)
- TypeScript where possible with types for all props and function signatures
- One component per file, small and focused
- Meaningful variable names (no single-letter names except loop counters)
- Always handle loading and error states in UI components
- Use `next/image` with explicit `width`/`height` for all images
- Use `next/link` for all internal links
- Use `next/font` for font loading (prevents CLS)
- Use SSR or SSG for ALL public pages (critical for Google, Bing, and AI crawlers)

### File Structure
```
src/
├── app/              # Next.js App Router pages
├── components/       # Reusable UI components
│   ├── ui/          # Generic UI primitives
│   └── [feature]/   # Feature-specific components
├── lib/             # Utility functions, API clients
├── hooks/           # Custom React hooks
├── types/           # TypeScript type definitions
└── styles/          # Global styles
public/
├── ads.txt          # AdSense (REQUIRED)
├── robots.txt       # Crawler config with AI crawlers (REQUIRED)
├── sitemap.xml      # SEO sitemap (REQUIRED)
├── llms.txt         # LLM site summary (REQUIRED)
└── images/          # Static images
```

### Git Conventions
- Branch from `main` for all work
- Descriptive branch names: `feature/add-calculator`, `fix/adsense-placement`
- Clear commit messages: `feat: add yarn weight calculator`, `fix: correct ads.txt publisher ID`
- Always test build locally before pushing: `npm run build`
- Never push directly to main without verifying build succeeds

---

## 4. AdSense & Monetization

### ads.txt (CRITICAL — incorrect ads.txt breaks ALL revenue)
- Serve at root: `https://domain.com/ads.txt`
- Content: `google.com, pub-7171402107622932, DIRECT, f08c47fec0942fa0`
- Include `OWNERDOMAIN` and `MANAGERDOMAIN` directives per IAB ads.txt v1.1 spec
- Must be accessible via HTTPS with 200 status code
- Validate in AdSense dashboard ads.txt management tool after any changes

### Ad Placement Rules
- Ads must NEVER exceed content volume on any page
- Label ads only as "Advertisements" or "Sponsored Links"
- No arrows, graphical gimmicks, or misleading images directing attention to ads
- No floating box scripts wrapping ads
- No CSS-hidden ad units (unless responsive ad units)
- No code modifications that inflate performance metrics
- Reserve explicit `width`/`height` on ALL ad containers — this is the #1 cause of CLS failures
- Mobile: follow Better Ads Standard — ads cannot push primary content below the fold

### Content & Traffic Policies
- Prohibited content near ads: adult material, violence, hate speech, medical misinformation, hacking, illicit drugs
- Zero tolerance for invalid traffic — no clicking own ads, no incentivizing clicks, no bot traffic
- Required pages for AdSense: About Us, Privacy Policy, Contact
- Health pages must not contain medical misinformation

### 2025-2026 Requirements
- **Referrer Ad Creative (RAC)**: Mandatory from November 1, 2025 for Related Search publishers. Must provide `referrerAdCreative` parameter with exact creative text when traffic arrives from controlled sources.
- **Google Consent Mode v2**: Mandatory for all sites. Configure all 6 parameters: `ad_storage`, `ad_user_data`, `ad_personalization`, `analytics_storage`, `functionality_storage`, `personalization_storage`.
- **Google-certified CMP with IAB TCF v2.2**: Required for serving personalized ads to EEA/UK/Switzerland users. Without it, Google stops serving personalized ads entirely.
- **GPP National v2**: Supported since September 2025 for US state privacy compliance across AdSense (covers CA, CO, CT, FL, VA).
- **YMYL sites**: Consider implementing non-personalized ads on health screening and medical bill analysis pages to avoid privacy concerns with sensitive health data.

### Amazon Associates
- Tag: `ytearnings-20`
- Used on: fibertools.app, creatorrevenuecalculator.com
- All affiliate links must include `rel="nofollow sponsored"` attribute

---

## 5. Google Search Essentials & Spam Policies

### Technical Requirements (all must pass)
- Googlebot is NOT blocked via robots.txt
- All public pages return HTTP 200 status codes
- Pages contain indexable content (not behind login, not `noindex`, publicly accessible)
- JavaScript-rendered content is crawlable — use SSR/SSG for ALL critical content

### Spam Policy Compliance (violation = potential deindexing)
- No cloaking (showing different content to search engines vs users)
- No doorway pages (thin pages targeting specific queries funneling to one destination)
- No link spam (buying/selling links, excessive exchanges, automated link programs)
- No hidden text or links (white-on-white, 0px font, single-character links)
- No scaled content abuse — mass-produced low-value pages violate policy regardless of whether AI or human-generated
- No scraped/republished content without substantial added value
- No sneaky redirects showing users unexpected content
- No thin affiliate pages without original value
- No expired domain abuse

### 2025-2026 Enforcement
- **Site reputation abuse** (tightened November 2024): Third-party content published to exploit host site's ranking signals is a violation regardless of oversight. AdSense ad units throughout pages are explicitly NOT site reputation abuse.
- **August 2025 spam update**: Specifically targeted site reputation abuse, scaled content abuse, and expired domain abuse.
- **AI content policy**: AI-generated content is permitted if it provides genuine value. AI-restated/paraphrased content rated as low quality per April 2025 Search Rater Guidelines.
- **Multi-site risk**: Running multiple sites with similar templates or content can trigger scaled content signals. Each Empire site MUST provide substantive, unique value.

---

## 6. Core Web Vitals

All three metrics are confirmed Google ranking factors, measured at the **75th percentile** of real Chrome user data (CrUX).

| Metric | Good | Needs Work | Poor |
|---|---|---|---|
| **LCP** (Largest Contentful Paint) | ≤ 2.5s | 2.5–4.0s | > 4.0s |
| **INP** (Interaction to Next Paint) | ≤ 200ms | 200–500ms | > 500ms |
| **CLS** (Cumulative Layout Shift) | ≤ 0.1 | 0.1–0.25 | > 0.25 |

INP replaced FID in March 2024. It measures responsiveness throughout the entire user session, not just the first interaction. This is harder to pass.

### How to Maintain CWV
- Reserve explicit `width`/`height` on ALL ad containers (top cause of CLS failures)
- Audit AdSense JavaScript impact on INP — heavy ad scripts degrade responsiveness
- Use `next/image` with `width`/`height` props to prevent image-driven layout shifts
- Use `next/font` to prevent font-loading layout shifts
- Leverage Vercel edge functions and ISR/SSR for LCP optimization
- Minimize third-party scripts in the critical rendering path

### Testing
- PageSpeed Insights: `https://pagespeed.web.dev/`
- CrUX Dashboard: Real user data from Chrome
- Lighthouse: `npx lighthouse https://domain.com --output json`

Bing has no formal Core Web Vitals program but considers speed and mobile-friendliness as signals.

---

## 7. E-E-A-T & YMYL Compliance

E-E-A-T stands for Experience, Expertise, Authoritativeness, and Trustworthiness. **Trust** is the central pillar. For YMYL (Your Money or Your Life) content — which includes mental health screening, medical bill analysis, and legal contract tools — Google applies the highest level of scrutiny.

### Experience
- Demonstrate first-hand knowledge in content (case studies, real-world testing, practical insights)
- Show demonstrated use of tools and products discussed

### Expertise
- Display author credentials (degrees, certifications, licenses) on every content page
- Create dedicated author bio pages with professional background and links
- Add Person schema on author pages (see Section 8)
- **YMYL sites**: Content MUST be authored or reviewed by licensed professionals with credentials clearly displayed

### Authoritativeness
- Build Organization structured data on homepage (see Section 8)
- Earn quality backlinks from professional organizations, .edu/.gov domains
- Maintain consistent brand naming across web, schema, social profiles, and directories

### Trustworthiness
- HTTPS on all pages (required)
- Comprehensive, up-to-date Privacy Policy and Terms of Service
- Transparent About page with verifiable organizational information, mission, and team credentials
- Readily accessible Contact information
- Editorial process description (especially for YMYL — explain how content is reviewed and fact-checked)

### YMYL Requirements for mindchecktools.com
- All content reviewed by licensed CADC-II professional with credentials displayed
- Crisis resources on EVERY page (988, Crisis Text Line 741741, SAMHSA 1-800-662-4357)
- Tools framed as supplementary to professional care — NEVER replacements for diagnosis or treatment
- Prominent disclaimers on every screening page
- Cite validated clinical instruments (PHQ-9, GAD-7) and authoritative sources (WHO, CDC, APA, PubMed)
- Content must never worsen conditions or delay treatment-seeking
- NEVER pass health screening data to advertising systems
- Anonymize any case studies

### YMYL Requirements for medicalbillreader.com
- Results are estimates, not financial or medical advice
- Explain calculation methodology transparently
- Healthcare billing expertise with verifiable credentials
- Cite authoritative sources (CMS, insurance industry standards)
- Clear privacy disclosures for medical billing data

### YMYL Requirements for contractextract.com
- Results are informational, not legal advice
- Legal disclaimer prominently displayed
- Never store contracts longer than necessary

---

## 8. Structured Data (JSON-LD)

Google's preferred format is JSON-LD. It helps search engines understand page content for rich results AND helps AI systems extract information for answers. Even deprecated rich result types (FAQPage, HowTo) still help AI parsing.

### Implementation Rules
- Use **JSON-LD format exclusively** (Google-preferred, easiest to maintain)
- Place in `<head>` or `<body>` — in Next.js, use `generateMetadata()` or `<Script>` component
- All markup MUST match visible page content exactly — no hidden or misleading schema
- All required properties must be present for each type
- Always include `dateModified` — critical freshness signal for both search and AI
- Keep structured data current — stale time-sensitive data disqualifies rich results
- Validate with Google Rich Results Test AND Bing Markup Validator

### Required Schema Per Page Type

**Homepage (all sites):**
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Site Name",
  "url": "https://domain.com",
  "logo": "https://domain.com/logo.png",
  "description": "Site description",
  "sameAs": ["social profile URLs"],
  "contactPoint": { "@type": "ContactPoint", "contactType": "customer support" }
}
```

**Each tool/calculator page:**
```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Tool Name",
  "url": "https://domain.com/tool",
  "applicationCategory": "UtilityApplication",
  "description": "What the tool does",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "operatingSystem": "All"
}
```

**Content/article pages:**
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Title",
  "image": "https://domain.com/image.jpg",
  "datePublished": "2025-01-01",
  "dateModified": "2025-06-15",
  "author": { "@type": "Person", "name": "Author credential", "url": "/about" },
  "publisher": { "@type": "Organization", "name": "Site Name" }
}
```

**All pages (BreadcrumbList):**
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://domain.com" },
    { "@type": "ListItem", "position": 2, "name": "Page", "item": "https://domain.com/page" }
  ]
}
```

**Author bio pages (Person):**
```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Professional credential (not personal name)",
  "jobTitle": "Relevant title",
  "sameAs": ["professional profile URLs"]
}
```

**FAQ sections (FAQPage):**
Still useful for AI answer extraction despite being deprecated for rich results on most sites. Health/government sites may still get FAQ rich results.

### 2025-2026 Changes
- FAQPage rich results restricted to authoritative health/government sites only — but schema still helps AI parsing
- HowTo rich results completely deprecated — schema still useful for AI
- 7 additional structured data features retired in 2025
- Bing now aligned on JSON-LD preference and actively uses Open Graph tags

---

## 9. Mobile-First Indexing

Google completed the transition to 100% mobile-first indexing in July 2024. ALL indexing and ranking signals come exclusively from the smartphone crawl.

### Requirements
- **Content parity**: Mobile version MUST contain ALL content from desktop — same text, headings, structured data, metadata
- Same `meta robots` tags on mobile and desktop
- Same structured data on mobile and desktop
- Responsive design (serve same HTML to all devices) — Google's preferred approach
- Viewport meta tag: `<meta name="viewport" content="width=device-width, initial-scale=1">`
- **Touch targets**: At least 48px wide/tall with adequate spacing
- **Body text**: Minimum 16px font size
- No intrusive interstitials (follow Google's popup guidelines)
- No lazy-loading of primary content that requires user interaction
- Do NOT block CSS, JS, or images from crawlers via robots.txt
- Follow Better Ads Standard for mobile ad placement

### Bing Difference
Bing has unified mobile/desktop indexing but still **leans desktop-first**. More critically, Bing's JavaScript rendering is severely limited. **SSR or SSG is MANDATORY for Bing compatibility.** If content is client-side rendered, Bingbot often marks pages as empty and does not index them. Use Next.js `generateMetadata()` for all critical meta tags.

---

## 10. Bing-Specific Optimization

Bing powers not just its own search but also **Microsoft Copilot, ChatGPT's Browse feature, DuckDuckGo, and Ecosia**. No Bing presence means no AI citation from any of these platforms.

### Requirements That Differ From Google
- **Include `<meta name="keywords">` tag** — Bing still recognizes it as a signal (Google ignores it entirely)
- **Social media engagement matters** — Bing confirms likes, shares, and engagement on Facebook, X, LinkedIn as ranking factors
- **Exact-match keywords** in titles, H1, meta descriptions, and URLs carry higher weight on Bing than Google's semantic approach
- **`Crawl-delay` directive supported** — add `Crawl-delay: 10` for Bingbot in robots.txt (Google ignores it)
- **Meta descriptions used more literally** — Bing displays them as-written more often than Google. Write longer, more descriptive meta descriptions.
- **Domain age** is a stronger trust signal for Bing (3+ year domains advantaged)
- **.edu and .gov backlinks** carry extra weight on Bing
- **No formal Core Web Vitals** — Bing considers speed but has no equivalent thresholds

### IndexNow (Push-Based Indexing)
IndexNow notifies search engines immediately when content changes, instead of waiting for them to discover changes via crawling. Supported by Bing, Yandex, Seznam, Naver, Yep. Google has NOT adopted IndexNow.

Implementation for Next.js on Vercel:
1. Generate API key via Bing Webmaster Tools or `openssl rand -hex 16`
2. Place `{API_KEY}.txt` in Next.js `/public` directory (served as static file)
3. Create API route (`/api/indexnow`) to submit URLs when content changes
4. POST to `https://api.indexnow.org/indexnow` with JSON body: `{ host, key, keyLocation, urlList }`
5. Store `INDEXNOW_API_KEY` in Vercel environment variables
6. Trigger submission on deploy via post-build scripts

### Bing Webmaster Tools
- Verify all 6 Empire properties (can bulk import from Google Search Console)
- Submit XML sitemaps to BWT
- Monitor AI Performance dashboard (public preview February 2026) — tracks citations across Copilot and Bing AI summaries

### Bing AI/Copilot Content Optimization (October 2025 Official Microsoft Guidance)
- Title, H1, and meta description must be **aligned and consistent** — AI uses these to interpret page scope
- Use **structured headings (H2/H3)** as chapter titles defining clear content slices for AI
- Write **Q&A-format content** with direct questions and clear answers — AI can lift these directly
- Include **lists, tables, and comparison formats** — highly extractable by AI systems
- Do NOT hide content behind tabs, accordions, or expandable menus — Bingbot doesn't click/expand
- Avoid PDFs for core information (lack structured signals)
- Avoid key information only in images — provide HTML text + alt text
- Anchor claims in **measurable facts with evidence** — data and cited sources build AI citation trust
- Keep content fresh — AI strongly prefers current information

---

## 11. GEO / AI Discoverability

AI-referred traffic increased 527% in early 2025. LLMs typically cite only 2–7 domains per response. Optimizing for AI citation is now a distinct discipline from traditional SEO.

### llms.txt (Required on All Sites)

Create `/llms.txt` at site root — a Markdown file that gives LLMs quick context about the site. Serve with `text/plain` MIME type, UTF-8 encoding.

**Format:**
```markdown
# Site Name

> Brief 1-2 sentence description of what this site does and who it's for.

## Main Tools
- [Tool Name](https://domain.com/tool-path): Brief description
- [Another Tool](https://domain.com/other-path): Brief description

## About
- [About Us](https://domain.com/about): Who we are and credentials
- [Privacy Policy](https://domain.com/privacy): How we handle data

## Optional
- [Blog](https://domain.com/blog): Articles and guides
- [FAQ](https://domain.com/faq): Common questions
```

Also create `/llms-full.txt` with full site documentation in Markdown — reduces LLM token consumption by 90%+ vs crawling HTML. For SaaS sites, include product capabilities, pricing, limits, comparisons, and FAQs.

### Content Structure for AI Citation

- **Answer-first format**: Lead every section with a direct 1–3 sentence answer, then elaborate
- **Self-contained sections**: Each H2/H3 section should be extractable as a standalone snippet
- **Question-based headings**: Mirror natural queries ("How does the yarn weight calculator work?")
- **Short paragraphs**: 2–4 sentences, 40–60 word blocks
- **50–70 word answer capsules** at the top of content sections for AI Overview eligibility
- Include **statistics and data** — boosts AI visibility 15–30% per research
- Add visible **"Last Updated" dates** on all content pages
- **Flesch readability score** above 60
- **SSR all critical content** — AI crawlers do NOT execute client-side JavaScript
- Set `<meta name="robots" content="index, follow, max-snippet:-1">` to allow full snippet extraction

### Google AI Overviews
- Appears in 50%+ of searches; 84% more likely on question-based queries
- 53% of #1-ranked pages appear in AI Overviews, but 40% of cited links come from outside top 10
- FAQ schema still helps AI Overviews despite being deprecated for regular rich results
- Build topical authority with content clusters, not just single pages
- Blocking `Google-Extended` does NOT prevent AI Overview inclusion — only blocking `Googlebot` does

### Perplexity Optimization
- Allow `PerplexityBot` in robots.txt
- Lead with answer in first 1–2 sentences
- One intent per URL — don't combine definition + tutorial + blog on one page
- Fast loading (under 3 seconds)
- HTML-first rendering (page must be readable with JS disabled)
- Create comparison tables in HTML (not images)

### E-E-A-T Signals That LLMs Use
- **Brand search volume** is the strongest predictor of AI citation
- **Branded web mentions** have strongest correlation with AI Overview inclusion
- **Consistent entity naming** across site, schema, social profiles, and directories
- Third-party presence: Wikipedia mentions, industry directories, review platforms, Reddit discussions
- First-party data (original research, benchmarks, case studies) dramatically increases citation likelihood

---

## 12. Privacy & Consent

### GDPR (EU/EEA Users) — Privacy Policy Must Include
- Identity and contact details of data controller (and DPO if applicable)
- Lawful basis for each type of processing
- Categories of personal data collected
- Purpose of processing for each category
- Data retention periods with specific timeframes
- All recipients/third parties data is shared with (including Google for AdSense)
- International data transfer safeguards (Standard Contractual Clauses)
- Data subject rights: access, rectification, erasure, restriction, portability, objection
- Right to withdraw consent and lodge complaints with supervisory authority
- Automated decision-making/profiling disclosures

### CCPA/CPRA (California Users)
- Categories, sources, and purposes of personal information collected in past 12 months
- Categories of third parties info is shared with
- **"Do Not Sell or Share My Personal Information"** link on homepage (conspicuous)
- Consumer rights: opt-out of sale/sharing, delete, correct, know, limit use of sensitive data
- Specific data retention periods
- Update privacy policy **every 12 months** (update effective date even if no substantive changes)
- **January 1, 2026**: New CCPA regulations expand definitions of sensitive personal data, updated transparency requirements

### Cookie Consent
- **EU/EEA/UK**: Opt-in model — prior affirmative consent REQUIRED before any tracking cookies fire. Pre-checked boxes do NOT qualify.
- **California**: Opt-out model — tracking permitted by default, but must honor Global Privacy Control (GPC) signals
- **15+ US states**: Must honor universal opt-out mechanisms and GPC signals
- Use Google-certified CMP with IAB TCF v2.2 integration for AdSense in EEA/UK/Switzerland
- TCF v2.2 requires: consent-only legal basis for personalization, total vendor count on initial banner, easy withdrawal

### Health Data Privacy (Tier 3 YMYL Sites)
- Treat ALL health screening data as **sensitive data** requiring explicit consent
- NEVER pass health screening data to advertising systems
- GDPR Article 9: Health data is special category data requiring explicit consent
- **Washington My Health My Data Act**: Protects "consumer health data" broadly — applies even to non-HIPAA entities
- **Maryland MODPA** (October 2025): Bans sale of sensitive data including health data
- Privacy policy must specifically address health data collection, processing, and retention
- Process screening results client-side where possible to minimize data exposure

### New US State Privacy Laws (2025-2026)
Tennessee (July 2025), Minnesota (July 2025), Maryland (October 2025), Indiana (January 2026), Kentucky (January 2026), Rhode Island (January 2026). All require: honor GPC, provide consumer rights (access, delete, correct, opt-out), conduct data protection impact assessments.

---

## 13. Accessibility (WCAG 2.1 AA)

WCAG 2.1 Level AA is the legal floor in the US under ADA case law. The **European Accessibility Act took effect June 28, 2025**, making WCAG compliance a legal requirement for any site serving EU consumers, with penalties up to 4% of annual revenue in France and €100K per violation in Germany.

### Perceivable
- Alt text on all images (`alt=""` for purely decorative images)
- **Color contrast**: Minimum 4.5:1 for normal text, 3:1 for large text (18pt+ or 14pt+ bold)
- Content resizable to 200% without loss of functionality
- Content reflows at 320px width with no horizontal scrolling
- Text spacing adjustable without content or functionality loss

### Operable
- ALL functionality available via keyboard — no keyboard traps
- Skip navigation links present on every page
- Descriptive, unique page titles
- Logical focus order and **visible focus indicators** on all interactive elements
- Touch/click targets at least **44×44 CSS pixels** with adequate spacing
- No content flashing more than 3 times per second

### Understandable
- Language declared via `lang` attribute on `<html>` element
- Consistent navigation across pages
- Form error identification with descriptive text messages
- Visible labels on all form fields (placeholders alone are NOT sufficient)
- Error prevention for legal/financial/data submissions (confirm, review, undo)

### Robust
- Valid HTML with proper semantic structure
- Proper ARIA roles, states, and properties where needed
- All UI components have accessible name, role, and value
- Dynamic content changes announced via ARIA live regions

### WCAG 2.2 Additions (Recommended Upgrade)
- **Focus Not Obscured**: Focused element not completely hidden by sticky headers, footers, or modals
- **Target Size (Minimum)**: Interactive targets at least 24×24 CSS pixels (or sufficient spacing)
- **Consistent Help**: Help mechanisms (FAQ, chat, contact) in same relative location across pages
- **Accessible Authentication**: No cognitive function tests (CAPTCHA) without alternatives

### European Accessibility Act
- Applies to ALL businesses providing products/services to EU consumers regardless of business location
- Exemption only for microenterprises (<10 employees AND <€2M turnover)
- Must publish an **accessibility statement** describing how requirements are met
- Penalties vary by member state

### Tool-Specific Accessibility
- YMYL sites (mindchecktools.com, medicalbillreader.com): Consider AAA criteria for cognitive accessibility given vulnerable users
- Interactive calculators: Results must be programmatically associated with inputs using semantic HTML
- All dynamic content changes in tools must be announced to screen readers
- **Overlay widgets (AccessiBe, UserWay) are NOT sufficient** for legal compliance and have been cited in ADA lawsuits — do not use them

---

## 14. Security Headers

Configure in `vercel.json` or `next.config.js` headers configuration.

### Required Headers
```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
```

For health content pages (mindchecktools.com, medicalbillreader.com), use `Referrer-Policy: no-referrer` to prevent health page URLs from leaking to third parties.

### Content Security Policy (AdSense-Compatible)
AdSense requires `unsafe-eval` — this is a known trade-off.
```
Content-Security-Policy:
  object-src 'none';
  script-src 'nonce-{random}' 'unsafe-inline' 'unsafe-eval' 'strict-dynamic' https: http:;
  base-uri 'none';
  report-uri https://your-report-collector/
```

- `strict-dynamic` allows nonce-trusted scripts to load their dependencies
- Apply nonce to ALL `<script>` tags including AdSense code
- Use `Content-Security-Policy-Report-Only` first to test before enforcing

### Permissions-Policy
```
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()
```
Disable all browser features not used by your tools. `interest-cohort=()` opts out of Google's Topics API.

### Cross-Origin Headers
- Do NOT enable strict COEP/COOP on pages running AdSense — they break ad rendering
- Use `Cross-Origin-Opener-Policy: unsafe-none` on pages with ads that open cross-origin popups
- Safe to use `Cross-Origin-Resource-Policy: same-origin` on non-ad pages

### TLS
- TLS 1.2 minimum required by all modern browsers
- TLS 1.3 recommended (faster, mandatory forward secrecy, ~70% of sites use it)
- Vercel automatically provisions and renews Let's Encrypt certificates
- Use `upgrade-insecure-requests` to auto-upgrade any remaining HTTP resources

---

## 15. Sitemaps, robots.txt & Metadata

### XML Sitemap
- UTF-8 encoded XML with proper declaration
- **50,000 URLs max** per sitemap file, **50 MB max** uncompressed
- Use sitemap index file if exceeding limits
- `<loc>`: Required — full absolute canonical URL
- `<lastmod>`: Recommended — W3C Datetime format, only update when content genuinely changes (the only optional tag Google uses)
- `<changefreq>` and `<priority>`: Ignored by Google — harmless to include but zero benefit
- Include image sitemaps for JavaScript-loaded images
- Submit to both Google Search Console and Bing Webmaster Tools
- Reference in robots.txt: `Sitemap: https://domain.com/sitemap.xml`
- In Next.js: use `app/sitemap.ts` or `app/sitemap.xml/route.ts` for dynamic generation

### robots.txt (Full Template)

Place in `/public/robots.txt`. Replace `DOMAIN` with actual domain for each site.

```
# Standard search engines
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /
Crawl-delay: 10

# AI search crawlers (ALLOW for visibility in AI answers)
User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: Claude-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Applebot
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: Amazonbot
Allow: /

User-agent: DuckAssistBot
Allow: /

# AI training crawlers (allow for maximum parametric knowledge)
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Google-Extended
Allow: /

# Block aggressive/low-value crawlers
User-agent: CCBot
Disallow: /

User-agent: Meta-ExternalAgent
Disallow: /

User-agent: Bytespider
Disallow: /

# Default
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /private/

Sitemap: https://DOMAIN/sitemap.xml
```

Note: `Claude-Web` and `anthropic-ai` are deprecated agent names — use the three-tier system above instead.

### Essential Metadata (Every Page)
- `<title>` — Unique, descriptive, under 60 characters
- `<meta name="description">` — Direct answer to page's main query, ~155 characters
- `<meta name="keywords">` — Include for Bing (Google ignores)
- `<meta name="robots" content="index, follow, max-snippet:-1">` — Allow full snippet extraction
- `<meta name="author">` — Author attribution
- `<link rel="canonical">` — Prevent duplicate content issues
- **Open Graph tags**: `og:title`, `og:description`, `og:image` (1200×630px minimum), `og:url`, `og:type`, `article:published_time`, `article:modified_time`, `article:author`
- **Semantic HTML5**: `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>`, `<aside>`, `<time datetime="...">`
- Proper heading hierarchy: One H1 per page, then H2 → H3, no skipping levels
- `id` attributes on headings for deep-linking

---

## 16. Deployment & Pre-Deploy Checklist

### Vercel Configuration
- **Platform**: Vercel
- **Production branch**: `main`
- **Build command**: `npm run build`
- **Output directory**: `.next`
- **Environment variables**: Store all API keys and secrets (ANTHROPIC_API_KEY, INDEXNOW_API_KEY, etc.) in Vercel dashboard — NEVER in code

### Pre-Deploy Checklist

Run through this EVERY time before deploying:

1. `npm run build` completes without errors
2. `npm run lint` passes (if configured)
3. `ads.txt` present at `public/ads.txt` with correct publisher ID
4. `robots.txt` present at `public/robots.txt` with AI crawler rules
5. `llms.txt` present at `public/llms.txt` and current
6. All legal pages render: `/privacy`, `/terms`, `/about`, `/contact`
7. Cross-site links present in footer (5 sister sites)
8. Security headers configured in `vercel.json` or `next.config.js`
9. Structured data validates (spot-check with Rich Results Test)
10. No personal name exposed anywhere in public-facing content
11. YMYL sites: Crisis resources visible, health disclaimers present
12. Mobile responsive: test at 320px width

---

## 17. Universal Warnings

Things Claude Code must NEVER do on ANY Empire site:

1. **Never expose the site owner's personal name** in any code, content, comments, metadata, or configuration
2. **Never modify ads.txt** unless explicitly asked — incorrect ads.txt stops ALL ad revenue
3. **Never remove legal pages** (privacy policy, terms of service) — creates legal exposure
4. **Never hardcode API keys** in any file — use environment variables exclusively
5. **Never push directly to main** without testing that `npm run build` succeeds
6. **Never remove sister site cross-links** from the footer
7. **Never remove or weaken security headers** (HSTS, CSP, X-Frame-Options, etc.)
8. **Never remove accessibility features** (alt text, ARIA attributes, focus indicators, skip nav links, lang attribute)
9. **Never remove llms.txt** or AI crawler rules from robots.txt
10. **Never remove crisis resources** from mindchecktools.com (988, Crisis Text Line, SAMHSA)
11. **Never present screening results as diagnoses** on mindchecktools.com
12. **Never modify validated screening instruments** (PHQ-9, GAD-7, AUDIT, AUDIT-C) — their questions and scoring are clinically standardized
13. **Never place ads adjacent to crisis resources** on mindchecktools.com
14. **Never pass health data to advertising systems** on YMYL sites
15. **Never store uploaded documents** (contracts, medical bills) longer than necessary on micro-SaaS sites
16. **Never confuse US and UK crochet terminology** on fibertools.app
17. **Never use incorrect yarn weight classifications** on fibertools.app
18. **Never present revenue estimates as guaranteed earnings** on creatorrevenuecalculator.com

---

## Empire Skills

Custom skills for cross-site management are available at `~/empire-skills/`:

- **empire-sitesync** (`~/empire-skills/empire-sitesync/SKILL.md`) — 12-category site audits, sync checks, and dashboards
- **empire-projectfiles** (`~/empire-skills/empire-projectfiles/SKILL.md`) — Per-site CLAUDE.md generation and syncing

When performing cross-site operations, read the relevant SKILL.md first.

---

*This document is the master source of truth. Per-site CLAUDE.md files derive from this document. If there is a conflict between a per-site CLAUDE.md and this document, this document wins unless there is a documented site-specific exception.*
