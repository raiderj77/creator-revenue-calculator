# EMPIRE BUILD STANDARDS
# The quality gate for EVERYTHING built across all 4 sites.
# Claude Code and Cowork must check every section before shipping.

---

## 1. LEGAL COMPLIANCE CHECKLIST

Every site MUST have these pages. No exceptions.

### Required Legal Pages
- Privacy Policy (REQUIRED BY LAW if you collect ANY data)
  - AdSense sets cookies = you collect data = you need this
  - Must disclose: what data collected, how used, who shared with, user rights
  - Must comply with: CCPA/CPRA (California), GDPR (if EU visitors), CalOPPA
  - Generate at https://www.termsfeed.com or https://termly.io (free tiers available)
  - Link in footer of EVERY page
- Terms of Use / Terms and Conditions
  - Protects your IP, limits liability, sets user behavior rules
  - Especially important for tool sites (limits liability for tool output)
  - Link in footer of EVERY page
- Cookie Policy (REQUIRED if using AdSense or any analytics)
  - flipmycase.com already has cookie consent banner (use as template for other sites)
  - Must explain what cookies, why used, how to opt out
  - GDPR requires consent BEFORE setting non-essential cookies
- Disclaimer Page
  - General: "Tools are for informational purposes only"
  - mindchecktools.com SPECIFIC: "Not a medical diagnosis. Not a substitute for professional help."
  - Include on every tool page AND as standalone page
- Accessibility Statement
  - mindchecktools.com and flipmycase.com already have this
  - State your commitment to WCAG 2.2 Level AA compliance
  - Provide contact info for accessibility issues
  - fibertools.app and creatorrevenuecalculator.com still need this

