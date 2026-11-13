const test = require("node:test");
const assert = require("node:assert/strict");

const { getPilotRuntimeStatus, getRateLimitResponse, parseDraftRequest } = require("../lib/pilot-config");

test("getPilotRuntimeStatus marks config as ready when env vars are set", () => {
  const result = getPilotRuntimeStatus({
    PILOT_ACCESS_CODE: "super-secret-code",
    OPENAI_API_KEY: "sk-test-key",
  });

  assert.equal(result.ready, true);
  assert.deepEqual(result.issues, []);
});

test("getPilotRuntimeStatus flags missing required env vars", () => {
  const result = getPilotRuntimeStatus({});

  assert.equal(result.ready, false);
  assert.deepEqual(result.issues, ["PILOT_ACCESS_CODE is missing", "OPENAI_API_KEY is missing"]);
});

test("parseDraftRequest validates required fields and lengths", () => {
  const valid = parseDraftRequest(JSON.stringify({
    accessCode: "abc123",
    message: "hello there",
    supportContext: "Some policy context",
  }));

  assert.equal(valid.message, "hello there");
  assert.equal(valid.supportContext, "Some policy context");

  assert.equal(parseDraftRequest(JSON.stringify({ message: "hello" })).message, "hello");

  const oversizedMessage = "x".repeat(5001);
  assert.throws(
    () => parseDraftRequest(JSON.stringify({ accessCode: "abc123", message: oversizedMessage })),
    /exceed the allowed length/i
  );
});

test("parseDraftRequest validates draft actions and requires a draft for transformations", () => {
  const actionRequest = parseDraftRequest(JSON.stringify({
    accessCode: "abc123",
    message: "hello",
    action: "more_direct",
    currentDraft: "Thanks for reaching out.",
  }));
  assert.equal(actionRequest.action, "more_direct");
  assert.equal(actionRequest.currentDraft, "Thanks for reaching out.");

  assert.throws(
    () => parseDraftRequest(JSON.stringify({ accessCode: "abc123", message: "hello", action: "send_reply" })),
    /Choose a valid draft action/i
  );
  assert.throws(
    () => parseDraftRequest(JSON.stringify({ accessCode: "abc123", message: "hello", action: "rewrite" })),
    /Generate a draft before applying an action/i
  );
});

test("getRateLimitResponse blocks after threshold is reached", () => {
  const request = {
    headers: {
      get(name) {
        if (name === "x-forwarded-for") return "203.0.113.10";
        return null;
      },
    },
  };

  for (let i = 0; i < 20; i += 1) {
    const result = getRateLimitResponse(request);
    if (i === 19) {
      assert.equal(result.blocked, false);
    }
  }

  const blocked = getRateLimitResponse(request);
  assert.equal(blocked.blocked, true);
});

test("getRateLimitResponse allows requests again after the rate-limit window expires", () => {
  const originalNow = Date.now;
  let now = 1_000_000;
  Date.now = () => now;

  const request = {
    headers: {
      get(name) {
        if (name === "x-forwarded-for") return "198.51.100.27";
        return null;
      },
    },
  };

  try {
    for (let i = 0; i < 20; i += 1) {
      assert.equal(getRateLimitResponse(request).blocked, false);
    }

    assert.equal(getRateLimitResponse(request).blocked, true);

    now += 60_001;
    assert.deepEqual(getRateLimitResponse(request), { blocked: false, retryAfter: 0 });
  } finally {
    Date.now = originalNow;
  }
});
