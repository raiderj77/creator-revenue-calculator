# EmailCapture — Beehiiv Activation Record (2026-10-24, via bridge at owner's direction)

## What was set
- `assets/js/email-capture.js` line 2: `BEEHIIV_EMBED_URL` set to
  `https://subscribe-forms.beehiiv.com/v3/forms/93dec953-d143-4aec-bd65-eb8e9570c42e`
- Source of the URL: the owner created the "Creator Revenue Calculator" Beehiiv publication
  (publication id `bec8bde1-c9ce-45ba-9232-3b5314c973f0`) and a subscribe form, and pasted the
  script-loader embed snippet. The iframe URL above is the form's own `url` field returned by
  Beehiiv's public forms API for that form id — verified directly, not guessed.
- Verified before wiring: GET on the URL returns HTTP 200 with the real form (email input,
  Subscribe, publication name + the corrected one-line description).

## Gate change (review this)
- `scripts/quality-check.js`: the pre-activation assertion required the constant to be empty.
  It now accepts empty OR exactly a `https://subscribe-forms.beehiiv.com/v3/forms/<uuid>` URL.
  All other conditions unchanged (hidden markup, no local form/input/iframe in markup,
  `block.remove()` present, no fetch/XHR/beacon/storage in the script). Assertion label updated
  to match. This is the ONLY check changed.

## Verification (2026-10-24, worktree, local static serve of dist/ — no production headers)
- `npm run build`: full chain PASS, zero FAIL. dist: 90 files, 1,691,618 bytes.
- Rendered probe (Playwright), consent banner dismissed, home + Patreon pages:
  iframe loads the exact form URL; exactly 1 email input inside the frame; form text shows the
  publication name and corrected description; screenshots reviewed at 1280 (clean) and mobile.
- NOT covered: production CSP. `vercel.json` still has `frame-src 'none'` — the live deploy
  needs the owner's frame-src decision for `https://subscribe-forms.beehiiv.com`, in the same
  deploy as this activation, or the block renders empty in production.
- NOT run: `test:browser` — the browser spec was written for the flag-off state; it needs a
  configured-state variant as part of the merge review.

## Known defect — mobile squeeze (Beehiiv-side, proven)
- At iframe widths <= ~360px the Beehiiv form's own layout squeezes: title/description wrap
  into a narrow centered column; at 280px the email input is nearly clipped away.
- Proven NOT caused by this site's CSS: a bare iframe with only the form URL (no site assets)
  renders identically at 280/360px. The form's internal layout has a fixed minimum width.
- Desktop widths (568/768px blocks) render perfectly.
- Candidate fixes: (a) Beehiiv form editor — choose a stacked/full-width layout if offered;
  (b) our side — render the iframe at ~450px and CSS-scale it down on small screens.
  Re-probe after any form-design change; do not merge until mobile is acceptable.

## State
- Worktree only. NOT merged, NOT deployed. Owner gates remaining: CSP frame-src decision,
  mobile-fix decision, merge/deploy word (creator chat).
