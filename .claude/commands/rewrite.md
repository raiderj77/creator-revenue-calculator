# Rewrite Command

Prepare a source-verified draft revision for an existing approved article or page.

## Usage

`/rewrite [URL, article slug, or file]`

## Rules

Read `docs/editorial-publishing.md` first. A rewrite requires a verified user, source, search-presentation, accessibility, or accuracy problem. It is not a routine freshness exercise.

Do not revive material from the retired `/blog/` archive. Do not change a date without a substantive reviewed change. Do not add keyword repetitions, filler, fixed-length sections, invented anecdotes, outcome claims, quotes, benchmarks, or credentials. Do not automatically publish or move a file into the published registry.

## Workflow

1. Verify the current canonical, publication state, original publication date, current `dateModified`, Search Console evidence, and associated calculator or next action.
2. Run the equivalent of `/analyze-existing` and identify the exact reason for revision.
3. Recheck each time-sensitive or platform-specific claim against its current primary source and source-ledger entry.
4. Preserve accurate useful material and the existing URL unless a separately approved redirect plan is necessary.
5. Correct unsupported, stale, ambiguous, inaccessible, privacy-sensitive, or misleading content. Keep facts, formulas, user assumptions, labeled synthetic examples, inferences, unknowns, and limitations distinct.
6. Update title, description, visible dates, author, breadcrumbs, sources, and Article JSON-LD only when the visible revision supports the change and all fields remain identical in meaning.
7. Record a factual change summary with claims added, changed, or removed and the source evidence for each.
8. Keep the result in a non-public draft state for editorial and owner review.

## Output

Return or, when explicitly requested, save:

- the proposed draft revision;
- verified reason for the rewrite;
- claim/source changes;
- metadata/schema changes;
- limitations and unknowns;
- required validation and approvals.

Do not publish, merge, deploy, request indexing, or alter redirects without separate authorization.
