# Creator Revenue Calculator

Static, browser-based scenario calculators for creator revenue planning at https://creatorrevenuecalculator.com.

## Current product

The production site contains 11 maintained tools:

- YouTube ad revenue scenario
- Twitch revenue scenario
- TikTok revenue scenario
- Instagram revenue scenario
- Podcast revenue scenario
- Sponsorship quote worksheet
- UGC quote worksheet
- Engagement rate calculator
- Patreon revenue scenario
- Newsletter revenue scenario
- Affiliate marketing scenario

The former finance and gaming YouTube benchmark pages permanently redirect to the maintained YouTube tool. The UGC route now serves an explicit-input quote worksheet with no supplied market rates.

## Design principles

- Material revenue assumptions must be visible and editable.
- Variable platform, niche, follower, sponsor, and payout rates default to zero unless an authoritative fixed rule applies.
- Results are scenarios, not income forecasts or financial advice.
- Calculator inputs and results remain in the browser.
- Affiliate relationships are disclosed and affiliate links use `rel="nofollow sponsored"`.
- Advertising code stays absent until the site has the required AdSense approval and consent configuration.

## Stack and hosting

- Static HTML, CSS, and vanilla JavaScript
- Vercel deployment configured by `vercel.json`
- Local Chart.js and Font Awesome assets where still required
- No application server, account system, or database

## Important files

- `index.html`: homepage and discovery content
- `tools/*/index.html`: public calculator pages
- `assets/js/theme.js`: theme and opt-in, privacy-limited analytics control
- `assets/js/main.js`: shared navigation and presentation behavior
- `sitemap.xml`, `robots.txt`, `llms.txt`: search and assistant discovery files
- `privacy.html`, `cookies.html`, `terms.html`, `accessibility.html`: policy pages
- `affiliate-disclosure.html`: Amazon Associates and editorial-independence disclosure
- `ads.txt`: authorized Google seller and owner declaration
- `scripts/predeploy-check.js`: deployment configuration checks
- `scripts/content-lint.js`: content checks
- `scripts/quality-check.js`: product and regression checks
- `scripts/subset-fontawesome.py`: reproducible maintained-page icon CSS and WOFF2 generator

## Local verification

```bash
npm ci
npm run build
npm audit --omit=dev
git diff --check
```

`npm run build` runs the predeploy checks, content lint, HTML validation, and product-quality suite.

### Regenerating icon assets

Font Awesome is pinned as a development dependency and its license is retained with the generated assets. Regenerate the maintained-page subset after adding or removing an icon class:

```bash
npm ci
python -m pip install -r requirements-fonts.txt
npm run assets:fontawesome
npm run assets:fontawesome:check
```

The check rebuilds the CSS, solid font, brands font, and manifest in a temporary directory and requires byte-for-byte equality with the tracked output. GitHub's Quality workflow runs the same check.

## Monetization safeguards

- Amazon Associates tag: `creatorcalc-20`
- Google publisher ID in `ads.txt`: `pub-7171402107622932`
- `MANAGERDOMAIN` is intentionally absent because it is only appropriate for a real primary or exclusive external monetization manager.
- AdSense and session-replay scripts are not part of public product pages.
- Google Analytics is privacy-limited and loads only after an explicit opt-in; Global Privacy Control keeps it off.

## Deployment

The configured production branch is `main`. Do not deploy or add ad code until the build passes and the applicable account-side approval and consent gates are verified.
