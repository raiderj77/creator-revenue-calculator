# /project:session-start

Run the empire-session skill to load build context before any work begins.

## Steps

1. Read EMPIRE_BUILD_STANDARDS.md from the current repo root
2. Read CLAUDE.md from the current repo root
3. Identify the active site from the repo folder name or ask if unclear
4. Output the full Session Brief (tier, attribution, critical rules, git workflow, pending tasks)
5. Confirm context loaded before accepting any further instructions

## When to use

Run this at the start of EVERY Claude Code session on any Empire repo.
Also run if the session has been running a while and you suspect context drift.

## Reminder

At session close (after final commit or when user says done/wrapping up):
- Generate the CLAUDE.md update block
- Write it to CLAUDE.md in the repo (do not stage or commit it)
