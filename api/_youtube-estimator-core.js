const YOUTUBE_API_ORIGIN = "https://www.googleapis.com";
const YOUTUBE_API_PATH = "/youtube/v3/";
const CHANNEL_ID_PATTERN = /^UC[A-Za-z0-9_-]{22}$/;
const HANDLE_PATTERN = /^[\p{L}\p{M}\p{N}._\u00b7-]{3,30}$/u;
const USERNAME_PATTERN = /^[\p{L}\p{M}\p{N}._-]{1,100}$/u;
const APPROVAL_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const POLICY_VERSION_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._-]{2,79}$/;
const PLACEHOLDER_POLICY_VERSIONS = new Set(["none", "pending", "unset", "todo"]);
const SUPPORTED_YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "music.youtube.com",
]);
const ALLOWED_LOOKBACK_DAYS = new Set([30, 60, 90]);
const MAX_CHANNEL_INPUT_LENGTH = 220;
const MAX_RECENT_UPLOADS = 50;
const API_TIMEOUT_MS = 8_000;

export class EstimatorError extends Error {
  constructor(code, status, message) {
    super(message);
    this.name = "EstimatorError";
    this.code = code;
    this.status = status;
  }
}

function invalidInput(message) {
  throw new EstimatorError("INVALID_CHANNEL", 400, message);
}

function normalizeHandle(value) {
  const handle = value.startsWith("@") ? value.slice(1) : value;
  if (!HANDLE_PATTERN.test(handle)) {
    invalidInput("Enter a valid YouTube handle, supported channel URL, or channel ID.");
  }
  return { kind: "handle", value: handle, canonical: `@${handle}` };
}

function normalizeYouTubeUrl(rawValue) {
  let parsed;
  try {
    parsed = new URL(rawValue);
  } catch {
    invalidInput("Enter a valid YouTube handle, supported channel URL, or channel ID.");
  }

  if (!/^https?:$/.test(parsed.protocol)
    || parsed.username
    || parsed.password
    || parsed.port
    || !SUPPORTED_YOUTUBE_HOSTS.has(parsed.hostname.toLowerCase())
    || parsed.search
    || parsed.hash) {
    invalidInput("Use a direct youtube.com channel URL without query parameters or fragments.");
  }

  const segments = parsed.pathname.split("/").filter(Boolean);
  if (segments.length === 1 && segments[0].startsWith("@")) {
    return normalizeHandle(segments[0]);
  }

  if (segments.length === 2 && segments[0] === "channel" && CHANNEL_ID_PATTERN.test(segments[1])) {
    return { kind: "id", value: segments[1], canonical: segments[1] };
  }

  if (segments.length === 2 && segments[0] === "user" && USERNAME_PATTERN.test(segments[1])) {
    return { kind: "username", value: segments[1], canonical: `/user/${segments[1]}` };
  }

  if (segments[0] === "c") {
    invalidInput("Custom /c/ URLs are ambiguous. Paste the channel handle or channel ID instead.");
  }

  invalidInput("Use a /channel/ID, /@handle, or supported /user/ channel URL.");
}

