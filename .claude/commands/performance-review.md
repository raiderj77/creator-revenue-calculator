# Performance Review Command

Review current search and privacy-safe funnel evidence to select one measured site improvement.

## Usage

`/performance-review [date range]`

## Rules

Read `docs/editorial-publishing.md` first. This command is read-only. It must not configure credentials, modify accounts, spend on data, edit pages, publish, deploy, or request indexing.

Never infer zero visits or conversions from unavailable, mislabeled, or mismapped analytics. Never promise clicks, traffic, rankings, revenue, recovery, or a timeframe. Keep Search Console observations, analytics observations, inferences, and unknowns separate.

## Workflow

1. Verify repository/production scope and the exact Search Console property, search type, filters, date range, comparison range, and capture date.
2. Collect clicks, impressions, CTR, and average position by page and query. Note recent releases, redirects, indexing state, and data lag.
3. Use aggregate analytics only after property/stream mapping and consent behavior are verified. Review calculator completion, result actions, tracker use, and next-step events without entered values or results.
4. Evaluate high-impression/low-click pages, intent mismatch, declining or rising observations, source freshness, and funnel friction.
5. Prefer a measurable improvement to an existing high-confidence page over new content volume.
6. Rank candidates using disclosed evidence: search opportunity, creator usefulness, commercial relevance, conversion evidence, effort, and risk. Use qualitative confidence when inputs are incomplete.

## Output

Return:

- verified evidence and date ranges;
- inferences;
- unknowns/access blockers;
- candidates considered and rejected;
- exactly one selected action, why it wins, validation, and a realistic measurement window.

Do not auto-save or execute the action. If a report file is explicitly requested, save it under `content/research/` outside the public build.
