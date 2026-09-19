# UGC calculator-to-kit pilot

Status: IMPLEMENTED AND PRODUCT-INSPECTED FOR REVIEW, COMMERCIAL RELEASE BLOCKED.
Preparation and product review date: September 18, 2026.
Base: `c445c7c81f16866382afd61839b2ffdc8f17889f`.

## Scope

One optional offer after a deliberately completed, valid UGC quote. The existing
calculator, formula, zero-default inputs, copy/print controls, disclaimer and
sponsorship/revenue-mix navigation remain intact. No new packages, API, accounts,
payment integration, ads, redirects, scheduler or automatic publication.

The code intentionally contains `var UGC_KIT_RELEASE = null;`. The committed
version creates no offer DOM and no offer tracking. A URL parameter, storage value
or incoming message cannot activate it. This is a source-release gate, not a
remote configuration service or a cryptographic authorization mechanism.

## Product evidence and remaining release blocker

Owner-approved seller access verified that Etsy listing 4549759149 is active in
the DevelopVault shop, was listed August 4, 2026, is currently priced at $8.99,
and uses manual renewal. Etsy currently shows these two customer attachments:

- `ugc-quote-rate-card-kit.pdf` (73.43 KB in Etsy; matching local original is
  73,434 bytes).
- `ugc-quote-builder-workbook.zip` (13.59 KB in Etsy; matching local original is
  13,599 bytes).

The matching originals are in the approved local UGC product folder. The ZIP
contains only `ugc-quote-builder.xlsx`, `START-HERE.txt`, and `LICENSE.txt`; each
archived item matches its local original. No purchase was made, and no customer,
order, payment, message, or unrelated seller information was inspected. Paid
files, private evidence hashes, signed URLs, and seller screenshots stay outside
this public repository.

The workbook has four sheets (Quote Builder, Rate Card Planner, Scope Checklist,
and Email Templates), 20 formula cells, and no detected macros, external links, or
workbook connections. All four sheets rendered cleanly. The $470 worked example,
all-zero monetary inputs, the 1,000-deliverable boundary, and a blank base-fee
case recalculated as expected. The inspected validations require nonnegative
decimal amounts no greater than 1,000,000 and a whole deliverable count from 1 to
1,000. The separate six-page, US-letter PDF is an unencrypted fillable AcroForm
with no JavaScript; its source render was visually clean. Application-specific
spreadsheet/PDF behavior outside the inspected environment remains unverified.

The listing states that instant downloads do not accept returns, exchanges, or
cancellations and directs a buyer with an order problem to contact the seller. A
Message seller control is present. This is not evidence of a response-time promise,
warranty, or remedy beyond Etsy's displayed terms.

One material content mismatch remains. The listing's visible quote formula ends
with "+ other listed items," and the PDF includes an Other field, but the workbook's
Quote Builder has no separate Other input or formula term. Before release, the
owner must either correct the listing claim or update and fully retest the paid
workbook and seller attachment. That account-side/product decision cannot be
resolved by changing this website.

The drafted offer deliberately omits a fixed price, file inventory, earnings
promise and testimonial. It invites the visitor to inspect the current listing.
Keep `UGC_KIT_RELEASE` null while the listing/workbook mismatch remains and until
the exact bounded release receives owner approval. A syntactically valid evidence
hash is not proof that either gate was satisfied.

## Proposed display behavior

After a trusted input/change followed by a trusted Calculate action with valid
inputs, display a separate aside after the result card. No default render or
unmodified zero-default calculation qualifies. The result keeps keyboard focus.
Editing inputs hides the offer until another valid explicit calculation. Existing
free controls and alternative next steps remain available.

The fixed external link contains no calculator values, campaign identifier or
query string. `noreferrer` and `referrerpolicy="no-referrer"` prevent the outgoing
navigation from intentionally carrying a referrer. No Etsy embed, pixel, prefetch,
iframe or request is added by the feature.

An approved source record contains exactly startsAt, expiresAt, releaseRef and
productEvidenceSha256. UTC timestamps require seconds and `.000Z`, and the window
is at most 30 days. Expired or malformed records stay off. The active tab checks
expiry periodically and again on interaction. Client clocks are not a secure
server clock; this guard complements, not replaces, owner-controlled release and
reversion. Disabling/reverting the source is the primary rollback.

## Measurement

