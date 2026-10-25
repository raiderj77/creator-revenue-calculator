# ARTICLE SPRINT — Patreon cluster, first set of 4 (bridge-launched OpenCode, non-interactive)

TRUTHMODE. Adversarial, evidence-first. Label every claim PROVEN (demonstrated by execution or primary source) / ASSERTED / NOT VERIFIED. Stop conditions are HARD STOPS — never work around them; report NOT VERIFIED at that gate and still complete every part the gate does not touch. This run is non-interactive: never wait for input.

WORKSPACE: C:\Users\jason\empire\creator-revenue-calculator-current (the worktree). Edit ONLY inside it. The main checkout (C:\Users\jason\empire\creator-revenue-calculator) is read-only to you.

OWNER AUTHORIZATION ON RECORD: Jason Ramirez, repo owner, in the Creator Revenue Calculator chat (Muse), 2026-10-24 19:34 PT: "Start the Patreon article sprint over the bridge now." This satisfies the repo's plan-approval rule (docs/CLAUDE_FULL.md "Before Doing Anything") for THIS sprint plan — the 4-article set below, delivered to him 2026-10-23 and re-approved as the queue after email capture went live 2026-10-24. Read docs/CLAUDE_FULL.md and the worktree-local EMPIRE_BUILD_STANDARDS.md in full before executing; any ADDED gate in them stops the affected part and is reported, never overridden. MATERIALITY TEST: a rule conflict gates only work that would have to violate the rule; everything else is a record-only finding in the final report.

SCOPE — ONLY this sprint: the 4 articles below, their sitemap + articles-index wiring, capture-block wiring on article pages, tests, build, ONE local commit on a new branch. NOT in scope: the Stan calculator, the affiliate-tagging pass, any AdSense code (the site is still AdSense-rejected — adding ad code is forbidden), any change to any existing calculator's math/fees/copy, any other repo or site.

GIT SETUP (first actions):
1. `git fetch origin`. Create branch `patreon-article-sprint` from `origin/main` (origin/main now includes the merged Beehiiv capture activation). If the branch already exists, STOP and report.
2. PRE-EXISTING WORKTREE STATE — leave exactly as found: `CLAUDE.md` has an unstaged local modification (do not stage, commit, or revert it); `HANDOFF.md`, `PHASES-3-4-REPORT.md`, `RUN-PHASES-3-4.md` are untracked records (leave them untracked). This file (ARTICLE-SPRINT-PROMPT.md) and your report (ARTICLE-SPRINT-REPORT.md) are run artifacts: never commit them.
3. Commit at the end ONLY the sprint files, staged by explicit pathspec. No push, no PR, no merge, no deploy.

PHASE 0 — RECON (change no content files; report feeds the final report):
1. Article pattern: dissect /articles/patreon-income-tracker/ and /articles/ugc-rates-guide/ — file layout, how an article page is built (template/includes/scripts), byline + dates + sources-ledger format, FAQ + JSON-LD pattern, how articles are added to the sitemap and the /articles/ index. Cite file:line for each claim.
2. Capture wiring: EmailCapture is LIVE on this codebase (assets/js/email-capture.js, BEEHIIV_EMBED_URL set; placements: homepage + /tools/patreon-revenue/). Determine how article pages include shared scripts/blocks, so each new article gets the same capture block in its footer position, reusing the existing component and assets unchanged. If article pages cannot include it without changing the component, report that and wire per-article includes of the existing assets instead — do NOT fork the component.
3. Verify fees from PRIMARY sources only, in the browser, recording URL + exact figure + access date for each:
   - Patreon Help Center creator fees overview: Standard platform fee, legacy plan fees, USD processing rates, payout fees. CROSS-CHECK against what /tools/patreon-revenue/ implements today; report any mismatch line by line. HARD STOP (articles only): if Patreon's current published fees contradict the live calculator, STOP the sprint and report — do not publish articles on fees the site's own tool contradicts, and do not change the calculator.
   - Ko-fi official pricing/fees page: platform fee % for memberships + any transaction fees.
   - Buy Me a Coffee official pricing/fees page: platform fee % for memberships + any transaction fees.
   HARD STOP per platform: a platform whose fees cannot be verified from its own official page today is EXCLUDED from Article A3, and the exclusion is stated on-page and in the report.
