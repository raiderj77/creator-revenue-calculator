# Creator Revenue Calculator — CLAUDE.md

> Source of truth for Claude Code on this project. Last updated: 2026-03-09

## Before Doing Anything
1. Read this file and EMPIRE_BUILD_STANDARDS.md first
2. Show Jason a plan. Wait for approval.

## Project Identity

- **Site**: Creator Revenue Calculator
- **Domain**: creatorrevenuecalculator.com
- **Purpose**: YouTube and creator platform income estimation
- **Type**: utility-site
- **Compliance Tier**: Standard

## Tech Stack

- **Framework**: Next.js
- **Deployment**: Vercel
- **Language**: TypeScript (preferred) / JavaScript
- **Styling**: Tailwind CSS (preferred) / CSS Modules
- **Package Manager**: npm
- Chart libraries for visualization

## 1. AdSense & Monetization

- **Publisher ID**: `ca-pub-7171402107622932`
- **ads.txt** at `public/ads.txt`: `google.com, pub-7171402107622932, DIRECT, f08c47fec0942fa0`
- Include OWNERDOMAIN directive per IAB ads.txt v1.1
- Ads must never exceed content volume on any page
- Reserve explicit width/height on ad containers (prevents CLS)
- Mobile: follow Better Ads Standard
- Google Consent Mode v2: configure all 6 parameters (ad_storage, ad_user_data, ad_personalization, analytics_storage, functionality_storage, personalization_storage)
- For EEA/UK visitors: Google-certified CMP with IAB TCF v2.2 required
- AdSense + Amazon Associates (ytearnings-20) for creator equipment. Affiliate links: `rel="nofollow sponsored"`.

## 2. SEO — Google Search Essentials

- Use SSR or SSG for all public pages (critical for both Google and Bing crawlability)
- No cloaking, doorway pages, hidden text, link spam, or sneaky redirects
- Each page must provide substantive unique value
- AI-generated content permitted if genuine value added

## 3. Core Web Vitals

Target thresholds (at 75th percentile):
- **LCP** ≤ 2.5 seconds
- **INP** ≤ 200 milliseconds
- **CLS** ≤ 0.1

How to maintain these:
- Use `next/image` with width/height props (prevents CLS)
- Use `next/font` (prevents font-loading shifts)
- Reserve dimensions on all ad containers
- Leverage Vercel ISR/SSR for LCP optimization
- Audit third-party scripts (especially AdSense) for INP impact

## 4. E-E-A-T Content Standards

- Display author credentials on every content page
- Create dedicated author bio pages with Person schema
- Maintain About page with verifiable organizational info and mission
- Include Contact information accessible from every page
- Describe editorial review process (especially for YMYL content)
- Attribution: "Built by a digital marketing professional" — NEVER use personal name

## 5. Structured Data (JSON-LD)

Use JSON-LD format. Place via Next.js generateMetadata() or Script component.

Required schema types for this site:
- Organization (homepage)
- WebSite (homepage)
- WebApplication (calculator)
- BreadcrumbList (all pages)

Rules:
- All markup must match visible page content exactly
- Include dateModified on all content (critical freshness signal for search and AI)
- Validate with Google Rich Results Test and Bing Markup Validator

## 6. Mobile-First Requirements

- Content parity: mobile must contain ALL desktop content
- Same structured data and meta robots on mobile and desktop
- Responsive design with viewport meta tag
- Touch targets: 48px minimum
- Body text: 16px minimum
- No intrusive interstitials
- Don't block CSS/JS/images from crawlers

## 7. Bing-Specific Optimization

- Include `<meta name="keywords">` tag (Bing still uses it, Google ignores)
- Write descriptive meta descriptions (Bing shows them more literally)
- SSR/SSG is MANDATORY — Bingbot has very limited JS rendering
- IndexNow: API route at /api/indexnow, key file in /public, trigger on deploy
- Store INDEXNOW_API_KEY in Vercel environment variables
- Crawl-delay: 10 for Bingbot in robots.txt
- Title, H1, meta description must be aligned and consistent
- Do NOT hide content behind tabs, accordions, or expandable menus

## 8. GEO / AI Discoverability

### llms.txt
Serve `/llms.txt` at site root (Markdown, text/plain MIME type). Include site name, description, links to key pages with descriptions. Also create `/llms-full.txt` with full content.

### robots.txt AI Crawlers
Configure in `public/robots.txt`. Allow all search-facing AI crawlers:
- OAI-SearchBot, ChatGPT-User, Claude-SearchBot, Claude-User, PerplexityBot, Applebot-Extended, DuckAssistBot, Amazonbot
- Allow or block training crawlers (GPTBot, ClaudeBot, Google-Extended) per preference
- Block: Bytespider, Meta-ExternalAgent