### Per-Page Legal Requirements
- Clinical disclaimer on EVERY mindchecktools tool (already done)
- SAMHSA hotline 1-800-662-4357 on EVERY mindchecktools tool (already done)
- 988 Suicide and Crisis Lifeline on EVERY mindchecktools tool (already done)
- AdSense disclosure: "This site contains ads" (check Google's current requirements)
- Affiliate disclosure on any page with affiliate links (FTC requirement)
- Copyright notice in footer: (c) 2026 [Site Name]. All rights reserved.

### What NOT To Do
- Do NOT use AI to generate legal policies (use a generator service instead)
- Do NOT copy another site's privacy policy (copyright violation)
- Do NOT put Jason's personal name on any public-facing legal page
- Do NOT make medical claims on mindchecktools (screening only, never diagnosis)
- Do NOT collect unnecessary user data (tools should process in-browser only)

---

## 2. SEO STANDARDS

Every page must pass this checklist before going live.

### On-Page SEO (Every Single Page)
- Title tag: under 60 characters, primary keyword near the front
- Meta description: under 155 characters, includes CTA ("Free", "Instant", "No signup")
- Single H1 tag containing primary keyword
- Heading hierarchy: H1 > H2 > H3 (never skip levels)
- URL slug: short, keyword-rich, lowercase, hyphens only
- Image alt text on every image (descriptive, not stuffed)
- Internal links: 2-3 links to related pages on the same site
- External links: 1-2 links to authoritative sources (studies, official guidelines)
- Canonical URL tag on every page
- OG metadata (title, description, image) for social sharing
- Structured data (see Schema section below)

### Schema Markup (JSON-LD)
Every tool page gets ALL of these:
- SoftwareApplication schema (name, description, applicationCategory, offers: free)
- FAQPage schema (minimum 5 questions per tool)
- BreadcrumbList schema
- Organization schema (site-wide, in layout)

Every blog post gets:
- Article schema (headline, author, datePublished, dateModified)
- FAQPage schema if FAQ section exists
- BreadcrumbList schema

### Content Structure for Tool Pages
1. H1 with primary keyword
2. Brief intro (1-2 sentences: what it does, who it's for)
3. The interactive tool (above the fold on desktop)
4. "How to Use This [Tool Name]" section (H2)
5. "Understanding Your Results" section (H2) - for screening tools
6. Educational content about the topic (H2, 300-500 words minimum)
7. FAQ section (H2, 5-8 questions as H3s, with FAQPage schema)
8. "Related Tools" section with internal links
9. Clinical disclaimer (mindchecktools only)
10. Crisis resources (mindchecktools only)

### Technical SEO
- robots.txt: allow all crawlers, link to sitemap
- sitemap.xml: auto-generated, includes all public pages
- Page load under 3 seconds (Core Web Vitals)
- Mobile responsive (test on actual phone, not just dev tools)
- HTTPS everywhere (Vercel handles this)
- No broken links (check before every deploy)
- No duplicate content across pages
- Hreflang tags if targeting multiple languages (not needed yet)

### Keyword Strategy
- Target long-tail keywords with low competition first
- Every tool page targets ONE primary keyword
- Use format: "[tool type] + [modifier]" e.g. "PHQ-9 depression test online free"
- Check actual SERPs before targeting (search the keyword, see who ranks)
- Hub-and-spoke: tool pages are hubs, blog posts are spokes linking back

---

## 3. LLM / AI SEARCH VISIBILITY

Google AI Overviews now appear in 60% of searches. Perplexity, ChatGPT search, and Claude search are growing. Your content needs to be visible to both traditional search AND AI systems.

### llms.txt File (Every Site)
Already on mindchecktools.com and flipmycase.com. Needs to be on all sites.

Structure:
```
# [Site Name]

> [One sentence: what this site does]

[2-3 sentences of context about the site and its tools]

## Tools
- [Tool Name](url): Brief description
- [Tool Name](url): Brief description

## Guides
- [Guide Name](url): Brief description

## About
- [About Page](url)
- [Contact Page](url)
```

### llms-full.txt (Optional but Recommended)
A comprehensive markdown version of your entire site content. More work to maintain but gives AI models your full context. Consider auto-generating from your sitemap.

### Content Optimized for AI Extraction
AI models pull answers from content that is:
- Direct answers in the first paragraph (answer the question, then elaborate)
- Clear heading hierarchy (H2, H3, H4) that makes content scannable
- Bulleted lists and comparison tables for structured info
- Concrete data with citations (numbers, percentages, study references)
- FAQ format (question as heading, answer as paragraph)
- Simple, conversational language matching natural queries

### Schema Markup for AI
Same schema that helps Google also helps AI models understand your content.
SoftwareApplication, FAQPage, Article, and HowTo schemas all feed into AI extraction.

### What Helps AI Visibility
- Answer high-intent questions directly at the top of the page
- Use the exact phrasing people would ask ("What is a PHQ-9 score of 15?")
- Provide authoritative, cited information
- Keep content updated with clear timestamps
- Make sure your site loads clean HTML (not JavaScript-heavy SPAs that AI can't read)
  - Next.js SSR/SSG helps here: your pages render as HTML by default

### What Doesn't Help (Yet)
- llms.txt adoption by AI providers is still limited as of early 2026
- No confirmed evidence that llms.txt directly improves AI retrieval
- BUT: it's zero-cost to implement, and it helps organize your own content
- Implement it, but don't rely on it as your only AI visibility strategy

---

## 4. ACCESSIBILITY STANDARDS (WCAG 2.2 Level AA)

Accessibility is both a legal requirement (ADA) and an SEO signal. Accessible sites rank higher.

### Critical Requirements for Interactive Tools
- All tools fully operable by keyboard only (Tab, Enter, Arrow keys)
- Focus indicators visible on all interactive elements (buttons, inputs, sliders)
- Focus never trapped (user can always Tab away from a component)
- Form inputs have visible labels (not just placeholder text)
- Error messages are clear and associated with the input that caused them
- Color is never the only way to convey information (add text/icons too)
- Sufficient color contrast: 4.5:1 for normal text, 3:1 for large text
- Touch targets minimum 44x44 CSS pixels on mobile
- No content depends on drag gestures without a click alternative
- ARIA roles and labels where HTML semantics aren't sufficient
- Screen reader announces results when tool produces output (aria-live region)

### Page-Level Requirements
- Skip navigation link ("Skip to main content") on every page
- Meaningful page title (matches H1)
- Language attribute on HTML element (lang="en")
- Headings in logical order (never skip H2 to H4)
- All images have alt text (decorative images get alt="")
- Links have descriptive text (never "click here")
- Tables have proper headers (th elements with scope)
- No auto-playing media
- Text resizable to 200% without breaking layout
- Content readable and functional at 320px viewport width

### Testing Protocol
Before every deploy:
1. Tab through every interactive element on the page
2. Check with browser zoom at 200%
3. Run Lighthouse accessibility audit (target 90+)
4. Check color contrast with browser dev tools
5. Test on actual mobile device (not just responsive mode)

---

## 5. UI/UX STANDARDS

### Core Principles
- Tool works INSTANTLY: no signup, no email gate, no paywall before results
- Results visible without scrolling after submission
- Mobile-first design (most traffic is mobile)
- One clear action per screen (don't overwhelm)
- Visual hierarchy: tool first, education second, ads never blocking
- Consistent design language within each site

### Tool Page UX Pattern
- Tool above the fold on desktop (visible without scrolling)
- Clear input labels and placeholder examples
- Single prominent action button ("Calculate", "Check My Score", "Convert")
- Results appear immediately below the tool
- Results are printable and shareable (print/share buttons)
- Related tools visible but not competing for attention

### Performance
- Largest Contentful Paint (LCP): under 2.5 seconds
- First Input Delay (FID): under 100 milliseconds
- Cumulative Layout Shift (CLS): under 0.1
- Total page weight: under 500KB ideally, under 1MB maximum
- Images: use next/image for automatic optimization
- Fonts: use system fonts or subset web fonts (no loading 400KB of Google Fonts)

### AdSense Placement Rules
- Maximum 2-3 ad units per page
- NEVER place an ad between the tool input and the tool results
- NEVER place an ad that blocks the tool from being used
- Ad placements: one above tool (banner), one below results, one in educational content
- Ads must be clearly distinguishable from content
- Test that ads don't cause layout shift (CLS impact)

### Mobile Specific
- Touch targets 44px minimum
- No horizontal scrolling
- Font size minimum 16px (prevents iOS zoom on input focus)
- Adequate spacing between interactive elements
- Test on real devices (iPhone SE is good minimum size test)

---

## 6. COMPETITIVE EDGE STANDARDS

### What Makes a Tool Page Beat Competitors
1. Tool works instantly (competitors often require signup)
2. Better educational content below the tool (not just the tool alone)
3. FAQ section answers real questions (check "People Also Ask" in Google)
4. Schema markup that competitors miss (SoftwareApplication + FAQPage)
5. Faster page load than competitors
6. Mobile experience that actually works (many competitor tools break on mobile)
7. Print/share functionality (competitors rarely offer this)
8. Internal linking to related tools (builds topical authority)
9. E-E-A-T signals (especially mindchecktools: clinical credentials, crisis resources)
10. Regular updates with visible timestamps ("Last updated: [date]")

### Competitive Intelligence Routine
Monthly, for each site:
1. Search your top 5 keywords, note who ranks 1-5
2. Check if competitors added new tools since last check
3. Note any competitor schema markup you're missing
4. Check competitor page speed vs yours
5. Look for keywords in "People Also Ask" that you don't cover yet
6. Log findings in a competitor-watch file

### Defensibility Checklist
- Every tool has educational content competitors don't bother writing
- FAQ section has unique questions not found on competitor pages
- Content references specific studies or official guidelines
- Tools process data client-side (privacy advantage over server-side competitors)
- llms.txt file makes your content AI-accessible before competitors do it
- Accessibility compliance (most competitors fail this entirely)

---

## 7. DEPLOYMENT CHECKLIST

Run this checklist before EVERY push to main.

### Pre-Deploy
- [ ] Code builds without errors (npm run build)
- [ ] No TypeScript errors
- [ ] All links work (no 404s)
- [ ] Mobile responsive (checked at 320px, 375px, 768px, 1024px)
- [ ] Lighthouse performance score 90+
- [ ] Lighthouse accessibility score 90+
- [ ] Lighthouse SEO score 90+
- [ ] Title tag present and under 60 chars
- [ ] Meta description present and under 155 chars
- [ ] OG metadata present
- [ ] Schema markup valid (test with Google Rich Results Test)
- [ ] Internal links point to correct pages
- [ ] Images have alt text
- [ ] Tool works correctly with keyboard only
- [ ] Print/share buttons work
- [ ] AdSense ads don't block content

### Post-Deploy
- [ ] Live URL loads correctly
- [ ] Run live page through PageSpeed Insights
- [ ] Check Google Search Console for any new errors
- [ ] Submit new page URL for indexing in GSC
- [ ] Update sitemap if new page added
- [ ] Update llms.txt if new tool added
- [ ] Log the deploy in Wins Log with date

---

## 8. SITE-SPECIFIC OVERRIDES

### mindchecktools.com (YMYL = Your Money or Your Life)
Google holds health content to the HIGHEST standard. Extra requirements:
- Every claim must be evidence-based or clearly labeled as general information
- Clinical disclaimers on EVERY tool page AND in results
- Crisis resources on EVERY page
- Author bio: "Reviewed by a Certified Drug and Alcohol Counselor (CADC-II)"
- No personal name in author bios
- Link to official sources (SAMHSA, NIMH, WHO) where relevant
- Never use words: "diagnose", "diagnosis", "cure", "treatment plan"
- Always use words: "screening", "assessment", "check", "may indicate"
- HIPAA-style privacy: all processing in browser, no data sent to server

### fibertools.app
- Assume reader knows basic fiber arts terminology
- Link to yarn brand references where helpful
- Unit conversion accuracy is critical (double-check all math)
- Pattern terminology must be correct (gauge, WPI, needle sizes)

### flipmycase.com
- Developer-focused: clean, fast, minimal
- GDPR cookie consent on all pages (already implemented)
- Cross-browser testing important (text tools used by developers on many browsers)

### creatorrevenuecalculator.com
- Static HTML: different deployment workflow (GitHub Pages, not Vercel)
- Calculations must be accurate and based on current platform rates
- Update rates periodically (YouTube CPM, TikTok creator fund, etc.)

---

## 9. SECURITY HEADERS

Every site must return these HTTP response headers on every page. Vercel handles some automatically; others require next.config.js customization. Missing headers = Lighthouse Best Practices penalty + credibility signal for Google.

### Required Headers (Verify with curl -I or PageSpeed Insights)

| Header | Required Value | Who Sets It | Priority |
|--------|---------------|-------------|----------|
| Strict-Transport-Security | max-age=63072000; includeSubDomains; preload | next.config.js | 🔴 CRITICAL |
| X-Content-Type-Options | nosniff | Vercel (auto) | ✅ Usually present |
| X-Frame-Options | SAMEORIGIN | next.config.js | 🔴 CRITICAL |
| Referrer-Policy | strict-origin-when-cross-origin | next.config.js | 🟡 IMPORTANT |
| Permissions-Policy | camera=(), microphone=(), geolocation=() | next.config.js | 🟡 IMPORTANT |
| Content-Security-Policy | See template below | next.config.js | 🟡 IMPORTANT |
| Cross-Origin-Opener-Policy | same-origin | next.config.js | 🟢 NICE TO HAVE |

### next.config.js Security Header Template

```javascript
const securityHeaders = [
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()'
  },
  {
    key: 'Cross-Origin-Opener-Policy',
    value: 'same-origin'
  }
];

module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};
```

### Content-Security-Policy Notes
- Do NOT use `unsafe-eval` in production (Lighthouse Best Practices penalty)
- AdSense requires `unsafe-inline` for styles — accept this tradeoff, document it
- Test CSP changes carefully — a misconfigured CSP will break AdSense ads
- Use Report-Only mode first: `Content-Security-Policy-Report-Only` before enforcing

### How to Verify Security Headers
```bash
curl -sI https://mindchecktools.com | grep -i "strict\|x-frame\|x-content\|referrer\|permissions\|coop"
```

### Deployment Checklist Addition (Security)
- [ ] Strict-Transport-Security present (HSTS)
- [ ] X-Frame-Options: SAMEORIGIN
- [ ] X-Content-Type-Options: nosniff
- [ ] Referrer-Policy set
- [ ] Permissions-Policy set
- [ ] No unsafe-eval in CSP (unless required by third party)
- [ ] HTTPS enforced (Vercel handles automatically)
- [ ] Brotli compression active (Vercel handles automatically)

---

## 10. CONTENT QUALITY & E-E-A-T DEEP STANDARDS

Google's Quality Rater Guidelines define E-E-A-T: **Experience, Expertise, Authoritativeness, Trustworthiness**. For YMYL content (mindchecktools), this is the single biggest ranking differentiator. Weak E-E-A-T = suppressed rankings regardless of technical SEO quality.

### Word Count Minimums by Page Type

| Page Type | Minimum Words | Ideal Range | Notes |
|-----------|--------------|-------------|-------|
| YMYL tool pages (mindchecktools) | 1,500 | 2,000-3,000 | Google auditors scrutinize health content heavily |
| Non-YMYL tool pages | 800 | 1,000-1,500 | Educational section + FAQ minimum |
| Blog posts | 1,500 | 2,000-3,500 | Long-form outranks thin content |
| pSEO pages | 1,000 | 1,200-1,800 | Must not be duplicate-y across variants |
| Landing pages (SaaS) | 600 | 800-1,200 | CTA-focused, less is fine |

### Published & Modified Date Markup (Required)

Every blog post and tool page must have machine-readable dates:

```html
<!-- In page metadata -->
<meta property="article:published_time" content="2026-03-01T00:00:00Z" />
<meta property="article:modified_time" content="2026-03-08T00:00:00Z" />

<!-- Visible on page (human-readable) -->
<time datetime="2026-03-01">March 1, 2026</time>
```

Also required in Article JSON-LD schema:
```json
{
  "@type": "Article",
  "datePublished": "2026-03-01",
  "dateModified": "2026-03-08"
}
```

**Rule:** Update `dateModified` any time you make substantive content changes. Google rewards freshness signals.

### Author Byline Requirements (mindchecktools ONLY)

Every blog post and tool page must have a visible author block:

```
Reviewed by a Certified Drug and Alcohol Counselor (CADC-II)
with 11 years of clinical experience.
```

- Link the author byline to the About page
- About page must describe the CADC-II credential and clinical background
- Do NOT include personal name (per brand standards)
- Include review/update date alongside byline

### About Page E-E-A-T Requirements

An About page that passes Google's quality reviewer checklist:
- Named credential (CADC-II, years of experience, specialization area)
- Mission statement tied to helping people
- Why this site exists (genuine purpose, not "we built tools to make money")
- Contact information (real email or form)
- Link from every page's footer
- For mindchecktools: reference to clinical training, ethical boundaries of the site

### E-E-A-T Signals Per Page (Checklist)

- [ ] Author byline with credentials visible (mindchecktools)
- [ ] Published date visible with `<time>` element
- [ ] Modified date visible or in metadata
- [ ] Citations to authoritative sources (SAMHSA, NIMH, WHO, peer-reviewed studies)
- [ ] External links to primary sources (not competitor pages)
- [ ] No unsubstantiated health claims
- [ ] Specific, concrete numbers (e.g., "affects 17.3 million adults" not "affects many adults")
- [ ] Content matches search intent exactly
- [ ] No thin, padded, or AI-obvious content (rewrite any section that reads like filler)

### Content Freshness Protocol

- Review every tool page content quarterly
- Update `dateModified` when content is refreshed
- Add freshness note: "Last reviewed: [Month Year]" visible on page
- Update statistics and citations when source data changes
- Google rewards regular updates — stale content slowly slides in rankings

---

## 11. TWITTER CARD & SOCIAL META (Gap in Current Standards)

Open Graph is covered in Section 2. Twitter Card is separate and required for X/Twitter share previews. Missing Twitter Card = ugly URL-only shares that get no clicks.

### Required Twitter Card Tags (Every Page)

```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="[Page Title — same as og:title]" />
<meta name="twitter:description" content="[Page Description — same as og:description]" />
<meta name="twitter:image" content="[Absolute URL to OG image]" />
```

### Implementation in Next.js layout.tsx / page.tsx

```typescript
export const metadata: Metadata = {
  title: "PHQ-9 Depression Test — Free Online Screening | MindCheck Tools",
  description: "Take the PHQ-9 depression screening test online. Free, anonymous, instant results with clinical context.",
  openGraph: {
    title: "PHQ-9 Depression Test — Free Online Screening",
    description: "Free, anonymous PHQ-9 depression screening with instant results.",
    images: [{ url: "https://mindchecktools.com/og-image.png" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PHQ-9 Depression Test — Free Online Screening",
    description: "Free, anonymous PHQ-9 depression screening with instant results.",
    images: ["https://mindchecktools.com/og-image.png"],
  },
};
```

### OG Image Requirements
- Dimensions: 1200x630px minimum
- Format: PNG or JPG
- File size: Under 300KB
- Content: Site name + tool name + brief value prop (readable at thumbnail size)
- Use a consistent template across all tools on each site
- Store in /public/og/ directory
- One generic fallback OG image per site; tool-specific images as bandwidth allows

---

## 12. IMAGE OPTIMIZATION STANDARDS

Currently the standards mention `next/image` but don't define requirements. Missing alt text and unoptimized images both hurt SEO and accessibility scores.

### Every Image Must Have

- `alt` attribute (descriptive for content images, `alt=""` for purely decorative)
- `loading="lazy"` for below-the-fold images (Next/Image handles this automatically)
- `width` and `height` attributes to prevent layout shift (CLS penalty)
- Next.js `<Image>` component (not raw `<img>`) for automatic WebP conversion

### Alt Text Rules

| Image Type | Alt Text Rule | Example |
|-----------|--------------|---------|
| Tool result charts | Describe what the chart shows | "Bar chart showing PHQ-9 score of 12 in the moderate depression range" |
| Decorative icons | Empty string | `alt=""` |
| Informational diagrams | Describe the information conveyed | "Diagram showing the 9 PHQ-9 depression screening criteria" |
| Site logo | Site name | `alt="MindCheck Tools"` |
| Blog post hero | Describe the image content | "Person sitting with head in hands, representing depression" |

### Image Audit Command

```bash
# Run in Claude Code to find images missing alt text
grep -rn "<img" src/ --include="*.tsx" --include="*.jsx" | grep -v 'alt='
```

### File Size Limits
- Hero images: Under 200KB (WebP preferred)
- Tool icons/illustrations: Under 50KB (SVG preferred for icons)
- OG images: Under 300KB (PNG or JPG)
- Never ship uncompressed PNGs — always run through squoosh.app or similar before adding to /public

---

## 13. REPOSITORY CODE STANDARDS

Every repo must be set up the same way. Claude Code must verify this structure exists before making any changes.

### Required Files in Every Repo Root

| File | Purpose | Must Contain |
|------|---------|-------------|
| CLAUDE.md | Claude Code behavior rules | Tier system, workflow, site-specific rules |
| EMPIRE_BUILD_STANDARDS.md | Quality gate | Full standards document |
| .gitignore | Repo hygiene | node_modules, .env.local, .vercel |
| README.md | Project overview | Site name, local path, deployment URL |
| next.config.js | Next.js config | Security headers, image domains, redirects |

### next.config.js Required Settings

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Security headers (see Section 9)
  async headers() { ... },

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },

  // No trailing slash inconsistency
  trailingSlash: false,

  // Compress output
  compress: true,
};
```

### Environment Variables Protocol
- Never commit `.env.local` (ensure it's in .gitignore)
- API keys (Claude API, Stripe) live in Vercel environment variables dashboard
- Local dev uses `.env.local` only
- Document required env vars in README.md (keys, not values)

### Branch Hygiene Rules
- Only `main` branch — no feature branches left hanging (already established, reinforcing)
- Every merge must pass pre-deploy checklist
- Commit messages: present tense, descriptive ("Add SoftwareApplication schema to PHQ-9 page")
- Never force-push to main

### Dependency Hygiene
- Run `npm audit` quarterly — fix high/critical vulnerabilities immediately
- Keep Next.js, Tailwind, TypeScript on current major versions
- Review package.json for unused dependencies before every major deploy

---

## 14. GOOGLE RANKING FACTORS MASTER CHECKLIST

This section covers ranking signals that are real, documented, and actionable — based on Google's public documentation, confirmed leak analysis, and consistent SERP behavior. Zero speculation.

### Tier 1: Highest Confirmed Impact Signals

**Page Experience & Core Web Vitals**
- [ ] LCP (Largest Contentful Paint): Under 2.5s on mobile (existing standard — reinforced)
- [ ] INP (Interaction to Next Paint): Under 200ms — replaced FID in March 2024, NOT in current standards
- [ ] CLS (Cumulative Layout Shift): Under 0.1 (existing — reinforced)
- [ ] TTFB (Time to First Byte): Under 800ms — Vercel edge CDN helps significantly
- [ ] FCP (First Contentful Paint): Under 1.8s on mobile
- [ ] Mobile usability: Zero mobile usability errors in Google Search Console

**How to measure INP:**
```
PageSpeed Insights → Field Data → INP score
Or: Chrome DevTools → Performance panel → Interaction timing
Target: < 200ms (Good), 200-500ms (Needs Improvement), > 500ms (Poor)
```

**Content Relevance & Search Intent Match**
- [ ] Page content EXACTLY matches the dominant search intent (informational/navigational/transactional/commercial)
- [ ] Primary keyword appears in: title tag, H1, first 100 words, at least one H2, URL slug
- [ ] Semantic keywords (LSI terms) naturally present in body content
- [ ] Content answers the question completely — no reason to bounce back to SERP
- [ ] Word count competitive with top 3 ranking pages (use Section 10 minimums as floor)

**Backlink Profile (Off-Page)**
- [ ] Earning links naturally via tool quality and educational content (long game)
- [ ] Guest posting on mental health / fiber arts / developer blogs to build authority
- [ ] Directory submissions: Product Hunt, AlternativeTo, ToolFinder for tool sites
- [ ] Broken link building: find dead competitor pages, pitch your tool as replacement
- [ ] HARO / Qwoted: respond to journalist requests in relevant niches for earned media
- [ ] Internal linking distributes PageRank across the site (already in standards — reinforced)

**E-E-A-T (covered in Section 10 — key signals summary)**
- [ ] Demonstrable first-hand experience with the topic
- [ ] Credentials visible and linked from content
- [ ] Third-party validation (awards, press mentions, professional organization membership)
- [ ] Transparent authorship — no anonymous content on YMYL sites

### Tier 2: Strong Supporting Signals

**Technical Crawlability**
- [ ] robots.txt: Allow all major crawlers — Googlebot, Bingbot, GPTBot, anthropic-ai, PerplexityBot
- [ ] XML sitemap: Every public page listed, correct `<lastmod>`, submitted to GSC
- [ ] Crawl depth: No important page more than 3 clicks from homepage
- [ ] URL structure: Logical hierarchy (/tools/phq-9-depression-test not /p?id=42)
- [ ] No orphan pages: Every page has at least one internal link pointing to it
- [ ] Redirect chains: No redirect chains longer than 2 hops (301 → 301 → destination = bad)
- [ ] Canonical tags: Every page has a self-referencing canonical (already in standards — reinforced)
- [ ] No noindex on pages you want ranked (obvious, but check after every major deploy)

**How to audit crawl depth:**
```
Screaming Frog (free up to 500 URLs) → Crawl Analysis → Internal → Filter by depth
Or in GSC: Coverage report → check for "Excluded" pages
```

**Structured Data / Rich Results Eligibility**
- [ ] SoftwareApplication schema: Enables rich results for tool pages (already a gap — fix now)
- [ ] FAQPage schema: Earns FAQ accordion in SERPs — direct traffic boost
- [ ] Article schema: Required for blog post eligibility in Top Stories
- [ ] HowTo schema: Use on pages with numbered step-by-step instructions
- [ ] Sitelinks Searchbox: Only appears after Google grants it — just have a working search
- [ ] Breadcrumb schema: Shows breadcrumbs in SERP snippet — always implement

**Test every schema at:** https://search.google.com/test/rich-results

**User Behavior Signals (Indirect)**
- [ ] Low bounce rate: Achieved by matching content to intent immediately
- [ ] Long dwell time: Achieved by having substantive content below the tool
- [ ] CTR above average for position: Achieved by compelling title tags and meta descriptions
- [ ] Return visitors: Achieved by bookmarkable tools that users come back to
- [ ] Note: Google has confirmed CTR and dwell time are NOT direct ranking factors. But they're outputs of good UX, which IS correlated with rankings.

### Tier 3: Confirmed But Smaller Impact

**Duplicate Content Prevention**
- [ ] No two pages on the site have substantially similar content (pSEO pages must vary significantly)
- [ ] Canonical tags on all pages pointing to preferred URL
- [ ] No www vs non-www split (Vercel handles with redirect — verify)
- [ ] No HTTP vs HTTPS split (Vercel handles — verify)
- [ ] Parameter handling: If tool generates URL params (?score=12), canonical must point to clean URL
- [ ] Pagination: If any paginated content, use rel="next" and rel="prev" (or single-page)

**Site Architecture for Topic Authority**
- [ ] Hub pages (main tool categories) link to all spoke pages (individual tools, blog posts)
- [ ] Blog posts link back to their hub tool page
- [ ] Related tools section on every tool page (cross-links within the site)
- [ ] Footer links: All main sections accessible from every page
- [ ] A site with 50 deeply interlinked pages on one topic outranks a site with 5 isolated pages

**Local Signals (not relevant yet, note for future)**
- Jason is in Castroville, CA but these sites are NOT local businesses
- Do NOT add local schema — it would confuse Google about the site's target audience
- These sites should appear in national / international SERPs, not local packs

### Tier 4: Things Google Has Explicitly Confirmed Do NOT Help

- Keyword density targets (write naturally — stuffing hurts)
- Meta keywords tag (ignored since 2009)
- H1 tag count (Google confirmed one H1 preferred but multiple are OK)
- Exact-match anchor text in every internal link (varies it)
- Social shares / likes (zero confirmed impact on rankings)
- Submitting URLs to GSC (helps speed of indexing, NOT ranking)
- Domain age alone (a fast, relevant new page can outrank old content)
- Posting frequency (quality beats quantity every time)

---

## 15. ONGOING AUDIT PROTOCOL

The full audit checklist from the technical audit should be run:
- **Before every major deploy** (mini version — Sections 1-7 deployment checklist)
- **Monthly** (full version — all sections below)
- **After any Google algorithm update** (check GSC for traffic drops immediately)

### Monthly Full Audit Sequence

**Step 1 — SEO Technical (30 min)**
For each site, verify with Chrome DevTools Console:
```javascript
// Check title
document.title
// Check meta description
document.querySelector('meta[name="description"]').content
// Check canonical
document.querySelector('link[rel="canonical"]').href
// Check H1 count
document.querySelectorAll('h1').length
// Check OG tags
document.querySelector('meta[property="og:title"]').content
// Check Twitter card
document.querySelector('meta[name="twitter:card"]').content
```

**Step 2 — Schema Validation (15 min)**
```javascript
// Check all JSON-LD blocks
document.querySelectorAll('script[type="application/ld+json"]')
// Then paste each into: https://search.google.com/test/rich-results
```

**Step 3 — Security Headers (5 min)**
```bash
curl -sI https://mindchecktools.com | grep -iE "strict|x-frame|x-content|referrer|permissions|coop|content-security"
```

**Step 4 — LLM Discoverability (5 min)**
Verify these URLs return plain text (not HTML):
- https://[site]/llms.txt → Must return Content-Type: text/plain
- https://[site]/robots.txt → Must allow GPTBot, anthropic-ai, PerplexityBot

**Step 5 — Core Web Vitals (10 min)**
- Run each site through https://pagespeed.web.dev (mobile strategy)
- Log scores in Weekly Metrics tracker
- Flag any metric that drops below threshold (Performance < 90, Accessibility < 90, SEO < 95)

**Step 6 — GSC Triage (15 min)**
In Google Search Console:
- Coverage → Check for new "Excluded" or "Error" pages
- Core Web Vitals → Check for new "Poor" URLs
- Manual Actions → Verify none (should always be zero)
- Security Issues → Verify none
- Rich Results → Check schema errors

**Step 7 — Content Freshness (15 min)**
- Are any tool pages or blog posts showing stale data (old statistics, outdated guidelines)?
- Has any linked external source (SAMHSA, NIMH) moved its URL? (Check for 404s)
- Have competitor pages added content that now outranks you on key terms?

### Quick Audit Command Set (Claude Code)

Paste this in Claude Code to run a fast technical audit on any site:

```
Read EMPIRE_BUILD_STANDARDS.md.
Audit this site across all 15 sections.
Check: security headers in next.config.js, all schema types present,
robots.txt bot allowances, image alt text completeness,
Twitter card meta tags, INP optimization, canonical tags on all pages,
sitemap coverage, word count on tool pages, E-E-A-T signals visible.
Report: CRITICAL issues (breaks standards), GAPS (missing but not broken), PASSING (confirmed compliant).
Give me a prioritized fix list.
```

---

## 16. AI ENGINE OPTIMIZATION (GEO — GENERATIVE ENGINE OPTIMIZATION)

GEO is the practice of structuring content and infrastructure so AI engines (ChatGPT, Perplexity, Claude, Google AI Overviews, Copilot) discover, index, and cite your pages. As of 2026, AI platforms account for ~0.15% of global traffic but grow 7x year-over-year. AI-referred visitors convert at **14.2%** vs Google organic's 2.8% and spend **67.7% more time** on site. This is not optional infrastructure for 2026.

---

### 16.1 Complete robots.txt bot allowance list

Your existing standards allow GPTBot, anthropic-ai, and PerplexityBot. The following bots are **missing** and must be added to every site's robots.txt immediately.

**Add this complete block to every robots.txt:**

```
# === AI TRAINING CRAWLERS ===
User-agent: GPTBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: CCBot
Allow: /
Crawl-delay: 2

User-agent: Bytespider
Allow: /

User-agent: cohere-ai
Allow: /

User-agent: Amazonbot
Allow: /

# === AI SEARCH / CITATION CRAWLERS (different from training) ===
User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: Claude-User
Allow: /

# NOTE: anthropic-ai and Claude-Web are deprecated — replace with above
# NOTE: OAI-SearchBot (search) can be allowed while blocking GPTBot (training)

# === AI ASSISTANT CRAWLERS ===
User-agent: Applebot
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: meta-externalagent
Allow: /

User-agent: meta-externalfetcher
Allow: /

User-agent: DuckAssistBot
Allow: /

# === PERPLEXITY (keep existing, confirm user agent string) ===
User-agent: PerplexityBot
Allow: /

# === BING (see Section 17) ===
User-agent: bingbot
Allow: /
Crawl-delay: 2

User-agent: MicrosoftPreview
Allow: /
```

**Audit command — run in Claude Code:**
```bash
cat public/robots.txt
# Verify all bots above are present
```

**Key distinctions:**
- Allow OAI-SearchBot (ChatGPT citations) even if blocking GPTBot (training data)
- Claude-User and Claude-SearchBot replaced deprecated `anthropic-ai` / `Claude-Web`
- Google-Extended controls Google Gemini training (separate from Googlebot)
- Applebot-Extended controls Apple Intelligence / Siri grounding

---

### 16.2 Content structure for AI citation extraction

AI engines extract individual passages, not full pages. Pages must be structured for machine extraction across all platforms. The principles below improve citation rates across ChatGPT, Perplexity, Claude, and Google AI Overviews simultaneously.

**Universal citation structure:**

```
[H1] — Primary query keyword
[Lead paragraph] — Direct answer in 40–60 words. Definitive statement. Numbers and specifics.
[H2] — What is [topic]?
  [40–60 word self-contained answer block]
[H2] — How does [topic] work?
  [40–60 word self-contained answer block]
[Tool widget — SSR-rendered shell with client hydration]
[H2] — How to interpret your results
  [Answer block + data table]
[H2] — FAQ
  [Question-based, self-contained Q&A pairs]
[Author byline with credentials]
[Citations to authoritative sources]
```

**Rules:**
- Lead with the answer — never bury the lede
- Use definitive statements: "The PHQ-9 cutoff for moderate depression **is** 10–14" not "may be around 10"
- Use exact numbers: "affects **17.3 million** US adults" not "affects many adults"
- Write extractable blocks of **40–60 words** — this is the AI extraction sweet spot
- Use question-based H2 headings that match natural language queries
- Never use `nosnippet` or `data-nosnippet` — these block AI Overview inclusion
- All content must be **SSR-rendered** — AI crawlers do not execute JavaScript
- Add `max-image-preview:large` to robots meta tag for image extraction

**Meta tag to add to every page:**
```tsx
// app/layout.tsx or per-page metadata
export const metadata = {
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
  },
};
```

---

### 16.3 llms.txt and llms-full.txt

**llms.txt** (`/public/llms.txt`): A Markdown summary of the site — what it does, key pages, and tool descriptions. 844,000+ sites implement it. No AI platform has confirmed active use, but adoption is growing and implementation cost is low. No downside.

**Format:**
```markdown
# [Site Name]

[Site Name] provides [brief description].

## Tools

- [Tool Name](/tools/tool-slug): [One-sentence description]
- [Tool Name](/tools/tool-slug): [One-sentence description]

## About

[3–5 sentences on purpose, credentials, and audience]

## Key Pages

- [Homepage](/)
- [About](/about)
- [Contact](/contact)
```

**llms-full.txt** (`/public/llms-full.txt`): All site documentation in a single parseable Markdown file — tool methodology, FAQ answers, clinical references, full content. Auto-generate during build from page data where possible.

**Keep existing llms.txt entries current** — update whenever a new tool is added. This is part of the new tool deployment checklist (see Section 15).

---

### 16.4 AI engine platform summary

| Platform | Index Source | Key Bot | Citation Signals |
|----------|-------------|---------|-----------------|
| ChatGPT Search | OpenAI index (OAI-SearchBot) | OAI-SearchBot, ChatGPT-User | Allows OAI-SearchBot in robots.txt; SSR content; trusted domain |
| Perplexity | Proprietary (200B+ URLs) | PerplexityBot | Credibility, freshness, 40–60 word blocks, author credentials |
| Claude | Brave Search + ClaudeBot | Claude-SearchBot, Claude-User | SSR content, structured answers, allow Claude-SearchBot |
| Google AI Overviews | Google index | Googlebot | Top-ranked pages + semantic completeness; 134–167 word blocks |
| Microsoft Copilot | Bing index | bingbot | Bing ranking; BWT setup; IndexNow |
| Apple Intelligence | Applebot | Applebot-Extended | Allow Applebot-Extended; semantic HTML; structured data |
| Meta AI | Meta crawler | meta-externalagent | Allow meta-externalagent; clean HTML |

**ChatGPT market position:** 82.7% of AI chatbot visits, 87.4% of AI referral traffic. Prioritize OAI-SearchBot allowance and content structure.

---

### 16.5 GEO deployment checklist (every new page)

- [ ] OAI-SearchBot, Claude-SearchBot, and all bots in 16.1 allowed in robots.txt
- [ ] Lead paragraph answers the query in 40–60 words
- [ ] Question-based H2 headings
- [ ] `max-image-preview:large` in robots meta
- [ ] Author credentials visible
- [ ] Published + modified dates visible
- [ ] Outbound citations to authoritative sources
- [ ] All content SSR-rendered (no useEffect-only content)
- [ ] llms.txt updated with new page/tool
- [ ] No `nosnippet` tags on any indexed page

---

## 17. BING / MICROSOFT STANDARDS

Bing powers ChatGPT Search, DuckDuckGo, and Microsoft Copilot. Not being indexed in Bing means being invisible across the entire Microsoft AI ecosystem. These standards are required for every site.

---

### 17.1 Bing ranking factors (key differences from Google)

| Signal | Google | Bing | Action Required |
|--------|--------|------|-----------------|
| Exact-match keywords | Semantic/intent | **Heavily weighted** in title, H1, meta, URL | Use exact-match keywords in all key elements |
| Social signals | Not a factor | **Confirmed ranking factor** | Add share buttons; distribute on LinkedIn, X, Facebook |
| Meta keywords tag | Ignored since 2009 | **Still processed** | Add `<meta name="keywords">` to every page |
| User engagement | Indirect | **Direct** — CTR, dwell time, bounce rate | Optimize for engagement, not just traffic |
| Domain age | Less relevant | Older domains get a boost | Consistent publishing schedule matters more early on |
| Content freshness | Important | **Emphasized** — use `lastmod` accurately in sitemap | Never fake lastmod; only update when content changes |
| Schema markup | Helpful | **Relied on more directly** | Implement all schema types; validate in BWT |
| FAQ rich results | Restricted to authoritative sites | **Still displayed for all sites** | Implement FAQPage schema on all tool pages |

**Add to every page head:**
```tsx
// Add keywords meta (Bing processes this, Google ignores it)
<meta name="keywords" content="[primary keyword], [secondary keyword], [tool type]" />
```

---

### 17.2 Bing Webmaster Tools setup

Every site must be verified in Bing Webmaster Tools separately from GSC. BWT offers unique capabilities including an AI Performance Dashboard showing citation frequency in Copilot answers.

**Verification via Next.js:**
```tsx
// app/layout.tsx
export const metadata: Metadata = {
  other: {
    'msvalidate.01': 'YOUR_BWT_VERIFICATION_CODE',
  },
};
```

**Required actions in BWT after verification:**
1. Submit XML sitemap
2. Run SEO Site Scan (built-in free technical audit)
3. Connect Microsoft Clarity (one-click from BWT dashboard)
4. Check AI Performance Dashboard (Copilot citation tracking)
5. Set up IndexNow key (see 17.3)

---

### 17.3 IndexNow — instant Bing ecosystem indexing

IndexNow notifies Bing, Yandex, DuckDuckGo, and other participating engines of content changes instantly. Real-world results: indexing from 3–5 days to **under 1 hour**. Note: Google does NOT support IndexNow — this is Bing/ecosystem only.

**Full implementation for Next.js/Vercel:**

**Step 1 — Generate key:**
```bash
openssl rand -hex 16
# Copy the output — this is your INDEXNOW_API_KEY
```

**Step 2 — Create verification file:**
```
# Create: /public/[YOUR_KEY].txt
# File contents: just the key itself, nothing else
```

**Step 3 — Add to .env.local and Vercel environment variables:**
```
INDEXNOW_API_KEY=your_key_here
```

**Step 4 — Create API route:**
```typescript
// app/api/indexnow/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { urls } = await request.json();
  const key = process.env.INDEXNOW_API_KEY;
  const host = process.env.NEXT_PUBLIC_SITE_URL?.replace('https://', '');

  const response = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host,
      key,
      keyLocation: `https://${host}/${key}.txt`,
      urlList: urls,
    }),
  });

  return NextResponse.json({ status: response.status });
}
```

**Step 5 — Submit all URLs on deploy (GitHub Action):**
```yaml
# .github/workflows/indexnow.yml
name: IndexNow Submit
on:
  push:
    branches: [main]
