const test = require("node:test");
const assert = require("node:assert/strict");
const { File } = require("node:buffer");

function makePdf(text) {
  const lines = text.match(/.{1,80}/g) || [""];
  const stream = `BT /F1 12 Tf 72 9000 Td ${lines.map((line) => `(${line}) Tj 0 -12 Td`).join(" ")} ET`;
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 10000] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}\nendstream`,
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  for (const [index, object] of objects.entries()) {
    offsets.push(Buffer.byteLength(pdf));
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  }
  const xref = Buffer.byteLength(pdf);
  pdf += `xref\n0 ${offsets.length}\n0000000000 65535 f \n`;
  for (const offset of offsets.slice(1)) pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  pdf += `trailer\n<< /Size ${offsets.length} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return pdf;
}

test("reads UTF-8 text and extracts PDF text", async () => {
  const { readDocument } = await import("../app/document-upload.mjs");
  assert.equal(await readDocument(new File(["Hello"], "POLICY.TXT")), "Hello");
  assert.match(await readDocument(new File([makePdf("Returns within 30 days")], "policy.PDF")), /Returns within 30 days/);
});

test("rejects unsupported, invalid, empty, and oversized documents", async () => {
  const { readDocument } = await import("../app/document-upload.mjs");
  await assert.rejects(readDocument(new File(["data"], "file.docx")), /txt or text-based .pdf/);
  await assert.rejects(readDocument(new File([new Uint8Array([0xff])], "file.txt")), /UTF-8/);
  await assert.rejects(readDocument(new File(["x".repeat(16001)], "file.txt")), /16,000 bytes/);
  await assert.rejects(readDocument(new File(["not a PDF"], "file.pdf")), /Unable to read this PDF/);
  await assert.rejects(readDocument(new File([makePdf("")], "file.pdf")), /readable text/);
  await assert.rejects(readDocument(new File([makePdf("x".repeat(16001))], "file.pdf")), /16,000 bytes/);
  await assert.rejects(readDocument(new File([new Uint8Array(10 * 1024 * 1024 + 1)], "file.pdf")), /10 MB/);
});
