const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 20;

function getRequestIp(request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  return request.headers.get("x-real-ip") || "unknown";
}

const rateLimitState = new Map();

function getRateLimitResponse(request) {
  const ip = getRequestIp(request);
  const now = Date.now();
  const current = rateLimitState.get(ip) || { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };

  if (now > current.resetAt) {
    current.count = 0;
    current.resetAt = now + RATE_LIMIT_WINDOW_MS;
  }

  if (current.count >= RATE_LIMIT_MAX_REQUESTS) {
    return {
      blocked: true,
      retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }

  current.count += 1;
  rateLimitState.set(ip, current);

  return { blocked: false, retryAfter: 0 };
}

function getPilotRuntimeStatus(env = process.env) {
  const issues = [];

  if (!env.PILOT_ACCESS_CODE || !String(env.PILOT_ACCESS_CODE).trim()) {
    issues.push("PILOT_ACCESS_CODE is missing");
  }

  if (!env.OPENAI_API_KEY || !String(env.OPENAI_API_KEY).trim()) {
    issues.push("OPENAI_API_KEY is missing");
  }

  return {
    ready: issues.length === 0,
    issues,
  };
}

function parseDraftRequest(rawBody) {
  if (!rawBody || typeof rawBody !== "string") {
    throw Object.assign(new Error("Request body must be valid JSON."), { status: 400 });
  }

  let parsed;
  try {
    parsed = JSON.parse(rawBody);
  } catch {
    throw Object.assign(new Error("Request body must be valid JSON."), { status: 400 });
  }

  if (!parsed || typeof parsed !== "object") {
    throw Object.assign(new Error("Request body must be valid JSON."), { status: 400 });
  }

  const { accessCode, message, supportContext = "" } = parsed;

  if (typeof accessCode !== "string" || !accessCode.trim()) {
    throw Object.assign(new Error("Enter a valid pilot access code."), { status: 401 });
  }

  if (typeof message !== "string" || !message.trim()) {
    throw Object.assign(new Error("A customer message is required."), { status: 400 });
  }

  if (message.length > 5000 || typeof supportContext !== "string" || supportContext.length > 8000) {
    throw Object.assign(new Error("The message or support details exceed the allowed length."), { status: 413 });
  }

  return { accessCode, message, supportContext };
}

module.exports = {
  getPilotRuntimeStatus,
  getRateLimitResponse,
  parseDraftRequest,
};
