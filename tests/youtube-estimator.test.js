import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

import {
  EstimatorError,
  buildInstantActivity,
  calculateTrackedChanges,
  createEstimatorService,
  createMemoryRuntimeGuards,
  estimateRevenueFromVisibleAssumptions,
  launchGatesSatisfied,
  normalizeChannelInput,
  productionActivationLocked,
  retrieveChannelPublicData,
  trackedWindowAvailability,
} from "../api/_youtube-estimator-core.js";
import { createHandler } from "../api/youtube-channel-estimator.js";

const root = path.resolve(import.meta.dirname, "..");
const fixedNow = new Date("2026-08-23T12:00:00.000Z");
const sentinelKey = "sentinel-key-that-must-never-leak-123456";
const enabledEnvironment = {
  ENABLE_YOUTUBE_PUBLIC_ESTIMATOR: "true",
  YOUTUBE_DATA_API_KEY: sentinelKey,
  YOUTUBE_ESTIMATOR_APPROVAL_DATE: "2026-08-22",
  YOUTUBE_ESTIMATOR_POLICY_VERSION: "derived-metrics-approved-v1",
  VERCEL_ENV: "preview",
};

function jsonResponse(body, ok = true) {
  return { ok, async json() { return body; } };
}

function upstreamFixture({ channelStatistics = {}, videoItems } = {}) {
  return async function fetchFixture(url, options) {
    const pathname = new URL(url).pathname;
    if (pathname.endsWith("/channels")) {
      return jsonResponse({
        items: [{
          id: "UC1234567890123456789012",
          snippet: {
            title: "Synthetic Channel",
            thumbnails: { default: { url: "https://yt3.ggpht.com/synthetic" } },
          },
          statistics: {
            viewCount: "100000",
            subscriberCount: "12300",
            hiddenSubscriberCount: false,
            videoCount: "42",
            ...channelStatistics,
          },
          contentDetails: { relatedPlaylists: { uploads: "UU1234567890123456789012" } },
        }],
      });
    }
    if (pathname.endsWith("/playlistItems")) {
      return jsonResponse({
        items: [
          { contentDetails: { videoId: "video-one", videoPublishedAt: "2026-08-10T12:00:00Z" } },
          { contentDetails: { videoId: "video-two", videoPublishedAt: "2026-08-20T12:00:00Z" } },
        ],
      });
    }
    if (pathname.endsWith("/videos")) {
      return jsonResponse({
        items: videoItems || [
          { id: "video-one", statistics: { viewCount: "3000" } },
          { id: "video-two", statistics: { viewCount: "6000" } },
        ],
      });
    }
    throw new Error("Unexpected resource");
  };
}

function responseRecorder() {
  return {
    headers: {},
    statusCode: 0,
    setHeader(name, value) { this.headers[name.toLowerCase()] = value; },
    end(value) { this.body = String(value); },
  };
}

function requestFixture(overrides = {}) {
  return {
    method: "POST",
    headers: {
      origin: "https://creatorrevenuecalculator.com",
      "content-type": "application/json",
      "content-length": "120",
      "x-crc-estimator-request": "browser-v1",
      "x-forwarded-for": "192.0.2.1",
    },
    body: {
      channel: "@synthetic-channel",
      privacyAccepted: true,
      website: "",
    },
    socket: { remoteAddress: "192.0.2.1" },
    ...overrides,
  };
}

test("all approval flags are required and production stays hard locked", () => {
  assert.equal(launchGatesSatisfied(enabledEnvironment, fixedNow), true);
  for (const key of [
    "ENABLE_YOUTUBE_PUBLIC_ESTIMATOR",
    "YOUTUBE_DATA_API_KEY",
    "YOUTUBE_ESTIMATOR_APPROVAL_DATE",
    "YOUTUBE_ESTIMATOR_POLICY_VERSION",
  ]) {
    assert.equal(launchGatesSatisfied({ ...enabledEnvironment, [key]: "" }, fixedNow), false, key);
  }
  assert.equal(launchGatesSatisfied({ ...enabledEnvironment, YOUTUBE_ESTIMATOR_APPROVAL_DATE: "2026-09-01" }, fixedNow), false);
  assert.equal(launchGatesSatisfied({ ...enabledEnvironment, YOUTUBE_ESTIMATOR_APPROVAL_DATE: "2026-02-31" }, fixedNow), false);
  assert.equal(launchGatesSatisfied({ ...enabledEnvironment, YOUTUBE_ESTIMATOR_POLICY_VERSION: "pending" }, fixedNow), false);
  assert.equal(productionActivationLocked({ VERCEL_ENV: "production" }), true);
});

