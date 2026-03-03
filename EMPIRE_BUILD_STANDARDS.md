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
