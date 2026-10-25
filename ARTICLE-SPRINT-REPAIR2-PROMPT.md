# ARTICLE SPRINT — REPAIR RUN 2: shared navigation block (bridge-launched OpenCode, non-interactive)

TRUTHMODE. Label every claim PROVEN / ASSERTED / NOT VERIFIED. Non-interactive: never wait for input. Hard stops apply to the part they touch; complete the rest.

WORKSPACE: C:\Users\jason\empire\creator-revenue-calculator-current, branch `patreon-article-sprint` (exists — stay on it). Edit ONLY inside this worktree.

STATE (all assistant-verified on disk 2026-10-24 evening): the sprint's 4 articles are built and ALL 10 article-integrity failures are FIXED (`npm run test:articles` passes: "Article integrity checks passed (7 published articles)"); `node --test tests/patreon-article-arithmetic.test.js` passes 1/1. The full suite then hard-stopped at its first step: `npm run build` → `test:navigation` fails because articles/patreon-fees-worked-examples/index.html carries a simplified minified <nav> while scripts/navigation-check.js requires the EXACT shared formatted navigation block (strictEqual). No commit exists yet. Full record: ARTICLE-SPRINT-REPORT.md in this worktree (original report + REPAIR RUN section).

OWNER AUTHORIZATION: unchanged — Jason Ramirez approved this sprint and its completion 2026-10-24 19:34 PT in the Creator chat. This run finishes it. No push, PR, merge, deploy, accounts, or spending.

PRE-EXISTING STATE — leave exactly as found: unstaged `CLAUDE.md` modification (never stage/commit/revert); untracked records and run artifacts (HANDOFF.md, PHASES-3-4-REPORT.md, RUN-PHASES-3-4.md, ARTICLE-SPRINT-*.md, *.cmd launchers, *.log, sprint-test-out.txt, nav-test-out.txt) are never committed.

THE ONE REPAIR:
1. Read scripts/navigation-check.js and identify the exact expected navigation block and how it compares (the assistant's read: strictEqual against a canonical formatted block).
2. For EACH of the 4 sprint articles (patreon-fees-worked-examples, patreon-patron-targets, patreon-membership-fee-comparison, patreon-payout-reconciliation): extract its current <nav ... </nav> block and compare against the canonical block. Report per article: MATCH or MISMATCH (before any edit).
3. For each MISMATCHING sprint article: replace its entire nav block with the canonical block, copied VERBATIM from a page that passes (e.g., articles/patreon-income-tracker/index.html or the checker's own expectation — prefer the checker-defined expectation if the script exposes it; otherwise a passing page's block). Use a Node script with occurrence-count proof (temporary repair-nav.cjs in the worktree root, deleted after; do NOT use apply_patch on these minified files). Change NOTHING else in the files — article content, attributes added by repair run 1, and JSON-LD stay byte-identical outside the nav block.
4. If a NON-sprint page fails test:navigation, STOP and report it — it is not yours to fix.

THEN, IN ORDER (all must pass before any commit):
1. `npm run test:navigation`
2. `npm run test:articles` (confirm repair run 1's fixes still hold)
3. `node --test tests/patreon-article-arithmetic.test.js`
4. FULL suite by name (repo's list governs; expected: build, lint:predeploy, lint:content, lint:html, lint:unused, test:navigation, test:articles, test:recommended-products, test:analytics, test:quality, test:social-estimator, test:youtube-estimator, build:dist, test:dist, assets:fontawesome:check, test:browser, git diff --check). Report EVERY result by name. Any failure = STOP before commit; report which check, the failure output, and your diagnosis — no scope broadening to fix it if it lies outside the 4 sprint articles and their wiring files.
5. Rendered checks on the BUILT dist: per article — page present in dist, capture block present in built HTML, calculator + blank-tracker links resolve to real dist targets. Evidence per article.
6. COMMIT (only if 1–5 all pass): one commit on `patreon-article-sprint`, message "feat: Patreon cluster article sprint (4 articles)", explicit pathspec ONLY: the 4 article directories, articles/index.html, content/published-articles.json, context/internal-links-map.md, llms.txt, package.json, scripts/article-integrity-check.js, sitemap.xml, tests/browser/articles.spec.js, tests/patreon-article-arithmetic.test.js. Delete repair-nav.cjs, sprint-test-out.txt, nav-test-out.txt before committing. Report commit hash + `git show --stat`, and restate the one-line justifications for the package.json and article-integrity-check.js changes from the repair report.

REPORT: append a "REPAIR RUN 2 — 2026-10-24 evening" section to ARTICLE-SPRINT-REPORT.md (prior content immutable) AND return it as your run output: per-article nav MATCH/MISMATCH before + after, the suite by name with results, rendered evidence, commit hash + stat or the precise stop, and the merge-readiness line.