test("disabled handler returns before reading input or calling a service", async () => {
  let serviceCalls = 0;
  const handler = createHandler({
    environment: { ...enabledEnvironment, ENABLE_YOUTUBE_PUBLIC_ESTIMATOR: "false" },
    now: () => fixedNow,
    service: { async lookup() { serviceCalls += 1; } },
  });
  const request = requestFixture();
  Object.defineProperty(request, "body", { get() { throw new Error("body was read"); } });
  const response = responseRecorder();
  await handler(request, response);
  assert.equal(response.statusCode, 404);
  assert.equal(serviceCalls, 0);
  assert.equal(response.headers["cache-control"], "no-store");
});

test("production handler stays unavailable even when every environment flag is present", async () => {
  let serviceCalls = 0;
  const handler = createHandler({
    environment: { ...enabledEnvironment, VERCEL_ENV: "production" },
    now: () => fixedNow,
    service: { async lookup() { serviceCalls += 1; } },
  });
  const request = requestFixture();
  Object.defineProperty(request, "body", { get() { throw new Error("body was read"); } });
  const response = responseRecorder();
  await handler(request, response);
  assert.equal(response.statusCode, 404);
  assert.equal(serviceCalls, 0);
  assert.doesNotMatch(response.body, new RegExp(sentinelKey));
});

test("handles, channel IDs, and supported URLs normalize without search", () => {
  assert.deepEqual(normalizeChannelInput("@Creator.Name"), {
    kind: "handle", value: "Creator.Name", canonical: "@Creator.Name",
  });
  assert.equal(normalizeChannelInput("クリエイター").kind, "handle");
  assert.equal(normalizeChannelInput("UC1234567890123456789012").kind, "id");
  assert.equal(normalizeChannelInput("https://www.youtube.com/@Creator.Name/").kind, "handle");
  assert.equal(normalizeChannelInput("https://youtube.com/channel/UC1234567890123456789012").kind, "id");
  assert.equal(normalizeChannelInput("https://youtube.com/user/legacy_name").kind, "username");
});

test("ambiguous, malicious, oversized, and non-channel inputs fail safely", () => {
  for (const value of [
    "https://notyoutube.example/@creator",
    "https://youtube.com.evil.example/@creator",
    "https://youtube.com/c/custom-name",
    "https://youtube.com/watch?v=abc",
    "https://youtube.com/playlist?list=abc",
    "https://user:pass@youtube.com/@creator",
    `@${"a".repeat(221)}`,
    "@bad\u0000handle",
  ]) {
    assert.throws(() => normalizeChannelInput(value), EstimatorError, value);
  }
});

test("the API client uses only three fixed resources and keeps the key in a header", async () => {
  const calls = [];
  const fixture = upstreamFixture();
  const result = await retrieveChannelPublicData({
    lookup: normalizeChannelInput("@synthetic-channel"),
    apiKey: sentinelKey,
    now: () => fixedNow,
    fetchImpl: async (url, options) => {
      calls.push({ url: String(url), options });
      return fixture(url, options);
    },
  });
  assert.equal(calls.length, 3);
  assert.deepEqual(calls.map((call) => new URL(call.url).pathname), [
    "/youtube/v3/channels",
    "/youtube/v3/playlistItems",
    "/youtube/v3/videos",
  ]);
  assert.ok(calls.every((call) => !call.url.includes(sentinelKey) && !/[?&]key=/.test(call.url)));
  assert.ok(calls.every((call) => call.options.headers["x-goog-api-key"] === sentinelKey));
  assert.ok(calls.every((call) => !call.url.includes("search")));
  assert.equal(result.publicData.channelName, "Synthetic Channel");
  assert.equal(result.publicData.recentUploads.length, 2);
});

test("only necessary public fields are requested", async () => {
  const urls = [];
  const fixture = upstreamFixture();
  await retrieveChannelPublicData({
    lookup: normalizeChannelInput("@synthetic-channel"),
    apiKey: sentinelKey,
    now: () => fixedNow,
    fetchImpl: async (url, options) => {
      urls.push(String(url));
      return fixture(url, options);
    },
  });
  const requestText = urls.join("\n");
  assert.doesNotMatch(requestText, /commentCount|likeCount|duration|description|estimatedRevenue|monetized/i);
  assert.match(requestText, /hiddenSubscriberCount/);
  assert.match(requestText, /videoPublishedAt/);
});

