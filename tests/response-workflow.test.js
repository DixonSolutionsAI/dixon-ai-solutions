const test = require("node:test");
const assert = require("node:assert/strict");
const { createMailtoUrl, readTemplates, saveTemplate, deleteTemplate } = require("../lib/response-workflow");

function memoryStorage() {
  const data = new Map();
  return {
    getItem: (key) => data.has(key) ? data.get(key) : null,
    setItem: (key, value) => data.set(key, value),
  };
}

test("email handoff encodes recipients, subject, body, signature and line breaks", () => {
  const url = createMailtoUrl({
    to: "one@example.com, two@example.com",
    cc: "copy@example.com",
    subject: "Question & answer",
    body: "Hello\nThanks",
    signature: "Support",
  });
  assert.equal(url, "mailto:one%40example.com,two%40example.com?cc=copy%40example.com&subject=Question%20%26%20answer&body=Hello%0D%0AThanks%0D%0A%0D%0ASupport");
  assert.throws(() => createMailtoUrl({ to: "", cc: "", subject: "", body: "Hi", signature: "" }), /recipient/);
  assert.throws(() => createMailtoUrl({ to: "ok@example.com", cc: "bad\nbcc@example.com", subject: "", body: "Hi", signature: "" }), /Cc/);
});

test("templates persist by response type and can be removed", () => {
  const storage = memoryStorage();
  const text = { id: "1", type: "text_message", label: "Delivery", body: "Thanks!" };
  const call = { id: "2", type: "call_prompts", label: "Follow-up", body: "Ask for details." };
  assert.deepEqual(readTemplates(storage), []);
  saveTemplate(storage, text);
  assert.deepEqual(saveTemplate(storage, call), [text, call]);
  assert.deepEqual(deleteTemplate(storage, "1"), [call]);
  assert.deepEqual(readTemplates(storage), [call]);
  assert.throws(() => saveTemplate(storage, { ...text, label: " " }), /template name/);
  assert.throws(() => saveTemplate(storage, { ...text, type: "email_structure" }), /template name/);
});

test("template storage errors do not silently discard existing templates", () => {
  const storage = memoryStorage();
  const template = { id: "1", type: "text_message", label: "Delivery", body: "Thanks!" };
  saveTemplate(storage, template);
  storage.setItem = () => { throw new Error("storage full"); };
  assert.throws(() => saveTemplate(storage, { ...template, id: "2" }), /storage full/);
  assert.deepEqual(readTemplates(storage), [template]);
  assert.throws(() => readTemplates({ getItem: () => "not json" }));
});
