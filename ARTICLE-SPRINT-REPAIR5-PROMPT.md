# ARTICLE SPRINT — REPAIR RUN 5 (FINAL CLOSE-OUT): Font Awesome subset refresh + remaining suite (bridge-launched OpenCode, non-interactive)

TRUTHMODE. Label every claim PROVEN / ASSERTED / NOT VERIFIED. Non-interactive: never wait for input. Hard stops apply to the part they touch; complete the rest.

WORKSPACE: C:\Users\jason\empire\creator-revenue-calculator-current, branch `patreon-article-sprint` (stay on it). Edit ONLY inside this worktree.

STATE (assistant-verified from the repair-run-4 report): nav + footer canonical on all 4 sprint articles; verification meta added to all 4; `test:navigation` PASSES (30 routes); `test:articles` PASSES (7 published articles — including one in-scope predicate correction in scripts/article-integrity-check.js aligning the capture-placement rule with the live Patreon tool page's before-footer shape); arithmetic test PASSES; build ran without a reported assertion failure; lint:predeploy, lint:content, test:recommended-products, test:analytics (283), test:social-estimator (6/6), test:youtube-estimator (22/22) all PASS. The run stopped at `assets:fontawesome:check`: "Font Awesome assets are stale: assets/vendor/fontawesome/subset-manifest.json". NOT RUN because of that stop: build:dist, test:dist, test:browser, git diff --check, rendered checks, commit. Full record: ARTICLE-SPRINT-REPORT.md (REPAIR RUN 4 section). NOTE: the subset-manifest.json is UNCHANGED from origin/main (not in the sprint's modified list) — the assistant's diagnosis is that the check compares the manifest against icons actually used across the site's pages, and the 4 new articles introduced icon usages the manifest doesn't cover, i.e., the staleness is sprint-caused. VERIFY that diagnosis (step 1) before acting on it; if it is wrong, STOP and report.

OWNER AUTHORIZATION: unchanged — Jason Ramirez approved this sprint and its completion 2026-10-24 19:34 PT in the Creator chat. No push, PR, merge, deploy, accounts, or spending.

PRE-EXISTING STATE — leave exactly as found: unstaged `CLAUDE.md` modification (never stage/commit/revert); untracked records/run artifacts (HANDOFF.md, PHASES-3-4-REPORT.md, RUN-PHASES-3-4.md, ARTICLE-SPRINT-*.md, *.cmd, *.log, *-test-out.txt) are never committed.

STEP 1 — DIAGNOSE (no edits): find the repo's Font Awesome tooling in package.json (assets:fontawesome* scripts) and read what the check compares. Identify WHICH icon names the check finds missing/stale and confirm at least one missing icon is used by one of the 4 sprint articles (grep the article HTML). Report the missing icons + which sprint articles use them. If NO missing icon traces to a sprint article, STOP: report the staleness as NOT sprint-caused with your evidence; do steps 2–4 only if the full-suite gate can still be honestly satisfied — it cannot if this check fails, so in that case report and end (no commit).

STEP 2 — REFRESH (only if step 1 proves sprint-caused): run the repo's own regeneration command for the Font Awesome subset (from package.json; e.g., the non-check assets:fontawesome script). Then re-run `assets:fontawesome:check` — must PASS. Record exactly which files the regeneration changed (expected: assets/vendor/fontawesome/subset-manifest.json and possibly subset font/CSS assets under assets/vendor/fontawesome/). Changes outside assets/vendor/fontawesome/ = STOP, revert them, report.

STEP 3 — REMAINING SUITE (each by name, capture the FINAL summary lines this time — redirect each command's output to a file and report its tail, so nothing is "completed but summary not verified"):
- `npm run build` (fresh full run; report its final lines)
- `npm run build:dist`
- `npm run test:dist`
- `npm run test:browser`
- `npm run test:quality` (report final summary)
- `npm run lint:html` and `npm run lint:unused` (report final summaries)
- `git diff --check`
Any failure whose defect lies outside the sprint articles + wiring files + the fontawesome refresh = STOP and report with diagnosis. A failure caused by sprint files = fix within sprint scope and re-run that check + test:navigation + test:articles.

STEP 4 — RENDERED CHECKS on the BUILT dist: per sprint article — page present in dist, capture block present in built HTML, calculator + blank-tracker links resolve to real dist targets. Evidence per article.

STEP 5 — COMMIT (only if steps 2–4 all pass): one commit on `patreon-article-sprint`, message "feat: Patreon cluster article sprint (4 articles)", explicit pathspec ONLY: the 4 article directories, articles/index.html, content/published-articles.json, context/internal-links-map.md, llms.txt, package.json, scripts/article-integrity-check.js, sitemap.xml, tests/browser/articles.spec.js, tests/patreon-article-arithmetic.test.js, AND the fontawesome files changed in step 2 (list them individually in the report). Before committing, `git status` must show NO other modified tracked files besides the pre-existing CLAUDE.md mod (stays unstaged); delete any temp scripts and *-test-out.txt files. Report commit hash + `git show --stat` + one-line justifications for: package.json, article-integrity-check.js (incl. the repair-4 predicate alignment), and the fontawesome refresh.

REPORT: append a "REPAIR RUN 5 — 2026-10-24 evening" section to ARTICLE-SPRINT-REPORT.md (prior content immutable) AND return it as run output: diagnosis evidence (missing icons + sprint-article usage), regeneration command + files changed, every suite result by name WITH final summaries, rendered evidence, commit hash + stat or the precise stop, and the merge-readiness line.
