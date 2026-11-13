const { copyFileSync, mkdirSync } = require("node:fs");
const { join } = require("node:path");

const publicDir = join(__dirname, "..", "public");
mkdirSync(publicDir, { recursive: true });
copyFileSync(require.resolve("pdfjs-dist/legacy/build/pdf.worker.min.mjs"), join(publicDir, "pdf.worker.min.mjs"));
