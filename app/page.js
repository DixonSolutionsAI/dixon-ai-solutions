"use client";

import { useState } from "react";

const fieldStyle = {
  width: "100%",
  borderRadius: "12px",
  border: "1px solid #334155",
  background: "#0f172a",
  color: "white",
  padding: "0.9rem 1rem",
  fontSize: "1rem",
  lineHeight: 1.5,
  boxSizing: "border-box",
};

const cardStyle = {
  background: "#0f172a",
  border: "1px solid #1e293b",
  borderRadius: "16px",
  padding: "1.25rem",
};

export default function Home() {
  const [accessCode, setAccessCode] = useState("");
  const [message, setMessage] = useState("");
  const [supportContext, setSupportContext] = useState("");
  const [reply, setReply] = useState("");
  const [reviewNote, setReviewNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setReply("");
    setReviewNote("");
    setCopied(false);

    try {
      const response = await fetch("/api/reply-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessCode, message, supportContext }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to generate a draft.");
      }

      setReply(data.reply);
      setReviewNote(data.reviewNote);
    } catch (requestError) {
      setError(requestError.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function copyDraft() {
    try {
      await navigator.clipboard.writeText(reply);
      setCopied(true);
    } catch {
      setError("Could not access the clipboard. Select and copy the draft manually.");
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#020617",
        color: "#f8fafc",
        padding: "40px 20px 64px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <p style={{ color: "#7dd3fc", textTransform: "uppercase", letterSpacing: "0.12em", fontSize: "0.8rem", fontWeight: 700 }}>
          InstantReply · private pilot prototype
        </p>
        <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 3.8rem)", lineHeight: 1.1, marginBottom: "0.8rem" }}>
          A useful first draft. Your agent makes the call.
        </h1>
        <p style={{ color: "#cbd5e1", fontSize: "1.05rem", lineHeight: 1.6, maxWidth: "760px" }}>
          Create a support reply draft using the customer message and any policy or order details you provide. The assistant must flag missing information; a person reviews and edits every draft.
        </p>

        <aside role="note" style={{ ...cardStyle, margin: "1.5rem 0", borderColor: "#854d0e", color: "#fef3c7" }}>
          <strong>Prototype safety:</strong> Use fictional or redacted examples only. Do not enter real customer personal, payment, health, or account information. Drafts are not sent or saved by this page, and they must be checked before use.
        </aside>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1.1rem" }}>
          <label style={{ display: "grid", gap: "0.5rem", fontWeight: 700 }}>
            Pilot access code
            <input
              type="password"
              value={accessCode}
              onChange={(event) => setAccessCode(event.target.value)}
              autoComplete="current-password"
              required
              maxLength={256}
              style={fieldStyle}
              placeholder="Provided by the pilot owner"
            />
          </label>

          <label style={{ display: "grid", gap: "0.5rem", fontWeight: 700 }}>
            Customer message <span style={{ color: "#94a3b8", fontWeight: 400 }}>Required · max 5,000 characters</span>
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              required
              maxLength={5000}
              rows={6}
              style={fieldStyle}
              placeholder="Paste a fictional or redacted support message..."
            />
          </label>

          <label style={{ display: "grid", gap: "0.5rem", fontWeight: 700 }}>
            Relevant policy or known details <span style={{ color: "#94a3b8", fontWeight: 400 }}>Optional · max 8,000 characters</span>
            <textarea
              value={supportContext}
              onChange={(event) => setSupportContext(event.target.value)}
              maxLength={8000}
              rows={5}
              style={fieldStyle}
              placeholder="For example: shipping policy, verified order status, or response tone. Leave blank if you have no confirmed information."
            />
          </label>

          <button
            type="submit"
            disabled={loading || !message.trim() || !accessCode.trim()}
            style={{
              width: "fit-content",
              background: "#38bdf8",
              color: "#082f49",
              border: 0,
              borderRadius: "999px",
              padding: "0.9rem 1.4rem",
              fontWeight: 700,
              cursor: loading ? "wait" : "pointer",
              opacity: loading || !message.trim() || !accessCode.trim() ? 0.65 : 1,
            }}
          >
            {loading ? "Preparing draft…" : "Generate reply draft"}
          </button>
        </form>

        {error ? (
          <p role="alert" style={{ marginTop: "1rem", padding: "1rem", background: "#7f1d1d", borderRadius: "12px", color: "#fee2e2" }}>
            {error}
          </p>
        ) : null}

        {reply ? (
          <section aria-labelledby="draft-heading" style={{ ...cardStyle, marginTop: "2rem" }}>
            <h2 id="draft-heading" style={{ color: "#7dd3fc", marginTop: 0 }}>Suggested reply — edit before use</h2>
            <label style={{ display: "grid", gap: "0.5rem", fontWeight: 700 }}>
              Editable draft
              <textarea value={reply} onChange={(event) => setReply(event.target.value)} rows={7} style={fieldStyle} />
            </label>
            {reviewNote ? (
              <div style={{ marginTop: "1rem", padding: "1rem", background: "#172554", borderRadius: "12px", color: "#dbeafe" }}>
                <strong>Agent review check:</strong> {reviewNote}
              </div>
            ) : null}
            <p style={{ color: "#fef3c7", marginBottom: "1rem" }}>
              Human review is required. Verify every factual statement and policy detail; this prototype does not send replies.
            </p>
            <button type="button" onClick={copyDraft} style={{ ...fieldStyle, width: "auto", cursor: "pointer", fontWeight: 700 }}>
              {copied ? "Copied" : "Copy draft"}
            </button>
          </section>
        ) : null}
      </div>
    </main>
  );
}
