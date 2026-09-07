# Article workflow: research, draft, review, publish

Use this command to prepare one evidence-led Creator Revenue Calculator article. It is a draft-and-validation workflow, not permission to publish.

## Required inputs

- One current Search Console opportunity tied to a maintained calculator or tracker journey.
- A clear creator decision the article will help make.
- Current primary sources for every platform-specific fee, policy, eligibility rule, or definition.
- An owner-approved scope when the article would introduce a new public route.

## TRUTHMODE workflow

1. Verify the canonical repository, branch, worktree, open pull requests, production route, and pre-existing changes.
2. Refresh Search Console evidence. Keep clicks, impressions, CTR, position, page, query, date range, and capture date together. Historical metrics are evidence, not forecasts.
3. State the search intent and the original value the article adds. Do not publish a generic paraphrase of results already ranking.
4. Research primary sources first. Record each supported claim, source URL, source updated date when available, date checked, and next review date.
5. Draft answer-first content. Use explicit formulas, limitations, and labeled synthetic examples. Never invent a person, result, quote, testimonial, rate, benchmark, or earnings claim.
6. Link only to relevant maintained pages. Give the reader one honest next action: use the calculator, use the tracker, compare scenarios, or read a directly related guide.
7. Keep the draft outside the public allowlist until editorial approval. The retired `/blog/` archive remains excluded.
8. On approved publication, add the article to `content/published-articles.json`, create its static `/articles/<slug>/index.html` page, add the hub card, sitemap entry, `llms.txt` entry, and relevant contextual links.
9. Ensure visible title, author, dates, sources, and breadcrumbs exactly match metadata and Article JSON-LD. Do not add FAQPage, HowTo, review, rating, or other schema unless the visible page and current eligibility rules justify it.
10. Run `npm run build`, `npm run test:browser`, `npm run lint:unused`, `npm audit --omit=dev`, and `git diff --check`. Stop on any integrity, accessibility, privacy, link, or source failure.
11. Prepare a focused draft pull request. Do not merge, deploy, submit indexing, promote, or contact anyone without fresh approval.

## Content rules

- Do not use keyword-density targets or fixed word counts.
- No hidden benchmarks, “typical earnings,” outcome promises, or false precision.
- No copied competitor structure, text, proprietary data, design, or branding.
- No filler sections added merely to make an article longer.
- No special AEO/GEO tricks. Search and answer-engine eligibility begins with crawlable, accurate, useful content and consistent visible metadata.
- No claim that a ranking, citation, traffic level, or revenue result is guaranteed.
- Use the organization author unless a real reviewed author is approved.

The durable publishing standard is `docs/editorial-publishing.md`.
