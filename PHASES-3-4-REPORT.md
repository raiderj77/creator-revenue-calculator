# Phases 3-4 Execution Report

## Closures

- PROVEN: Phase 1 aerovato/container KILLED because its escape test found a writable host configuration mount (runbook `RUN-PHASES-3-4.md:9`).
- PROVEN: Phase 2 ai-memory KILLED because documented Codex/OpenCode hooks are user-level on Windows rather than worktree-scoped, making capture scope unacceptable (runbook `RUN-PHASES-3-4.md:9`).

## Part A0: Part 1 Port

- PROVEN: Source patch preflight checked clean for all four modified files: `assets/vendor/fontawesome/subset-manifest.json`, `index.html`, `scripts/build-dist.js`, and `scripts/quality-check.js`.
- PROVEN: Applied clean hunks without adjustment: manifest (1), homepage (3), dist builder (2), quality check (1). No file stopped.
- PROVEN: Copied unchanged whole files: `assets/css/email-capture.css`, `assets/js/email-capture.js`, `tests/browser/email-capture.spec.js`, and `HANDOFF.md`.
- PROVEN: Appended the required `PORT` section to `HANDOFF.md:73-79`; pre-existing handoff content remains intact.
- PROVEN: At the A0 status gate, `git status --short` showed exactly the Part 1 four modified and four added files, plus excluded run artifacts `RUN-PHASES-3-4.md` and `PHASES-3-4-REPORT.md` (the latter was created after the gate). No source-clone logs or other excluded artifacts were ported.

### A0 Checks

- PROVEN: `npm run build` PASS. Its named chain passed: `test:navigation`, `lint:predeploy`, `lint:content`, `test:articles`, `test:recommended-products`, `lint:html`, `test:analytics`, `test:quality`, `test:social-estimator` (6 passing tests), `test:youtube-estimator` (22 passing tests), `build:dist`, and `test:dist`. Final A0 dist verification: 90 files, 1,690,921 bytes.
- PROVEN: `npm run lint:unused` PASS.
- PROVEN: `npm run assets:fontawesome:check` PASS: reproducible subset, 64 solid classes, 7 brand classes, 9,856 font bytes.
- PROVEN: `npm run test:browser` PASS: 36 tests, including the three homepage email-capture tests.
- PROVEN: `git diff --check` PASS.
- PROVEN: Built-homepage flag-off check at 320px and 1280px: capture starts hidden with zero client rectangles and no iframe; after the empty-configuration script executes it is removed, no iframe remains, no external request occurs, and no horizontal overflow occurs. A JavaScript-disabled context remains hidden with no iframe (`tests/browser/email-capture.spec.js:3-38`).
- NOT VERIFIED: Exact A0 wall-clock duration was not recorded with a monotonic timer.

## Part A: Handoff Verdict and Patreon Placement

### Required Handoff Quotes

`HANDOFF.md` section 2, verbatim:

> - PROVEN: `assets/js/email-capture.js` begins with the requested owner comment and `const BEEHIIV_EMBED_URL = "";`. It is the single configuration constant; no real embed URL was supplied.
> - PROVEN: Static markup starts hidden. Empty configuration removes every `[data-email-capture]` section before creating any iframe. CSS enforces zero layout space even before JavaScript executes; disabled JavaScript leaves it hidden.
> - PROVEN: With a valid HTTPS configuration, the script creates an iframe via DOM APIs inside `[data-email-capture-embed]`, gives it an accessible title, lazy loading and no-referrer policy, then unhides the block. Invalid configuration removes the block. There is no first-party form, endpoint, storage or collection API.
> - PROVEN: Shared assets follow the repository's `assets/css/` and `assets/js/` layout. The semantic section has a heading, the exact copy `One email a week. Unsubscribe anytime.`, and a named nested signup section.
> - NOT VERIFIED: Actual Beehiiv rendering, delivery, consent behavior, and iframe sizing with a real embed. Existing production CSP blocks frames; see section 8.

