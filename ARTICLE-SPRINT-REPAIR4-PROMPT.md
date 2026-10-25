# ARTICLE SPRINT — REPAIR RUN 4: static verification meta + close-out (bridge-launched OpenCode, non-interactive)

TRUTHMODE. Label every claim PROVEN / ASSERTED / NOT VERIFIED. Non-interactive: never wait for input. Hard stops apply to the part they touch; complete the rest.

WORKSPACE: C:\Users\jason\empire\creator-revenue-calculator-current, branch `patreon-article-sprint` (stay on it). Edit ONLY inside this worktree.

STATE (assistant-verified): 4 sprint articles built; article-integrity failures fixed; nav blocks canonical (repair run 2); footers canonical with capture blocks relocated byte-for-byte to immediately before the footer, mirroring the live Patreon tool page (repair run 3). `npm run test:navigation` now progresses past header + footer and fails on the checker's third assertion: articles/patreon-fees-worked-examples/index.html lacks the static verification meta `name="google-adsense-account" content="ca-pub-7171402107622932"` that scripts/navigation-check.js requires on every route. Full record: ARTICLE-SPRINT-REPORT.md (original + REPAIR RUN 1–3 sections). NOTE: this meta is the site's static AdSense ACCOUNT verification tag, present on every existing page — it is not ad-serving code and loads nothing; adding it matches the site-wide contract. Do NOT add any ad loader/unit anywhere (the article-integrity checker forbids those and must keep passing).

OWNER AUTHORIZATION: unchanged — Jason Ramirez approved this sprint and its completion 2026-10-24 19:34 PT in the Creator chat. No push, PR, merge, deploy, accounts, or spending.

PRE-EXISTING STATE — leave exactly as found: unstaged `CLAUDE.md` modification (never stage/commit/revert); untracked records/run artifacts (HANDOFF.md, PHASES-3-4-REPORT.md, RUN-PHASES-3-4.md, ARTICLE-SPRINT-*.md, *.cmd, *.log, *-test-out.txt) are never committed.

REPAIR — in this order:
1. SELF-AUDIT FIRST (all three navigation-checker contracts, all 4 sprint articles, before editing): (a) nav block byte-matches docs/templates/site-header.html; (b) footer block byte-matches docs/templates/site-footer.html; (c) the exact string `name="google-adsense-account" content="ca-pub-7171402107622932"` is present. Report a 4×3 PASS/FAIL grid. ((a) and (b) are expected PASS from repairs 2–3 — if either FAILs, report it; do not silently re-fix.)
2. META FIX: for each sprint article failing (c), insert `<meta name="google-adsense-account" content="ca-pub-7171402107622932">` in the <head>, in the same relative position an existing passing article uses (check articles/patreon-income-tracker/index.html). Temporary Node script, occurrence-count proof per anchor, delete script after. Nothing else in the files changes.
3. THE PAIR: `npm run test:navigation` AND `npm run test:articles` — BOTH must pass. Either fails = STOP before the suite and report the exact assertion.

THEN THE CLOSE-OUT, IN ORDER (all must pass before commit):
1. `node --test tests/patreon-article-arithmetic.test.js`
2. FULL suite by name (repo's list governs; expected: build, lint:predeploy, lint:content, lint:html, lint:unused, test:navigation, test:articles, test:recommended-products, test:analytics, test:quality, test:social-estimator, test:youtube-estimator, build:dist, test:dist, assets:fontawesome:check, test:browser, git diff --check). Report EVERY result by name. A failure whose defect lies outside the sprint articles + their wiring files = STOP and report with diagnosis. A failure caused BY the sprint files = fix within sprint scope, then re-run the affected check AND the pair from step 3.
3. Rendered checks on the BUILT dist: per article — page present, capture block present in built HTML, calculator + blank-tracker links resolve to real dist targets. Evidence per article.
4. COMMIT (only if 1–3 all pass): one commit on `patreon-article-sprint`, message "feat: Patreon cluster article sprint (4 articles)", explicit pathspec ONLY: the 4 article directories, articles/index.html, content/published-articles.json, context/internal-links-map.md, llms.txt, package.json, scripts/article-integrity-check.js, sitemap.xml, tests/browser/articles.spec.js, tests/patreon-article-arithmetic.test.js. Before committing, `git status` must show NO other modified tracked files besides the pre-existing CLAUDE.md mod (stays unstaged); delete temp scripts and *-test-out.txt files. Report commit hash + `git show --stat` + one-line justifications for the package.json and article-integrity-check.js changes.

REPORT: append a "REPAIR RUN 4 — 2026-10-24 evening" section to ARTICLE-SPRINT-REPORT.md (prior content immutable) AND return it as run output: the 4×3 audit grid before/after, meta insertions, pair results, arithmetic, full suite by name, rendered evidence, commit hash + stat or the precise stop, and the merge-readiness line.
