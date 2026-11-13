const test = require("node:test");
const assert = require("node:assert/strict");
const { File } = require("node:buffer");

test("project template uploads reject empty and oversized files", async () => {
  const { saveProjectTemplate } = await import("../app/project-template-storage.mjs");
  assert.throws(() => saveProjectTemplate(new File([], "empty.xlsx")), /non-empty/);
  assert.throws(() => saveProjectTemplate(new File([new Uint8Array(10 * 1024 * 1024 + 1)], "large.xlsx")), /10 MB/);
});

test("project template storage reports when IndexedDB is unavailable", async () => {
  const { listProjectTemplates } = await import("../app/project-template-storage.mjs");
  await assert.rejects(listProjectTemplates(), /unavailable/);
});
