"use client";

import { useCallback, useEffect, useState } from "react";

const inputStyle = { width: "100%", boxSizing: "border-box", padding: "0.75rem", borderRadius: 8, border: "1px solid #475569", background: "#0f172a", color: "white" };
const panelStyle = { padding: "1rem", border: "1px solid #334155", borderRadius: 12, background: "#0f172a", marginBottom: "1rem" };

export default function ReviewerPage() {
  const [reviewerCode, setReviewerCode] = useState("");
  const [drafts, setDrafts] = useState([]);
  const [replies, setReplies] = useState({});
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  const loadQueue = useCallback(async () => {
    if (!reviewerCode) return;
    const response = await fetch("/api/review-queue", { headers: { "x-reviewer-code": reviewerCode }, cache: "no-store" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Could not load the queue.");
    setDrafts(data.drafts || []);
    setReplies((current) => {
      const next = { ...current };
      for (const draft of data.drafts || []) next[draft.pending_id] ??= draft.draft_reply;
      return next;
    });
  }, [reviewerCode]);

  useEffect(() => {
    if (!reviewerCode) return;
    let alive = true;
    const refresh = async () => {
      try { await loadQueue(); if (alive) setError(""); }
      catch (requestError) { if (alive) setError(requestError.message); }
    };
    refresh();
    const timer = setInterval(refresh, 5000);
    return () => { alive = false; clearInterval(timer); };
  }, [reviewerCode, loadQueue]);

  async function approve(pendingId) {
    setLoading(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-reviewer-code": reviewerCode },
        body: JSON.stringify({ pendingId, approvedReply: replies[pendingId] }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Approval failed.");
      setNotice("Approved. The consumer can now receive the verified reply.");
      await loadQueue();
    } catch (requestError) { setError(requestError.message); }
    finally { setLoading(false); }
  }

  function setCannedReply(pendingId, text) {
    setReplies((current) => ({ ...current, [pendingId]: text }));
  }

  return (
    <main style={{ minHeight: "100vh", padding: "32px 20px", background: "#020617", color: "#f8fafc", fontFamily: "Arial, sans-serif" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <h1>Branch review queue</h1>
        <p>Verify the facts and edit the response before approving. Confidence is an AI estimate, not a correctness guarantee.</p>
        <label style={{ display: "grid", gap: 8, maxWidth: 480, marginBottom: 24 }}>
          Reviewer access code
          <input type="password" autoComplete="current-password" value={reviewerCode} onChange={(event) => setReviewerCode(event.target.value)} style={inputStyle} />
        </label>
        {error ? <p role="alert" style={{ color: "#fecaca" }}>{error}</p> : null}
        {notice ? <p role="status" style={{ color: "#bbf7d0" }}>{notice}</p> : null}
        {!drafts.length && reviewerCode ? <p>No pending drafts.</p> : null}
        {drafts.map((draft) => (
          <article key={draft.pending_id} style={panelStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <h2 style={{ marginTop: 0 }}>{draft.location}</h2>
              <span aria-label={draft.confidence == null ? "No AI confidence score" : `AI confidence estimate ${draft.confidence} out of 100`} style={{ alignSelf: "start", padding: "0.35rem 0.6rem", borderRadius: 999, background: draft.confidence != null && draft.confidence < 60 ? "#7f1d1d" : "#1e3a8a", color: "#dbeafe", fontSize: "0.85rem" }}>
                {draft.confidence == null ? "Mock · no confidence score" : `AI confidence estimate: ${draft.confidence}/100`}
              </span>
            </div>
            <p><strong>Customer message</strong></p>
            <blockquote style={{ margin: "0 0 1rem", color: "#cbd5e1", whiteSpace: "pre-wrap" }}>{draft.customer_message}</blockquote>
            <p><strong>Agent review check:</strong> {draft.review_note}</p>
            <label style={{ display: "grid", gap: 8, fontWeight: 700 }}>
              Edit the draft before approval
              <textarea rows={6} maxLength={8000} value={replies[draft.pending_id] ?? draft.draft_reply} onChange={(event) => setReplies((current) => ({ ...current, [draft.pending_id]: event.target.value }))} onKeyDown={(event) => {
                if ((event.metaKey || event.ctrlKey) && event.key === "Enter") { event.preventDefault(); approve(draft.pending_id); }
              }} style={inputStyle} />
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, margin: "12px 0" }}>
              <button type="button" onClick={() => setCannedReply(draft.pending_id, "Please call your local branch so a specialist can assist you directly.")}>Ask them to call us</button>
              <button type="button" onClick={() => setCannedReply(draft.pending_id, "I’m escalating this to the branch manager for follow-up.")}>Escalate to manager</button>
              <button type="button" onClick={() => setCannedReply(draft.pending_id, "A local specialist is reviewing this and will follow up with verified information.")}>Request specialist follow-up</button>
            </div>
            <button type="button" disabled={loading} onClick={() => approve(draft.pending_id)} style={{ padding: "0.75rem 1rem", borderRadius: 999, border: 0, background: "#38bdf8", color: "#082f49", fontWeight: 700 }}>
              {loading ? "Approving…" : "Approve and release · ⌘/Ctrl + Enter"}
            </button>
          </article>
        ))}
      </div>
    </main>
  );
}
