# Research Performance Command

Review search and funnel evidence for existing public pages and identify one measured follow-up.

## Usage

`/research-performance [date range or page]`

## Rules

Read `docs/editorial-publishing.md` first. This command is read-only and must not edit pages, resubmit indexing, or change analytics/Search Console settings.

Use Search Console as historical evidence, not as a forecast. Use analytics only when the property and stream mapping are verified. Missing data is `UNKNOWN`, not zero. Do not calculate hypothetical clicks from assumed ranking or CTR curves.

## Workflow

1. Verify the exact property, search type, filters, date range, comparison range, and capture date.
2. Collect clicks, impressions, CTR, and average position by page and query. Note low-volume noise and position aggregation limits.
3. When trustworthy analytics is available, review privacy-safe aggregate completion, print/copy, tracker/download, and next-action events without exposing entered values or results.
4. Separate indexed pages, redirected/retired URLs, and pages too new for a meaningful comparison.
5. Look for high-impression/low-click pages, query-page mismatch, post-release changes, and useful journeys that fail before the next action.
6. Check whether a source or platform change, snippet mismatch, technical issue, or intent mismatch better explains the observation than content length.

## Output

Report verified metrics, comparable changes, inferences, unknowns, and one smallest next action with a measurement window. Do not label a page a winner or failure from a single query, immediate crawl, or unverified analytics.