test("missing public statistics are never fabricated as zero", async () => {
  await assert.rejects(
    retrieveChannelPublicData({
      lookup: normalizeChannelInput("@synthetic-channel"),
      apiKey: sentinelKey,
      now: () => fixedNow,
      fetchImpl: upstreamFixture({ channelStatistics: { viewCount: undefined } }),
    }),
    (error) => error.code === "UPSTREAM_UNAVAILABLE",
  );

  const partial = await retrieveChannelPublicData({
    lookup: normalizeChannelInput("@synthetic-channel"),
    apiKey: sentinelKey,
    now: () => fixedNow,
    fetchImpl: upstreamFixture({
      videoItems: [
        { id: "video-one", statistics: {} },
        { id: "video-two", statistics: { viewCount: "6000" } },
      ],
    }),
  });
  assert.deepEqual(partial.publicData.recentUploads.map((upload) => upload.videoId), ["video-two"]);
  assert.equal(partial.coverage.unavailableRecentUploadCount, 1);
  assert.equal(partial.coverage.completeRecentUploadCoverage, false);
});

test("instant activity is a recent-upload proxy, not actual monthly channel views", () => {
  const activity = buildInstantActivity([
    { publishedAt: "2026-08-20T00:00:00Z", viewCount: "6000" },
    { publishedAt: "2026-07-01T00:00:00Z", viewCount: "900000" },
  ], 30, fixedNow.toISOString());
  assert.equal(activity.qualifyingUploads, 1);
  assert.equal(activity.currentlyVisibleViewsOnQualifyingUploads, 6000);
  assert.equal(activity.estimatedDailyViewActivity, 200);
  assert.equal(activity.estimatedMonthlyViewActivity, 6000);
  assert.match(activity.description, /currently visible views for recently published videos/i);
  assert.equal(activity.olderCatalogExcluded, true);
});

test("revenue math uses visible views and RPM assumptions, never subscribers", () => {
  const assumptions = {
    monetization: "hypothetical-monetized-views",
    contentMix: "mixed",
    longFormPercent: 60,
    longForm: { low: 2, middle: 4, high: 6 },
    shorts: { low: 0.1, middle: 0.2, high: 0.3 },
    unknown: { low: 0.1, middle: 2, high: 6 },
  };
  const result = estimateRevenueFromVisibleAssumptions(100_000, assumptions);
  assert.equal(result.available, true);
  assert.deepEqual(result.split, { longFormPercent: 60, shortsPercent: 40 });
  assert.equal(result.monthly.middle, 248);
  assert.equal(result.annual.middle, 2976);
  assert.equal("subscriberCount" in result, false);
});

test("blank or unselected monetization assumptions do not create revenue", () => {
  const result = estimateRevenueFromVisibleAssumptions(100_000, { monetization: "not-modeled" });
  assert.equal(result.available, false);
});

test("Shorts, long-form, mixed, and unknown ranges stay separate", () => {
  const base = {
    monetization: "hypothetical-monetized-views",
    longForm: { low: 2, middle: 4, high: 6 },
    shorts: { low: 0.1, middle: 0.2, high: 0.3 },
    unknown: { low: 0.1, middle: 2, high: 6 },
  };
  assert.equal(estimateRevenueFromVisibleAssumptions(1000, { ...base, contentMix: "mostly-long-form" }).monthly.middle, 4);
  assert.equal(estimateRevenueFromVisibleAssumptions(1000, { ...base, contentMix: "mostly-shorts" }).monthly.middle, 0.2);
  assert.equal(estimateRevenueFromVisibleAssumptions(1000, { ...base, contentMix: "unknown" }).monthly.middle, 2);
  assert.throws(() => estimateRevenueFromVisibleAssumptions(1000, {
    ...base,
    contentMix: "unknown",
    unknown: { low: 1, middle: 2, high: 5 },
  }), /broadest/i);
});

