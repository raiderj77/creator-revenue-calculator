# Channel Earnings Estimator for YouTube — gated architecture

Status: production disabled
Reviewed: 2026-08-23

## Decision

The first API-backed estimator uses the YouTube Data API only. It does not use Google OAuth, the YouTube Analytics API, a creator account connection, scraping, search-based channel selection, or historical snapshot storage.

The proposed page remains outside `dist/`, navigation, the sitemap, `llms.txt`, structured data, and indexing. The server handler is also hard-locked when `VERCEL_ENV=production` and has no production runtime-guard adapter. Setting environment variables alone cannot activate it.

The separate `/tools/social-media-earnings-estimator/` route is safe to publish now because it is a manual, browser-only calculator using explicit user-entered values.

## Owner and provider gates before public activation

All items must be verified at action time:

- [ ] Create exactly one Google Cloud API project for this API client.
- [ ] Enable YouTube Data API v3 for that project.
- [ ] Submit the [YouTube API Services audit form](https://support.google.com/youtube/contact/yt_api_form) for the exact analytics-and-reporting use case with OAuth marked No.
- [ ] Accept the [Derived Metrics policy amendment](https://developers.google.com/youtube/terms/derived-metrics-policy) and receive YouTube's determination that the financial-projection use case qualifies.
- [ ] Record the accepted policy version in `YOUTUBE_ESTIMATOR_POLICY_VERSION`.
- [ ] Record the owner's approval date in `YOUTUBE_ESTIMATOR_APPROVAL_DATE`.
- [ ] Create a restricted server key for YouTube Data API v3. Use fixed-egress IP restrictions only if the approved hosting design provides fixed egress.
- [ ] Store the key only as `YOUTUBE_DATA_API_KEY` in the approved server environment.
- [ ] Set `ENABLE_YOUTUBE_PUBLIC_ESTIMATOR=true` only in the owner-approved environment after every remaining gate passes.
- [ ] Add a shared atomic cache, per-client rate limit, duplicate-request lock, and daily quota-unit reservation. In-memory serverless maps do not satisfy this gate.
- [ ] Add owner-approved bot/WAF protection and a zero-dollar infrastructure-spend default or explicit spending ceiling.
- [ ] Implement and test a narrowly scoped thumbnail delivery path that preserves approved YouTube attribution without weakening the current `img-src 'self' data:` Content Security Policy; do not add a broad Google image-host wildcard.
- [ ] Run cache, quota, failure, concurrency, timeout, and preview smoke tests against synthetic identifiers before any real public request.
- [ ] Add approved linked YouTube attribution/Brand Features beside API data.
- [ ] Update the public Privacy Policy and Terms, then require active API-client privacy agreement before lookup.
- [ ] Add an easy deletion-request route and an operational process that completes valid deletion requests as soon as possible and within seven days.
- [ ] Verify the production key, request bodies, channel identifiers, API errors, and response data are absent from logs and analytics.
- [ ] Obtain a final owner approval that explicitly authorizes public activation.
- [ ] Remove the hard production lock, add the page to the fail-closed public allowlist, then separately add navigation, sitemap, assistant discovery, canonical indexing, and matching visible/schema content.

## Environment contract

```text
ENABLE_YOUTUBE_PUBLIC_ESTIMATOR=false
YOUTUBE_DATA_API_KEY=
YOUTUBE_ESTIMATOR_APPROVAL_DATE=
YOUTUBE_ESTIMATOR_POLICY_VERSION=
```

The key is read only by the Vercel function. It must not appear in browser JavaScript, HTML, `dist/`, logs, request URLs, analytics, screenshots, support messages, or pull-request text. The server sends it to Google in the `x-goog-api-key` request header, never as `?key=`.

## Input contract

The endpoint accepts a JSON `POST` body only:

```json
{
  "channel": "@handle-or-supported-url-or-channel-id",
  "privacyAccepted": true,
  "website": ""
}
```

The request must be same-origin, use `application/json`, include the fixed browser request marker, remain below 2 KB, and leave the honeypot empty. Channel identifiers are never accepted in a query string.

Accepted identifiers:

- an exact `UC` channel ID;
- a bare handle, with or without `@`, including supported international characters;
- `youtube.com/channel/{channelId}`;
- `youtube.com/@{handle}`;
- a supported legacy `youtube.com/user/{username}` URL.

Rejected identifiers include `/c/` custom URLs, video and playlist URLs, lookalike hosts, URLs with user information, query parameters, fragments, redirects, control characters, and oversized input. The service never falls back to `search.list` or scraping.

## Fixed YouTube Data API request plan

One exact cache miss uses three fixed one-unit calls under the [current quota table](https://developers.google.com/youtube/v3/determine_quota_cost):

1. `channels.list`
   - exact `id`, `forHandle`, or `forUsername` filter;
   - parts: `snippet,statistics,contentDetails`;
   - fields: channel ID, title, default/medium thumbnail, public subscriber count, hidden-subscriber flag, YouTube-reported channel view count, public-video count, and uploads-playlist ID.
2. `playlistItems.list`
   - exact uploads playlist from step 1;
   - part: `contentDetails`;
   - fields: at most 50 public video IDs and `videoPublishedAt` values.
3. `videos.list`
   - exact IDs from step 2;
   - part: `statistics`;
   - fields: ID and public view count.

Likes, comments, descriptions, titles, duration, geography, watch time, monetization state, private revenue, RPM, CPM, monetized playbacks, sponsorship revenue, and merchandise revenue are not requested. The API has no reliable `isShort` field, so content mix remains a user-entered assumption.

## Data flow and security boundary

```text
Browser source (POST body; no query string)
  -> same-origin Vercel function
  -> feature and production lock
  -> method, origin, size, privacy, honeypot, and identifier validation
  -> approved WAF plus shared atomic rate/cache/quota controls [not connected]
  -> fixed YouTube Data API methods with server-only key header
  -> minimum UI response
  -> browser-only revenue arithmetic from visible assumptions
```

The endpoint does not accept a requested resource, part, field mask, page token, URL, or arbitrary upstream target. Raw Google errors are mapped to short safe messages. Requests use an eight-second timeout. Stale cached data is never labeled current after a failed refresh.

## Instant mode

Instant mode selects public uploads published inside a visible 30-, 60-, or 90-day lookback. It sums the views currently visible on those uploads, divides by the selected lookback days for a daily proxy, and multiplies by 30 for a monthly proxy.

```text
visible recent-upload views = sum(current public views on sampled uploads published in the lookback)
daily view-activity proxy = visible recent-upload views / lookback days
monthly view-activity proxy = daily view-activity proxy * 30
```

Required label:

> Instant estimate based on currently visible views for recently published videos.

This is not actual monthly channel views. It excludes activity on older catalog videos, cannot determine when a visible view occurred, and samples at most the 50 most recent public uploads.

## Visible revenue assumptions

Subscribers are display-only and never enter revenue math. Every RPM value starts at zero and remains editable.

- Mostly long-form uses the visible long-form low/middle/high RPM range.
- Mostly Shorts uses the visible Shorts low/middle/high RPM range.
- Mixed requires a visible long-form percentage; Shorts is the displayed remainder.
- Unknown uses a separate, explicit low/middle/high range. If the user also enters long-form or Shorts ranges, the Unknown low-to-high envelope must be at least as broad. Its middle is explicitly user-entered, not inferred.
- Revenue stays unavailable unless the user selects the visible hypothetical monetization assumption. This selection does not claim that the channel or any view is monetized.

Mixed formula:

```text
long-form modeled views = monthly view-activity proxy * entered long-form share
Shorts modeled views = monthly view-activity proxy * entered Shorts share

monthly revenue case =
  (long-form modeled views / 1,000 * entered long-form RPM case)
  + (Shorts modeled views / 1,000 * entered Shorts RPM case)
```

Annual cases multiply the matching monthly case by 12. No subscriber, niche, geography, engagement, video-length, platform-share, or hidden benchmark multiplier exists.

Required result disclosure:

> “This is a third-party estimate from Creator Revenue Calculator. It is not YouTube-published, YouTube-approved, verified revenue, or an actual payout. Public data does not confirm whether a channel or view is monetized.”

The visible page also clarifies that Creator Revenue Calculator independently generates the estimate, the estimate itself is not supplied by YouTube, and it is not approved or verified by Google or YouTube.

## Tracked mode — not implemented

Tracked mode requires an approved shared snapshot store. Do not create a record until a legitimate visitor requests a channel. Refresh only channels with recent legitimate demand.

Minimum allowed snapshot shape after approval:

```text
channel ID
snapshot date
public total views
public subscriber count
public video count
data source
retrieval status
```

Do not store names, descriptions, video titles, comments, or thumbnails in tracked snapshots. Do not create public historical pages automatically.

The planned UI shows 7-, 30-, and 90-day changes, tracked days, missing-snapshot warnings, the actual endpoint span, and the last successful refresh. A nominal window requires a baseline no more than two days older than its target. A 30-day result also requires at least 28 valid snapshots in that bounded current window and at least 30 calendar days between usable endpoints. Negative public-count changes are treated as an anomaly and not silently converted to revenue.

Under the [YouTube API Services Developer Policies](https://developers.google.com/youtube/terms/developer-policies), non-authorized API data must be deleted or refreshed within 30 days absent a more specific permission. Under the accepted derived-metrics amendment, approved statistical fields and derived metrics may be retained for no more than 36 months. Names, titles, descriptions, thumbnails, and comment text remain on a 30-day refresh/deletion boundary. The final implementation must follow the permission actually granted, not the maximum possible period.

## Connected mode — architecture only

Connected mode remains disabled. It would require a separate threat model, Google OAuth verification and consent design, YouTube Analytics scopes, encrypted token storage, revocation, export/deletion behavior, and a new owner approval. No OAuth code or credential is part of the initial estimator.

## Privacy, terms, deletion, and branding launch text

Before activation, the public Privacy Policy must name YouTube API Services, link the [Google Privacy Policy](https://policies.google.com/privacy), and explain data access, use, transient caching, storage, sharing, cookies, security, retention, and deletion. Cookie consent is not a substitute for the required active API-client privacy agreement.

The Terms must link the [YouTube Terms of Service](https://www.youtube.com/t/terms) and state that users of the API client agree to be bound by them. The deletion notice must say that deletion from Creator Revenue Calculator does not delete content or data from YouTube.

Raw API data needs nearby approved, linked YouTube attribution under the [YouTube branding guidelines](https://developers.google.com/youtube/terms/branding-guidelines). The API client remains branded Creator Revenue Calculator; do not imply Google or YouTube endorsement.

## Advertising and analytics

Do not place advertising inside or immediately adjacent to the channel input, public-data group, assumption inputs, or estimate result. Any later API page must retain substantial independent value if the YouTube data is removed.

Analytics may receive only a generic payload-free completion event after explicit analytics consent. It must never receive a channel identifier, channel name, platform selection, API response, rate, split, monetization assumption, view activity, revenue result, error detail, or query string.

## Activation evidence package

Capture synthetic, identifier-free evidence for:

- exact endpoint, parts, fields, and three-unit cache-miss forecast;
- key restriction and header-only handling without revealing the key;
- audit approval and accepted amendment/version;
- privacy agreement, YouTube Terms, Google Privacy, attribution, and deletion UI;
- shared cache/rate-limit/coalescing/quota configuration;
- timeout, failure, stale-data, and quota-ceiling behavior;
- 320px, desktop, keyboard, focus, live-region, print, and contrast checks;
- production `dist/` and browser-source credential scans;
- production endpoint disabled before the final activation change.

Official references should be rechecked at activation time:

- [YouTube API Services Developer Policies](https://developers.google.com/youtube/terms/developer-policies)
- [Derived Metrics policy](https://developers.google.com/youtube/terms/derived-metrics-policy)
- [YouTube Data API channel resource](https://developers.google.com/youtube/v3/docs/channels)
- [YouTube Data API quota calculator](https://developers.google.com/youtube/v3/determine_quota_cost)
- [Google API key best practices](https://docs.cloud.google.com/docs/authentication/api-keys-best-practices)
