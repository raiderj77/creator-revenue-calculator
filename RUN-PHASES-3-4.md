# RUN — Phases 3–4 execution (bridge-launched OpenCode, non-interactive)

TRUTHMODE. Label every claim PROVEN / ASSERTED / NOT VERIFIED with evidence. This run is non-interactive: never wait for input. When a gate forces a choice, take the conservative branch the gate specifies and record it. A failed gate stops its part: report it, undo that part only, never work around it.

WORKSPACE: C:\Users\jason\empire\creator-revenue-calculator-current (the "worktree", clean at origin/main fbd369e). Edit ONLY inside the worktree. The main checkout (C:\Users\jason\empire\creator-revenue-calculator) and the Documents clone (below) are read-only to you. No push, no merge, no deploy, no PR, no account creation, no spending, no secrets read aloud or printed.

PLAN APPROVAL ON RECORD (docs/CLAUDE_FULL.md "Before Doing Anything" — SATISFIED, do not re-wait): Jason Ramirez, the repo owner, approved in his Muse chat on 2026-10-24: (1) the Phase 1 plan (16:04), (2) the static-site redesign of Phase 3 (16:36), (3) the Part 1 port into this worktree (16:46), and (4) this bridge execution of Phases 3–4 (16:52). This runbook IS the approved plan's execution form. The non-interactive instruction governs execution mechanics only; it waives no repo rule. Read the worktree-local EMPIRE_BUILD_STANDARDS.md in full before executing (a prior session read it in full and found no conflict with the approved plan — verify that yourself; if it adds a gate beyond this runbook, stop and report the conflict as your run output).

CLOSURES (decided by the owner, Jason Ramirez, 2026-10-24 — record each as one line in the final report, do not revisit): Phase 1 aerovato/container KILLED (escape test failed: writable host config mount). Phase 2 ai-memory KILLED (documented Codex/OpenCode hooks are user-level on Windows, not worktree-scoped; capture scope unacceptable).

EXECUTION NOTES (bridge run, learned from the first launch attempt): this file lives INSIDE the worktree because your external_directory permissions deny Read-tool access outside it. RUN-PHASES-3-4.md (this file) and PHASES-3-4-REPORT.md are RUN ARTIFACTS: exclude both from every git-status accounting in this run (the A0 proof reads "exactly the Part 1 file set, plus these two run artifacts"). Read EMPIRE_BUILD_STANDARDS.md from the WORKTREE-LOCAL copy. Access the source clone ONLY through shell commands (git -C <source> diff, file copies) — do not use the Read tool on paths outside the worktree; read HANDOFF.md from its ported worktree copy.

PRE-DECIDED ITEMS (owner-side rulings for this run — do not re-litigate, do not gate on these):
1. X-Frame-Options disagreement (CLAUDE.md:12 SAMEORIGIN vs EMPIRE_BUILD_STANDARDS.md:699 DENY): the standards resolve their own conflicts — EMPIRE_BUILD_STANDARDS.md:903 grants the standards precedence, so DENY governs (and matches the live vercel.json). Record it in Part B as a known config disagreement. It is NOT a gate: no step in this run changes any header.
2. `empire-wrapup` is unavailable on PATH in this environment (already proven twice). If it is still unavailable at session close, record it as NOT RUN with that reason. It is not a gate.
3. MATERIALITY TEST for any other rule conflict you find: a conflict gates a part of this run ONLY if executing that part would require violating one of the conflicting rules. Conflicts that no step in this run touches (headers, deployment, ads, monetization, other repos) are record-only findings for Part B — note them and CONTINUE. If a step WOULD violate a rule, stop that part, report precisely, and still do the other parts.

