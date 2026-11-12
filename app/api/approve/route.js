import { NextResponse } from "next/server";
import { approvePendingDraft, isReviewerAuthorized } from "../../../lib/approval-queue.js";

export const runtime = "nodejs";
const MAX_BODY_BYTES = 12_000;

export async function POST(request) {
  if (!isReviewerAuthorized(request)) {
    return NextResponse.json({ error: "Reviewer authorization required." }, { status: 401 });
  }

  try {
    const rawBody = await request.text();
    if (Buffer.byteLength(rawBody, "utf8") > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "The request is too large." }, { status: 413 });
    }

    let body;
    try {
      body = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
    }

    const pendingId = typeof body.pendingId === "string" ? body.pendingId : "";
    const approvedReply = typeof body.approvedReply === "string" ? body.approvedReply.trim() : "";
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(pendingId)) {
      return NextResponse.json({ error: "A valid pending id is required." }, { status: 400 });
    }
    if (!approvedReply || approvedReply.length > 8000) {
      return NextResponse.json({ error: "An approved reply of at most 8,000 characters is required." }, { status: 400 });
    }

    const rows = await approvePendingDraft({ pendingId, approvedReply });
    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ error: "This draft is no longer pending." }, { status: 409 });
    }
    return NextResponse.json({ status: "approved", pendingId: rows[0].pending_id });
  } catch {
    return NextResponse.json({ error: "The draft could not be approved. Try again later." }, { status: 503 });
  }
}
