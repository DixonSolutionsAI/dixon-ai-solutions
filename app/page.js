"use client";

import { useEffect, useRef, useState } from "react";

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
  { id: "email_structure", label: "Email Response" },
  { id: "text_message", label: "Text Response" },
  { id: "call_prompts", label: "Call Response" },
  { id: "populate_client_profile", label: "Populate Client Profile" },
];

const documentKeys = {
  policy: "instantreply-policy",
  guidelines: "instantreply-guidelines",
};

function getDocuments() {
  try {
    return {
      companyPolicy: localStorage.getItem(documentKeys.policy) || "",
      companyGuidelines: localStorage.getItem(documentKeys.guidelines) || "",
    };
  } catch {
    throw new Error("Cannot access browser document storage. Enable site storage and try again.");
  }
}

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
  const [activePanel, setActivePanel] = useState("generate");
  const [hasDraft, setHasDraft] = useState(false);
  const [emailTo, setEmailTo] = useState("");
  const [emailCc, setEmailCc] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailSignature, setEmailSignature] = useState("");
  const [documentBusy, setDocumentBusy] = useState(false);
  const [documentMessage, setDocumentMessage] = useState("");
  const [documentError, setDocumentError] = useState("");
  const [documentStatus, setDocumentStatus] = useState(null);
  const policyFile = useRef(null);
  const guidelinesFile = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    if (activePanel !== "generate" && panelRef.current) {
      panelRef.current.focus();
    }
  }, [activePanel]);

  useEffect(() => {
    function refreshDocuments() {
      try {
        const documents = getDocuments();
        setDocumentStatus({ policy: Boolean(documents.companyPolicy), guidelines: Boolean(documents.companyGuidelines) });
        setDocumentError("");
      } catch (storageError) {
        setDocumentError(storageError.message);
      }
    }
    refreshDocuments();
    window.addEventListener("storage", refreshDocuments);
    return () => window.removeEventListener("storage", refreshDocuments);
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setCopied(false);
    setAccepted(false);

    try {
      const response = await fetch("/api/reply-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessCode, message, supportContext, ...getDocuments() }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to generate a draft.");
      }

      setReply(data.reply);
      setReviewNote(data.reviewNote);
      setHasDraft(true);
      setCurrentAction("generate");
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
          ...getDocuments(),
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to update the draft.");
      }

      setReply(data.reply);
      setReviewNote(data.reviewNote);
      setCurrentAction(action);
    } catch (requestError) {
      setError(requestError.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      setPendingAction("");
    }
  }

  async function copyDraft() {
    try {
      const text = activePanel === "email_structure"
        ? [`To: ${emailTo}`, emailCc && `Cc: ${emailCc}`, `Subject: ${emailSubject}`, "", reply, emailSignature].filter((line) => line !== false).join("\n")
        : reply;
      await navigator.clipboard.writeText(text);
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
    if (!file.name.toLowerCase().endsWith(".txt") || file.size > 16000) {
      setDocumentError("Choose a UTF-8 .txt file of at most 16,000 bytes.");
      return;
    }

    setDocumentBusy(true);
    try {
      const content = new TextDecoder("utf-8", { fatal: true }).decode(await file.arrayBuffer());
      if (!content.trim() || content.includes("\0")) throw new Error("Choose a non-empty UTF-8 text file.");
      try {
        localStorage.setItem(documentKeys[kind], content);
      } catch {
        throw new Error("Unable to save the document in this browser. Check site storage and available space.");
      }
      setDocumentStatus((previous) => ({ ...previous, [kind]: true }));
      setDocumentMessage(`${kind === "policy" ? "Policy" : "Guidelines"} saved in this browser. New drafts will use it.`);
    } catch (requestError) {
      setDocumentError(requestError.message || "Unable to upload the document.");
    } finally {
      setDocumentBusy(false);
    }
  }

  function downloadDocument(kind) {
    setDocumentMessage("");
    setDocumentError("");
    try {
      const documents = getDocuments();
      const content = kind === "policy" ? documents.companyPolicy : documents.companyGuidelines;
      if (!content) throw new Error(`No ${kind} has been uploaded in this browser.`);
      const url = URL.createObjectURL(new Blob([content], { type: "text/plain;charset=utf-8" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = `${kind}.txt`;
      link.click();
      URL.revokeObjectURL(url);
      setDocumentMessage(`${kind === "policy" ? "Policy" : "Guidelines"} downloaded.`);
    } catch (requestError) {
      setDocumentError(requestError.message || "Unable to download the document.");
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

        <section aria-labelledby="actions-heading" style={{ ...cardStyle, margin: "1.5rem 0" }}>
          <h2 id="actions-heading" style={{ color: "#7dd3fc", marginTop: 0 }}>Response actions</h2>
          <p>Enter your access code and a customer message to generate a response. Review it before using the other actions.</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
            <button type="submit" form="draft-form" disabled={loading || documentBusy || !message.trim() || !accessCode.trim()} style={{ ...fieldStyle, width: "auto", cursor: loading || documentBusy ? "wait" : "pointer", fontWeight: 700 }}>
              {loading && !pendingAction ? "Preparing draft…" : "Generate New Response"}
            </button>
            <button type="button" onClick={() => { setActivePanel("approve"); setCopied(false); }} disabled={loading} aria-pressed={activePanel === "approve"} style={{ ...fieldStyle, width: "auto", cursor: "pointer", fontWeight: 700 }}>
              Accept/Approve
            </button>
            {draftActions.map(({ id, label }) => (
              <button key={id} type="button" onClick={() => { setActivePanel(id); setCopied(false); }} disabled={loading} aria-pressed={activePanel === id} style={{ ...fieldStyle, width: "auto", cursor: loading ? "wait" : "pointer", fontWeight: 700 }}>
                {label}
              </button>
            ))}
            <button type="button" onClick={copyDraft} disabled={loading || !reply.trim()} style={{ ...fieldStyle, width: "auto", cursor: loading ? "wait" : "pointer", fontWeight: 700 }}>
              {copied ? "Copied" : "Copy draft"}
            </button>
          </div>
          <p style={{ color: "#cbd5e1", marginBottom: 0 }}>Choose an action to open its editor. Accept/Approve marks the draft for this session only; it does not send or save it.</p>
        </section>

        <section aria-labelledby="documents-heading" style={{ ...cardStyle, margin: "1.5rem 0" }}>
          <h2 id="documents-heading" style={{ color: "#7dd3fc", marginTop: 0 }}>Company documents</h2>
          <p>Upload UTF-8 .txt files, up to 16,000 bytes each. Files are stored only in this browser, not shared with other users or devices. Anyone using this browser can read or replace them; clearing site data removes them. Document text is sent to OpenAI when generating a response.</p>
          {documentStatus ? <p>Policy: {documentStatus.policy ? "uploaded" : "not uploaded"} · Guidelines: {documentStatus.guidelines ? "uploaded" : "not uploaded"}</p> : null}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
            <input ref={policyFile} type="file" accept=".txt,text/plain" hidden onChange={(event) => uploadDocument("policy", event)} />
            <button type="button" disabled={documentBusy || loading} onClick={() => policyFile.current.click()} style={{ ...fieldStyle, width: "auto", cursor: "pointer", fontWeight: 700 }}>Upload Policy</button>
            <button type="button" disabled={documentBusy} onClick={() => downloadDocument("policy")} style={{ ...fieldStyle, width: "auto", cursor: "pointer", fontWeight: 700 }}>Download Policy</button>
            <input ref={guidelinesFile} type="file" accept=".txt,text/plain" hidden onChange={(event) => uploadDocument("guidelines", event)} />
            <button type="button" disabled={documentBusy || loading} onClick={() => guidelinesFile.current.click()} style={{ ...fieldStyle, width: "auto", cursor: "pointer", fontWeight: 700 }}>Upload Guidelines</button>
            <button type="button" disabled={documentBusy} onClick={() => downloadDocument("guidelines")} style={{ ...fieldStyle, width: "auto", cursor: "pointer", fontWeight: 700 }}>Download Guidelines</button>
          </div>
          {documentBusy ? <p role="status">Processing document...</p> : null}
          {documentMessage ? <p role="status">{documentMessage}</p> : null}
          {documentError ? <p role="alert" style={{ color: "#fca5a5" }}>{documentError}</p> : null}
        </section>

        <aside role="note" style={{ ...cardStyle, margin: "1.5rem 0", borderColor: "#854d0e", color: "#fef3c7" }}>
          <strong>Prototype safety:</strong> Use fictional or redacted examples only. Do not enter real customer personal, payment, health, or account information. Drafts are not sent or saved by this page, and they must be checked before use.
        </aside>

        <form id="draft-form" onSubmit={handleSubmit} style={{ display: "grid", gap: "1.1rem" }}>
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
              onChange={(event) => { setMessage(event.target.value); setAccepted(false); }}
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
              onChange={(event) => { setSupportContext(event.target.value); setAccepted(false); }}
              maxLength={8000}
              rows={5}
              style={fieldStyle}
              placeholder="For example: shipping policy, verified order status, or response tone. Leave blank if you have no confirmed information."
            />
          </label>

        </form>

        {error ? (
          <p role="alert" style={{ marginTop: "1rem", padding: "1rem", background: "#7f1d1d", borderRadius: "12px", color: "#fee2e2" }}>
            {error}
          </p>
        ) : null}

        {hasDraft || activePanel !== "generate" ? (
          <section ref={panelRef} tabIndex={-1} aria-labelledby="draft-heading" style={{ ...cardStyle, marginTop: "2rem" }}>
            <h2 id="draft-heading" style={{ color: "#7dd3fc", marginTop: 0 }}>
              {activePanel === "approve"
                ? "Review and approve"
                : draftActions.find(({ id }) => id === activePanel)?.label || "Suggested reply — edit before use"}
            </h2>
            <label style={{ display: "grid", gap: "0.5rem", fontWeight: 700, marginBottom: "1rem" }}>
              Customer inquiry
              <textarea value={message} onChange={(event) => { setMessage(event.target.value); setAccepted(false); }} maxLength={5000} rows={4} style={fieldStyle} />
            </label>
            {activePanel === "email_structure" ? (
              <div style={{ display: "grid", gap: "1rem", marginBottom: "1rem" }}>
                <label style={{ display: "grid", gap: "0.5rem", fontWeight: 700 }}>
                  To
                  <input type="email" value={emailTo} onChange={(event) => { setEmailTo(event.target.value); setCopied(false); setAccepted(false); }} style={fieldStyle} />
                </label>
                <label style={{ display: "grid", gap: "0.5rem", fontWeight: 700 }}>
                  Cc
                  <input type="text" value={emailCc} onChange={(event) => { setEmailCc(event.target.value); setCopied(false); setAccepted(false); }} placeholder="Email addresses, separated by commas" style={fieldStyle} />
                </label>
                <label style={{ display: "grid", gap: "0.5rem", fontWeight: 700 }}>
                  Subject
                  <input type="text" value={emailSubject} onChange={(event) => { setEmailSubject(event.target.value); setCopied(false); setAccepted(false); }} style={fieldStyle} />
                </label>
              </div>
            ) : null}
            {activePanel === "populate_client_profile" ? (
              <div style={{ marginBottom: "1rem", padding: "1rem", background: "#172554", borderRadius: "12px" }}>
                Shared customer profiles are not connected yet. You can generate an editable profile summary from the inquiry, but it will not open, retrieve, or save a customer record.
                <p><button type="button" disabled style={{ ...fieldStyle, width: "auto" }}>Open customer profile</button></p>
                <details>
                  <summary>Shared profile setup guidance</summary>
                  <p>A future integration will need a Supabase project, individual sign-in, and workspace-level database access rules. These are not implemented yet; creating a project alone will not connect profiles.</p>
                </details>
              </div>
            ) : null}
            {activePanel === "call_prompts" ? <p>Generate talking points and questions for a support call; review and edit them before use.</p> : null}
            {activePanel === "text_message" ? <p>Generate a short text-message response; review and edit it before use.</p> : null}
            <label style={{ display: "grid", gap: "0.5rem", fontWeight: 700 }}>
              {activePanel === "email_structure" ? "Email body" : activePanel === "text_message" ? "Text message draft" : activePanel === "call_prompts" ? "Call talking points" : currentAction === "populate_client_profile" ? "Profile summary" : "Editable draft"}
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
            {activePanel === "email_structure" ? (
              <div style={{ display: "grid", gap: "0.75rem", marginTop: "1rem" }}>
                <label style={{ display: "grid", gap: "0.5rem", fontWeight: 700 }}>
                  Signature
                  <textarea value={emailSignature} onChange={(event) => { setEmailSignature(event.target.value); setCopied(false); setAccepted(false); }} rows={3} style={fieldStyle} />
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
                  <button type="button" disabled style={{ ...fieldStyle, width: "auto" }}>Connect Gmail</button>
                  <button type="button" disabled style={{ ...fieldStyle, width: "auto" }}>Connect Outlook</button>
                  <button type="button" disabled style={{ ...fieldStyle, width: "auto" }}>Send email</button>
                </div>
                <p style={{ color: "#fef3c7", margin: 0 }}>Email connections and sending are not available yet. Copy the completed email to send it manually.</p>
                <details>
                  <summary>Email connection setup guidance</summary>
                  <p>Gmail and Outlook connections will require secure individual sign-in and authorization with Google and Microsoft. These integrations are not implemented yet; do not enter credentials here.</p>
                </details>
              </div>
            ) : null}
            {reviewNote ? (
              <div style={{ marginTop: "1rem", padding: "1rem", background: "#172554", borderRadius: "12px", color: "#dbeafe" }}>
                <strong>Agent review check:</strong> {reviewNote}
              </div>
            ) : null}
            <p style={{ color: "#fef3c7", marginBottom: "1rem" }}>
              Human review is required. Verify every factual statement and policy detail; drafts are not sent or saved.
            </p>
            {activePanel === "approve" ? (
              <button type="button" onClick={() => setAccepted(true)} disabled={loading || accepted || !reply.trim()} style={{ ...fieldStyle, width: "auto", fontWeight: 700 }}>
                {accepted ? "Approved for this session" : "Approve current draft"}
              </button>
            ) : activePanel !== "generate" ? (
              <>
                {!reply.trim() ? <p>Generate a response first, then use this action to update it.</p> : null}
                <button type="button" onClick={() => applyDraftAction(activePanel)} disabled={loading || documentBusy || !reply.trim() || !message.trim() || !accessCode.trim()} style={{ ...fieldStyle, width: "auto", fontWeight: 700 }}>
                  {pendingAction === activePanel ? "Working…" : `Generate ${draftActions.find(({ id }) => id === activePanel)?.label}`}
                </button>
              </>
            ) : null}
          </section>
        ) : null}
      </div>
    </main>
  );
}
