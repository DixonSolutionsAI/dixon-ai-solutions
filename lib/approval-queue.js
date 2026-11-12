import crypto from "node:crypto";

const TABLE = "approval_queue";
const MEMORY_QUEUE = new Map();

function createPendingUuid() {
  return crypto.randomUUID();
}

function hasSupabaseConfig() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

function getConfig() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Approval storage is not configured.");
  }
  return { baseUrl: `${url.replace(/\/$/, "")}/rest/v1/${TABLE}`, key };
}

export function getBusinessId() {
  return process.env.BUSINESS_ID || "pilot-business";
}

async function supabaseRequest(path = "", options = {}) {
  const { baseUrl, key } = getConfig();
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    cache: "no-store",
  });

  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(`Approval storage request failed (${response.status}).`);
  }
  return data;
}

export async function createPendingDraft(draft) {
  if (!hasSupabaseConfig()) {
    const pendingId = createPendingUuid();
    const record = {
      pending_id: pendingId,
      business_id: getBusinessId(),
      location: draft.location,
      customer_message: draft.customerMessage,
      draft_reply: draft.reply,
      review_note: draft.reviewNote,
      status: "pending",
      approved_reply: null,
      created_at: new Date().toISOString(),
      approved_at: null,
      edited: false,
    };
    MEMORY_QUEUE.set(pendingId, record);
    return record;
  }

  const rows = await supabaseRequest("?select=id,pending_id,status,created_at", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      business_id: getBusinessId(),
      location: draft.location,
      customer_message: draft.customerMessage,
      draft_reply: draft.reply,
      review_note: draft.reviewNote,
      status: "pending",
      created_at: new Date().toISOString(),
      edited: false,
    }),
  });
  if (!Array.isArray(rows) || !rows[0]?.pending_id) {
    throw new Error("Approval storage did not return a pending id.");
  }
  return rows[0];
}

export async function getPublicStatus(pendingId) {
  if (!hasSupabaseConfig()) {
    return MEMORY_QUEUE.get(pendingId) || null;
  }

  const query = `?select=pending_id,status,approved_reply,review_note&pending_id=eq.${encodeURIComponent(pendingId)}&business_id=eq.${encodeURIComponent(getBusinessId())}&limit=1`;
  const rows = await supabaseRequest(query);
  return Array.isArray(rows) ? rows[0] || null : null;
}

export async function listPendingDrafts() {
  if (!hasSupabaseConfig()) {
    return Array.from(MEMORY_QUEUE.values())
      .filter((item) => item.business_id === getBusinessId() && item.status === "pending")
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  }

  const query = `?select=pending_id,location,customer_message,draft_reply,review_note,created_at&business_id=eq.${encodeURIComponent(getBusinessId())}&status=eq.pending&order=created_at.asc&limit=100`;
  return (await supabaseRequest(query)) || [];
}

export async function approvePendingDraft({ pendingId, approvedReply }) {
  if (!hasSupabaseConfig()) {
    const existing = MEMORY_QUEUE.get(pendingId);
    if (!existing || existing.business_id !== getBusinessId()) {
      return [];
    }
    const updated = {
      ...existing,
      status: "approved",
      approved_reply: approvedReply,
      approved_at: new Date().toISOString(),
      edited: true,
    };
    MEMORY_QUEUE.set(pendingId, updated);
    return [updated];
  }

  const query = `?pending_id=eq.${encodeURIComponent(pendingId)}&business_id=eq.${encodeURIComponent(getBusinessId())}&status=eq.pending`;
  return await supabaseRequest(query, {
    method: "PATCH",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      status: "approved",
      approved_reply: approvedReply,
      approved_at: new Date().toISOString(),
      edited: true,
    }),
  });
}

export function isReviewerAuthorized(request) {
  const expected = process.env.REVIEWER_ACCESS_CODE;
  const provided = request.headers.get("x-reviewer-code") || "";
  return Boolean(expected && provided && provided === expected);
}
