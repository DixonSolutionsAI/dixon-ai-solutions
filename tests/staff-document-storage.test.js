const test = require("node:test");
const assert = require("node:assert/strict");
const { File } = require("node:buffer");

test("staff uploads allow multiple non-empty files and enforce the per-file size limit", async () => {
  const { saveStaffDocuments } = await import("../app/staff-document-storage.mjs");
  assert.deepEqual(await saveStaffDocuments("E1", []), []);
  assert.throws(() => saveStaffDocuments("E1", [new File([], "empty.pdf")]), /non-empty/);
  assert.throws(() => saveStaffDocuments("E1", [new File([new Uint8Array(10 * 1024 * 1024 + 1)], "large.pdf")]), /10 MB/);
  assert.throws(() => saveStaffDocuments("", [new File(["content"], "file.pdf")]), /Employee ID/);
});

test("staff document storage reports when IndexedDB is unavailable", async () => {
  const { saveStaffDocuments } = await import("../app/staff-document-storage.mjs");
  await assert.rejects(saveStaffDocuments("E1", [new File(["content"], "file.pdf")]), /unavailable/);
});