jobs:
  submit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Submit sitemap URLs to IndexNow
        run: |
          curl -s https://${{ secrets.SITE_URL }}/sitemap.xml | \
          grep -oP '(?<=<loc>)[^<]+' | \
          jq -R -s -c 'split("\n")[:-1]' | \
          xargs -I{} curl -X POST https://${{ secrets.SITE_URL }}/api/indexnow \
            -H "Content-Type: application/json" \
            -d "{\"urls\":{}}"
```

---

### 17.4 Bing-specific robots.txt entries

```
User-agent: bingbot
Allow: /
Crawl-delay: 2

User-agent: MicrosoftPreview
Allow: /

# DuckDuckGo uses Bing's index
User-agent: DuckDuckBot
Allow: /
```

---

### 17.5 Bing YMYL quality requirements

For mindchecktools.com and medicalbillreader.com: Bing's Whole Page Algorithm applies E-A-T signals to YMYL content. Requirements: professional authorship with credentials visible, peer-reviewed source citations, medical disclaimers on every tool page, `MedicalWebPage` schema (see Section 19), regular content updates with visible dates, transparent editorial policy, crisis resources on mental health pages.

---

### 17.6 Bing deployment checklist

- [ ] Site verified in Bing Webmaster Tools
- [ ] XML sitemap submitted in BWT
- [ ] IndexNow key generated and verification file in /public
- [ ] All pages submitted via IndexNow on deploy
- [ ] Bingbot and MicrosoftPreview allowed in robots.txt
- [ ] `<meta name="keywords">` present on all pages
- [ ] Exact-match keywords in title tag, H1, meta description, URL slug
- [ ] FAQPage schema present (Bing still displays FAQ rich results)
- [ ] Microsoft Clarity installed
- [ ] Social share buttons on all content pages

---

## 18. ADSENSE TECHNICAL STANDARDS

AdSense is the primary revenue mechanism for 4 sites. Misconfigured AdSense is the #1 cause of Core Web Vitals failures on publisher sites. These standards prevent revenue loss, account issues, and ranking damage simultaneously.

---

### 18.1 AdSense effect on Core Web Vitals — quantified

| Metric | Without optimization | With optimization | Target |
|--------|---------------------|------------------|--------|
| LCP | +1–3 seconds | Minimal impact | < 2.5s |
| CLS | 0.1–0.25+ | < 0.05 | < 0.1 |
| INP | +100–300ms | Minimal | < 200ms |

**Root cause of CLS from ads:** AdSense responsive ads load at 0px height and expand, pushing content down. AdSense JavaScript removes `min-height` from elements targeted by CSS class selectors — but NOT from elements targeted by **CSS ID selectors**. This is the fix.

**CSS fix (use IDs, not classes):**
```css
/* ✅ CORRECT — ID selector, AdSense cannot strip this */
#ad-header {
  min-height: 90px;
  width: 100%;
  contain: layout style;
}
#ad-in-content {
  min-height: 250px;
  contain: layout style;
}
@media (max-width: 768px) {
  #ad-header { min-height: 250px; }
}

