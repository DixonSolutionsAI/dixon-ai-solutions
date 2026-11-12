const test = require("node:test");
const assert = require("node:assert/strict");

const { createMockDraft } = require("../lib/draft-mock");

test("mock draft clearly identifies itself as simulated and requires human review", () => {
  const draft = createMockDraft();

  assert.deepEqual(Object.keys(draft).sort(), ["confidence", "reply", "reviewNote"]);
  assert.match(draft.reply, /^\[SIMULATED MOCK — NOT AI-GENERATED\]/);
  assert.match(draft.reviewNote, /MOCK TEST ONLY/);
  assert.match(draft.reviewNote, /Verify all facts and policies/);
  assert.equal(draft.confidence, null);
});

test("mock draft is fixed and does not echo potentially sensitive user input", () => {
  const draft = createMockDraft();
  assert.doesNotMatch(draft.reply, /customer|order #12345/i);
});