`HANDOFF.md` section 3, verbatim:

> - `index.html` — adds shared asset references and the hidden homepage section.
> - `assets/js/email-capture.js` — new configuration flag and iframe injection/removal logic.
> - `assets/css/email-capture.css` — new scoped responsive styling and hidden-state protection.
> - `scripts/build-dist.js` — allowlists the two new public assets.
> - `scripts/quality-check.js` — replaces the blanket email-capture name prohibition with checks for empty configuration, hidden markup, no local form, and no collection APIs; retains the legacy projection-copy prohibition.
> - `assets/vendor/fontawesome/subset-manifest.json` — regenerated source inventory includes the newly linked script; fonts and icon CSS did not change.
> - `tests/browser/email-capture.spec.js` — three built-homepage regression tests for disabled capture, mobile layout, network inactivity, and JavaScript disabled.
> - `HANDOFF.md` — this local Part 2 handoff; excluded from the public build allowlist.
> - `test-results/phase3-build.log`, `test-results/phase3-browser.log` — local ignored check transcripts.

`HANDOFF.md` section 6, verbatim:

> Patreon placement only: target `tools/patreon-revenue/index.html`.
> PROVEN: `.results-panel` contains `<div class="results-card" id="patreonResults" aria-live="polite" aria-atomic="true" tabindex="-1">`. That card contains revenue summary, fee/breakdown content, `button#copyResult`, `p#copyStatus`, then its final `.disclaimer`.
> Precise insertion anchor: immediately AFTER the closing div of `#patreonResults` (following the disclaimer), BEFORE `<aside class="growth-next-step growth-next-step--compact" id="patreonTrackerNextStep" ...>`, as a sibling inside `.results-panel`. Keep capture outside the results live region and preserve the tracker aside.
> Use exactly `<link rel="stylesheet" href="/assets/css/email-capture.css">` and `<script src="/assets/js/email-capture.js" defer></script>` at this depth. These root-relative paths work at both `/` and `/tools/patreon-revenue/`; do not use `assets/...` or `../assets/...` from the tool page.
> Reuse the homepage block markup, exact copy, data attributes, shared CSS and JS, and empty configuration unchanged. The heading ID may remain `email-capture-heading` when it occurs once per document. No duplicate assets or second configuration constant. Rerun relevant checks and verify the built Patreon page's flag-off behavior. Part 1 did not edit the Patreon page.

- PROVEN: Sections 2, 3, and 6 carried the design, changed-file list, and remaining task adequately. The required anchor, exact asset paths, reuse constraints, and empty configuration were all present and executable (`HANDOFF.md:7-12,14-23,52-57`).
- File-handoff: KEEP. No specific gap found.

### EmailCapture Final State

- PROVEN: Shared assets are `assets/css/email-capture.css` and `assets/js/email-capture.js`; `BEEHIIV_EMBED_URL` remains exactly empty at `assets/js/email-capture.js:2`.
- PROVEN: Homepage placement is in `index.html:240-244`, following the hero and before the revenue-mix calculator.
- PROVEN: Patreon placement is in `tools/patreon-revenue/index.html`, immediately after `#patreonResults` and before the preserved `#patreonTrackerNextStep` aside; assets are root-relative in its head.
- PROVEN: The full named suite passed again after Part 2: `build` chain (all named A0 checks), `lint:unused`, `assets:fontawesome:check`, `test:browser` (36 passing), and `git diff --check`. Final dist verification: 90 files, 1,691,537 bytes.
- PROVEN: Direct built-Patreon Playwright flag-off check passed at 320px and 1280px: zero layout before script release, no iframe, no external requests, block removed after script execution, and no horizontal overflow. JavaScript-disabled output remains hidden with zero layout and no iframe.
- PROVEN: `HANDOFF.md:81-85` contains only the required `PART 2 COMPLETION` addition.
- NOT VERIFIED: Exact Part A wall-clock duration was not recorded with a monotonic timer.

## Part B: Security Execution