export function normalizeChannelInput(rawValue) {
  if (typeof rawValue !== "string") {
    invalidInput("Enter a YouTube handle, supported channel URL, or channel ID.");
  }

  const value = rawValue.trim();
  if (!value || value.length > MAX_CHANNEL_INPUT_LENGTH || /[\u0000-\u001f\u007f]/.test(value)) {
    invalidInput("Enter a YouTube handle, supported channel URL, or channel ID.");
  }

  if (CHANNEL_ID_PATTERN.test(value)) {
    return { kind: "id", value, canonical: value };
  }

  if (/^https?:\/\//i.test(value)) return normalizeYouTubeUrl(value);
  return normalizeHandle(value);
}

function approvalDateIsValid(rawDate, now) {
  if (!APPROVAL_DATE_PATTERN.test(rawDate || "")) return false;
  const parsed = new Date(`${rawDate}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime())
    && parsed.toISOString().slice(0, 10) === rawDate
    && parsed <= now;
}

export function launchGatesSatisfied(environment, now = new Date()) {
  const policyVersion = String(environment.YOUTUBE_ESTIMATOR_POLICY_VERSION || "").trim();
  return environment.ENABLE_YOUTUBE_PUBLIC_ESTIMATOR === "true"
    && typeof environment.YOUTUBE_DATA_API_KEY === "string"
    && environment.YOUTUBE_DATA_API_KEY.trim().length >= 20
    && approvalDateIsValid(environment.YOUTUBE_ESTIMATOR_APPROVAL_DATE, now)
    && POLICY_VERSION_PATTERN.test(policyVersion)
    && !PLACEHOLDER_POLICY_VERSIONS.has(policyVersion.toLowerCase());
}

export function productionActivationLocked(environment) {
  return environment.VERCEL_ENV === "production";
}

function fixedApiUrl(resource, parameters) {
  if (!new Set(["channels", "playlistItems", "videos"]).has(resource)) {
    throw new Error("Unsupported YouTube resource");
  }
  const url = new URL(`${YOUTUBE_API_PATH}${resource}`, YOUTUBE_API_ORIGIN);
  Object.entries(parameters).forEach(([key, value]) => url.searchParams.set(key, value));
  return url;
}

async function fetchApiJson(resource, parameters, options) {
  const url = fixedApiUrl(resource, parameters);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs || API_TIMEOUT_MS);
  try {
    const response = await options.fetchImpl(url, {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-goog-api-key": options.apiKey,
      },
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new EstimatorError(
        "UPSTREAM_UNAVAILABLE",
        502,
        "YouTube public data is temporarily unavailable. Try again later.",
      );
    }
    return await response.json();
  } catch (error) {
    if (error instanceof EstimatorError) throw error;
    throw new EstimatorError(
      "UPSTREAM_UNAVAILABLE",
      502,
      "YouTube public data is temporarily unavailable. Try again later.",
    );
  } finally {
    clearTimeout(timeout);
  }
}

function requireChannelShape(channel) {
  const uploadsPlaylistId = channel?.contentDetails?.relatedPlaylists?.uploads;
  if (!channel?.id || !channel?.snippet?.title || !uploadsPlaylistId || !channel?.statistics) {
    throw new EstimatorError(
      "UPSTREAM_UNAVAILABLE",
      502,
      "YouTube public data is temporarily unavailable. Try again later.",
    );
  }
  return uploadsPlaylistId;
}

function selectThumbnail(thumbnails) {
  return thumbnails?.medium?.url || thumbnails?.default?.url || null;
}

function normalizedPublicCount(value) {
  return typeof value === "string" && /^\d+$/.test(value) ? value : null;
}

function requirePublicCount(value) {
  const normalized = normalizedPublicCount(value);
  if (normalized === null) {
    throw new EstimatorError(
      "UPSTREAM_UNAVAILABLE",
      502,
      "YouTube public data is temporarily unavailable. Try again later.",
    );
  }
  return normalized;
}

export async function retrieveChannelPublicData({ lookup, apiKey, fetchImpl = fetch, now = () => new Date() }) {
  const channelFilter = lookup.kind === "id"
    ? { id: lookup.value }
    : lookup.kind === "handle"
      ? { forHandle: lookup.value }
      : { forUsername: lookup.value };
  const channelResponse = await fetchApiJson("channels", {
    part: "snippet,statistics,contentDetails",
    fields: "items(id,snippet(title,thumbnails(default(url),medium(url))),statistics(viewCount,subscriberCount,hiddenSubscriberCount,videoCount),contentDetails(relatedPlaylists(uploads)))",
    ...channelFilter,
  }, { apiKey, fetchImpl });
  const channel = channelResponse?.items?.[0];
  if (!channel) {
    throw new EstimatorError("CHANNEL_NOT_FOUND", 404, "No channel matched that exact handle, URL, or ID.");
  }
  const uploadsPlaylistId = requireChannelShape(channel);

  const playlistResponse = await fetchApiJson("playlistItems", {
    part: "contentDetails",
    playlistId: uploadsPlaylistId,
    maxResults: String(MAX_RECENT_UPLOADS),
    fields: "items(contentDetails(videoId,videoPublishedAt))",
  }, { apiKey, fetchImpl });
  const uploadItems = Array.isArray(playlistResponse?.items) ? playlistResponse.items : [];
  const publicationByVideoId = new Map(uploadItems
    .filter((item) => item?.contentDetails?.videoId && item?.contentDetails?.videoPublishedAt)
    .map((item) => [item.contentDetails.videoId, item.contentDetails.videoPublishedAt]));
  const videoIds = [...publicationByVideoId.keys()];

  let videoItems = [];
  if (videoIds.length > 0) {
    const videoResponse = await fetchApiJson("videos", {
      part: "statistics",
      id: videoIds.join(","),
      fields: "items(id,statistics(viewCount))",
    }, { apiKey, fetchImpl });
    videoItems = Array.isArray(videoResponse?.items) ? videoResponse.items : [];
  }

  const recentUploads = videoItems.flatMap((video) => {
    const publishedAt = publicationByVideoId.get(video?.id);
    const viewCount = normalizedPublicCount(video?.statistics?.viewCount);
    return publishedAt && viewCount !== null
      ? [{ videoId: video.id, publishedAt, viewCount }]
      : [];
  });
  const unavailableRecentUploadCount = Math.max(0, uploadItems.length - recentUploads.length);
  const subscriberCount = channel.statistics.hiddenSubscriberCount
    ? null
    : requirePublicCount(channel.statistics.subscriberCount);

  return {
    schemaVersion: 1,
    retrievedAt: now().toISOString(),
    source: "youtube-data-api",
    publicData: {
      channelId: channel.id,
      channelName: channel.snippet.title,
      thumbnailUrl: selectThumbnail(channel.snippet.thumbnails),
      subscriberCount,
      subscriberCountHidden: Boolean(channel.statistics.hiddenSubscriberCount),
      channelViewCount: requirePublicCount(channel.statistics.viewCount),
      publicVideoCount: requirePublicCount(channel.statistics.videoCount),
      recentUploads,
    },
    coverage: {
      maximumRecentUploads: MAX_RECENT_UPLOADS,
      unavailableRecentUploadCount,
      completeRecentUploadCoverage: unavailableRecentUploadCount === 0,
      olderCatalogExcluded: true,
    },
  };
}

function nonNegativeNumber(value, label) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) {
    throw new EstimatorError("INVALID_ASSUMPTION", 400, `${label} must be zero or greater.`);
  }
  return number;
}

function orderedRange(range, label) {
  const normalized = {
    low: nonNegativeNumber(range?.low, `${label} low RPM`),
    middle: nonNegativeNumber(range?.middle, `${label} middle RPM`),
    high: nonNegativeNumber(range?.high, `${label} high RPM`),
  };
  if (normalized.low > normalized.middle || normalized.middle > normalized.high) {
    throw new EstimatorError("INVALID_ASSUMPTION", 400, `${label} RPM values must run from low to middle to high.`);
  }
  return normalized;
}

export function buildInstantActivity(recentUploads, lookbackDays, retrievedAt) {
  if (!ALLOWED_LOOKBACK_DAYS.has(Number(lookbackDays))) {
    throw new EstimatorError("INVALID_ASSUMPTION", 400, "Choose a 30, 60, or 90 day lookback.");
  }
  const end = new Date(retrievedAt);
  if (Number.isNaN(end.getTime())) {
    throw new EstimatorError("INVALID_PUBLIC_DATA", 400, "The public-data retrieval date is invalid.");
  }
  const windowStart = new Date(end.getTime() - Number(lookbackDays) * 86_400_000);
  const included = (recentUploads || []).filter((upload) => {
    const published = new Date(upload.publishedAt);
    return !Number.isNaN(published.getTime()) && published >= windowStart && published <= end;
  });
  const visibleViews = included.reduce((sum, upload) => sum + nonNegativeNumber(upload.viewCount, "Public video views"), 0);
  const daily = visibleViews / Number(lookbackDays);
  return {
    method: "recent-public-uploads",
    lookbackDays: Number(lookbackDays),
    windowStart: windowStart.toISOString(),
    windowEnd: end.toISOString(),
    qualifyingUploads: included.length,
    currentlyVisibleViewsOnQualifyingUploads: visibleViews,
    estimatedDailyViewActivity: daily,
    estimatedMonthlyViewActivity: daily * 30,
    olderCatalogExcluded: true,
    description: "Instant estimate based on currently visible views for recently published videos.",
  };
}

function weightedRange(longForm, shorts, longFormPercent) {
  const longShare = longFormPercent / 100;
  const shortsShare = 1 - longShare;
  return {
    low: longForm.low * longShare + shorts.low * shortsShare,
    middle: longForm.middle * longShare + shorts.middle * shortsShare,
    high: longForm.high * longShare + shorts.high * shortsShare,
  };
}

export function estimateRevenueFromVisibleAssumptions(monthlyViewActivity, assumptions) {
  const modeledViews = nonNegativeNumber(monthlyViewActivity, "Monthly view activity");
  if (assumptions?.monetization !== "hypothetical-monetized-views") {
    return { available: false, reason: "No monetization scenario was selected." };
  }

  const longForm = orderedRange(assumptions.longForm, "Long-form");
  const shorts = orderedRange(assumptions.shorts, "Shorts");
  const unknown = orderedRange(assumptions.unknown, "Unknown mix");
  let applied;
  let split = null;
  if (assumptions.contentMix === "mostly-long-form") applied = longForm;
  else if (assumptions.contentMix === "mostly-shorts") applied = shorts;
  else if (assumptions.contentMix === "mixed") {
    const longFormPercent = nonNegativeNumber(assumptions.longFormPercent, "Long-form split");
    if (longFormPercent > 100) {
      throw new EstimatorError("INVALID_ASSUMPTION", 400, "The long-form split must be from 0 to 100 percent.");
    }
    applied = weightedRange(longForm, shorts, longFormPercent);
    split = { longFormPercent, shortsPercent: 100 - longFormPercent };
  } else if (assumptions.contentMix === "unknown") {
    const knownRangesEntered = longForm.high > 0 || shorts.high > 0;
    if (knownRangesEntered
      && (unknown.low > Math.min(longForm.low, shorts.low)
        || unknown.high < Math.max(longForm.high, shorts.high))) {
      throw new EstimatorError(
        "INVALID_ASSUMPTION",
        400,
        "Unknown mix must use the broadest low-to-high range displayed.",
      );
    }
    applied = unknown;
  } else {
    throw new EstimatorError("INVALID_ASSUMPTION", 400, "Choose a content mix.");
  }

  const monthly = {
    low: modeledViews / 1_000 * applied.low,
    middle: modeledViews / 1_000 * applied.middle,
    high: modeledViews / 1_000 * applied.high,
  };
  return {
    available: true,
    appliedRpm: applied,
    split,
    monthly,
    annual: {
      low: monthly.low * 12,
      middle: monthly.middle * 12,
      high: monthly.high * 12,
    },
  };
}

export function trackedWindowAvailability(snapshots, requestedDays = 30) {
  const valid = (snapshots || [])
    .filter((snapshot) => snapshot?.retrievalStatus === "success" && APPROVAL_DATE_PATTERN.test(snapshot.snapshotDate || ""))
    .map((snapshot) => ({ ...snapshot, time: new Date(`${snapshot.snapshotDate}T00:00:00.000Z`).getTime() }))
    .filter((snapshot) => !Number.isNaN(snapshot.time))
    .sort((left, right) => left.time - right.time);
  const uniqueDates = [...new Map(valid.map((snapshot) => [snapshot.snapshotDate, snapshot])).values()];
  const latest = uniqueDates.at(-1);
  const toleranceDays = 2;
  const threshold = latest ? latest.time - requestedDays * 86_400_000 : 0;
  const base = latest
    ? [...uniqueDates].reverse().find((snapshot) => (
      snapshot.time <= threshold
      && snapshot.time >= threshold - toleranceDays * 86_400_000
    ))
    : null;
  const windowSnapshots = latest
    ? uniqueDates.filter((snapshot) => snapshot.time >= threshold - toleranceDays * 86_400_000)
    : [];
  const spanDays = base && latest
    ? Math.floor((latest.time - base.time) / 86_400_000)
    : 0;
  const minimumSnapshots = requestedDays === 30 ? 28 : requestedDays;
  return {
    available: Boolean(base)
      && windowSnapshots.length >= minimumSnapshots
      && spanDays >= requestedDays
      && spanDays <= requestedDays + toleranceDays,
    validSnapshots: windowSnapshots.length,
    spanDays,
    missingSnapshotWarning: windowSnapshots.length < spanDays + 1,
  };
}

function normalizedTrackedSnapshots(snapshots) {
  return [...new Map((snapshots || [])
    .filter((snapshot) => snapshot?.retrievalStatus === "success" && APPROVAL_DATE_PATTERN.test(snapshot.snapshotDate || ""))
    .map((snapshot) => {
      const time = new Date(`${snapshot.snapshotDate}T00:00:00.000Z`).getTime();
      let views;
      try {
        views = BigInt(snapshot.publicTotalViews);
      } catch {
        return null;
      }
      return Number.isNaN(time) || views < 0n ? null : [snapshot.snapshotDate, { ...snapshot, time, views }];
    })
    .filter(Boolean)).values()]
    .sort((left, right) => left.time - right.time);
}

export function calculateTrackedChanges(snapshots) {
  const valid = normalizedTrackedSnapshots(snapshots);
  if (valid.length === 0) {
    return {
      trackedDays: 0,
      lastSuccessfulRefresh: null,
      missingSnapshotWarning: false,
      windows: {},
    };
  }
  const latest = valid.at(-1);
  const spanDays = Math.floor((latest.time - valid[0].time) / 86_400_000);
  const missingSnapshotWarning = valid.length < spanDays + 1;
  const windows = {};
  for (const days of [7, 30, 90]) {
    const threshold = latest.time - days * 86_400_000;
    const base = [...valid].reverse().find((snapshot) => snapshot.time <= threshold);
    const actualSpanDays = base ? Math.floor((latest.time - base.time) / 86_400_000) : 0;
    const boundedEndpoint = actualSpanDays >= days && actualSpanDays <= days + 2;
    const availability = days === 30 ? trackedWindowAvailability(valid, 30).available : boundedEndpoint;
    if (!base || !boundedEndpoint || !availability) {
      windows[days] = { available: false, reason: "INSUFFICIENT_SNAPSHOTS" };
      continue;
    }
    const change = latest.views - base.views;
    windows[days] = change < 0n
      ? { available: false, reason: "NEGATIVE_COUNT_ANOMALY", actualSpanDays }
      : { available: true, change: change.toString(), actualSpanDays, baseDate: base.snapshotDate, endDate: latest.snapshotDate };
  }
  return {
    trackedDays: valid.length,
    lastSuccessfulRefresh: latest.snapshotDate,
    missingSnapshotWarning,
    windows,
  };
}

export function createMemoryRuntimeGuards({ now = () => Date.now(), cacheTtlMs = 900_000, requestLimit = 8, quotaCeiling = 3_000 } = {}) {
  const cache = new Map();
  const pending = new Map();
  const requests = new Map();
  let quotaDate = "";
  let quotaUsed = 0;
  const dayKey = () => new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(now()));

  return {
    productionReady: false,
    checkRateLimit(clientKey) {
      const cutoff = now() - 600_000;
      const recent = (requests.get(clientKey) || []).filter((time) => time > cutoff);
      if (recent.length >= requestLimit) return false;
      recent.push(now());
      requests.set(clientKey, recent);
      return true;
    },
    getCached(key) {
      const item = cache.get(key);
      if (!item || item.expiresAt <= now()) {
        cache.delete(key);
        return null;
      }
      return item.value;
    },
    setCached(key, value) {
      cache.set(key, { value, expiresAt: now() + cacheTtlMs });
    },
    reserveQuota(units) {
      const currentDate = dayKey();
      if (quotaDate !== currentDate) {
        quotaDate = currentDate;
        quotaUsed = 0;
      }
      if (quotaUsed + units > quotaCeiling) return false;
      quotaUsed += units;
      return true;
    },
    coalesce(key, operation) {
      if (pending.has(key)) return pending.get(key);
      const promise = Promise.resolve().then(operation).finally(() => pending.delete(key));
      pending.set(key, promise);
      return promise;
    },
  };
}

export function createEstimatorService({ apiKey, fetchImpl, runtimeGuards, now = () => new Date() }) {
  return {
    async lookup({ channel, clientKey }) {
      const normalized = normalizeChannelInput(channel);
      if (!runtimeGuards?.productionReady) {
        throw new EstimatorError("RUNTIME_GUARDS_UNAVAILABLE", 503, "The estimator is not available yet.");
      }
      if (!runtimeGuards.checkRateLimit(clientKey)) {
        throw new EstimatorError("RATE_LIMITED", 429, "Too many requests. Try again later.");
      }
      const cacheKey = `${normalized.kind}:${normalized.value}`;
      const cached = await runtimeGuards.getCached(cacheKey);
      if (cached) return { ...cached, cacheStatus: "cached" };
      return runtimeGuards.coalesce(cacheKey, async () => {
        const duplicateCached = await runtimeGuards.getCached(cacheKey);
        if (duplicateCached) return { ...duplicateCached, cacheStatus: "cached" };
        if (!await runtimeGuards.reserveQuota(3)) {
          throw new EstimatorError("QUOTA_CEILING", 503, "The daily lookup limit has been reached. Try again tomorrow.");
        }
        const fresh = await retrieveChannelPublicData({ lookup: normalized, apiKey, fetchImpl, now });
        await runtimeGuards.setCached(cacheKey, fresh);
        return { ...fresh, cacheStatus: "fresh" };
      });
    },
  };
}

export const estimatorConstants = Object.freeze({
  maxChannelInputLength: MAX_CHANNEL_INPUT_LENGTH,
  maxRecentUploads: MAX_RECENT_UPLOADS,
  apiTimeoutMs: API_TIMEOUT_MS,
});
