const { JWT } = require("google-auth-library");
const { timingSafeEqual } = require("node:crypto");

const MAX_DOCUMENT_BYTES = 16_000;
const SETTINGS = ["GOOGLE_SERVICE_ACCOUNT_EMAIL", "GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY", "GOOGLE_DRIVE_POLICY_FILE_ID", "GOOGLE_DRIVE_GUIDELINES_FILE_ID"];

function isConfigured(env = process.env) {
  const present = SETTINGS.filter((name) => env[name]?.trim());
  if (present.length && present.length !== SETTINGS.length) {
    throw new Error("Company document storage is not fully configured.");
  }
  if (present.length === SETTINGS.length && env.GOOGLE_DRIVE_POLICY_FILE_ID === env.GOOGLE_DRIVE_GUIDELINES_FILE_ID) {
    throw new Error("Policy and guidelines must use different Google Drive files.");
  }
  return present.length === SETTINGS.length;
}

function matchesSecret(value, secret) {
  if (typeof value !== "string" || typeof secret !== "string" || !value || !secret || value.length > 256 || secret.length > 256) return false;
  const actual = Buffer.from(value);
  const expected = Buffer.from(secret);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

function validateDocument(content) {
  if (typeof content !== "string" || !content.trim() || content.includes("\0")) {
    throw new Error("Upload a non-empty UTF-8 text document.");
  }
  if (Buffer.byteLength(content, "utf8") > MAX_DOCUMENT_BYTES) {
    throw new Error(`Documents must be at most ${MAX_DOCUMENT_BYTES} bytes.`);
  }
}

function fileId(kind, env) {
  if (kind !== "policy" && kind !== "guidelines") throw new Error("Invalid document type.");
  const id = env[kind === "policy" ? "GOOGLE_DRIVE_POLICY_FILE_ID" : "GOOGLE_DRIVE_GUIDELINES_FILE_ID"];
  if (!id || !/^[\w-]+$/.test(id)) throw new Error("Invalid company document file ID.");
  return id;
}

async function driveRequest(url, options, env) {
  const client = new JWT({
    email: env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/drive"],
  });
  const headers = await client.getRequestHeaders();
  const response = await fetch(url, { ...options, headers: { ...headers, ...options.headers }, cache: "no-store" });
  if (!response.ok) throw new Error(`Google Drive request failed (${response.status}).`);
  return response;
}

async function readBounded(response) {
  if (!response.body) throw new Error("Google Drive returned an empty response.");
  const reader = response.body.getReader();
  const chunks = [];
  let length = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > MAX_DOCUMENT_BYTES) {
        await reader.cancel();
        throw new Error("Company document exceeds the allowed size.");
      }
      chunks.push(Buffer.from(value));
    }
  } finally {
    reader.releaseLock();
  }
  return new TextDecoder("utf-8", { fatal: true }).decode(Buffer.concat(chunks));
}

async function documentUrl(kind, env) {
  const id = fileId(kind, env);
  const url = `https://www.googleapis.com/drive/v3/files/${id}`;
  const metadataResponse = await driveRequest(`${url}?fields=mimeType,trashed&supportsAllDrives=true`, {}, env);
  const metadata = await metadataResponse.json();
  if (metadata.mimeType !== "text/plain" || metadata.trashed) {
    throw new Error("Company document must be an untrashed plain text file.");
  }
  return { id, url };
}

async function readDocument(kind, env = process.env) {
  const { url } = await documentUrl(kind, env);
  const response = await driveRequest(`${url}?alt=media&supportsAllDrives=true`, {}, env);
  return readBounded(response);
}

async function writeDocument(kind, content, env = process.env) {
  validateDocument(content);
  const { id } = await documentUrl(kind, env);
  await driveRequest(`https://www.googleapis.com/upload/drive/v3/files/${id}?uploadType=media&supportsAllDrives=true`, {
    method: "PATCH",
    headers: { "Content-Type": "text/plain; charset=utf-8" },
    body: content,
  }, env);
}

module.exports = { MAX_DOCUMENT_BYTES, isConfigured, matchesSecret, validateDocument, readDocument, writeDocument };
