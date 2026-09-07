# Evidence-led article publishing standard

Last reviewed: 2026-09-06

This is the durable publication contract for Creator Revenue Calculator. It turns article work into a repeatable content-and-evidence task instead of a redesign or build-system task.

## What “ready for articles” means

The site is ready when an approved article can be added through the manifest, static page template, article hub, discovery links, and automated gates without changing the publication architecture. It does not mean the site can become maintenance-free: platform fees, policies, source pages, search presentation, accessibility expectations, and browser behavior still require periodic review.

## 1. Opportunity gate

Publish only when all of the following are recorded:

- Search Console query and page evidence with clicks, impressions, CTR, average position, date range, and capture date; or a documented user/funnel problem with comparable direct evidence.
- One specific creator decision or job the article will help complete.
- A meaningful original contribution beyond summarizing competitors or search results.
- A maintained calculator, tracker, or adjacent next action that fits the intent.
- The smallest safe scope. Prefer strengthening an existing page over splitting minor query variants into new routes.

Search metrics are historical observations. They are not promises or forecasts.

Record the trigger in the registry as one of three structured types:

- `search_console` with the aggregate period, capture date, clicks, impressions, CTR, and average position;
- `platform_change` with a capture date, primary-source URL, and a concise change summary; or
- `direct_evidence` with a capture date, `funnel_observation` or `user_report` evidence kind, aggregate observation count, and a privacy-safe evidence summary.

Never store a visitor identifier, customer record, email address, calculator input, or result in the publishing registry.

## 2. Source ledger

Every published article is registered in `content/published-articles.json`. Each time-sensitive or platform-specific claim needs:

- a claim identifier;
- the exact claim supported;
- a primary-source URL;
- the source’s visible update date, when available;
- the date the editor checked it;
- a next review date.

Primary sources include platform help centers, product documentation, regulatory guidance, and first-party policy pages. Secondary sources may supply context but cannot silently replace an available primary source.

If a source changes, disappears, or conflicts with the page, fix or unpublish the affected claim. Do not leave a confident statement in place while research is pending.

## 3. TRUTHMODE content gate

Every page must separate:

- verified facts from sources;
- formulas and deterministic calculations;
- user-entered assumptions;
- labeled synthetic examples;
- reasonable inferences;
- unknowns and limitations.

Never fabricate rates, creator income, outcomes, quotes, testimonials, personas, credentials, platform policy, or traffic. Never insert an undisclosed benchmark. Avoid false precision. Do not use keyword density, fixed word count, invented narrative, or competitor length as a quality proxy.

## 4. Draft state

Unapproved drafts stay outside the public build allowlist and out of the sitemap. The retired `/blog/` archive remains excluded. A draft is not a published page merely because it exists in Git.

The draft should contain:

- an answer-first introduction;
- the creator decision and the relevant tool;
- transparent workflow or formula;
- a visible source ledger;
- limitations and privacy notes;
- one honest next action;
- proposed title, description, URL, dates, and Article schema fields.

## 5. Publication state

After editorial approval:

1. Add a `published` entry to `content/published-articles.json`.
2. Build the page at `/articles/<slug>/index.html` from `docs/templates/article-page.html`.
3. Add the page to `/articles/`, `sitemap.xml`, `llms.txt`, and `context/internal-links-map.md`.
4. Add only relevant contextual links from the associated calculator or tracker.
5. Use shared privacy, theme, typography, and article styles.
6. Keep visible title, description, author, dates, breadcrumbs, sources, and Article JSON-LD in exact agreement.
7. Run all required tests before creating a focused pull request.

The build is fail-closed: only registry-approved article files and the hub enter `dist`.

## 6. Required validation

Run:

```text
npm run build
npm run test:browser
npm run lint:unused
npm audit --omit=dev
git diff --check
```

The article integrity gate verifies registry coherence, discovery, metadata/schema parity, source annotations, visible limitations, and banned fabrication/manipulation patterns. Browser checks cover keyboard/mobile/accessibility behavior. A green test does not replace editorial review of the claims.

## 7. Release and measurement

A local commit, pushed branch, pull request, merge, production deployment, indexing submission, and search result are different states. Do not collapse them.

After an approved merge and verified deployment:

- inspect the exact production URL, canonical, robots directive, structured data, mobile layout, links, and source presentation;
- confirm the sitemap contains the page;
- request indexing only with fresh approval;
- annotate the release date without sending article text or visitor inputs to analytics;
- review impressions, clicks, CTR, position, relevant Generative AI visibility, tool engagement, and tracker use after enough time has elapsed.

Do not judge success from a single query, an immediate crawl, or missing analytics. Never infer zero traffic from unavailable or mismapped measurement.

## 8. Maintenance triggers

Review an article when any of these occurs:

- its registry `nextReviewOn` date arrives;
- a platform changes fees, eligibility, terminology, or reporting;
- a source URL, update date, or claim changes;
- Search Console shows substantial impressions with weak satisfaction signals;
- a user reports confusing or inaccurate guidance;
- validation detects metadata, schema, link, accessibility, or privacy drift.

Do not rewrite merely to change a date. A `dateModified` update must reflect a substantive reviewed change.

## Current primary guidance

- Google AI features and Search: https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
- Google people-first content guidance: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Google spam policies: https://developers.google.com/search/docs/essentials/spam-policies
- Google Article structured data: https://developers.google.com/search/docs/appearance/structured-data/article
- Google structured-data policies: https://developers.google.com/search/docs/appearance/structured-data/sd-policies
- Search Console Generative AI report: https://support.google.com/webmasters/answer/16984139
