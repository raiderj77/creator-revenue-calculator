import crypto from "node:crypto";

import {
  EstimatorError,
  createEstimatorService,
  estimatorConstants,
  launchGatesSatisfied,
  productionActivationLocked,
} from "./_youtube-estimator-core.js";

const ALLOWED_ORIGINS = new Set([
  "https://creatorrevenuecalculator.com",
  "https://www.creatorrevenuecalculator.com",
]);

function sendJson(response, status, body) {
  response.statusCode = status;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("Cache-Control", "no-store");
  response.setHeader("X-Robots-Tag", "noindex, nofollow");
  response.end(JSON.stringify(body));
}

function readBody(request) {
  if (request.body && typeof request.body === "object") return request.body;
  if (typeof request.body === "string") {
    try {
      return JSON.parse(request.body);
    } catch {
      throw new EstimatorError("INVALID_REQUEST", 400, "The request could not be read.");
    }
  }
  throw new EstimatorError("INVALID_REQUEST", 400, "The request could not be read.");
}

function bodyExceedsLimit(rawBody) {
  try {
    const serialized = typeof rawBody === "string" ? rawBody : JSON.stringify(rawBody);
    return Buffer.byteLength(serialized || "", "utf8") > 2_048;
  } catch {
    return true;
  }
}

function clientKey(request) {
  const forwarded = String(request.headers["x-forwarded-for"] || "").split(",", 1)[0].trim();
  const address = forwarded || request.socket?.remoteAddress || "unknown";
  return crypto.createHash("sha256").update(address).digest("hex");
}

function requestOriginAllowed(request, environment) {
  const origin = String(request.headers.origin || "");
  if (ALLOWED_ORIGINS.has(origin)) return true;
  return environment.VERCEL_ENV !== "production" && /^https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?$/.test(origin);
}

export function createHandler({
  environment = process.env,
  now = () => new Date(),
  service,
} = {}) {
  return async function youtubeChannelEstimator(request, response) {
    if (!launchGatesSatisfied(environment, now()) || productionActivationLocked(environment)) {
      sendJson(response, 404, { error: "NOT_AVAILABLE", message: "The estimator is not available." });
      return;
    }

    if (!service) {
      sendJson(response, 503, { error: "NOT_AVAILABLE", message: "The estimator is not available yet." });
      return;
    }

    try {
      if (request.method !== "POST") {
        throw new EstimatorError("METHOD_NOT_ALLOWED", 405, "Use POST for estimator requests.");
      }
      if (!requestOriginAllowed(request, environment)) {
        throw new EstimatorError("INVALID_ORIGIN", 403, "This request origin is not allowed.");
      }
      if (!String(request.headers["content-type"] || "").toLowerCase().startsWith("application/json")) {
        throw new EstimatorError("INVALID_REQUEST", 415, "Send a JSON request.");
      }
      if (Number(request.headers["content-length"] || 0) > 2_048) {
        throw new EstimatorError("INVALID_REQUEST", 413, "The request is too large.");
      }
      if (request.headers["x-crc-estimator-request"] !== "browser-v1") {
        throw new EstimatorError("INVALID_REQUEST", 400, "The request could not be accepted.");
      }
      if (bodyExceedsLimit(request.body)) {
        throw new EstimatorError("INVALID_REQUEST", 413, "The request is too large.");
      }
      const body = readBody(request);
      if (body.website || body.privacyAccepted !== true) {
        throw new EstimatorError(
          "PRIVACY_AGREEMENT_REQUIRED",
          400,
          "Agree to the API-client privacy notice before requesting public data.",
        );
      }
      if (typeof body.channel !== "string" || body.channel.length > estimatorConstants.maxChannelInputLength) {
        throw new EstimatorError("INVALID_CHANNEL", 400, "Enter a valid channel handle, URL, or ID.");
      }
      const result = await service.lookup({ channel: body.channel, clientKey: clientKey(request) });
      sendJson(response, 200, result);
    } catch (error) {
      const safe = error instanceof EstimatorError
        ? error
        : new EstimatorError("UNAVAILABLE", 503, "The estimator is temporarily unavailable.");
      sendJson(response, safe.status, { error: safe.code, message: safe.message });
    }
  };
}

// Deliberately no shared cache/rate-limit/quota adapter is connected. A later,
// owner-approved activation change must supply an atomic production service.
const productionService = null;

export default createHandler({
  service: productionService || (process.env.VERCEL_ENV === "development"
    ? createEstimatorService({
      apiKey: process.env.YOUTUBE_DATA_API_KEY,
      fetchImpl: fetch,
      runtimeGuards: null,
    })
    : null),
});
