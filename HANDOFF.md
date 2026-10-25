## 1. Task summary
PROVEN: Phase 3 Part 1 adds a disabled static email capture block to the homepage only.
PROVEN: Work stayed in creator-ugc-rates-article-2026-09-18 on codex/ugc-rates-article-20260918, starting HEAD 7bab7bd.
ASSERTED: Jason approved the static redesign on 2026-10-24, per the task instruction.
PROVEN: No Patreon edits, push, merge, deploy, PR, account access, or spending occurred.

## 2. Design decisions
- PROVEN: `assets/js/email-capture.js` begins with the requested owner comment and `const BEEHIIV_EMBED_URL = "";`. It is the single configuration constant; no real embed URL was supplied.
- PROVEN: Static markup starts hidden. Empty configuration removes every `[data-email-capture]` section before creating any iframe. CSS enforces zero layout space even before JavaScript executes; disabled JavaScript leaves it hidden.
- PROVEN: With a valid HTTPS configuration, the script creates an iframe via DOM APIs inside `[data-email-capture-embed]`, gives it an accessible title, lazy loading and no-referrer policy, then unhides the block. Invalid configuration removes the block. There is no first-party form, endpoint, storage or collection API.
- PROVEN: Shared assets follow the repository's `assets/css/` and `assets/js/` layout. The semantic section has a heading, the exact copy `One email a week. Unsubscribe anytime.`, and a named nested signup section.
- NOT VERIFIED: Actual Beehiiv rendering, delivery, consent behavior, and iframe sizing with a real embed. Existing production CSP blocks frames; see section 8.

## 3. Files created/modified
- `index.html` — adds shared asset references and the hidden homepage section.
- `assets/js/email-capture.js` — new configuration flag and iframe injection/removal logic.
- `assets/css/email-capture.css` — new scoped responsive styling and hidden-state protection.
- `scripts/build-dist.js` — allowlists the two new public assets.
- `scripts/quality-check.js` — replaces the blanket email-capture name prohibition with checks for empty configuration, hidden markup, no local form, and no collection APIs; retains the legacy projection-copy prohibition.
- `assets/vendor/fontawesome/subset-manifest.json` — regenerated source inventory includes the newly linked script; fonts and icon CSS did not change.
- `tests/browser/email-capture.spec.js` — three built-homepage regression tests for disabled capture, mobile layout, network inactivity, and JavaScript disabled.
- `HANDOFF.md` — this local Part 2 handoff; excluded from the public build allowlist.
- `test-results/phase3-build.log`, `test-results/phase3-browser.log` — local ignored check transcripts.

## 4. Placement completed
PROVEN: In `index.html`, immediately after the closing `</section>` of `<section class="hero">`, and immediately before `<!-- Creator Revenue Mix Calculator -->` and `<section id="creator-calculator" ...>`. This is below the hero's first calculator entry-point links. No other page received the block.

## 5. Checks run
Final results, all PROVEN:
- `npm run build` — PASS.
- `npm run test:navigation` — PASS, invoked by build.
- `npm run lint:predeploy` — PASS, invoked by build.
- `npm run lint:content` — PASS, invoked by build.
- `npm run test:articles` — PASS, invoked by build.
- `npm run test:recommended-products` — PASS, invoked by build.
- `npm run lint:html` — PASS, invoked by build.
- `npm run test:analytics` — PASS, invoked by build.
- `npm run test:quality` — PASS, invoked by build.
- `npm run test:social-estimator` — PASS, invoked by build.
- `npm run test:youtube-estimator` — PASS, invoked by build.
- `npm run build:dist` — PASS, invoked by build; 90 public files.
- `npm run test:dist` — PASS, invoked by build; source/output hashes and references verified.
- `npm run lint:unused` — PASS.
- `npm run assets:fontawesome` — PASS; regenerated manifest only.
- `npm run assets:fontawesome:check` — PASS; reproducible subset.
- `npm run test:browser` — PASS, 36 tests including three new capture tests.
- Rendered flag-off check — PASS using repository Playwright/Chromium and `scripts/serve-test-dist.js`, serving BUILT `dist/` at localhost port 4312. At 320px and 1280px, delay the capture script: section hidden, zero client rectangles, no iframe. Release script: section removed, no iframe, zero external requests, no horizontal overflow. A separate JavaScript-disabled browser context confirms the section remains hidden with no iframe. The hidden section therefore reserves no space before removal and causes no removal-induced layout shift.
- `git diff --check` — PASS.
- Protected-file diff — PASS: Patreon, ads.txt, legal pages, vercel.json, llms.txt and robots.txt unchanged; no earnings copy edits.
Earlier validation failures were resolved: HTML lint required a native section for the named embed region; the old quality rule banned the component name; font source inventory needed the new script. Final checks above passed after those fixes.