- PROVEN: Gitleaks command: `python .portfolio-standards/scripts/tool.py gitleaks -- git --redact=100 --no-banner .`.
- PROVEN: Gitleaks scope was repository Git history, using the configured CI wrapper (`.github/workflows/portfolio-standards.yml:41-43`) and exact-history suppressions in `.gitleaksignore:1-7`. Result: 407 commits scanned, about 9.72 MB scanned in 2.52 seconds, no leaks found.
- PROVEN: OSV command: `python .portfolio-standards/scripts/tool.py osv -- scan source --lockfile package-lock.json`.
- PROVEN: OSV scope was `package-lock.json` only, 87 packages. Result: 5 known vulnerabilities in 2 development-only transitive packages: 0 critical, 1 high, 2 medium, 2 low, 0 unknown.
- PROVEN: `fast-uri@3.1.8` has four advisories: GHSA-333x-w4r6-6crp (low, CVSS 3.7), GHSA-w74x-v6f9-j3xg (medium, 6.1), GHSA-wjr9-j795-jxcr (medium, 4.8), and GHSA-xhq7-xmqj-769h (low, 3.7). OSV reports fixed version `3.1.9`.
- PROVEN: `zod@4.5.4` has GHSA-mrhx-c7xc-m3w5 (high, CVSS 8.2). OSV reports fixed version `4.6.6`.
- PROVEN: Neither is a direct dependency. `npm ls zod fast-uri` shows `fast-uri` through `html-validate -> ajv` and `zod` through `knip`; both root parents are `devDependencies` (`package.json:26-32`).
- PROVEN: EmailCapture review found only the empty configuration constant and DOM iframe creation after a valid HTTPS URL (`assets/js/email-capture.js:1-33`), no first-party collection API, storage, fetch, beacon, or embedded secret. Built flag-off evidence above cross-checks its inactive behavior.
- PROVEN: HANDOFF review found no actual embed URL or credential; references to `BEEHIIV_EMBED_URL` describe the empty placeholder (`HANDOFF.md:8-12,56-57`).
- PROVEN: Activation-time finding: the current CSP has `frame-src 'none'` (`vercel.json:109-112`), so a Beehiiv iframe cannot work until the owner approves a narrowly scoped `frame-src` decision. No header was changed.
- PROVEN: Known configuration disagreement, record-only: `CLAUDE.md:10` requires `SAMEORIGIN`; master standards require `DENY` (`EMPIRE_BUILD_STANDARDS.md:699,903`), and deployed config is `DENY` (`vercel.json:98-100`). The pre-decided standards precedence governs; no header was touched.
- PROVEN: Skips retained: generated `dist/`, `node_modules/`, binary assets, `.git/` except the sanctioned Gitleaks history scan, `.claude/settings.local.json`, and `.env.example` contents. These were outside the execution scope or restricted by the runbook.

### Review-Only Patch Proposal

No patch was applied.

```diff
--- package-lock.json (review only; regenerate, test, then review)
+++ package-lock.json (proposed)
@@ transitive development dependencies
- fast-uri@3.1.8
+ fast-uri@3.1.9
- zod@4.5.4
+ zod@4.6.6
```

- ASSERTED: Regenerating this diff through the package manager would require reviewing the resulting lockfile integrity and resolved dependency fields before application. It was deliberately not run or applied in this execution.
- NOT VERIFIED: Whether the parent development tools have an update path that produces both fixed transitive versions without unrelated lockfile movement.
- NOT VERIFIED: Exact Part B wall-clock duration was not recorded with a monotonic timer.

## Wrap-Up

- PROVEN: `empire-wrapup` was NOT RUN because cmd.exe reported it is not recognized as an internal or external command. This is the pre-decided non-gating condition.

## Owner-Only Checklist

1. Create Beehiiv free account + paste the embed URL into the `BEEHIIV_EMBED_URL` constant in `assets/js/email-capture.js`.
2. Decide the CSP `frame-src` allowance for Beehiiv at activation.
3. Say merge/deploy in the creator chat.