/* ❌ WRONG — class selector, AdSense strips min-height */
.ad-container {
  min-height: 90px; /* AdSense will remove this */
}
```

---

### 18.2 AdSense in Next.js — production implementation

**Step 1 — Load script once in root layout:**
```tsx
// app/layout.tsx
import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        {process.env.NODE_ENV === 'production' && (
          <Script
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
            strategy="afterInteractive"
            data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_ID}
            crossOrigin="anonymous"
          />
        )}
      </body>
    </html>
  );
}
```

**Step 2 — AdUnit component that refreshes on route changes:**
```tsx
// components/AdUnit.tsx
'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface AdUnitProps {
  slot: string;
  format?: string;
  style?: React.CSSProperties;
}

export function AdUnit({ slot, format = 'auto', style }: AdUnitProps) {
  const pathname = usePathname();

  useEffect(() => {
    try {
      const adsbygoogle = (window as any).adsbygoogle || [];
      adsbygoogle.push({});
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, [pathname]); // Re-push on route change

  if (process.env.NODE_ENV !== 'production') return null;

  return (
    <ins
      className="adsbygoogle"
      style={style || { display: 'block' }}
      data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_ID}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  );
}
```

**Step 3 — ads.txt (required for programmatic buying):**
```
# /public/ads.txt
google.com, pub-XXXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0
```
Replace with your publisher ID from AdSense dashboard.

---

### 18.3 Ad placement rules for tool pages

| Position | Rule | Why |
|----------|------|-----|
| Above tool input | ❌ Never | Disrupts task; YMYL policy risk |
| Between input and output | ❌ Never absolute | Core policy violation |
| Below tool results | ✅ Primary placement | Natural pause point |
| In-content (blog) | ✅ After 3rd paragraph minimum | Better Ads Standards |
| Sidebar | ✅ Desktop only | Mobile: too narrow |
| Footer | ✅ Acceptable | Low viewability, low RPM |

**Per-page maximums:**
- Tool pages: max 2 ad units
- Blog posts (1,500+ words): max 3 ad units
- Short pages (<800 words): max 1 ad unit
- Never stack consecutive ad units with less than 150px of content between them

---

### 18.4 Better Ads Standards compliance

Chrome's built-in ad filter **blocks ALL ads on non-compliant sites** — not just the offending ad. Compliance is not optional.

**Banned formats (must never appear on any page):**

Desktop banned:
- Pop-up ads of any kind
- Auto-playing video with sound
- Prestitial countdown ads (ads that count down before dismissing)
- Large sticky ads covering more than 30% of screen
- Postitial ads with countdown

Mobile banned:
- Pop-up ads
- Prestitial ads covering the full screen
- Ad density above **30% of page content**
- Flashing/animated ads
- Large sticky ads at top of viewport
- Full-screen scroll-over ads

**Verify compliance:** Google Search Console → Experience → Ad Experience Report

---

### 18.5 AdSense Consent Mode v2 (mandatory for EU traffic)

Since March 2024: non-compliant publishers have Google ads blocked for EU/EEA/UK users. Requires Google-certified CMP with IAB TCF v2.2.

**Default state initialization (load before any tracking):**
```tsx
// app/layout.tsx — Script with beforeInteractive
<Script id="consent-defaults" strategy="beforeInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('consent', 'default', {
      'analytics_storage': 'denied',
      'ad_storage': 'denied',
      'ad_user_data': 'denied',
      'ad_personalization': 'denied',
      'wait_for_update': 500
    });
  `}
</Script>
```

