"use client";

import { useRef, useState } from "react";

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

const draftActions = [
  { id: "apply_policy", label: "Apply Policy" },
  { id: "rewrite", label: "Re-Write" },
  { id: "more_direct", label: "More Direct" },
  { id: "email_structure", label: "Email Structure" },
  { id: "text_message", label: "Text Message" },
  { id: "call_prompts", label: "Call Prompts" },
  { id: "populate_client_profile", label: "Populate Client Profile" },
];

export default function Home() {
  const [accessCode, setAccessCode] = useState("");
  const [message, setMessage] = useState("");
  const [supportContext, setSupportContext] = useState("");
  const [reply, setReply] = useState("");
  const [reviewNote, setReviewNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [currentAction, setCurrentAction] = useState("generate");
  const [pendingAction, setPendingAction] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [ownerPassword, setOwnerPassword] = useState("");
  const [documentBusy, setDocumentBusy] = useState(false);
  const [documentMessage, setDocumentMessage] = useState("");
  const [documentError, setDocumentError] = useState("");
  const [documentNotice, setDocumentNotice] = useState("");
  const policyFile = useRef(null);
  const guidelinesFile = useRef(null);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setReply("");
    setReviewNote("");
    setCopied(false);
    setCurrentAction("generate");
    setAccepted(false);

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
      setDocumentNotice(data.documentNotice || "");
    } catch (requestError) {
      setError(requestError.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function applyDraftAction(action) {
    setLoading(true);
    setPendingAction(action);
    setError("");
    setCopied(false);
    setAccepted(false);

    try {
      const response = await fetch("/api/reply-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accessCode,
          message,
          supportContext,
          action,
          currentDraft: reply,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to update the draft.");
      }

      setReply(data.reply);
      setReviewNote(data.reviewNote);
      setCurrentAction(action);
      setDocumentNotice(data.documentNotice || "");
    } catch (requestError) {
      setError(requestError.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      setPendingAction("");
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

  async function uploadDocument(kind, event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setDocumentMessage("");
    setDocumentError("");
    if (!ownerPassword) {
      setDocumentError("Enter the owner password before uploading.");
      return;
    }
    if (!file.name.toLowerCase().endsWith(".txt") || file.size > 16000) {
      setDocumentError("Choose a UTF-8 .txt file of at most 16,000 bytes.");
      return;
    }

    setDocumentBusy(true);
    try {
      const content = new TextDecoder("utf-8", { fatal: true }).decode(await file.arrayBuffer());
      const response = await fetch("/api/company-documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, operation: "upload", ownerPassword, content }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to upload the document.");
      setDocumentMessage(`${data.message} New drafts will use it.`);
    } catch (requestError) {
      setDocumentError(requestError.message || "Unable to upload the document.");
    } finally {
      setOwnerPassword("");
      setDocumentBusy(false);
    }
  }

  async function downloadDocument(kind) {
    setDocumentMessage("");
    setDocumentError("");
    if (!accessCode.trim()) {
      setDocumentError("Enter the pilot access code below before downloading.");
      return;
    }
    setDocumentBusy(true);
    try {
      const response = await fetch("/api/company-documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, operation: "download", accessCode }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to download the document.");
      const url = URL.createObjectURL(new Blob([data.content], { type: "text/plain;charset=utf-8" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = `${kind}.txt`;
      link.click();
      URL.revokeObjectURL(url);
      setDocumentMessage(`${kind === "policy" ? "Policy" : "Guidelines"} downloaded.`);
    } catch (requestError) {
      setDocumentError(requestError.message || "Unable to download the document.");
    } finally {
      setDocumentBusy(false);
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

        <section aria-labelledby="documents-heading" style={{ ...cardStyle, margin: "1.5rem 0" }}>
          <h2 id="documents-heading" style={{ color: "#7dd3fc", marginTop: 0 }}>Company documents</h2>
          <p>Upload replaces the shared document. Use UTF-8 .txt files, up to 16,000 bytes each. Downloads require the pilot access code below.</p>
          <label style={{ display: "grid", gap: "0.5rem", fontWeight: 700, marginBottom: "1rem" }}>
            Owner password for uploads
            <input type="password" value={ownerPassword} onChange={(event) => setOwnerPassword(event.target.value)} autoComplete="off" maxLength={256} style={fieldStyle} />
          </label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
            <input ref={policyFile} type="file" accept=".txt,text/plain" hidden onChange={(event) => uploadDocument("policy", event)} />
            <button type="button" disabled={documentBusy} onClick={() => policyFile.current.click()} style={{ ...fieldStyle, width: "auto", cursor: "pointer", fontWeight: 700 }}>Upload Policy</button>
            <button type="button" disabled={documentBusy} onClick={() => downloadDocument("policy")} style={{ ...fieldStyle, width: "auto", cursor: "pointer", fontWeight: 700 }}>Download Policy</button>
            <input ref={guidelinesFile} type="file" accept=".txt,text/plain" hidden onChange={(event) => uploadDocument("guidelines", event)} />
            <button type="button" disabled={documentBusy} onClick={() => guidelinesFile.current.click()} style={{ ...fieldStyle, width: "auto", cursor: "pointer", fontWeight: 700 }}>Upload Guidelines</button>
            <button type="button" disabled={documentBusy} onClick={() => downloadDocument("guidelines")} style={{ ...fieldStyle, width: "auto", cursor: "pointer", fontWeight: 700 }}>Download Guidelines</button>
          </div>
          {documentBusy ? <p role="status">Processing document...</p> : null}
          {documentMessage ? <p role="status">{documentMessage}</p> : null}
          {documentError ? <p role="alert" style={{ color: "#fca5a5" }}>{documentError}</p> : null}
        </section>

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
            <h2 id="draft-heading" style={{ color: "#7dd3fc", marginTop: 0 }}>
              {currentAction === "populate_client_profile"
                ? "Editable client profile draft"
                : currentAction === "call_prompts"
                  ? "Call prompts for agent"
                  : currentAction === "generate"
                    ? "Suggested reply — edit before use"
                    : "Updated draft — edit before use"}
            </h2>
            <label style={{ display: "grid", gap: "0.5rem", fontWeight: 700 }}>
              {currentAction === "populate_client_profile" ? "Profile details" : "Editable draft"}
              <textarea
                value={reply}
                onChange={(event) => {
                  setReply(event.target.value);
                  setAccepted(false);
                  setCopied(false);
                }}
                rows={7}
                style={fieldStyle}
              />
            </label>
            {reviewNote ? (
              <div style={{ marginTop: "1rem", padding: "1rem", background: "#172554", borderRadius: "12px", color: "#dbeafe" }}>
                <strong>Agent review check:</strong> {reviewNote}
              </div>
            ) : null}
            {documentNotice ? <p role="status" style={{ color: "#fef3c7" }}>{documentNotice}</p> : null}
            <p style={{ color: "#fef3c7", marginBottom: "1rem" }}>
              Human review is required. Verify every factual statement and policy detail; drafts are not sent or saved.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
              <button
                type="button"
                onClick={() => setAccepted(true)}
                disabled={loading || accepted}
                aria-pressed={accepted}
                style={{ ...fieldStyle, width: "auto", cursor: accepted ? "default" : "pointer", fontWeight: 700 }}
              >
                {accepted ? "Accepted" : "Accept"}
              </button>
              {draftActions.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => applyDraftAction(id)}
                  disabled={loading}
                  style={{ ...fieldStyle, width: "auto", cursor: loading ? "wait" : "pointer", fontWeight: 700 }}
                >
                  {pendingAction === id ? "Working…" : label}
                </button>
              ))}
              <button
                type="button"
                onClick={copyDraft}
                disabled={loading}
                style={{ ...fieldStyle, width: "auto", cursor: loading ? "wait" : "pointer", fontWeight: 700 }}
              >
                {copied ? "Copied" : "Copy draft"}
              </button>
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
