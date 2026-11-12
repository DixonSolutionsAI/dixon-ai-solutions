const { NextResponse } = require("next/server");
const { getRateLimitResponse } = require("../../../lib/pilot-config");
const { isConfigured, matchesSecret, validateDocument, readDocument, writeDocument } = require("../../../lib/company-documents");

const MAX_BODY_BYTES = 100_000;

async function POST(request) {
  const rateLimit = getRateLimitResponse(request);
  if (rateLimit.blocked) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, {
      status: 429,
      headers: { "Retry-After": String(rateLimit.retryAfter) },
    });
  }

  try {
    if (Number(request.headers.get("content-length") || 0) > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "The request is too large." }, { status: 413 });
    }
    const raw = await request.text();
    if (Buffer.byteLength(raw, "utf8") > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "The request is too large." }, { status: 413 });
    }
    let body;
    try {
      body = JSON.parse(raw);
    } catch {
      return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
    }
    if (!body || !["policy", "guidelines"].includes(body.kind) || !["upload", "download"].includes(body.operation)) {
      return NextResponse.json({ error: "Invalid document request." }, { status: 400 });
    }
    if (!isConfigured()) {
      return NextResponse.json({ error: "Company document storage is not configured. Ask the owner to finish setup." }, { status: 503 });
    }

    if (body.operation === "upload") {
      const ownerPassword = process.env.COMPANY_DOCUMENT_OWNER_PASSWORD;
      if (!ownerPassword || ownerPassword === process.env.PILOT_ACCESS_CODE) {
        return NextResponse.json({ error: "A separate owner password must be configured." }, { status: 503 });
      }
      if (!matchesSecret(body.ownerPassword, ownerPassword)) {
        return NextResponse.json({ error: "Invalid owner password." }, { status: 401 });
      }
      try {
        validateDocument(body.content);
      } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
      await writeDocument(body.kind, body.content);
      return NextResponse.json({ message: `${body.kind === "policy" ? "Policy" : "Guidelines"} uploaded.` }, { headers: { "Cache-Control": "no-store" } });
    }

    if (!process.env.PILOT_ACCESS_CODE) {
      return NextResponse.json({ error: "The pilot access code is not configured." }, { status: 503 });
    }
    if (!matchesSecret(body.accessCode, process.env.PILOT_ACCESS_CODE)) {
      return NextResponse.json({ error: "Invalid pilot access code." }, { status: 401 });
    }
    const content = await readDocument(body.kind);
    return NextResponse.json({ content }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Company document request failed.", error instanceof Error ? error.message : "UnknownError");
    return NextResponse.json({ error: "Unable to access company documents. Ask the owner to check the storage configuration." }, { status: 502 });
  }
}

module.exports = { POST };