Update to `granted` state when user accepts via CMP callback. Consent Mode v2 lets Google model ~70% of missing conversions from cookie rejections.

---

### 18.6 AdSense lazy loading for below-fold ads

Loading all ads eagerly is the #1 avoidable performance mistake on tool sites.

```tsx
// components/LazyAdUnit.tsx
'use client';
import { useEffect, useRef, useState } from 'react';
import { AdUnit } from './AdUnit';

export function LazyAdUnit({ slot, ...props }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { rootMargin: '300px' } // Load 300px before entering viewport
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      {visible ? <AdUnit slot={slot} {...props} /> : (
        <div style={{ minHeight: 250 }} aria-hidden="true" />
      )}
    </div>
  );
}
```

Use `<AdUnit>` (eager) for first above-fold ad. Use `<LazyAdUnit>` for all other placements.

---

### 18.7 AdSense deployment checklist

- [ ] ads.txt present in /public with correct publisher ID
- [ ] AdSense script loaded once in root layout via `next/script` `afterInteractive`
- [ ] AdUnit component uses `usePathname()` as key to refresh on route change
- [ ] All ad containers use CSS ID selectors with `min-height` set
- [ ] Below-fold ads use LazyAdUnit with 300px rootMargin
- [ ] No ads between tool input and results
- [ ] Max 2 ad units on tool pages
- [ ] Better Ads Standards verified in GSC Ad Experience Report
- [ ] Consent Mode v2 defaults set before any tracking scripts
- [ ] YMYL pages (mindchecktools): no ads within screening flow

