# Rollback plan

How to undo a bad release of creatorrevenuecalculator.com. Written 2026-11-07.

## Code

1. Fastest path: in the Vercel project, open Deployments, pick the last known-good production deployment, and use Promote to Production. No rebuild runs, so the rollback is the exact earlier build.
2. Source path: `git revert` the bad commit on a branch, open a PR, and merge on the owner's word. Never force-push main.
3. After either path, load the homepage and one tool page and confirm the version in `/api/health` matches the expected deployment commit.

## Schema

This site has no database and no schema migrations. There is nothing to roll back at a schema layer. If a database is ever added, this section must be written before the first migration ships, not after.

## Data

- Site content data lives in this repository (HTML, articles, tool pages), so the code rollback above is also the content rollback. The `dist` output is rebuilt from source on every deploy and is never edited by hand.
- The YouTube estimator API stores no user data. Its in-memory caches and rate-limit counters reset on redeploy, which is expected and safe.
- Email subscribers live in Beehiiv, outside this repo. A site rollback does not touch the subscriber list, and no deploy step may delete or re-import it.
