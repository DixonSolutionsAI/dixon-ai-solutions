import { NextResponse } from "next/server";
import { isReviewerAuthorized, listPendingDrafts } from "../../../lib/approval-queue.js";

export const runtime = "nodejs";

export async function GET(request) {
  if (!isReviewerAuthorized(request)) {
    return NextResponse.json({ error: "Reviewer authorization required." }, { status: 401 });
  }

  try {
    return NextResponse.json({ drafts: await listPendingDrafts() });
  } catch {
    return NextResponse.json({ error: "The review queue is temporarily unavailable." }, { status: 503 });
  }
}
