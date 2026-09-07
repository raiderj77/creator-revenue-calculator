# Content Calendar Command

Create an evidence-led review queue for approved opportunities. It is not an automatic publishing schedule.

## Usage

`/content-calendar [optional review window or topic]`

## Rules

Read `docs/editorial-publishing.md` first. Do not impose a posts-per-week quota, fill empty dates, roll parked ideas forward automatically, or schedule publication merely to maintain cadence.

A calendar date is a research, source-review, editorial-review, or measurement checkpoint. Publication, merge, deployment, indexing, promotion, outreach, and spending remain separate approval-gated actions.

## Workflow

1. Include only opportunities supported by current Search Console evidence or a documented user/funnel problem.
2. Prefer existing-page improvements over new articles and remove duplicate or cannibalizing candidates.
3. For each candidate, record creator job, associated calculator/next action, original contribution, primary-source needs, source review date, effort, risk, and approval state.
4. Schedule only the next useful checkpoint. Do not manufacture urgency from a short-lived trend or third-party score.
5. Leave capacity unused when no candidate clears the opportunity gate.
6. Keep all unapproved drafts outside the public build, sitemap, and assistant discovery.

## Output

Return a small queue ordered by evidence strength and user value. Each row must show status (`research`, `draft`, `editorial review`, `approved`, `measurement`, or `deferred`), checkpoint date, owner, evidence, blocker, and next decision. Do not automatically save, draft, or publish anything.