---

## 19. SCHEMA MARKUP COMPLETE STANDARDS

Building on Section 3 (schema basics). This section defines the correct schema types, nesting patterns, and SaaS-specific markup missing from previous standards.

---

### 19.1 WebApplication vs SoftwareApplication

**Correction from previous standards:** Use `WebApplication` for all browser-based tools, not `SoftwareApplication`. SoftwareApplication implies installable/downloadable software.

```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Word Counter",
  "description": "Free online word counter tool...",
  "url": "https://flipmycase.com/tools/word-counter",
  "applicationCategory": "UtilitiesApplication",
  "operatingSystem": "All",
  "browserRequirements": "Requires JavaScript",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "datePublished": "2026-01-15",
  "dateModified": "2026-03-08"
}
```

**applicationCategory values by site:**
- flipmycase.com: `UtilitiesApplication`
- fibertools.app: `UtilitiesApplication`
- mindchecktools.com: `HealthApplication`
- creatorrevenuecalculator.com: `FinanceApplication`
- contractextract.com: `BusinessApplication`
- medicalbillreader.com: `HealthApplication`

---

### 19.2 Schema @graph nesting pattern

Use the `@graph` pattern to relate all entities on a page without duplication. This is the preferred pattern per Google's documentation.

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://yourdomain.com/#organization",
      "name": "Brand Name",
      "url": "https://yourdomain.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://yourdomain.com/logo.png",
        "width": 512,
        "height": 512
      },
      "sameAs": [
        "https://twitter.com/yourhandle",
        "https://github.com/yourhandle"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://yourdomain.com/#website",
      "url": "https://yourdomain.com",
      "name": "Brand Name",
      "publisher": { "@id": "https://yourdomain.com/#organization" },
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://yourdomain.com/search?q={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "WebPage",
      "@id": "https://yourdomain.com/tools/tool-name#webpage",
      "url": "https://yourdomain.com/tools/tool-name",
      "name": "Tool Name | Brand",
      "isPartOf": { "@id": "https://yourdomain.com/#website" },
      "primaryImageOfPage": {
        "@type": "ImageObject",
        "url": "https://yourdomain.com/og/tool-name.png"
      },
      "datePublished": "2026-01-15",
      "dateModified": "2026-03-08",
      "mainEntity": {
        "@type": "WebApplication",
        "name": "Tool Name"
      }
    }
  ]
}
```

---

### 19.3 MedicalWebPage schema (mindchecktools.com and medicalbillreader.com)

Required for YMYL health tool pages. Signals to both Google and Bing that the content meets medical content standards.

```json
{
  "@context": "https://schema.org",
  "@type": "MedicalWebPage",
  "name": "PHQ-9 Depression Screening Test",
  "description": "Take the free PHQ-9 depression screening test...",
  "url": "https://mindchecktools.com/tools/phq-9",
  "about": {
    "@type": "MedicalCondition",
    "name": "Major Depressive Disorder",
    "code": {
      "@type": "MedicalCode",
      "code": "F32",
      "codingSystem": "ICD-10"
    }
  },
  "reviewedBy": {
    "@type": "Person",
    "jobTitle": "Certified Drug and Alcohol Counselor",
    "honorificSuffix": "CADC-II"
  },
  "lastReviewed": "2026-03-08",
  "medicalAudience": {
    "@type": "MedicalAudience",
    "audienceType": "Patient"
  }
}
```

---

### 19.4 ItemList schema for tool listing pages

For homepage and category pages listing multiple tools. Can generate carousel-style rich results.

```json
{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Mental Health Screening Tools",
  "description": "Free, anonymous mental health screening tools...",
  "url": "https://mindchecktools.com/tools",
  "mainEntity": {
    "@type": "ItemList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "item": {
          "@type": "WebApplication",
          "name": "PHQ-9 Depression Test",
          "url": "https://mindchecktools.com/tools/phq-9",
          "description": "9-question depression screening instrument"
        }
      },
      {
        "@type": "ListItem",
        "position": 2,
        "item": {
          "@type": "WebApplication",
          "name": "GAD-7 Anxiety Test",
          "url": "https://mindchecktools.com/tools/gad-7",
          "description": "7-question generalized anxiety disorder screening"
        }
      }
    ]
  }
}
```

---

### 19.5 SaaS pricing page schema (contractextract.com, medicalbillreader.com)

```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Contract Key Terms Extractor",
  "url": "https://contractextract.com",
  "offers": {
    "@type": "AggregateOffer",
    "lowPrice": "0",
    "highPrice": "49",
    "priceCurrency": "USD",
    "offerCount": 3,
    "offers": [
      {
        "@type": "Offer",
        "name": "Free",
        "description": "3 contracts per month",
        "price": "0",
        "priceCurrency": "USD"
      },
      {
        "@type": "Offer",
        "name": "Pay Per Use",
        "description": "Single contract analysis",
        "price": "4.99",
        "priceCurrency": "USD"
      },
      {
        "@type": "Offer",
        "name": "Unlimited",
        "description": "Unlimited contracts per month",
        "price": "49",
        "priceCurrency": "USD",
        "priceSpecification": {
          "@type": "UnitPriceSpecification",
          "billingDuration": "P1M",
          "billingIncrement": 1
        }
      }
    ]
  }
}
```

---

### 19.6 VideoObject schema (implement when adding tutorials)

```json
{
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "name": "How to Use the PHQ-9 Depression Screening Tool",
  "description": "Step-by-step walkthrough of the PHQ-9 test...",
  "thumbnailUrl": "https://mindchecktools.com/videos/phq9-thumb.jpg",
  "uploadDate": "2026-03-08T00:00:00Z",
  "duration": "PT3M42S",
  "contentUrl": "https://mindchecktools.com/videos/phq9-tutorial.mp4",
  "embedUrl": "https://www.youtube.com/embed/VIDEO_ID",
  "transcript": "In this video, we walk through..."
}
```

---

### 19.7 Speakable schema (voice search)

Currently in beta, English/US only. Mark up key answer sections for voice assistant extraction.

```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "speakable": {
    "@type": "SpeakableSpecification",
    "cssSelector": [".tool-summary", ".score-interpretation", ".faq-answer"]
  }
}
```

---

### 19.8 Schema deployment checklist (every new page)

- [ ] WebApplication schema (not SoftwareApplication) on every tool page
- [ ] @graph pattern with Organization > WebSite > WebPage hierarchy
- [ ] MedicalWebPage schema on mindchecktools.com and medicalbillreader.com YMYL pages
- [ ] ItemList schema on tool listing/category pages
- [ ] FAQPage schema on every tool page (Bing still displays; AI engines use it)
- [ ] Article schema on all blog posts
- [ ] BreadcrumbList on all pages
- [ ] SaaS pricing schema on contractextract.com and medicalbillreader.com
- [ ] datePublished and dateModified on all schema blocks
- [ ] Validate every page at: https://search.google.com/test/rich-results
- [ ] Validate in Bing BWT → Diagnostics & Tools → Markup Validator

---

## 20. GOOGLE ALGORITHM UPDATES — ACTIVE SIGNALS (2024–2026)

Supplements Section 14. These are net-new signals confirmed since the original standards were written.

---

### 20.1 Helpful Content System — now baked into core

Google's standalone Helpful Content classifier was merged into the core algorithm in March 2024. It now evaluates content at the **page level** continuously, not as a site-wide signal. The March 2024 update removed an estimated 40–45% of low-quality content from results.

**What this means for tool sites:** Bare calculator widgets with no supporting content are high-risk. Every tool page must have expert-written surrounding content explaining methodology, use cases, and interpretation. The content cannot appear "AI-obvious" — rewrite any section that reads as padded or generic.

**Self-check questions per Google's guidelines:**
- Does the content provide original information, reporting, or research?
- Does the content provide a substantial, complete answer — not leaving users to search further?
- Would you be comfortable having a subject-matter expert review it for accuracy?
- Does it avoid excessive ads that distract from or interfere with the main content?

---

### 20.2 NavBoost and confirmed leak signals

From Google's May 2024 leaked ranking documents (14,014 attributes confirmed):

**NavBoost** — Google's primary re-ranking system. Uses Chrome clickstream data with a 13-month rolling window. Tracks:
- `goodClicks` — clicks followed by no return to SERP
- `badClicks` — clicks followed by immediate SERP return
- `lastLongestClicks` — strongest signal: the final click where a user's session ends

**Implications:** Interactive tools naturally generate `lastLongestClicks` — users complete a task and close the tab. Ensure tools deliver complete results on-page. Never redirect to a separate results page. Add "share results" functionality to extend sessions.

**SiteAuthority** — confirmed site-wide authority metric. Build brand recognition off-site (social, YouTube, directories, press mentions) not just on-page.

**Author entities** — Google tracks author identities and connects them to content quality signals. Create author pages with credentials; link author profiles consistently.

---

### 20.3 Google AI Overviews (AIO) — citation optimization

AI Overviews appear on 50%+ of all queries. Organic CTR drops 61% when AIO is present. Only 17–38% of cited pages come from top-10 organic results — AIO citations are decoupled from rankings.

**How to get cited:**
- Write self-contained answer blocks of **134–167 words** (verified extraction sweet spot for Google)
- Semantic completeness (r=0.87 correlation with citation): cover the topic exhaustively within related clusters
- Multi-modal content (text + images + structured data): 156% higher AIO selection rate
- Add `max-image-preview:large` to robots meta
- Build E-E-A-T signals: credentials, citations, dates, author pages
- Never use `nosnippet` — it directly excludes you from AI Overviews
- Cross-platform brand mentions correlate with AIO inclusion

**Note on YMYL:** Google adds disclaimers in 83% of health-related AIO results and avoids direct AI answers for severe mental health queries. This is protective behavior — do not try to circumvent it.

---

### 20.4 Soft 404 prevention for tool pages

Tool pages using client-side-only rendering are reported as soft 404s in GSC and may be deindexed. This is the single most common indexing failure for Next.js tool sites.

**Diagnosis:**
- GSC → Pages → "Not indexed" → filter for "Soft 404"
- URL Inspection → "Test Live URL" → compare rendered vs server HTML
- In browser DevTools → View Source (not Inspect) to see what Googlebot sees

**Fix — ensure every tool page has substantial pre-rendered content:**

```tsx
// ✅ Correct: educational content in Server Component, widget in Client Component
// app/tools/phq9/page.tsx (Server Component)
export default function PHQ9Page() {
  return (
    <article>
      <h1>PHQ-9 Depression Screening Test</h1>
      {/* Pre-rendered: Googlebot sees this */}
      <section>
        <h2>What is the PHQ-9?</h2>
        <p>The PHQ-9 (Patient Health Questionnaire-9) is a validated 9-item
        screening instrument for depression severity. Developed by Drs. Spitzer,
        Williams, and Kroenke, it measures the frequency of depressive symptoms
        over the past two weeks using DSM-5 criteria...</p>
        {/* 300–500 more words of pre-rendered content */}
      </section>
      {/* Client Component: hydrates interactivity */}
      <PHQ9Widget />
      <section>
        <h2>How to interpret your PHQ-9 score</h2>
        <p>Scores of 5, 10, 15, and 20 represent cutpoints for mild,
        moderate, moderately severe, and severe depression...</p>
      </section>
    </article>
  );
}
```

---

### 20.5 JavaScript rendering strategy by page type

| Page Type | Rendering | Rationale |
|-----------|-----------|-----------|
| Tool/calculator pages | **SSG** (preferred) or **ISR** | Fastest CWV; content rarely changes |
| Blog posts | **SSG** | Static content; best for crawling |
| pSEO pages | **SSG** | Generated at build time; fully crawlable |
| Dynamic results pages | **SSR** with cache headers | Fresh per request; cached at edge |
| Dashboard/auth pages | **CSR** | Not indexed; no crawl concern |
| Sitemap | **Dynamic route with SSR** | Always current |

**Never use `'use client'` at page level** — only for interactive widget sub-components. Educational content surrounding the tool must be in Server Components.

---

### 20.6 Passage ranking — structure for extraction

Google can rank individual passages within pages for ~7% of queries. A single well-structured tool page can rank for multiple subtopics.

**Implementation:** Each H2 section should be self-contained. Use anchor IDs for deep linking (`<h2 id="score-interpretation">`). Write paragraphs that make sense without the surrounding context. This improves both passage ranking and AI citation extraction simultaneously.

---

### 20.7 Google algorithm deployment checklist

- [ ] Every tool page has 500+ words of pre-rendered SSR/SSG content surrounding the widget
- [ ] No `nosnippet` meta tags on indexed pages
- [ ] `max-image-preview:large` in robots meta on all pages
- [ ] URL Inspection test passes (rendered HTML matches desired content)
- [ ] GSC Pages tab checked for soft 404s after every major deploy
- [ ] All tool pages use SSG or ISR — never CSR-only
- [ ] `dateModified` updated whenever content changes substantively
- [ ] Author pages linked from all bylines
- [ ] Tools deliver complete results on-page (no results-page redirect)

---

## 21. COMPETITIVE EDGE STANDARDS

Analysis of top-ranking tool sites (OmniCalculator: 7M+ organic traffic, Calculator.net, InchCalculator: 4.5M, PSYTests) reveals patterns that consistently differentiate high-traffic tool portfolios. These are not optional enhancements — they are the difference between 1K and 100K monthly visitors.

---

### 21.1 Content depth model

Top tool sites wrap every calculator in **1,000–2,000+ words** of educational content. The structure that works:

1. **Problem introduction** — Why does this matter? Who needs this?
2. **What is [topic]?** — Definition, clinical/technical context
3. **How is it calculated?** — Formula, methodology, manual example
4. **The tool** — Widget
5. **How to interpret results** — Ranges, scores, what to do next
6. **FAQ section** — 5–8 Q&As targeting long-tail queries
7. **Related tools** — Internal links to 3–5 related pages
8. **Sources and citations** — Authoritative external links

**Measured impact:** Adding calculators to content pages increases session duration by **2.8 minutes** and reduces bounce rates by **34%**. This directly improves NavBoost signals.

---

### 21.2 Hub-and-spoke internal linking architecture

A site with 50 **deeply interlinked** pages on one topic outranks a site with 5 isolated pages. This is topical authority at scale.

**Structure:**

```
Hub: /tools (links to all tools, all categories)
  ├── Category hub: /tools/mental-health
  │   ├── Spoke: /tools/phq-9 → links back to hub + related tools
  │   ├── Spoke: /tools/gad-7 → links back to hub + related tools
  │   └── Spoke: /tools/audit → links back to hub + related tools
  │
  ├── Blog hub: /blog (links to all posts)
  │   ├── Post: /blog/phq9-guide → links to /tools/phq-9
  │   └── Post: /blog/gad7-guide → links to /tools/gad-7
  │
  └── pSEO hub: /assessments (links to all pSEO pages)
      ├── /assessments/depression-test-for-teens → links to /tools/phq-9
      └── /assessments/anxiety-test-for-women → links to /tools/gad-7