## 6. REMAINING TASK
Patreon placement only: target `tools/patreon-revenue/index.html`.
PROVEN: `.results-panel` contains `<div class="results-card" id="patreonResults" aria-live="polite" aria-atomic="true" tabindex="-1">`. That card contains revenue summary, fee/breakdown content, `button#copyResult`, `p#copyStatus`, then its final `.disclaimer`.
Precise insertion anchor: immediately AFTER the closing div of `#patreonResults` (following the disclaimer), BEFORE `<aside class="growth-next-step growth-next-step--compact" id="patreonTrackerNextStep" ...>`, as a sibling inside `.results-panel`. Keep capture outside the results live region and preserve the tracker aside.
Use exactly `<link rel="stylesheet" href="/assets/css/email-capture.css">` and `<script src="/assets/js/email-capture.js" defer></script>` at this depth. These root-relative paths work at both `/` and `/tools/patreon-revenue/`; do not use `assets/...` or `../assets/...` from the tool page.
Reuse the homepage block markup, exact copy, data attributes, shared CSS and JS, and empty configuration unchanged. The heading ID may remain `email-capture-heading` when it occurs once per document. No duplicate assets or second configuration constant. Rerun relevant checks and verify the built Patreon page's flag-off behavior. Part 1 did not edit the Patreon page.

## 7. Conventions discovered
- PROVEN: Headers/footers are checked-in static copies of `docs/templates/site-header.html` and `site-footer.html`. `scripts/navigation-check.js` compares them; optional `--write` replaces those copies. The normal build checks rather than generates them.
- PROVEN: Shared files use root-relative `/assets/...`; tool-specific CSS/JS uses same-directory filenames. Homepage styles include Font Awesome subset CSS, `assets/css/style.css`, accessibility fixes and site-navigation CSS. Classes are global kebab-case; shared CSS variables supply colors, spacing and radii. Capture classes are scoped with `email-capture` and use fallbacks for tool pages.
- PROVEN: `build` is a validation chain followed by `build:dist` and `test:dist`. `scripts/build-dist.js` recreates the resolved worktree-local `dist/`, copies only its explicit allowlist plus published article manifest entries, then verifies hashes, references, sitemap, redirects and deployment configuration. Pages keep their source paths, including `dist/index.html` and `dist/tools/patreon-revenue/index.html`. There is no runtime include or framework compilation for this block.
- PROVEN: Both rule files were read. Their Next.js, next/*, Tailwind/CSS-module and `.next` requirements conflict with the actual static architecture, including locally stored origin/main. Follow code and the user's explicit architecture override. Remote freshness was not checked. Preserve all nonconflicting privacy, accessibility, disclosure and security requirements.
- PROVEN: The generic standards' identity/cross-site-footer instructions also differ from site-specific guidance. Existing identity/footer content was left untouched; navigation templates remain authoritative for matching checks.
- PROVEN: The font manifest inventories linked scripts even if they contain no icons. Future new script references may require regeneration. The quality gate intentionally requires the capture configuration to remain empty for this phase; enabling it later requires updating that gate alongside actual activation verification.

## 8. Open questions / risks
- PROVEN activation blocker: `vercel.json` currently specifies CSP `frame-src 'none'`. A URL alone cannot produce a working production embed. Security headers were preserved as explicitly required. A separately authorized, narrowly scoped CSP decision is necessary before activation.
- NOT VERIFIED: Beehiiv account availability, actual embed URL, provider privacy/consent behavior, accessibility, mobile sizing, success/error handling and delivery. No real URL was configured or contacted. The current 340px iframe height must be checked against the actual embed before launch.
- ASSERTED: Weekly frequency and unsubscribe behavior are the requested future copy; no working subscription service has been verified.
- PROVEN: Existing unrelated untracked creator-* logs and production-check script were preserved. This branch starts at an existing worktree commit; no branch sync, commit or remote mutation was performed.

## PORT
2026-10-24
- PROVEN: Ported from `C:\Users\jason\Documents\Empire\creator-ugc-rates-article-2026-09-18` into this worktree.
- PROVEN: Modified-file hunks applied cleanly with no adjustments: `index.html` (3 hunks), `scripts/build-dist.js` (2 hunks), `scripts/quality-check.js` (1 hunk), and `assets/vendor/fontawesome/subset-manifest.json` (1 hunk).
- PROVEN: Whole files copied unchanged: `assets/css/email-capture.css`, `assets/js/email-capture.js`, `tests/browser/email-capture.spec.js`, and `HANDOFF.md`.
- PROVEN: No file port stopped and no excluded source artifact was copied.

## PART 2 COMPLETION
2026-10-24
- PROVEN: Added the reused, disabled email-capture block to `tools/patreon-revenue/index.html` immediately after `#patreonResults` and before `#patreonTrackerNextStep`, outside the live region. Added exactly the required root-relative shared CSS and deferred JavaScript references.
- PROVEN: `BEEHIIV_EMBED_URL` remains the single empty configuration constant in `assets/js/email-capture.js`; shared assets were not changed for this placement.
- PROVEN: Full handoff suite passed: `build` (including navigation, predeploy, content, HTML, article, recommended-products, analytics, quality, social-estimator, YouTube-estimator, dist build, and dist check); `lint:unused`; `assets:fontawesome:check`; `test:browser` (36 tests); and `git diff --check`.
- PROVEN: Built Patreon flag-off checks passed at 320px and 1280px: zero capture layout space before execution, no iframe, no external requests, block removed after script execution, and no horizontal overflow. A JavaScript-disabled context kept the block hidden with zero layout space and no iframe.
