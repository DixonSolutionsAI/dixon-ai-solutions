const test = require("node:test");
const assert = require("node:assert/strict");
const { parseDraftRequest } = require("../lib/pilot-config");

test("draft requests validate browser document text by byte size", () => {
  const base = { accessCode: "pilot", message: "Help" };
  const parse = (extra) => parseDraftRequest(JSON.stringify({ ...base, ...extra }));
  assert.equal(parse({}).companyPolicy, "");
  assert.equal(parse({ companyPolicy: "é".repeat(8000) }).companyPolicy.length, 8000);
  assert.throws(() => parse({ companyPolicy: "é".repeat(8001) }), /16,000 bytes/);
  assert.throws(() => parse({ companyGuidelines: { text: "bad" } }), /company document/);
  assert.throws(() => parse({ companyPolicy: "bad\0text" }), /company document/);
});

test("draft generation and actions send browser documents to the model", async (t) => {
  const previous = { PILOT_ACCESS_CODE: process.env.PILOT_ACCESS_CODE, OPENAI_API_KEY: process.env.OPENAI_API_KEY };
  process.env.PILOT_ACCESS_CODE = "pilot-test";
  process.env.OPENAI_API_KEY = "test-key";
  const openaiPath = require.resolve("openai");
  require("openai");
  const original = require.cache[openaiPath].exports;
  const prompts = [];
  require.cache[openaiPath].exports = class {
    constructor() {
      this.chat = { completions: { create: async (request) => {
        prompts.push(request);
        return { choices: [{ message: { content: JSON.stringify({ reply: "Draft", reviewNote: "Review" }) } }] };
      } } };
    }
  };
  t.after(() => {
    require.cache[openaiPath].exports = original;
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  });

  const { POST } = require("../app/api/reply-draft/route");
  const makeRequest = (body) => new Request("http://localhost/api", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": "192.0.2.83" },
    body: JSON.stringify(body),
  });
  const body = { accessCode: "pilot-test", message: "Help", companyPolicy: "Returns within 30 days", companyGuidelines: "Be helpful" };
  assert.equal((await POST(makeRequest(body))).status, 200);
  assert.equal((await POST(makeRequest({ ...body, action: "apply_policy", currentDraft: "Draft" }))).status, 200);
  for (const prompt of prompts) {
    const data = JSON.parse(prompt.messages[1].content);
    assert.equal(data.companyPolicy, body.companyPolicy);
    assert.equal(data.companyGuidelines, body.companyGuidelines);
  }
  assert.equal((await POST(makeRequest({ ...body, companyPolicy: "x".repeat(16001) }))).status, 413);
  assert.equal(prompts.length, 2);
});