### Content Structure for AI
- Answer-first format: lead sections with 1-3 sentence direct answers
- Question-based headings ("How does X work?")
- Self-contained sections extractable as standalone snippets
- Short paragraphs (2-4 sentences)
- Include statistics and data (boosts AI visibility 15-30%)
- Add visible "Last Updated" dates
- Set meta robots: `index, follow, max-snippet:-1`
- SSR all critical content (AI crawlers don't execute JS)

## 9. Privacy & Consent

### Required Pages
- `/privacy` — Privacy Policy (update annually, include GDPR + CCPA sections)
- `/terms` — Terms of Service

### Privacy Policy Must Include
- Data controller identity, lawful basis, data categories, retention periods
- Third-party recipients (including Google for AdSense)
- Consumer rights (access, delete, correct, opt-out)
- CCPA: "Do Not Sell or Share" link on homepage
- Honor Global Privacy Control (GPC) signals

### Cookie Consent
- EU/EEA/UK: Opt-in model (consent before tracking)
- US: Opt-out model (honor GPC)
- Use Google-certified CMP with IAB TCF v2.2 for EEA/UK

## 10. Accessibility (WCAG 2.1 AA)

- Alt text on all images (alt="" for decorative)
- Color contrast: 4.5:1 normal text, 3:1 large text
- All functionality via keyboard, no keyboard traps
- Skip navigation links
- Visible focus indicators on all interactive elements
- Touch targets: 44x44 CSS pixels minimum
- `lang` attribute on `<html>` element
- Form errors with descriptive messages, visible labels (not just placeholders)
- Valid semantic HTML, proper ARIA roles
- Dynamic content changes announced via ARIA live regions
- Content reflow at 320px without horizontal scroll
- European Accessibility Act (June 2025): publish accessibility statement

## 11. Security Headers

Configure in `vercel.json` or `next.config.js` headers:

```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), interest-cohort=()
```

CSP (AdSense-compatible — unsafe-eval required by AdSense):
```
Content-Security-Policy: object-src 'none'; script-src 'nonce-{random}' 'unsafe-inline' 'unsafe-eval' 'strict-dynamic' https: http:; base-uri 'none'
```

Do NOT enable strict COEP/COOP on pages with ads (breaks ad rendering).

## 12. Sitemaps & Metadata

### Sitemap
- Generate via `app/sitemap.ts` with lastmod from actual content dates
- Submit to Google Search Console AND Bing Webmaster Tools
- Reference in robots.txt

### Every Page Must Have
- `<title>` unique, under 60 chars
- `<meta name="description">` unique, ~155 chars, direct answer to page query
- `<meta name="keywords">` (for Bing)
- `<meta name="robots" content="index, follow, max-snippet:-1">`
- `<link rel="canonical">`
- Open Graph: og:title, og:description, og:image (1200x630px), og:url, og:type
- Semantic HTML5: header, nav, main, article, section, footer
- Heading hierarchy: H1 > H2 > H3, no skipping

## Cross-Site Links

Footer links to all sister sites (exclude self):
- [FiberTools](https://fibertools.app)
- [MindCheck Tools](https://mindchecktools.com)
- [FlipMyCase](https://flipmycase.com)
- [ContractExtract](https://contractextract.com)
- [Medical Bill Reader](https://medicalbillreader.com)

## Deployment

- **Platform**: Vercel
- **Branch**: main
- **Build**: `npm run build`
- **Env vars**: INDEXNOW_API_KEY

### Pre-Deploy Checklist
1. `npm run build` passes
2. ads.txt present and correct
3. robots.txt has AI crawler rules
4. llms.txt present and current
5. All legal pages render
6. Cross-site links working
7. Security headers configured
8. Structured data validates

## Warnings — Things Claude Code Must NEVER Do

1. Never expose the site owner's personal name in code, content, comments, or metadata
2. Never modify ads.txt unless explicitly asked
3. Never remove legal pages (privacy, terms)
4. Never hardcode API keys — use environment variables
5. Never push to main without testing build
6. Never remove sister site cross-links
7. Never remove or weaken security headers
8. Never remove accessibility features (alt text, ARIA, focus indicators)
9. Never remove llms.txt or AI crawler rules from robots.txt
10. Never present revenue estimates as guaranteed earnings — use "estimated" or "approximate"

## Empire Skills
For cross-site operations, read the relevant skill:
- Audit/sync: ~/empire-skills/empire-sitesync/SKILL.md
- CLAUDE.md generation: ~/empire-skills/empire-projectfiles/SKILL.md

## Calculator Logic
Show revenue ranges (low-mid-high), not single numbers. Allow custom CPM input with sensible defaults. Explain what CPM means and what affects it. Required disclaimer: "Revenue estimates are approximations based on publicly available CPM data."
