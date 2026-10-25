# Stan Calculator Run Report

Run date: 2026-10-24

## Result

**NOT VERIFIED / HARD STOP:** Phase 0 did not pass, so no calculator product files were created or changed. The task requires current first-party verification of every Stan fee the calculator would use before Phase 1. Stan's current first-party plan article verifies subscription prices, but the supplied first-party transaction-fee URL returned HTTP 404 and the current first-party pages inspected did not publish the platform transaction rate, applicable card-processing rate, or payout-fee formula. Building with the supplied oracle values would bypass that gate.

**PROVEN:** `git fetch origin` completed and branch `stan-calculator` was created from `origin/main`. The pre-existing `CLAUDE.md` modification and listed untracked artifacts were not changed.

## Phase 0 Registration Map

**PROVEN:** The requested slug did not exist before the run: repository search found it only in `STAN-CALCULATOR-PROMPT.md:11,23`.

| Registration or pattern | Evidence | Required action if Phase 0 passes |
| --- | --- | --- |
| Comparable tool page and calculator | `tools/patreon-revenue/index.html:210-452`; `tools/patreon-revenue/patreon-calculator.js:4-40,85-111,132-198,286-307` | Model the semantic form, visible inputs, accessible live results, validation, formula configuration, and target solver. |
| Estimator test model | `tools/social-media-earnings-estimator/index.html:108-151,190-239`; `tools/social-media-earnings-estimator/social-media-estimator.js:18-37,111-150,162-270`; `tests/social-estimator.test.js:14-63` | Model dynamic calculator result invalidation and unit coverage. |
| Email capture assets and markup | `assets/js/email-capture.js:1-33`; `assets/css/email-capture.css:1-33`; `tools/patreon-revenue/index.html:141-142,423-427` | Reuse the exact established block and assets after results. |
| Homepage tool card | `index.html:538-556` | Add the tool card. |
| Trailing-slash redirect | `vercel.json:14-25` | Add the canonical route redirect. |
| Sitemap | `sitemap.xml:4-15` | Add the URL. |
| Navigation integrity | `scripts/navigation-check.js:6-18` | Preserve byte-canonical header/footer; sitemap drives route coverage. |
| Maintained-page quality registry | `scripts/quality-check.js:141-172` | Register the page and its scripts/icons. |
| Public dist allowlist | `scripts/build-dist.js:63-106` | Include page and calculator assets. |
| Discovery files | `llms.txt:5-19`; `context/internal-links-map.md:20-33` | Add discovery and natural internal-link mappings. |
| Analytics registry | `scripts/analytics-integrity-check.js:497-521` | Register calculator telemetry contract. |
| Existing browser contracts | `tests/browser/calculators.spec.js:54-71,98-110`; `tests/browser/email-capture.spec.js:39-46` | Add rendered arithmetic, link, and EmailCapture coverage. |

## Fee Verification

Verification date: 2026-10-24.

| Figure | Oracle | Current first-party evidence | Verdict |
| --- | --- | --- | --- |
| Stan Creator monthly | $29/month | Stan Help Center, `https://help.stan.store/article/31-creator-vs-creator-pro`, “Creator at $29/month”; updated 2026-06-23 | **PROVEN MATCH** |
| Stan Creator annual | $300/year | Same Stan article, “$300/year” | **PROVEN MATCH** |
| Stan Creator Pro monthly | $99/month | Same Stan article, “Creator Pro at $99/month” | **PROVEN MATCH** |
| Stan Creator Pro annual | $948/year | Same Stan article, “$948/year” | **PROVEN MATCH** |
| Stan platform transaction fee | 0% | Supplied source `https://help.stan.store/en/articles/6121517-what-are-the-stan-transaction-fees` returned HTTP 404. Current Stan plan, payments, cash-out, and balance articles inspected did not state a platform rate. | **NOT VERIFIED** |
| Stan payment processing | Stripe US 2.9% + $0.30/sale | Stripe pricing, `https://stripe.com/pricing`, states “2.9% + 30¢ per successful transaction for domestic cards.” Stan Help Center, `https://help.stan.store/article/7-how-to-connect-stan-with-stripe`, states Stan creates a managed Custom Stripe account but does not state this rate. | **PROVEN STRIPE RATE; NOT VERIFIED AS STAN RATE** |
| Stan payout fee | 0.25% + $0.25, $1 minimum | Supplied Stan transaction-fee URL returned HTTP 404. Current Stan cash-out article, `https://help.stan.store/article/75-how-do-i-cash-out-inside-stan`, did not state a payout-fee formula. | **NOT VERIFIED** |

**ASSERTED:** The oracle's annual effective monthly figures are $25 for Creator ($300 / 12) and $79 for Creator Pro ($948 / 12).

### Gumroad Verdict

**PROVEN:** Gumroad is verifiable from its first-party pricing page, `https://gumroad.com/pricing`, accessed 2026-10-24. It states `10% + $0.50` per transaction for sales through a profile or direct link and `30%` through Discover. A completed calculator would use the direct-sale rate and identify it as such. It was not excluded.

## Build State

**PROVEN:** No calculator page, JavaScript, tests, registration entries, source ledger, or internal links were created or modified because the Phase 0 gate did not pass.

**NOT APPLICABLE:** No calculator config location exists and no `STAN_STORE_URL` constant was added.

## Oracle Test Evidence

**NOT RUN:** The task requires oracle tests only after Phase 0 passes. No test was added and no oracle arithmetic was executed against a shipped calculator.

For traceability, the required oracle figures remain unverified against an implementation:

- $47 x 20, Creator monthly: gross $940.00; Stripe fees $33.26; net $877.74; keep 93.4%; cover-plan sales 1.
- $47 x 20, Creator Pro monthly: net $807.74; cover-plan sales 3.
- Per-sale Stripe fee: $19 -> $0.85; $29 -> $1.14; $97 -> $3.11.

## Suite and Rendered Evidence

**NOT RUN:** `build`, `lint:predeploy`, `lint:content`, `lint:html`, `lint:unused`, `test:navigation`, `test:articles`, `test:recommended-products`, `test:analytics`, `test:quality`, `test:social-estimator`, `test:youtube-estimator`, `build:dist`, `test:dist`, `assets:fontawesome:check`, `test:browser`, and `git diff --check` were not run because the hard stop prevents Phase 2.

**NOT RUN:** No built tool page exists; therefore page presence, EmailCapture presence, driven `$47 x 20` output, and internal-link resolution checks could not be performed.

## Commit and Safety Statement

**NOT APPLICABLE:** No commit was created, so there is no commit hash or `git show --stat` output.

**PROVEN:** Nothing was pushed, merged, or deployed. No referral link or ID was invented. No AdSense code was added.

## Final Checks

**PROVEN:** `git diff --check` produced no whitespace errors. Its only output was a warning about the pre-existing modified `CLAUDE.md` line endings.

**NOT VERIFIED:** The repository rule requires `empire-wrapup` at session end. `where empire-wrapup` found no executable, and the single invocation attempt returned: `'empire-wrapup' is not recognized as an internal or external command, operable program or batch file.` No workaround was attempted.
