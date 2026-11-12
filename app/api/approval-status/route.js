import { NextResponse } from "next/server";
import { getPublicStatus } from "../../../lib/approval-queue.js";

export const runtime = "nodejs";

export async function GET(request) {
  const pendingId = request.nextUrl.searchParams.get("pendingId") || "";
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(pendingId)) {
    return NextResponse.json({ error: "A valid pending id is required." }, { status: 400 });
  }

  try {
    const record = await getPublicStatus(pendingId);
    if (!record) return NextResponse.json({ error: "Approval request not found." }, { status: 404 });
    return NextResponse.json({
      status: record.status,
      approvedReply: record.status === "approved" ? record.approved_reply : null,
      reviewNote: record.status === "approved" ? record.review_note : null,
    });
  } catch {
    return NextResponse.json({ error: "Approval status is temporarily unavailable." }, { status: 503 });
  }
}
