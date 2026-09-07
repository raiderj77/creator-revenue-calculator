# Analyze Existing Command

Review one existing Creator Revenue Calculator page or draft for evidence, usefulness, and search-presentation opportunities.

## Usage

`/analyze-existing [URL or file path]`

## Rules

Read `docs/editorial-publishing.md` first. This command is an audit, not authorization to edit, publish, redirect, request indexing, merge, deploy, or change an account.

Keep verified facts, inferences, and unknowns separate. Do not turn unavailable or mismapped analytics into zero traffic. Do not predict ranking or traffic gains.

## Workflow

1. Verify the input, canonical URL, robots directive, publication state, and whether the page is in `content/published-articles.json`, the sitemap, and the public build.
2. Record current Search Console query/page evidence with property, date range, capture date, clicks, impressions, CTR, and average position. Use analytics only after its site/property mapping is verified.
3. Identify the creator decision the page helps complete and the relevant calculator, tracker, or honest next action.
4. Audit each monetary, percentage, platform-policy, eligibility, and time-sensitive claim against the visible source ledger and current primary source. Mark unsupported or stale claims as blockers.
5. Check answer-first clarity, formula and assumption transparency, limitations, title/description/canonical, visible metadata and Article-schema parity, accessibility, privacy, disclosures, and internal links.
6. Compare current evidence with a matching earlier period only when the comparison is methodologically valid.
7. Recommend the smallest reversible improvement. Prefer correcting or strengthening the existing page over adding content.

## Output

Return:

- verified evidence;
- inferences;
- unknowns or access blockers;
- claim/source failures;
- user-journey and search-presentation findings;
- one recommended action, its evidence, risk, and validation plan.

Do not automatically save or modify anything. If the user asks for a saved report, place it under `content/research/` with the capture date and keep it outside the public build.
