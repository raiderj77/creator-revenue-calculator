# Stan Calculator Run 2 Report

Run date: 2026-10-24

## Result

**NOT VERIFIED / STOPPED:** The Stan fee gate passed and the calculator implementation was added, but the required full suite did not complete. Per the workspace TRUTHMODE rule, `npm run build` failed twice and must not be attempted a third time. No commit was created.

## 1. First-Party Fee Re-fetch

**PROVEN:** Re-fetched `https://help.stan.store/article/83-stan-stripes-transaction-fees` on 2026-10-24. The article, last updated September 23, 2026, matched every Run 2 gate figure:

| Figure | Article 83 evidence | Oracle | Verdict |
| --- | --- | --- | --- |
| Stan transaction fee | `0%` | 0% | **PROVEN MATCH** |
| Creator subscription | `$29/mo` | $29/mo | **PROVEN MATCH** |
| Creator Pro subscription | `$99/mo` | $99/mo | **PROVEN MATCH** |
| US Stripe standard purchase | `2.9% + $0.30 per transaction` | 2.9% + $0.30 | **PROVEN MATCH** |
| US payout fee | `0.25% + $0.25 per payout (min. $1)` | 0.25% + $0.25, $1 minimum | **PROVEN MATCH** |

**PROVEN:** Re-fetched `https://help.stan.store/article/31-creator-vs-creator-pro` on 2026-10-24. It states Creator is $29/month or $300/year and Creator Pro is $99/month or $948/year. All four figures match the oracle.

**PROVEN:** Re-fetched `https://gumroad.com/pricing` on 2026-10-24. It states 10% + $0.50 for profile/direct-link transactions and 30% through Discover. The implementation uses and labels the direct-sale rate only.

**PROVEN:** Re-fetched `https://stripe.com/pricing` on 2026-10-24. It states 2.9% + 30 cents per successful domestic-card transaction.

## 2. Build State

**ASSERTED:** Added `tools/stan-store-calculator/index.html` and `tools/stan-store-calculator/stan-store-calculator.js`. The calculator compares Stan Creator, Stan Creator Pro, Gumroad direct sale, and direct Stripe from product price plus monthly sales.

**ASSERTED:** Fee configuration is centralized in `FEE_CONFIG` in `tools/stan-store-calculator/stan-store-calculator.js`, with a source-verification comment. Stan payout fees are shown separately because payout frequency is not a user input and oracle net excludes them.

**ASSERTED:** `STAN_STORE_URL` is exactly `https://stan.store` in `tools/stan-store-calculator/stan-store-calculator.js`; it has no referral path or parameter and is visibly labeled a direct Stan link.

**ASSERTED:** Registered the route in the homepage card, `vercel.json`, `sitemap.xml`, `llms.txt`, internal-link map, build-dist allowlist/counts, quality registry, analytics registry, Font Awesome inventory, EmailCapture browser contract, calculator browser contract, and reciprocal Patreon/UGC links. Added `tests/stan-calculator.test.js` and its package script.

## 3. Oracle Evidence

**PROVEN:** `npm run test:stan-calculator` passed 4 tests, 0 failures:

- $47 x 20 Stan Creator monthly: gross $940.00, sale fees $33.26, net $877.74, keep 93.4%, cover-plan sales 1.
- $47 x 20 Stan Creator Pro monthly: net $807.74, cover-plan sales 3.
- Per-sale Stripe fees, rounded to displayed cents: $19 -> $0.85; $29 -> $1.14; $97 -> $3.11.
- Direct Stan URL is exactly bare `https://stan.store`.

## 4. Suite Evidence

**PROVEN:** Passed before the composite build stop:

- `npm run test:navigation`: `Shared navigation and verification checked on 31 routes.`
- `npm run test:analytics`: `Analytics integrity checks passed (289 assertions).`
- `npm run assets:fontawesome`: generated `67 solid classes, 7 brand classes, 10,076 font bytes.`
- `npm run assets:fontawesome:check`: reproducible with the same summary.
- `npm run lint:unused`: completed with no findings.

**NOT VERIFIED:** `npm run build` failed first at `lint:html` because the new comparison wrapper needed the repository's scoped `prefer-native-element` annotation. That correction was applied.

**NOT VERIFIED:** The second `npm run build` reached `test:quality` and failed three checks: Font Awesome expected glyph-set count, homepage tool count, and Stan Twitter metadata. Corrections are applied in `scripts/quality-check.js`, `index.html`, and the Stan page, but the mandatory stop-after-two-failures rule prevents a third build.

**NOT VERIFIED:** The second build did not reach `test:social-estimator`, `test:stan-calculator` within the composite chain, `test:youtube-estimator`, `test:patreon-articles`, `build:dist`, or `test:dist`.

## 5. Rendered Evidence

**NOT VERIFIED:** The built-page check could not complete because the failed build did not regenerate `dist/` with the new Stan route. The attempted `npm run test:browser` therefore found no new built page: the new route lacked its H1/inputs and its assertion timed out. This is not arithmetic evidence.

**PROVEN:** `git diff --check` returned no whitespace error. It emitted only CRLF conversion warnings, including the pre-existing `CLAUDE.md` modification.

## 6. Commit

**NOT APPLICABLE:** No commit hash or `git show --stat` exists. The build and rendered checks are not green, so the requested commit was not created.

## 7. Safety Statement

**PROVEN:** Nothing was pushed, merged, or deployed. No referral link or ID was invented. No AdSense code was added. The pre-existing `CLAUDE.md` modification was not edited, staged, committed, or reverted.

**NOT VERIFIED:** The required session command `empire-wrapup` was attempted once and was unavailable: `'empire-wrapup' is not recognized as an internal or external command, operable program or batch file.`

## Owner Checklist

- Review the uncommitted Stan calculator changes.
- Approve a fresh verification run after the mandatory two-failure stop is cleared; it must run `npm run build`, `npm run test:browser`, and the requested rendered $47 x 20 check before committing.
