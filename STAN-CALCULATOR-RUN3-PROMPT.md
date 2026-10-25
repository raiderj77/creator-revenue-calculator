# Stan Calculator Run 3 — Verification + Commit (fresh session)

Worktree: `C:\Users\jason\empire\creator-revenue-calculator-current`, branch `stan-calculator`.
You are a FRESH OpenCode session. Execute this runbook exactly, non-interactively.

## Owner attestation (read first — this is your authorization)

- Owner (Jason Ramirez) ordered this build on 2026-10-24 20:42 PT, verbatim: "Build the Stan break-even calculator over the bridge now."
- Owner's standing build rule (set 2026-10-21, still in force): "build" means the entire build sequence with no micro-approvals; stop only at spending, account creation, merge/deploy approvals, and failed validation checks. Merge/deploy word stays the owner's per release and is NOT given for this run.
- Continuity: Run 1 (recon) stopped correctly on an unverified fee source. Run 2 re-fetched Stan help article 83 first-hand and PROVED every oracle figure (0% Stan transaction fee; Creator $29/mo, Pro $99/mo; Stripe 2.9% + $0.30; payout 0.25% + $0.25, $1 min; Gumroad direct 10% + $0.50), implemented the calculator + all registrations, and PASSED `test:stan-calculator` 4/4 (incl. $47 × 20 Creator monthly net $877.74). Run 2 stopped only because `npm run build` failed twice and the workspace two-failure rule bound THAT session. Its report (`STAN-CALCULATOR-RUN2-REPORT.md`) owner checklist explicitly calls for a fresh verification run. This run is that run. The two-failure stop does NOT carry into this fresh session; this run has its own cap of 2 build attempts.
- Materiality test: a rule conflict gates only work that would have to violate the rule; everything else is record-only.

## Scope — verification and commit ONLY

Do NOT re-litigate fees. `FEE_CONFIG` and `STAN_STORE_URL` (bare `https://stan.store`, no referral path — hard stop, never invent one) are gated PROVEN from Run 2. Do NOT change calculator content, copy, or fee logic. The only edits permitted are minimal fixes for validation failures DIRECTLY CAUSED by the Stan change set (Run 2 already applied corrections for: Font Awesome glyph-set count in `scripts/quality-check.js`, homepage tool count in `index.html`, Stan Twitter metadata in the Stan page — verify they are present; do not redo blindly).

## Steps

1. Snapshot: `git status --porcelain=v1` and `git diff --stat`. Confirm the change set matches Run 2's report (17 tracked files incl. Font Awesome assets; new `tools/stan-store-calculator/` + `tests/stan-calculator.test.js`). The pre-existing unstaged `CLAUDE.md` modification is the owner's — NEVER edit, stage, commit, or revert it.
2. `npm run build` — capture the summary line of every chained step (lint, quality, navigation, analytics, article-integrity, social/stan/youtube/patreon tests, build:dist, test:dist). If it fails on a Stan-caused validation issue, apply the minimal fix and retry ONCE (max 2 build attempts this run). If the second attempt fails, or any failure is NOT Stan-caused, STOP and report.
3. `npm run test:browser` — capture the pass/fail totals.
4. Driven rendered check: against the BUILT page (`dist/tools/stan-store-calculator/index.html`), set price $47 and monthly sales 20, read back Stan Creator monthly net = **$877.74** and keep % = 93.4%. If the browser spec already asserts these exact values, cite its output; otherwise run a one-off Playwright script from %TEMP% (never committed). A mismatch = STOP, report the arithmetic, never adjust expected values.
5. `git diff --check` — report result (CRLF warnings on pre-existing files are record-only).
6. Commit (only if steps 2–4 are all green): stage EXACTLY the Stan change set — all modified tracked files EXCEPT `CLAUDE.md`, plus `tools/stan-store-calculator/` and `tests/stan-calculator.test.js`. NEVER stage untracked process records (any `*-PROMPT.md`, `*-REPORT.md`, `HANDOFF.md`, `*.cmd`, `*.log`, `pr-body-sprint.md`). Commit message: `feat: Stan Store break-even calculator`. Capture the commit hash and `git show --stat` summary.

## Prohibitions

No push, no PR, no merge, no deploy. No spending, no account creation. No AdSense code. No referral link/ID invention. Do not touch `CLAUDE.md`. Do not start `empire-wrapup` (unavailable on this machine — PROVEN in Runs 1–2; skip it silently).

## Report

Write `STAN-CALCULATOR-RUN3-REPORT.md` in the worktree: every claim labeled PROVEN / ASSERTED / NOT VERIFIED with evidence; verbatim suite summary lines; the rendered-check readback values; commit hash + stat (or the exact failing step and output if stopped); safety statement (nothing pushed/merged/deployed, no referral invented, no AdSense code, CLAUDE.md untouched).
