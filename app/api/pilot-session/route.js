const { NextResponse } = require("next/server");
const { getPilotRuntimeStatus, getRateLimitResponse } = require("../../../lib/pilot-config");
const {
  PILOT_SESSION_COOKIE,
  PILOT_SESSION_MAX_AGE,
  codesMatch,
  createSessionToken,
  isValidSession,
  readSessionCookie,
} = require("../../../lib/pilot-session");

const cookieOptions = {
  httpOnly: true,
  sameSite: "strict",
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

async function GET(request) {
  return NextResponse.json({ unlocked: isValidSession(readSessionCookie(request)) });
}

async function POST(request) {
  const rateLimit = getRateLimitResponse(request);
  if (rateLimit.blocked) {
    return NextResponse.json(
      { error: "Too many attempts. Please try again later." },
      { status: 429, headers: { "Retry-After": String(rateLimit.retryAfter) } }
    );
  }
  if (!getPilotRuntimeStatus().ready) {
    return NextResponse.json({ error: "The private pilot is not configured yet." }, { status: 503 });
  }

  let accessCode;
  try {
    ({ accessCode } = await request.json());
  } catch {
    return NextResponse.json({ error: "Enter the administrator pilot code." }, { status: 400 });
  }
  if (typeof accessCode !== "string" || !accessCode.trim() || accessCode.length > 256) {
    return NextResponse.json({ error: "Enter the administrator pilot code." }, { status: 400 });
  }
  if (!codesMatch(accessCode, process.env.PILOT_ACCESS_CODE)) {
    return NextResponse.json({ error: "That pilot access code is not valid." }, { status: 401 });
  }

  const response = NextResponse.json({ unlocked: true });
  response.cookies.set(PILOT_SESSION_COOKIE, createSessionToken(), { ...cookieOptions, maxAge: PILOT_SESSION_MAX_AGE });
  return response;
}

async function DELETE() {
  const response = NextResponse.json({ unlocked: false });
  response.cookies.set(PILOT_SESSION_COOKIE, "", { ...cookieOptions, maxAge: 0 });
  return response;
}

module.exports = { GET, POST, DELETE };