## PART A0 — PORT PART 1 INTO THE WORKTREE
Part 1 (EmailCapture for the homepage) was built by Codex in a different clone: C:\Users\jason\Documents\Empire\creator-ugc-rates-article-2026-09-18 (diverged: 3 local commits not in origin/main, 1 behind). Transport ONLY this file set:
- Modified — apply as a DIFF generated in the source clone: index.html; scripts/build-dist.js; scripts/quality-check.js; assets/vendor/fontawesome/subset-manifest.json
- New — copy whole files: assets/css/email-capture.css; assets/js/email-capture.js; tests/browser/email-capture.spec.js; HANDOFF.md
Excluded: everything else in the source folder (stray logs, pr-body, production-check files stay behind).
Rules: diff applied hunk by hunk; a conflicting hunk STOPS that file's port and is reported precisely (file, hunk, both versions' gist) — no silent hand-merges, no whole-file overwrite of a modified file.
Port proof (all three required): (1) `git status` in the worktree shows EXACTLY the Part 1 file set changed/added and nothing else; (2) the full check suite from HANDOFF.md section 5 re-run in the worktree, each by name with results, all passing (Part 1's reported list: build, lint:predeploy, lint:content, lint:html, lint:unused, test:navigation, test:articles, test:recommended-products, test:analytics, test:quality, test:social-estimator, test:youtube-estimator, build:dist, test:dist, assets:fontawesome:check, test:browser, git diff --check — if HANDOFF.md's list differs, HANDOFF.md governs); (3) rendered flag-off check on the BUILT homepage (the repo's browser tooling, as Part 1 used): zero capture layout space, no iframe, no external requests, capture element removed after script execution.
Append a "PORT" section to HANDOFF.md documenting the port (date, files, hunks clean vs adjusted — describe every adjustment). Part 1's own sections stay byte-for-byte immutable.

## PART A — PART 2: PATREON PLACEMENT FROM THE BRIEF ALONE
Only after a clean A0. Read ONLY HANDOFF.md + the worktree itself (no chats, no Documents clone from here on). Add the Patreon placement exactly per HANDOFF.md section 6 (target tools/patreon-revenue/index.html, its named anchor, the asset-path form for that depth). Reuse Part 1's assets unchanged unless the brief says otherwise. The BEEHIIV_EMBED_URL constant in assets/js/email-capture.js stays EMPTY. Run the same check suite (each by name) + the rendered flag-off check on the BUILT Patreon page. Append only a "PART 2 COMPLETION" section to HANDOFF.md. If the brief is materially wrong or missing something needed: STOP Part A, report the exact gap, still do Part B.
Handoff verdict (for the final report): quote HANDOFF.md sections 2, 3, and 6 verbatim; state PROVEN/FAILED whether they carried the design, the files changed, and the remaining task; verdict line "File-handoff: KEEP/KILL" with any specific gap named. (Two earlier "missing HANDOFF.md" states were precondition failures — plan-mode and wrong-folder — NOT brief failures; judge the brief only on Part 2's execution.)

## PART B — SECURITY SCAN, EXECUTION HALF
A prior read-only pass (plan-mode session, 2026-10-24) completed the inventory, threat model, and panel at source level. Its findings are attached below as PRIOR READ-ONLY RESULTS. Do NOT redo the read-only inventory; EXECUTE the deferred checks and re-confirm or update the conclusions now that EmailCapture + HANDOFF.md exist in the worktree:
1. Run Gitleaks with the repo's configured setup (.gitleaksignore + CI history scan at .github/workflows/portfolio-standards.yml:41-46). Report the actual command, scope (worktree/history), and result.
2. Dependency advisories: run the available check (OSV and/or npm audit) — state the method, report counts by severity and any direct-dependency findings.
3. EmailCapture + HANDOFF.md: include both in scope (config constant handling, no key leakage, flag-off behavior cross-checked against the A0/A rendered evidence; HANDOFF.md reviewed for secret leakage).
4. CSP item: the site's CSP blocks all frames — record as an activation-time finding (Beehiiv will need an owner-approved frame-src decision). Do NOT change any header.
5. PATCHES as a separate review diff only, never auto-applied. If execution surfaces nothing real, state the zero-finding checklist explicitly.

PRIOR READ-ONLY RESULTS (verify by execution where execution applies; file:line refs are the prior pass's):
- Zero surviving exploitable findings at source level.
- api/: public POST validates method, origin, JSON, body size, honeypot, input (api/youtube-channel-estimator.js:73-103); production service deliberately null (:114-125), production locked (_youtube-estimator-core.js:115-117).
- Calculators render user output via textContent (tools/patreon-revenue/patreon-calculator.js:160-183, 311-339); innerHTML assignments elsewhere are static literals.
- YouTube estimator browser flag OFF (tools/youtube-channel-earnings-estimator/index.html:17; early return at youtube-channel-estimator.js:185-192); tests specify no key/query leakage (tests/youtube-estimator.test.js:487-498, unexecuted in the prior pass — the A0/A suite runs them now).
- Analytics consent-gated (assets/js/theme.js:206-250); event interface = 4 payload-free names (:123-128, 269-273).
- data_sources/: operator-only, env-var credentials (dataforseo.py:24-35, google_analytics.py:32-33, google_search_console.py:24-25); no public route imports them.
- CI: CodeQL + dependency review (.github/workflows/code-security.yml:17-46); Dependabot weekly; .gitleaksignore = 3 exact historical suppressions.
- Config conflict (not a vulnerability): CLAUDE.md wants X-Frame-Options SAMEORIGIN; vercel.json:98-100 sets DENY (stricter).
- Skipped with reason in the prior pass: .git/, node_modules/, dist/ (generated), binary assets, .claude/settings.local.json and .env.example contents (secret-file guardrail). Keep those skips and reasons unless execution tooling covers them safely (Gitleaks history scan is the sanctioned exception for secrets — it reports locations, never values).

## FINAL REPORT
Write the complete final report to C:\Users\jason\empire\creator-revenue-calculator-current\PHASES-3-4-REPORT.md AND return it as your run output. Order:
- Closures (Phase 1, Phase 2 — one line each).
- Part A0 port report (files, hunks clean/adjusted/stopped, worktree git status, full check results by name, rendered evidence).
- Part A handoff verdict (quoted sections 2/3/6, PROVEN/FAILED, KEEP/KILL) + EmailCapture final state (files, constant name/location, both placements, check results, rendered evidence for the Patreon page).
- Part B security execution report (Gitleaks command + result, advisory method + counts, EmailCapture/HANDOFF.md review, CSP activation finding, zero-finding checklist or surviving findings labeled PROVEN/ASSERTED, patches as review diff only or explicit none).
- Owner-only checklist ONLY if all gates passed: (1) create Beehiiv free account + paste the embed URL into the BEEHIIV_EMBED_URL constant in assets/js/email-capture.js; (2) decide the CSP frame-src allowance for Beehiiv at activation; (3) say merge/deploy in the creator chat. Nothing else.
- Honest wall-clock per part.
