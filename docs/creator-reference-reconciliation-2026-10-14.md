# Creator reference reconciliation and release evidence

Checked October 14, 2026. This record reconciles the owner-supplied reference library with primary sources and the maintained code. It is internal documentation, excluded from the public build.

## Evidence and publication decisions

- Live Search Console, July 13–October 12: 130 clicks, 11.4K displayed impressions, 1.1% CTR, average position 23.8. These are traffic metrics, not revenue or AdSense approval.
- Actual query rows: `patreon revenue calculator` 8 clicks/62 impressions; `patreon income tracker` 6/162; `twitch revenue calculator` 1/106. YouTube-filtered totals: 0 clicks/190 impressions; `youtube monetization requirements and rpm 2026` 0/20; `youtube ad revenue` 0/22. Ignore browser-extension CPC/volume columns; they are not GSC evidence.
- The YouTube guide answers the observed eligibility/RPM query and the independently verified platform-change deadline. No measured search volume is claimed for a 2027 query. Its registry stores both forms of evidence.
- The existing UGC guide remains in PR #70. Its prior opportunity metrics are calculator-page aggregates, not exact-query counts. Do not describe those numbers as query-specific or the unreleased guide as already earning traffic.
- AdSense's reported rejection category is low value content. The claim that input multipliers caused it is a hypothesis, not a Google diagnosis. Additional content cannot guarantee approval.

## Verified source corrections

YouTube: [official changes](https://support.google.com/youtube/answer/12843009?hl=en), [August announcement](https://blog.youtube/news-and-events/youtube-partner-program-updates-2027-new-opportunities-earn/), [early entry](https://support.google.com/youtube/answer/13429240?hl=en), [analytics definitions](https://support.google.com/youtube/answer/9314357?hl=en). Help page read directly in Chrome after the web fetch timed out. The guide separates future entry, ongoing Shorts earnings, existing membership, module acceptance, and synthetic arithmetic. Overall Studio RPM includes more than ads, so the ad-only calculator must not simply relabel its input as overall RPM. No second share deduction is applied to a post-share input.

Patreon: [fees overview](https://support.patreon.com/hc/en-us/articles/11111747095181-Creator-fees-overview), source updated September 11. The legacy section expressly places currency-changed Founders on the following legacy processing table. Code previously excluded that plan from micropayments; corrected the actual processing selector, not just its descriptive flag. Regression cases cover the boundary and preserve Standard's no-micropayment treatment. The tool remains a USD web-payment scenario; tax-inclusive processing, shared payments, iOS and payout charges require separate reconciliation. Do not describe the result as an exact payout.

Newsletter: [Substack cost](https://support.substack.com/hc/en-us/articles/360037607131-How-much-does-Substack-cost) and [Stripe Tax pricing](https://stripe.com/tax/pricing). The percentage field can combine applicable fees; fixed transaction charges go into other costs once. Tax Basic's no-code charge is conditional on actual use and registration, not universal Substack pricing. Annual-payment frequency must be accounted for.

Twitch: [Affiliate FAQ](https://help.twitch.tv/s/article/twitch-affiliate-program-faq), [Plus Help](https://help.twitch.tv/s/article/plus-program?language=en_US), [LATAM update](https://blog.twitch.tv/en/2025/05/19/supporting-streamers-in-latin-america/). Plus page read directly in Chrome; Affiliate default corroborated in official search index. Standard split is specifically the standard Affiliate arrangement, not a promise about every individually negotiated agreement. General thresholds require the Latin America exception. Prime and gifts have different point/share treatment. Do not infer payouts from retail subscription prices.

TikTok: [official announcement](https://newsroom.tiktok.com/introducing-the-new-creator-rewards-program?lang=en) read. Support pages were blocked to web fetch. New explanatory text identifies the announcement's requirements and directs readers to current account terms. No RPM range, new country list or guaranteed eligibility published. Existing dashboard-first arithmetic retained.

Instagram: official creator resource returned rate limiting; English Meta Help redirected to login. Current program thresholds and invitations remain UNKNOWN. Existing manual, confirmed-revenue arithmetic preserved; no new eligibility numbers or blanket monetization promises added. Do not stamp a new platform verification date for this page.

## Next useful articles, ordered by evidence

1. Patreon standard versus legacy processing: observed Patreon calculator demand; explain small-payment and plan-history boundaries using Patreon Help, a synthetic comparison, and the existing calculator. Confirm query-level fee intent before a standalone article; otherwise improve this calculator section.
2. Patreon income tracking: strengthen the existing guide against the exact tracker queries before duplicating it. Reconcile earned revenue, cash payouts and payout fees; use blank records, never private creator examples.
3. YouTube RPM versus CPM: observed eligibility/RPM query supports the explanation in the new guide. A separate page needs evidence of a distinct decision and must avoid cannibalizing it.
4. Twitch Plus: observed Twitch calculator demand; candidate standalone query still unverified. Keep current sourced explanation in the calculator pending exact-query evidence.
5. Newsletter platform comparison, Instagram programs and Ko-fi pricing: research backlog only. Verify current primary pricing and demand before publication. Do not reuse the supplied beehiiv/Ko-fi plan names or price estimates as current facts.

## Baseline indexing, before release

Search Console report last updated October 8: 21 indexed, 62 not indexed (40 recorded 404, 8 redirects, 11 crawled-not-indexed, 3 discovered-not-indexed). This includes historical URLs and is not a live audit of maintained routes. Sitemap submitted August 10; last read October 9; Success; 23 discovered pages. The new release must be checked independently on production and with live URL inspection.

## Release safeguards

The owner's About main content is byte-identical to the branch baseline. Consent controller and analytics identifiers are unchanged. Static publisher verification is added consistently where absent; it does not load ad code. Existing affiliate destinations/disclosures and the Etsy callout remain visible. No AdSense review request is authorized without final owner confirmation.

Validation and production results are recorded in the PR and final handoff; this document does not itself assert deployment or approval.
