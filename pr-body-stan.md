## What

New tool page `/tools/stan-store-calculator/` — a Stan Store break-even / comparison calculator (Stan Creator vs Stan Creator Pro vs Gumroad direct sale vs direct Stripe) from product price + monthly sales, with a centralized `FEE_CONFIG` and visible fee assumptions.

Fees verified from first-party sources on 2026-10-24: Stan help articles 83 and 31 (0% Stan transaction fee; Creator $29/mo, Pro $99/mo; Stripe 2.9% + $0.30; payout 0.25% + $0.25, $1 min), gumroad.com/pricing (10% + $0.50 direct/profile), stripe.com/pricing. Stan payout fee is shown as its own line because payout cadence is not an input.

## Verification

- `test:stan-calculator` 4/4 oracle tests — $47 x 20 Stan Creator monthly: gross $940.00, sale fees $33.26, net $877.74, keep 93.4%, cover-plan sales 1; Pro monthly net $807.74, cover 3; per-sale Stripe $19 -> $0.85, $29 -> $1.14, $97 -> $3.11.
- Full `npm run build` green (lint, quality, navigation 31 routes, analytics 289 assertions, article integrity, dist verified 96 files).
- Browser suite 50/50, including the rendered oracle assertion on the built page. The suite caught one real defect during verification — the new page was missing the shared `main.js` tag (dead mobile nav) — fixed in this change set and re-verified.
- Registered in sitemap, llms.txt, internal-links map, vercel.json, build-dist, quality + analytics registries, Font Awesome inventory, and the homepage tool grid; reciprocal links from the Patreon calculator and UGC Rates Guide; live Beehiiv EmailCapture block on the page.

## Notes

- `STAN_STORE_URL` is the bare `https://stan.store` — no referral path. Stan's referral program requires a paid subscription; nothing was bought on spec.
- No AdSense code added.