4. Confirm none of the 4 article slugs already exist (repo + sitemap search).

PHASE 1 — BUILD THE 4 ARTICLES. Follow the article pattern from Phase 0 exactly (byline "By Jason Ramirez" linking to /about.html, published + review dates, sources-reviewed ledger with the Phase 0 sources and dates, FAQ section, JSON-LD matching the site pattern, capture block in the footer position). Each article: 1,200+ words of original copy, no income promises, any illustration labeled a synthetic example. Internal links: to the Patreon calculator (/tools/patreon-revenue/), to the tracker guide (/articles/patreon-income-tracker/), and between the new articles where natural. Add all 4 to the sitemap and the /articles/ index per the existing pattern.

- A1 — "How Much Does Patreon Take? Every Fee, With Worked Examples" (target query: how much does patreon take). Total take (platform + processing) on $5, $10, and $25 tiers under the current Standard plan, using ONLY Phase 0 verified rates; show why "10%" understates the real take at small tiers (the fixed $0.30 processing bite). Every dollar figure must be reproducible by the Phase 2 tests.
- A2 — "How Many Patrons Do You Need to Make $1,000, $3,000, or $5,000 a Month on Patreon?" Patron counts built from the calculator's own net-per-patron math at $5/$10/$25 tiers (state the plan + processing assumptions on-page), with the target take-home solver presented as the interactive version. No growth/conversion benchmarks presented as fact.
- A3 — "Patreon vs Ko-fi vs Buy Me a Coffee: What Membership Creators Actually Keep". Only Phase 0 verified platforms (exclusions stated on-page). Identical scenarios through each: $500/mo and $2,000/mo gross membership revenue; keep-amount per platform with the fee arithmetic shown.
- A4 — "Why Your Patreon Payout Is Less Than Your Earnings Page: Payout Fees, Timing, and Reconciliation". Funnels to the tracker guide + CSV. Covers payout fees, conditional fees, and timing differences ONLY as verified in Phase 0; the reconciliation formula must match the tracker guide's formula (cross-check it; a mismatch is reported, not silently harmonized).

PHASE 2 — TESTS + BUILD (PROVEN only if executed; paste full output into the report):
- A test (or the repo's existing article/test tooling, extended) must reproduce EVERY worked-example dollar figure in A1–A4 from the Phase 0 verified rates. If any figure disagrees, STOP, show the failing arithmetic line by line, and do not adjust the expected values to match the article — one of them is wrong and the owner needs to know which.
- Run the repo's FULL check suite by name (the same list the capture work used: build, lint:predeploy, lint:content, lint:html, lint:unused, test:navigation, test:articles, test:recommended-products, test:analytics, test:quality, test:social-estimator, test:youtube-estimator, build:dist, test:dist, assets:fontawesome:check, test:browser, git diff --check — if the repo's current suite differs, the repo's suite governs; report each by name with its result).
- Rendered check on the BUILT output: each new article returns/render 200-equivalent in dist, shows its capture block, and its internal links resolve to real pages. Evidence per article.

PHASE 3 — COMMIT: one local commit on `patreon-article-sprint`, explicit pathspec staging of ONLY the sprint files (new article files, sitemap, articles index, article wiring, test files). Message: "feat: Patreon cluster article sprint (4 articles)". Report the commit hash + `git show --stat` output. NO push, PR, merge, or deploy.

FINAL REPORT: write it to ARTICLE-SPRINT-REPORT.md in the worktree AND return it as your run output, in this order:
1. Phase 0 recon (article pattern with file:line, capture-wiring method, every fee with primary-source URL + figure + date, Patreon cross-check result, slug collisions or none).
2. Per article: slug, word count, worked examples it contains, internal links added.
3. Test output (worked-example reproduction per figure, full suite by name with results).
4. Rendered-check evidence per article.
5. Commit hash + stat; explicit statement that nothing was pushed/merged/deployed.
6. Owner-only items (expected: just the merge/deploy word in the Creator chat) + anything that stopped or was excluded, with reasons.
