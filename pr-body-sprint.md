## Patreon cluster article sprint — 4 articles

First content cluster for the Patreon calculator, built to the repo's full publication contract (article integrity, shared navigation/footer, arithmetic reproduction tests).

**Articles**
- `/articles/patreon-fees-worked-examples/` — every Patreon fee with $5/$10/$25 worked examples (Standard 10% + 2.9% + $0.30 processing, verified against Patreon's Creator fees overview, updated 2026-09-11)
- `/articles/patreon-patron-targets/` — patrons needed for $1,000/$3,000/$5,000 a month, built from the calculator's own net-per-patron math
- `/articles/patreon-membership-fee-comparison/` — Patreon vs Ko-fi vs Buy Me a Coffee: Ko-fi publishes no processor rate and Buy Me a Coffee's official fee pages return 404, so both are excluded from exact keep-amount math with the exclusions stated on-page (no invented figures)
- `/articles/patreon-payout-reconciliation/` — why payouts differ from the earnings page; funnels to the tracker guide + blank CSV

Each article: sources ledger with dated primary sources, source/synthetic annotation on every monetary claim, FAQ, Article + BreadcrumbList JSON-LD, the live Beehiiv capture block, and the blank-tracker CSV link.

**Supporting changes**
- `tests/patreon-article-arithmetic.test.js` (new, wired in `package.json`): reproduces every worked-example figure from the verified fee rates
- `scripts/article-integrity-check.js`: registers the 4 articles; capture-placement predicate aligned to the live Patreon tool page's before-footer shape
- `assets/vendor/fontawesome/subset-manifest.json`: regenerated — the 4 new maintained pages join the subset page inventory (check: reproducible, 64 solid + 7 brand classes)
- Sitemap, article hub, published-articles registry, llms.txt, internal-links map updated

**Verification (local, pre-push)**
Full suite green: navigation (30 routes), article integrity (7 articles), arithmetic 1/1, build, build:dist (94 files), test:dist, test:quality, test:browser 46/46, analytics 283 assertions, social-estimator 6/6, youtube-estimator 22/22, Font Awesome reproducible, git diff --check clean. Rendered dist checks per article: page present, capture block present, calculator + CSV links resolve.
