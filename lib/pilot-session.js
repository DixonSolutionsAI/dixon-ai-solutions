const crypto = require("node:crypto");

const PILOT_SESSION_COOKIE = "pilot_session";
const PILOT_SESSION_MAX_AGE = 12 * 60 * 60;

function hash(value) {
  return crypto.createHash("sha256").update(String(value)).digest();
}

function codesMatch(provided, expected) {
  if (typeof provided !== "string" || typeof expected !== "string" || !expected) return false;
  return crypto.timingSafeEqual(hash(provided), hash(expected));
}

function createSessionToken(env = process.env) {
  return crypto.createHmac("sha256", String(env.PILOT_ACCESS_CODE || "")).update("instantreply-pilot-session").digest("hex");
}

function isValidSession(token, env = process.env) {
  if (!env.PILOT_ACCESS_CODE || typeof token !== "string") return false;
  return codesMatch(token, createSessionToken(env));
}

function readSessionCookie(request) {
  const header = request.headers.get("cookie") || "";
  for (const part of header.split(";")) {
    const [name, ...value] = part.trim().split("=");
    if (name === PILOT_SESSION_COOKIE) return value.join("=");
  }
  return "";
}

module.exports = {
  PILOT_SESSION_COOKIE,
  PILOT_SESSION_MAX_AGE,
  codesMatch,
  createSessionToken,
  isValidSession,
  readSessionCookie,
};
