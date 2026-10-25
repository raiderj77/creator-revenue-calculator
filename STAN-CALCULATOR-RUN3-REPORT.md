# Stan Calculator Run 3 Report

Run date: 2026-10-24

## Result

**PROVEN:** The Stan Store break-even calculator change set was verified and committed as `7edb8e2` (`feat: Stan Store break-even calculator`). The final build, browser suite, rendered oracle check, and whitespace check are green.

## Snapshot

**PROVEN:** Before validation, `git status --porcelain=v1` listed 17 modified tracked files, including `CLAUDE.md`, plus untracked `tests/stan-calculator.test.js` and `tools/stan-store-calculator/`. `git diff --stat` reported `17 files changed, 66 insertions(+), 17 deletions(-)`, matching Run 2's stated tracked-file count.

**ASSERTED:** The runbook identifies the pre-existing `CLAUDE.md` modification as owner-owned.

**PROVEN:** `CLAUDE.md` was present as a pre-existing unstaged modification before this run and remains unstaged after the commit. It was not edited, staged, committed, or reverted.

## Validation

**PROVEN:** Build attempt 1 completed successfully without a change. The required chained-suite summary lines were:

```text
Shared navigation and verification checked on 31 routes.
🎉 All predeploy checks passed.
🎉 All content checks passed.
Article integrity checks passed (7 published articles).
Recommended-product integrity passed for 32 options.
Analytics integrity checks passed (289 assertions).
All product quality checks passed.
ℹ tests 6
ℹ pass 6
ℹ fail 0
ℹ tests 4
ℹ pass 4
ℹ fail 0
ℹ tests 22
ℹ pass 22
ℹ fail 0
ℹ tests 1
ℹ pass 1
ℹ fail 0
Verified fail-closed dist/: 96 files, 1,788,954 bytes.
Verified fail-closed dist/: 96 files, 1,788,954 bytes.
```

**PROVEN:** Browser attempt 1 ran the built distribution and had `49 passed` and `1 failed`. The failure was on the Stan page: after opening mobile navigation, the `/articles/` link remained hidden. Error context identified the Stan page H1 and showed the link was hidden.

**PROVEN:** The failure was directly caused by the Stan change set. `tools/stan-store-calculator/index.html:11` loaded the shared navigation CSS but not `/assets/js/main.js`; `assets/js/main.js:19-25` toggles the mobile menu's active state and display. The only fix added `<script src="/assets/js/main.js" defer></script>` to `tools/stan-store-calculator/index.html:11`.

**PROVEN:** Build attempt 2 completed successfully. Its required chained-suite summary lines were:

```text
Shared navigation and verification checked on 31 routes.
🎉 All predeploy checks passed.
🎉 All content checks passed.
Article integrity checks passed (7 published articles).
Recommended-product integrity passed for 32 options.
Analytics integrity checks passed (289 assertions).
All product quality checks passed.
ℹ tests 6
ℹ pass 6
ℹ fail 0
ℹ tests 4
ℹ pass 4
ℹ fail 0
ℹ tests 22
ℹ pass 22
ℹ fail 0
ℹ tests 1
ℹ pass 1
ℹ fail 0
Verified fail-closed dist/: 96 files, 1,789,002 bytes.
Verified fail-closed dist/: 96 files, 1,789,002 bytes.
```

**PROVEN:** `lint:html` produced no standalone summary line and returned successfully as part of each green composite build.

**PROVEN:** Final browser validation output was `50 passed (1.4m)`.

## Rendered Oracle

**PROVEN:** The final browser suite executed the built-page test `Stan visible fee assumptions reconcile the $47 x 20 oracle`. `tests/browser/calculators.spec.js:74-83` navigates to `/tools/stan-store-calculator/`, enters price `47` and monthly sales `20`, and asserts the rendered readbacks:

```text
Stan Creator gross: $940.00
Stan Creator sale fees: -$33.26
Stan Creator monthly net: $877.74
Stan Creator keep: 93.4%
Stan Creator cover-plan sales: 1
```

**PROVEN:** That test passed in the final `50 passed (1.4m)` browser run. No arithmetic expectation was adjusted.

## Whitespace

**PROVEN:** `git diff --check` emitted no whitespace errors. It emitted only CRLF conversion warnings for existing working-copy files, including the pre-existing `CLAUDE.md` modification.

## Commit

**PROVEN:** Commit hash: `7edb8e2`.

**PROVEN:** `git show --stat --oneline --summary HEAD` reported:

```text
7edb8e2 feat: Stan Store break-even calculator
19 files changed, 288 insertions(+), 15 deletions(-)
create mode 100644 tests/stan-calculator.test.js
create mode 100644 tools/stan-store-calculator/index.html
create mode 100644 tools/stan-store-calculator/stan-store-calculator.js
```

**PROVEN:** The staged set contained exactly 16 approved modified tracked files, excluding `CLAUDE.md`, plus `tests/stan-calculator.test.js` and the two files under `tools/stan-store-calculator/`. No process record was staged.

## Safety

**PROVEN:** Nothing was pushed, merged, or deployed. No referral link or ID was invented. No AdSense code was added. `CLAUDE.md` was untouched by this run and remains unstaged.

## Owner Checklist

- No action required for this verification-and-commit run.
- Do not merge, push, or deploy this commit without separate owner authorization.
