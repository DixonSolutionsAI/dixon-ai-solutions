const test = require("node:test");
const assert = require("node:assert/strict");
const { JWT } = require("google-auth-library");
const { isConfigured, validateDocument } = require("../lib/company-documents");

test("document configuration and content are validated", () => {
  assert.equal(isConfigured({}), false);
  assert.throws(() => isConfigured({ GOOGLE_SERVICE_ACCOUNT_EMAIL: "test@example.com" }), /not fully configured/);
  assert.throws(() => validateDocument(" "), /non-empty/);
  assert.throws(() => validateDocument("x".repeat(16001)), /at most/);
  assert.doesNotThrow(() => validateDocument("é".repeat(8000)));
  assert.throws(() => validateDocument("é".repeat(8001)), /at most/);
});

test("document actions require the right secret and drafts use current Drive files", async (t) => {
  const keys = {
    PILOT_ACCESS_CODE: "pilot-test",
    OPENAI_API_KEY: "test-key",
    COMPANY_DOCUMENT_OWNER_PASSWORD: "owner-test",
    GOOGLE_SERVICE_ACCOUNT_EMAIL: "test@example.com",
    GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY: "test-key",
    GOOGLE_DRIVE_POLICY_FILE_ID: "policy-id",
    GOOGLE_DRIVE_GUIDELINES_FILE_ID: "guidelines-id",
  };
  const oldEnv = Object.fromEntries(Object.keys(keys).map((key) => [key, process.env[key]]));
  Object.assign(process.env, keys);
  const oldFetch = global.fetch;
  const oldHeaders = JWT.prototype.getRequestHeaders;
  const openaiPath = require.resolve("openai");
  require("openai");
  const originalOpenAI = require.cache[openaiPath].exports;
  let prompt;
  require.cache[openaiPath].exports = class {
    constructor() {
      this.chat = { completions: { create: async (request) => {
        prompt = request;
        return { choices: [{ message: { content: JSON.stringify({ reply: "Draft", reviewNote: "Review" }) } }] };
      } } };
    }
  };
  JWT.prototype.getRequestHeaders = async () => ({ Authorization: "Bearer test" });
  const files = { "policy-id": "Old policy", "guidelines-id": "Be clear" };
  let failDrive = false;
  global.fetch = async (url, options) => {
    if (failDrive) return new Response("", { status: 500 });
    const parsed = new URL(url);
    const id = parsed.pathname.split("/").pop();
    assert.ok(Object.hasOwn(files, id));
    if (options.method === "PATCH") {
      files[id] = options.body;
      return Response.json({ id });
    }
    if (parsed.searchParams.get("alt") === "media") return new Response(files[id]);
    return Response.json({ mimeType: "text/plain", trashed: false });
  };
  t.after(() => {
    global.fetch = oldFetch;
    JWT.prototype.getRequestHeaders = oldHeaders;
    require.cache[openaiPath].exports = originalOpenAI;
    for (const [key, value] of Object.entries(oldEnv)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  });

  const documents = require("../app/api/company-documents/route");
  const drafts = require("../app/api/reply-draft/route");
  const request = (body) => new Request("http://localhost/api", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": "192.0.2.83" },
    body: JSON.stringify(body),
  });

  let response = await documents.POST(request({ kind: "policy", operation: "upload", ownerPassword: "pilot-test", content: "New policy" }));
  assert.equal(response.status, 401);
  assert.equal(files["policy-id"], "Old policy");

  response = await documents.POST(request({ kind: "policy", operation: "upload", ownerPassword: "owner-test", content: "New policy" }));
  assert.equal(response.status, 200);
  assert.equal(files["policy-id"], "New policy");
  assert.equal(files["guidelines-id"], "Be clear");

  response = await documents.POST(request({ kind: "guidelines", operation: "upload", ownerPassword: "owner-test", content: "x".repeat(16001) }));
  assert.equal(response.status, 400);
  assert.equal(files["guidelines-id"], "Be clear");
  response = await documents.POST(request({ kind: "guidelines", operation: "upload", ownerPassword: "owner-test", content: "Be helpful" }));
  assert.equal(response.status, 200);

  response = await documents.POST(request({ kind: "policy", operation: "download", accessCode: "wrong" }));
  assert.equal(response.status, 401);
  response = await documents.POST(request({ kind: "policy", operation: "download", accessCode: "pilot-test" }));
  assert.deepEqual(await response.json(), { content: "New policy" });
  assert.equal(response.headers.get("cache-control"), "no-store");

  response = await drafts.POST(request({ accessCode: "pilot-test", message: "Help" }));
  assert.equal(response.status, 200);
  const context = JSON.parse(prompt.messages[1].content);
  assert.equal(context.companyPolicy, "New policy");
  assert.equal(context.companyGuidelines, "Be helpful");

  failDrive = true;
  response = await drafts.POST(request({ accessCode: "pilot-test", message: "Help" }));
  assert.equal(response.status, 503);
  assert.match((await response.json()).error, /Unable to load company documents/);

  for (const key of ["GOOGLE_SERVICE_ACCOUNT_EMAIL", "GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY", "GOOGLE_DRIVE_POLICY_FILE_ID", "GOOGLE_DRIVE_GUIDELINES_FILE_ID"]) {
    delete process.env[key];
  }
  response = await drafts.POST(request({ accessCode: "pilot-test", message: "Help" }));
  assert.equal(response.status, 200);
  assert.match((await response.json()).documentNotice, /not configured/);
});