Two dedicated event names: `ugc_kit_offer_viewed`, `ugc_kit_offer_clicked`.

The helper accepts one of these names and no additional payload. It requires the
UGC route, current saved analytics consent, no Global Privacy Control signal,
successful tag loading and analytics not disabled. It does not extend the generic
calculator-event allowlist. Storage, script or tracking errors fail closed.

A passive view needs a valid completed quote, foreground document, at least half
the offer in the viewport and one second of visibility. A genuine link activation
also establishes an observed view. Each event is queued at most once per document.
Clicks without consent are not buffered or replayed. A later consent grant starts
fresh visibility assessment of the current offer, not historical activity.

A queued analytics command is not proof Google received it. The tests use a fake
tag and do not establish live provider delivery, property configuration or billing.
Only report the measured consented population. Per-document deduplication is not
per-session or per-person deduplication. For a conversion ratio, use distinct
measured sessions with each event, not raw event count as unique visitors.

No fee, quote total, copied text, client data, extra visitor ID, campaign value or
listing ID is added to these events. The existing page-query stripping remains.
Consequently, the social draft UTM links must not be presented as verified GA4
campaign attribution. No campaign collection or cross-site identity join is added.

Website clicks establish interest, not a sale. Use actual paid-shop order evidence
for purchases, refunds and fees. A no-referrer link limits store-side attribution;
Etsy Share & Save enrollment and a store-issued tracked link remain unverified.
Do not invent such a link or claim reliable attribution from this implementation.
Report observed orders separately from attributed orders and incremental profit.

## Review decision rules

These are proposed operating limits, not industry benchmarks or significance tests.
Start the clock only after an approved, verified public release, not after a PR.
Review at 30 days or 100 measured qualified offer-viewing sessions. Fewer than five
product-link sessions at that exposure triggers one copy/placement review. Product
clicks without purchases prompt a listing/product/purchase-path review, not more
features. Three genuine, non-test purchases with positive direct contribution
justify considering one further bounded experiment; they do not establish profit.
Insufficient exposure is INCONCLUSIVE. Privacy issues, unsupported claims, a broken
destination, account warnings or unexpected expenses stop the pilot immediately.

No paid acquisition or new scheduler subscription is authorized. Keep three
source-linked social drafts unpublished until the page, source claims, account
ownership and exact publishing action are approved. See `ugc-kit-social-drafts.md`.

## Checks and release requirements

- `npm run test:ugc-kit` runs deterministic release and event-contract tests.
- `npm run build` includes this check alongside every existing build check.
- `npm run test:browser` includes the real UGC page via the existing local dist
  server, real HTML/CSS/scripts, synthetic input, fake tag and blocked external
  requests. The feature's approved-state fixture is substituted in memory only.
- Browser cases cover two viewports, free controls, result focus, offer-only axe
  checks, refusal, withdrawal, GPC, unavailable storage, loader failure, invalid
  release records, expiry and absence of a visibility observer.
- Test approval fixtures are not an owner release. No live Google collection,
  Etsy navigation, purchase, publishing or production verification is performed.
- Report local and remote browser evidence separately, and rerun both the focused
  offer suite and retained site gates after any evidence or activation change. Do
  not treat an earlier green run as proof for a changed revision.

Review the exact diff and CI results independently before any merge. Verify the
full UGC page in the intended release environment and the actual Etsy destination.
Record the final release SHA, source record, observation dates and rollback owner.
Keep `UGC_KIT_RELEASE` null until the listing/workbook mismatch is resolved and
the exact release is approved. Activating it is a later reviewed change with
corresponding tests, not an environment flag, guessed hash or removal of the
safeguards.

Existing Dependabot work is separate. No package versions or lockfile changed.
A draft PR may invoke existing CI/hosting integrations; source remains inactive.
No direct production deployment or main-branch write is included in this task.

## Evidence locations

Source behavior is bounded to the reviewed base and these paths:
- `tools/ugc-rate/index.html`, `tools/ugc-rate/ugc-calculator.js`
- `assets/js/theme.js`, `privacy.html`
- `scripts/analytics-integrity-check.js`, `scripts/build-dist.js`
- `package.json`, `playwright.config.js`, `.github/workflows/quality.yml`

Current primary reference for consent implementation:
https://developers.google.com/tag-platform/security/guides/consent

This record documents implementation and limitations, not legal compliance,
verified customer demand, live account access or a completed commercial test.
