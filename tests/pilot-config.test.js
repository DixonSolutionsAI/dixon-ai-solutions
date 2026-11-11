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

  assert.throws(() => parseDraftRequest(JSON.stringify({ message: "hello" })), /Enter a valid pilot access code/i);

  const oversizedMessage = "x".repeat(5001);
  assert.throws(
    () => parseDraftRequest(JSON.stringify({ accessCode: "abc123", message: oversizedMessage })),
    /exceed the allowed length/i
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