```

**Rules:**
- Every spoke page links back to its hub
- Every tool page has a "Related tools" section with 3–5 internal links
- No orphan pages — every page has at least 2 internal links pointing to it
- Blog posts link to the tool they explain
- pSEO pages link to parent tool AND related pSEO pages

---

### 21.3 Programmatic SEO at scale

Top competitors generate thousands of indexable pages from structured data. Opportunities by site:

**mindchecktools.com:** `[condition] screening test for [demographic]` — 20+ pSEO pages for each major tool (PHQ-9 for veterans, PHQ-9 for teens, PHQ-9 for postpartum, etc.)

**fibertools.app:** `[brand] yarn weight calculator`, `[stitch pattern] gauge calculator`, `[project type] yarn estimator` — potentially 200+ pages from yarn brand + weight combinations

**creatorrevenuecalculator.com:** `[platform] revenue calculator for [creator type]` — TikTok revenue calculator for musicians, YouTube calculator for gaming channels, etc.

**flipmycase.com:** `[language] case converter` (Python, JavaScript, SQL), `convert [format] to [format]` — developer workflow variants

**Rule:** pSEO pages must vary significantly in content (Section 14 Tier 3). Shared template with unique data, examples, and platform-specific context. Never thin clones.

---

### 21.4 Calculators as link-building assets

Interactive tools earn backlinks passively. CoSchedule's Headline Analyzer earned **26,400 backlinks** from 7,000 domains from a single tool. The strategy:

1. Build a genuinely useful tool that solves a problem better than alternatives
2. Publish a dedicated landing page with embed code
3. Write a press release or outreach email targeting relevant publications
4. Submit to tool directories: Product Hunt, AlternativeTo, ToolFinder, G2
5. Let the tool compound — links accumulate over months

**For mindchecktools.com:** Mental health organizations, therapy directories, employee wellness programs, and health journalism outlets are all natural link sources for validated screening tools. The CADC-II credential differentiates credibly.

---

### 21.5 Competitive edge deployment checklist

- [ ] Every tool page has 1,000+ words of surrounding educational content
- [ ] Hub-and-spoke internal linking documented and implemented per site
- [ ] "Related tools" section present on every tool page (minimum 3 links)
- [ ] Every blog post links to its primary tool
- [ ] Every tool page has a dedicated FAQ section (5–8 questions minimum)
- [ ] pSEO page plan documented for each site with unique content per variant
- [ ] Site submitted to Product Hunt, AlternativeTo, ToolFinder
- [ ] Tools deliver shareable output (print, share, save buttons)

---

## 22. TECHNICAL INFRASTRUCTURE GAPS

These items are commonly missed in standards documents but have direct ranking, performance, or compliance impact.

---

### 22.1 Complete favicon set

Missing favicons cause broken browser tab icons, poor PWA experience, and failed automated audits. Required set:

```
public/
├── favicon.ico         (32×32 — legacy browser fallback)
├── favicon.svg         (scalable, supports dark mode — modern standard)
├── apple-touch-icon.png (180×180 — iOS home screen)
├── android-chrome-192x192.png
├── android-chrome-512x512.png
└── site.webmanifest
```

**Next.js App Router metadata:**
```tsx
export const metadata: Metadata = {
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  manifest: '/site.webmanifest',
};
```

**site.webmanifest:**
```json
{
  "name": "Brand Name",
  "short_name": "Brand",
  "description": "One-line site description",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#your-brand-color",
  "icons": [
    { "src": "/android-chrome-192x192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/android-chrome-512x512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

---

### 22.2 DNS preconnect for AdSense performance

Preconnect establishes full TCP/TLS connections early. Testing shows **360–400ms improvement** for AdSense load time.

```tsx
// app/layout.tsx — in <head>
export default function RootLayout() {
  return (
    <html>
      <head>
        {/* AdSense — limit preconnect to 2-4 domains */}
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
        {/* DNS-prefetch for secondary ad domains */}
        <link rel="dns-prefetch" href="//adservice.google.com" />
        <link rel="dns-prefetch" href="//googleads.g.doubleclick.net" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
      </head>
      ...
    </html>
  );
}
```

---

### 22.3 Font loading with next/font (eliminates CLS)

`next/font` downloads fonts at build time, self-hosts them with size-adjusted fallbacks, and eliminates GDPR concerns from Google Fonts requests.

```tsx
// app/layout.tsx
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  adjustFontFallback: true, // Key: generates fallback with matching metrics
  preload: true,
});

export default function RootLayout({ children }) {
  return (
    <html className={inter.variable}>
      ...
    </html>
  );
}
```

**Rules:**
- Define fonts at module level, never inside components
- Use `adjustFontFallback: true` to eliminate font-swap CLS
- Use variable fonts when available (one file, multiple weights)
- Never use raw Google Fonts `<link>` tags — always use `next/font`

---

### 22.4 URL structure rules

| Rule | Correct | Incorrect |
|------|---------|-----------|
| Lowercase | `/tools/phq-9` | `/Tools/PHQ-9` |
| Hyphens (not underscores) | `/word-counter` | `/word_counter` |
| No trailing slash | `/tools/phq-9` | `/tools/phq-9/` |
| No parameters in indexed URLs | `/tools/phq-9` | `/tools/phq-9?score=12` |
| Descriptive slugs | `/tools/phq-9-depression-test` | `/tools/tool-7` |
| Max 3 levels deep | `/tools/category/tool-name` | `/tools/cat/sub/sub2/tool` |

Configure in `next.config.js`: `trailingSlash: false`

---

### 22.5 Redirect rules

| Scenario | Use | Next.js config |
|----------|-----|---------------|
| Page permanently moved | 308 (permanent: true) | `permanent: true` |
| Page temporarily moved | 307 (permanent: false) | `permanent: false` |
| Tool retired permanently | 410 Gone | Custom middleware returning 410 |
| Tool temporarily unavailable | 404 | Default Next.js 404 |
| Tool replaced at new URL | 308 → new URL | Redirect in next.config.js |

```js
// next.config.js
async redirects() {
  return [
    {
      source: '/old-tool-slug',
      destination: '/new-tool-slug',
      permanent: true, // 308
    },
  ];
},
```

**Custom 410 handler:**
```tsx
// app/deprecated-tool/page.tsx
import { notFound } from 'next/navigation';
// Or: return NextResponse.json(null, { status: 410 }) from middleware
```

---

### 22.6 First-party data and Consent Mode v2

Third-party cookie deprecation is in progress. GA4 with cookie consent rejection loses 20–97% of EU analytics data.

**Implement in order:**

1. **Consent Mode v2 defaults** (see Section 18.5) — load before any tracking
2. **Certified CMP** (Cookiebot, OneTrust, Usercentrics) with IAB TCF v2.2
3. **GA4 with modeled conversions** — Consent Mode v2 models ~70% of missing data
4. **First-party data collection** — email capture, tool preferences, saved results

**For US sites (CCPA compliance):** Add Global Privacy Control (GPC) header detection and honor opt-out signals automatically.

---

### 22.7 security.txt

RFC 9116 standard for responsible vulnerability disclosure. Creates trust signals, especially important for YMYL and SaaS sites.

```
# /public/.well-known/security.txt
Contact: mailto:security@yourdomain.com
Expires: 2027-03-08T00:00:00.000Z
Preferred-Languages: en
Policy: https://yourdomain.com/security-policy
Acknowledgments: https://yourdomain.com/security-acknowledgments
```

---

### 22.8 Google Search Console — complete setup checklist

- [ ] Property verified (HTML meta tag in layout.tsx)
- [ ] XML sitemap submitted
- [ ] Preferred domain confirmed (www vs non-www — Vercel defaults to non-www)
- [ ] Crawl stats report reviewed after major deploys
- [ ] URL parameters report reviewed (deprecated but Coverage report shows parameter issues)
- [ ] International targeting NOT configured (sites target global English — do not set country targeting in GSC)
- [ ] Core Web Vitals report monitored monthly
- [ ] Rich Results report checked after schema changes
- [ ] Manual Actions — always verify zero (check after every algorithm update)

---

### 22.9 Technical infrastructure deployment checklist

- [ ] Complete favicon set in /public
- [ ] site.webmanifest present and linked in layout metadata
- [ ] DNS preconnect for AdSense and analytics
- [ ] Fonts loaded via next/font with adjustFontFallback
- [ ] All redirects use permanent: true (308) or permanent: false (307)
- [ ] 410 status returned for permanently removed tools
- [ ] URL structure: lowercase, hyphenated, no trailing slash, no parameters
- [ ] Consent Mode v2 defaults set before tracking scripts
- [ ] security.txt present at /.well-known/security.txt
- [ ] GSC fully configured: sitemap submitted, no manual actions, CWV monitored

---

## 23. MASTER DEPLOYMENT CHECKLIST (ALL SITES)

Run this checklist before every deploy. Sections reference the standard where the requirement lives.

### Legal & Compliance
- [ ] Privacy Policy present and linked in footer (S1)
- [ ] Terms of Use present (S1)
- [ ] Cookie Policy + consent banner (S1)
- [ ] Accessibility Statement (S1)
- [ ] YMYL: Clinical disclaimers + 988 + SAMHSA on every tool page (S1)
- [ ] YMYL: Author byline with CADC-II credential (S10)
- [ ] SaaS: "Not legal/medical advice" disclaimer (S1)
- [ ] ads.txt in /public with correct publisher ID (S18)

### SEO Technical
- [ ] Title tag: 50–60 chars, primary keyword near front (S2)
- [ ] Meta description: 150–160 chars, compelling, keyword included (S2)
- [ ] H1: exactly one per page, matches title intent (S2)
- [ ] Canonical tag: self-referencing, absolute URL, no parameters (S22)
- [ ] robots meta: `max-image-preview:large`, no nosnippet on indexed pages (S16/S20)
- [ ] OG tags: og:title, og:description, og:image (1200×630), og:type (S2)
- [ ] Twitter Card: summary_large_image (S11)
- [ ] meta keywords: present for Bing (S17)
- [ ] sitemap.xml: page included, lastmod accurate (S5)
- [ ] robots.txt: all bots in Section 16.1 allowed (S16)
- [ ] BWT: URL submitted via IndexNow (S17)

### Schema
- [ ] WebApplication schema (not SoftwareApplication) (S19)
- [ ] @graph pattern: Organization > WebSite > WebPage (S19)
- [ ] FAQPage schema: 5–8 Q&As on tool pages (S3)
- [ ] BreadcrumbList schema (S3)
- [ ] MedicalWebPage schema on YMYL pages (S19)
- [ ] Article schema on blog posts (S3)
- [ ] ItemList schema on listing/category pages (S19)
- [ ] SaaS pricing schema on contractextract + medicalbillreader (S19)
- [ ] Validated at https://search.google.com/test/rich-results (S15)
- [ ] Validated in Bing BWT Markup Validator (S17)

### Content & E-E-A-T
- [ ] 500+ words pre-rendered surrounding content (not inside useEffect) (S20)
- [ ] Content passes Helpful Content self-check (S20)
- [ ] Answer blocks: 40–60 words, self-contained, definitive statements (S16)
- [ ] Question-based H2 headings (S16)
- [ ] Published date and modified date visible with `<time>` element (S10)
- [ ] Author byline linked to author/about page (S10)
- [ ] Outbound citations to authoritative sources (S10)
- [ ] Related tools section: 3–5 internal links (S21)
- [ ] Blog posts linked from their primary tool page (S21)
- [ ] llms.txt updated to include new page/tool (S16)

### Performance
- [ ] Tool page uses SSG or ISR (never CSR-only) (S20)
- [ ] Fonts loaded via next/font with adjustFontFallback (S22)
- [ ] AdSense ad containers use CSS ID selectors with min-height (S18)
- [ ] Below-fold ads use LazyAdUnit with 300px rootMargin (S18)
- [ ] DNS preconnect for AdSense (S22)
- [ ] PageSpeed mobile score ≥ 90 (S7)
- [ ] LCP < 2.5s, INP < 200ms, CLS < 0.1 (S14)

### Security
- [ ] HSTS header present (S9)
- [ ] X-Frame-Options: SAMEORIGIN (S9)
- [ ] Consent Mode v2 defaults set before any tracking (S18/S22)
- [ ] security.txt present at /.well-known/security.txt (S22)

### Accessibility
- [ ] Color contrast ≥ 4.5:1 for all text (S4)
- [ ] All images have alt text or alt="" for decorative (S12)
- [ ] Keyboard navigable (tab through all interactive elements) (S4)
- [ ] Touch targets ≥ 44×44px (S4)
- [ ] Lighthouse Accessibility ≥ 90 (S7)

### Post-Deploy Verification
- [ ] URL Inspection in GSC: rendered HTML contains tool content (S20)
- [ ] Live site loads correctly on mobile
- [ ] No console errors in browser DevTools
- [ ] AdSense ads render correctly (production only)
- [ ] Schema validated at Rich Results Test
- [ ] IndexNow submission confirmed (Bing ecosystem)

---

## STANDARDS VERSION HISTORY

| Version | Date | Changes |
|---------|------|---------|
| v1.0 | March 3, 2026 | Initial standards (Sections 1–8) |
| v2.0 | March 8, 2026 | Added Sections 9–15: Security, E-E-A-T, Twitter Card, Image optimization, Repo standards, Google ranking factors, Audit protocol |
| v3.0 | March 8, 2026 | Added Sections 16–23: GEO/AI engine optimization, Bing/Microsoft standards, AdSense technical standards, Schema complete standards, Google algorithm updates, Competitive edge standards, Technical infrastructure gaps, Master deployment checklist |