test("30-day tracked results require 28 valid snapshots and a 30-day span", () => {
  const shortSpan = Array.from({ length: 28 }, (_, index) => ({
    snapshotDate: `2026-07-${String(index + 1).padStart(2, "0")}`,
    retrievalStatus: "success",
  }));
  assert.equal(trackedWindowAvailability(shortSpan, 30).available, false);
  const sufficient = Array.from({ length: 28 }, (_, index) => ({
    snapshotDate: new Date(Date.UTC(2026, 6, 1 + Math.round(index * 31 / 27))).toISOString().slice(0, 10),
    retrievalStatus: "success",
  }));
  const status = trackedWindowAvailability(sufficient, 30);
  assert.equal(status.available, true);
  assert.equal(status.spanDays >= 30, true);

  const staleHistory = Array.from({ length: 28 }, (_, index) => ({
    snapshotDate: new Date(Date.UTC(2026, 0, 1 + index)).toISOString().slice(0, 10),
    retrievalStatus: "success",
  })).concat({ snapshotDate: "2026-08-23", retrievalStatus: "success" });
  assert.equal(trackedWindowAvailability(staleHistory, 30).available, false);
});

test("tracked mode derives 7, 30, and 90 day changes and flags gaps or negative anomalies", () => {
  const snapshots = Array.from({ length: 91 }, (_, index) => ({
    snapshotDate: new Date(Date.UTC(2026, 4, 25 + index)).toISOString().slice(0, 10),
    publicTotalViews: String(10_000 + index * 100),
    retrievalStatus: "success",
  }));
  snapshots.splice(12, 1);
  const result = calculateTrackedChanges(snapshots);
  assert.equal(result.windows[7].change, "700");
  assert.equal(result.windows[30].change, "3000");
  assert.equal(result.windows[90].change, "9000");
  assert.equal(result.missingSnapshotWarning, true);
  assert.equal(result.lastSuccessfulRefresh, "2026-08-23");

  const anomaly = calculateTrackedChanges(Array.from({ length: 31 }, (_, index) => ({
    snapshotDate: new Date(Date.UTC(2026, 6, 2 + index)).toISOString().slice(0, 10),
    publicTotalViews: index === 30 ? "1500" : "2000",
    retrievalStatus: "success",
  })));
  assert.equal(anomaly.windows[30].reason, "NEGATIVE_COUNT_ANOMALY");

  const sparseRecentHistory = Array.from({ length: 28 }, (_, index) => ({
    snapshotDate: new Date(Date.UTC(2026, 0, 1 + index)).toISOString().slice(0, 10),
    publicTotalViews: String(1_000 + index),
    retrievalStatus: "success",
  })).concat({
    snapshotDate: "2026-08-23",
    publicTotalViews: "5000",
    retrievalStatus: "success",
  });
  assert.equal(calculateTrackedChanges(sparseRecentHistory).windows[30].reason, "INSUFFICIENT_SNAPSHOTS");
});

test("cache hits reduce API calls", async () => {
  let calls = 0;
  const fixture = upstreamFixture();
  const guards = createMemoryRuntimeGuards();
  guards.productionReady = true;
  const service = createEstimatorService({
    apiKey: sentinelKey,
    now: () => fixedNow,
    runtimeGuards: guards,
    fetchImpl: async (url, options) => {
      calls += 1;
      return fixture(url, options);
    },
  });
  const first = await service.lookup({ channel: "@synthetic-channel", clientKey: "one" });
  const second = await service.lookup({ channel: "@synthetic-channel", clientKey: "one" });
  assert.equal(calls, 3);
  assert.equal(first.cacheStatus, "fresh");
  assert.equal(second.cacheStatus, "cached");
});

test("rate limits stop repeated requests", async () => {
  const guards = createMemoryRuntimeGuards({ requestLimit: 1 });
  guards.productionReady = true;
  const service = createEstimatorService({
    apiKey: sentinelKey,
    now: () => fixedNow,
    runtimeGuards: guards,
    fetchImpl: upstreamFixture(),
  });
  await service.lookup({ channel: "@synthetic-channel", clientKey: "repeat" });
  await assert.rejects(
    service.lookup({ channel: "@synthetic-channel", clientKey: "repeat" }),
    (error) => error.code === "RATE_LIMITED",
  );
});

test("quota ceiling rejects a miss before any upstream call", async () => {
  let calls = 0;
  const guards = createMemoryRuntimeGuards({ quotaCeiling: 2 });
  guards.productionReady = true;
  const service = createEstimatorService({
    apiKey: sentinelKey,
    now: () => fixedNow,
    runtimeGuards: guards,
    fetchImpl: async () => { calls += 1; return jsonResponse({}); },
  });
  await assert.rejects(
    service.lookup({ channel: "@synthetic-channel", clientKey: "quota" }),
    (error) => error.code === "QUOTA_CEILING",
  );
  assert.equal(calls, 0);
});

test("concurrent duplicate requests coalesce", async () => {
  let calls = 0;
  const fixture = upstreamFixture();
  const guards = createMemoryRuntimeGuards();
  guards.productionReady = true;
  const service = createEstimatorService({
    apiKey: sentinelKey,
    now: () => fixedNow,
    runtimeGuards: guards,
    fetchImpl: async (url, options) => {
      calls += 1;
      await new Promise((resolve) => setTimeout(resolve, 5));
      return fixture(url, options);
    },
  });
  await Promise.all([
    service.lookup({ channel: "@synthetic-channel", clientKey: "a" }),
    service.lookup({ channel: "@synthetic-channel", clientKey: "b" }),
  ]);
  assert.equal(calls, 3);
});

test("expired cache is never shown as current after an API failure", async () => {
  let currentTime = 1_000;
  let fail = false;
  const fixture = upstreamFixture();
  const guards = createMemoryRuntimeGuards({ now: () => currentTime, cacheTtlMs: 10 });
  guards.productionReady = true;
  const service = createEstimatorService({
    apiKey: sentinelKey,
    now: () => fixedNow,
    runtimeGuards: guards,
    fetchImpl: async (url, options) => {
      if (fail) return jsonResponse({ error: "private upstream detail" }, false);
      return fixture(url, options);
    },
  });
  await service.lookup({ channel: "@synthetic-channel", clientKey: "first" });
  currentTime += 20;
  fail = true;
  await assert.rejects(
    service.lookup({ channel: "@synthetic-channel", clientKey: "second" }),
    (error) => error.code === "UPSTREAM_UNAVAILABLE" && !error.message.includes("private upstream detail"),
  );
});

test("handler requires origin, JSON, anti-bot marker, and privacy agreement", async () => {
  const service = { async lookup() { return { ok: true }; } };
  for (const request of [
    requestFixture({ headers: { ...requestFixture().headers, origin: "https://evil.example" } }),
    requestFixture({ headers: { ...requestFixture().headers, "content-type": "text/plain" } }),
    requestFixture({ headers: { ...requestFixture().headers, "x-crc-estimator-request": "" } }),
    requestFixture({ body: { channel: "@creator", privacyAccepted: false, website: "" } }),
    requestFixture({ body: { channel: "@creator", privacyAccepted: true, website: "filled" } }),
    requestFixture({
      headers: { ...requestFixture().headers, "content-length": "" },
      body: { channel: `@${"a".repeat(2_100)}`, privacyAccepted: true, website: "" },
    }),
  ]) {
    const response = responseRecorder();
    await createHandler({ environment: enabledEnvironment, now: () => fixedNow, service })(request, response);
    assert.notEqual(response.statusCode, 200);
  }
});

test("safe handler responses never expose a server credential", async () => {
  const response = responseRecorder();
  await createHandler({
    environment: enabledEnvironment,
    now: () => fixedNow,
    service: { async lookup() { throw new Error(`raw ${sentinelKey}`); } },
  })(requestFixture(), response);
  assert.equal(response.statusCode, 503);
  assert.doesNotMatch(response.body, new RegExp(sentinelKey));
});

test("browser source has no secret, query-string, analytics-value, or scraping path", () => {
  const browserPaths = [
    "tools/youtube-channel-earnings-estimator/index.html",
    "tools/youtube-channel-earnings-estimator/youtube-channel-estimator.js",
  ];
  const existingBrowserSource = browserPaths
    .filter((relative) => fs.existsSync(path.join(root, relative)))
    .map((relative) => fs.readFileSync(path.join(root, relative), "utf8"))
    .join("\n");
  assert.doesNotMatch(existingBrowserSource, /YOUTUBE_DATA_API_KEY|AIza[0-9A-Za-z_-]{30,}/);
  assert.doesNotMatch(existingBrowserSource, /location\.search|URLSearchParams|\bgtag\s*\(|dataLayer|youtube\.com\/watch|scrap(?:e|ing)/i);
});
