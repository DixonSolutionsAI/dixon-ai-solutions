"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getDocuments } from "./browser-documents";
import { useAccess } from "./get-started/access-context";
import { useStaff } from "./get-started/staff-context";
import { createMailtoUrl, readTemplates, saveTemplate, deleteTemplate } from "../lib/response-workflow";

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
  { id: "email_structure", label: "Email Response", path: "email" },
  { id: "text_message", label: "Text Response", path: "text" },
  { id: "call_prompts", label: "Call Response", path: "call" },
];

export default function WorkSpace() {
  const pathname = usePathname();
  const router = useRouter();
  const actionPath = pathname.startsWith("/get-started/work-space/") ? pathname.split("/").pop() : "";
  const activePanel = actionPath === "profile"
    ? "populate_client_profile"
    : draftActions.find(({ path }) => path === actionPath)?.id;
  const { unlocked } = useAccess();
  const { employee, status } = useStaff();
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [reviewNote, setReviewNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentAction, setCurrentAction] = useState("generate");
  const [pendingAction, setPendingAction] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);
  const [suggestion, setSuggestion] = useState(null);
  const [emailTo, setEmailTo] = useState("");
  const [emailCc, setEmailCc] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailSignature, setEmailSignature] = useState("");
  const [templateName, setTemplateName] = useState("");
  const [templates, setTemplates] = useState([]);
  const [templateError, setTemplateError] = useState("");
  const [approvalError, setApprovalError] = useState("");
  const [approvalStatus, setApprovalStatus] = useState("");
  const profileDialogRef = useRef(null);
  const approvalDialogRef = useRef(null);

  useEffect(() => {
    if (activePanel) {
      setAccepted(false);
    }
  }, [activePanel]);

  useEffect(() => {
    function refreshTemplates() {
      try {
        setTemplates(readTemplates(localStorage));
        setTemplateError("");
      } catch {
        setTemplateError("Unable to read saved templates in this browser. Check site storage.");
      }
    }
    refreshTemplates();
    window.addEventListener("storage", refreshTemplates);
    return () => window.removeEventListener("storage", refreshTemplates);
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setAccepted(false);

    try {
      const response = await fetch("/api/reply-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, currentDraft: reply, ...getDocuments() }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to generate a draft.");
      }

      if (reply.trim()) {
        setSuggestion({ reply: data.reply, reviewNote: data.reviewNote });
      } else {
        setReply(data.reply);
        setReviewNote(data.reviewNote);
        setHasDraft(true);
        setCurrentAction("generate");
        setSuggestion(null);
      }
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
    setAccepted(false);

    try {
      const response = await fetch("/api/reply-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
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

  function approveResponse() {
    setApprovalError("");
    if (!reply.trim()) {
      setApprovalError("Enter a response before accepting.");
      return;
    }
    if (activePanel === "email_structure") {
      let url;
      try {
        url = createMailtoUrl({ to: emailTo, cc: emailCc, subject: emailSubject, body: reply, signature: emailSignature });
      } catch (validationError) {
        setApprovalError(validationError.message);
        return;
      }
      try {
        window.location.href = url;
      } catch {
        setApprovalError("Unable to open the email app. Copy the draft and send it manually.");
        return;
      }
      setApprovalStatus("Requested your default email app. Review and send the message there; it has not been sent by this agent.");
    } else if (activePanel === "text_message" || activePanel === "call_prompts") {
      try {
        const updated = saveTemplate(localStorage, { id: crypto.randomUUID(), type: activePanel, label: templateName, body: reply });
        setTemplates(updated);
        setTemplateError("");
        setTemplateName("");
      } catch (storageError) {
        setApprovalError(storageError.message || "Unable to save the template in this browser.");
        return;
      }
      setApprovalStatus("Template saved in this browser for manual reuse. No message was sent and no call was made.");
    } else {
      setApprovalStatus("Draft approved for this session. Nothing was sent or saved.");
    }
    setAccepted(true);
    approvalDialogRef.current.close();
  }

  function useTemplate(template) {
    if (reply.trim() && !window.confirm("Replace the current editable draft with this template?")) return;
    setReply(template.body);
    setHasDraft(true);
    setCurrentAction(template.type);
    setReviewNote("");
    setSuggestion(null);
    setAccepted(false);
    setApprovalStatus("");
  }

  function removeTemplate(id) {
    try {
      setTemplates(deleteTemplate(localStorage, id));
      setTemplateError("");
    } catch {
      setTemplateError("Unable to delete the template. Check browser site storage.");
    }
  }

  if (!employee || !["working", "cue", "meeting"].includes(status)) {
    return (
      <main style={{ padding: "40px 20px 64px" }}>
        <section style={{ maxWidth: "900px", margin: "0 auto", background: "#0f172a", border: "1px solid #1e293b", borderRadius: "16px", padding: "1.25rem" }}>
          <h1 style={{ color: "#7dd3fc", marginTop: 0 }}>Work Space is locked</h1>
          <p>{!employee ? "Sign in on the Employee tab and clock in to start work." : "Clock in (or end your lunch or break) on the Employee tab to continue working."}</p>
          <Link href="/get-started/employee" style={{ color: "#7dd3fc" }}>Go to Employee tab</Link>
        </section>
      </main>
    );
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
          OfficeVault AI · private pilot prototype
        </p>
        <h1 style={{ fontSize: "2rem", marginBottom: "0.8rem" }}>
          {activePanel === "populate_client_profile" ? "Populate Client Profile" : draftActions.find(({ id }) => id === activePanel)?.label || "Work Space"}
        </h1>
        {activePanel ? <Link href="/get-started" style={{ color: "#7dd3fc" }}>← Back to Work Space</Link> : null}
        {!activePanel ? <section aria-labelledby="actions-heading" style={{ ...cardStyle, margin: "1.5rem 0" }}>
          <h2 id="actions-heading" style={{ color: "#7dd3fc", marginTop: 0 }}>Response actions</h2>
          <p>Choose an action to open its workspace. Enter your pilot code in <Link href="/get-started/access" style={{ color: "#7dd3fc" }}>Access</Link> before generating a response.</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
            {draftActions.map(({ id, label, path }) => (
              <Link key={id} href={`/get-started/work-space/${path}`} onClick={(event) => { if (loading) event.preventDefault(); }} aria-disabled={loading || undefined} style={{ ...fieldStyle, width: "auto", cursor: loading ? "wait" : "pointer", fontWeight: 700, textDecoration: "none" }}>
                {label}
              </Link>
            ))}
          </div>
        </section> : null}

        {activePanel ? (
        <>
        <aside role="note" style={{ ...cardStyle, margin: "1.5rem 0", borderColor: "#854d0e", color: "#fef3c7" }}>
          <strong>Prototype safety:</strong> Use fictional or redacted examples only. Do not enter real customer personal, payment, health, or account information. Responses must be checked before use.
        </aside>

        <form id="draft-form" onSubmit={handleSubmit} style={{ display: "grid", gap: "1.1rem" }}>
          <div style={{ display: "grid", gap: "0.5rem" }}>
            <label htmlFor="customer-message" style={{ fontWeight: 700 }}>
              Customer inquiry <span style={{ color: "#94a3b8", fontWeight: 400 }}>Required · max 5,000 characters</span>
            </label>
            <textarea
              id="customer-message"
              value={message}
              onChange={(event) => { setMessage(event.target.value); setAccepted(false); }}
              required
              maxLength={5000}
              rows={6}
              style={fieldStyle}
              placeholder="Describe why the customer reached out, using fictional or redacted details..."
            />
            <button type="button" disabled={loading} onClick={() => profileDialogRef.current.showModal()} aria-haspopup="dialog" style={{ ...fieldStyle, width: "fit-content", cursor: "pointer", fontWeight: 700 }}>
              Populate Client Profile
            </button>
          </div>
        </form>

        <dialog ref={profileDialogRef} aria-labelledby="profile-dialog-heading" aria-describedby="profile-dialog-description" style={{ ...cardStyle, color: "#f8fafc", width: "min(90%, 560px)", maxHeight: "80vh", overflowY: "auto", boxSizing: "border-box" }}>
          <h2 id="profile-dialog-heading" style={{ color: "#7dd3fc", marginTop: 0 }}>Client profile</h2>
          <p id="profile-dialog-description">Shared customer profiles are not connected. Database connection and profile search are not yet available; do not enter customer information or database credentials here.</p>
          <label style={{ display: "grid", gap: "0.5rem", fontWeight: 700 }}>
            Search client profiles
            <input type="search" disabled placeholder="Available when a database is connected" style={fieldStyle} />
          </label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem", marginTop: "1rem" }}>
            <button type="button" disabled style={{ ...fieldStyle, width: "auto", fontWeight: 700 }}>Search</button>
            <button type="button" disabled style={{ ...fieldStyle, width: "auto", fontWeight: 700 }}>Connect database</button>
          </div>
          <p>A future Supabase integration will require individual sign-in and company-level access controls. Creating a database alone will not connect it.</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
            <button type="button" onClick={() => { profileDialogRef.current.close(); router.push("/get-started/work-space/profile"); }} style={{ ...fieldStyle, width: "auto", cursor: "pointer", fontWeight: 700 }}>Draft profile summary</button>
            <button type="button" autoFocus onClick={() => profileDialogRef.current.close()} style={{ ...fieldStyle, width: "auto", cursor: "pointer", fontWeight: 700 }}>Close</button>
          </div>
          <p>Drafting creates an editable summary from the inquiry; it does not open or save a customer record.</p>
        </dialog>

        {error ? (
          <p role="alert" style={{ marginTop: "1rem", padding: "1rem", background: "#7f1d1d", borderRadius: "12px", color: "#fee2e2" }}>
            {error}
          </p>
        ) : null}

          <section aria-labelledby="draft-heading" style={{ ...cardStyle, marginTop: "2rem" }}>
            <h2 id="draft-heading" style={{ color: "#7dd3fc", marginTop: 0 }}>
              {activePanel === "populate_client_profile"
                  ? "Populate Client Profile"
                  : draftActions.find(({ id }) => id === activePanel)?.label || "AI suggested response — edit before use"}
            </h2>
            {activePanel === "email_structure" ? (
              <div style={{ display: "grid", gap: "1rem", marginBottom: "1rem" }}>
                <label style={{ display: "grid", gap: "0.5rem", fontWeight: 700 }}>
                  To
                  <input type="email" value={emailTo} onChange={(event) => { setEmailTo(event.target.value); setAccepted(false); }} style={fieldStyle} />
                </label>
                <label style={{ display: "grid", gap: "0.5rem", fontWeight: 700 }}>
                  Cc
                  <input type="text" value={emailCc} onChange={(event) => { setEmailCc(event.target.value); setAccepted(false); }} placeholder="Email addresses, separated by commas" style={fieldStyle} />
                </label>
                <label style={{ display: "grid", gap: "0.5rem", fontWeight: 700 }}>
                  Subject
                  <input type="text" value={emailSubject} onChange={(event) => { setEmailSubject(event.target.value); setAccepted(false); }} style={fieldStyle} />
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
                disabled={loading}
                onChange={(event) => {
                  setReply(event.target.value);
                  setAccepted(false);
                }}
                rows={7}
                style={fieldStyle}
              />
            </label>
            <button type="submit" form="draft-form" disabled={loading || !message.trim() || !unlocked} title={unlocked ? undefined : "Ask an administrator to unlock the pilot in Access."} style={{ ...fieldStyle, width: "auto", marginTop: "1rem", cursor: loading ? "wait" : "pointer", fontWeight: 700 }}>
              {loading && !pendingAction ? "Preparing draft…" : hasDraft || reply.trim() ? "Generate New Response" : "Generate Response"}
            </button>
            <div style={{ marginTop: "0.6rem" }}>
              <button type="button" onClick={() => { setApprovalError(""); setApprovalStatus(""); approvalDialogRef.current.showModal(); }} disabled={loading || !reply.trim()} aria-haspopup="dialog" style={{ ...fieldStyle, width: "auto", cursor: "pointer", fontWeight: 700 }}>
                {accepted ? "Review approved response" : "Accept/Approve"}
              </button>
            </div>
            {accepted && approvalStatus ? <p role="status">{approvalStatus}</p> : null}
            {suggestion ? (
              <div style={{ marginTop: "1rem", padding: "1rem", background: "#172554", borderRadius: "12px" }}>
                <h3>New suggestion</h3>
                <p>Your current draft is unchanged. Review this suggestion before replacing it.</p>
                <pre style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere", font: "inherit" }}>{suggestion.reply}</pre>
                {suggestion.reviewNote ? <p><strong>Agent review check:</strong> {suggestion.reviewNote}</p> : null}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
                  <button type="button" disabled={loading} onClick={() => { setReply(suggestion.reply); setReviewNote(suggestion.reviewNote); setSuggestion(null); setHasDraft(true); setCurrentAction("generate"); setAccepted(false); }} style={{ ...fieldStyle, width: "auto", fontWeight: 700 }}>Use new suggestion</button>
                  <button type="button" disabled={loading} onClick={() => setSuggestion(null)} style={{ ...fieldStyle, width: "auto", fontWeight: 700 }}>Keep current draft</button>
                </div>
              </div>
            ) : null}
            {activePanel === "email_structure" ? (
              <div style={{ display: "grid", gap: "0.75rem", marginTop: "1rem" }}>
                <label style={{ display: "grid", gap: "0.5rem", fontWeight: 700 }}>
                  Signature
                  <textarea value={emailSignature} onChange={(event) => { setEmailSignature(event.target.value); setAccepted(false); }} rows={3} style={fieldStyle} />
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
                  <button type="button" disabled style={{ ...fieldStyle, width: "auto" }}>Connect Gmail</button>
                  <button type="button" disabled style={{ ...fieldStyle, width: "auto" }}>Connect Outlook</button>
                  <button type="button" disabled style={{ ...fieldStyle, width: "auto" }}>Send email</button>
                </div>
                <p style={{ color: "#fef3c7", margin: 0 }}>Accept/Approve can open a draft in your default email app. Direct connections and sending are not available.</p>
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
              Human review is required. Verify every factual statement and policy detail.
            </p>
            {activePanel ? (
              <>
                {!reply.trim() ? <p>Generate a response first, then use this action to update it.</p> : null}
                <button type="button" onClick={() => applyDraftAction(activePanel)} disabled={loading || !reply.trim() || !message.trim() || !unlocked} title={unlocked ? undefined : "Ask an administrator to unlock the pilot in Access."} style={{ ...fieldStyle, width: "auto", fontWeight: 700 }}>
                  {pendingAction === activePanel ? "Working…" : `Generate ${activePanel === "populate_client_profile" ? "Client Profile" : draftActions.find(({ id }) => id === activePanel)?.label}`}
                </button>
              </>
            ) : null}
            {activePanel === "text_message" || activePanel === "call_prompts" ? (
              <section aria-labelledby="templates-heading" style={{ marginTop: "1.5rem" }}>
                <h3 id="templates-heading">Saved templates</h3>
                <p>Templates are stored only in this browser and selected manually. Anyone using this browser can read them; clearing site data removes them. Do not save sensitive information.</p>
                {templateError ? <p role="alert">{templateError}</p> : null}
                {templates.filter((template) => template.type === activePanel).length === 0 ? <p>No templates saved for this response type.</p> : null}
                {templates.filter((template) => template.type === activePanel).map((template) => (
                  <div key={template.id} style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.6rem", marginBottom: "0.6rem" }}>
                    <span>{template.label}</span>
                    <button type="button" disabled={loading} onClick={() => useTemplate(template)} style={{ ...fieldStyle, width: "auto" }}>Use template</button>
                    <button type="button" disabled={loading} onClick={() => removeTemplate(template.id)} aria-label={`Delete ${template.label}`} style={{ ...fieldStyle, width: "auto" }}>Delete</button>
                  </div>
                ))}
              </section>
            ) : null}
          </section>
          <dialog ref={approvalDialogRef} aria-labelledby="approval-heading" aria-describedby="approval-description" style={{ ...cardStyle, color: "#f8fafc", width: "min(90%, 640px)", maxHeight: "85vh", overflowY: "auto", boxSizing: "border-box" }}>
            <h2 id="approval-heading" style={{ color: "#7dd3fc", marginTop: 0 }}>Review before accepting</h2>
            <p id="approval-description">
              {activePanel === "email_structure"
                ? "Accept opens your default email app with this draft. Review and send it there; the agent does not send email."
                : activePanel === "text_message" || activePanel === "call_prompts"
                  ? "Accept saves this response as a template in this browser for manual reuse. No message is sent or call made. Anyone using this browser can read it; do not save sensitive information."
                  : "Accept marks this draft approved for this session. Nothing is sent or saved."}
            </p>
            {activePanel === "email_structure" ? (
              <div style={{ display: "grid", gap: "0.75rem" }}>
                <label style={{ display: "grid", gap: "0.5rem" }}>To
                  <input type="email" multiple value={emailTo} onChange={(event) => { setEmailTo(event.target.value); setAccepted(false); }} style={fieldStyle} />
                </label>
                <label style={{ display: "grid", gap: "0.5rem" }}>Cc
                  <input type="email" multiple value={emailCc} onChange={(event) => { setEmailCc(event.target.value); setAccepted(false); }} style={fieldStyle} />
                </label>
                <label style={{ display: "grid", gap: "0.5rem" }}>Subject
                  <input value={emailSubject} onChange={(event) => { setEmailSubject(event.target.value); setAccepted(false); }} style={fieldStyle} />
                </label>
              </div>
            ) : null}
            <label style={{ display: "grid", gap: "0.5rem", marginTop: "0.75rem" }}>
              {activePanel === "email_structure" ? "Email body" : "Response"}
              <textarea value={reply} onChange={(event) => { setReply(event.target.value); setAccepted(false); }} rows={7} style={fieldStyle} />
            </label>
            {activePanel === "email_structure" ? (
              <>
                <label style={{ display: "grid", gap: "0.5rem", marginTop: "0.75rem" }}>Signature
                  <textarea value={emailSignature} onChange={(event) => { setEmailSignature(event.target.value); setAccepted(false); }} rows={3} style={fieldStyle} />
                </label>
                <p>Email-app availability and draft length depend on your device. Check all fields in the email app before sending.</p>
              </>
            ) : null}
            {activePanel === "text_message" || activePanel === "call_prompts" ? (
              <label style={{ display: "grid", gap: "0.5rem", marginTop: "0.75rem" }}>Template name
                <input value={templateName} maxLength={100} onChange={(event) => setTemplateName(event.target.value)} placeholder="Name for manual reuse" style={fieldStyle} />
              </label>
            ) : null}
            {approvalError ? <p role="alert" style={{ color: "#fca5a5" }}>{approvalError}</p> : null}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem", marginTop: "1rem" }}>
              <button type="button" onClick={approveResponse} style={{ ...fieldStyle, width: "auto", cursor: "pointer", fontWeight: 700 }}>Accept</button>
              <button type="button" autoFocus onClick={() => approvalDialogRef.current.close()} style={{ ...fieldStyle, width: "auto", cursor: "pointer", fontWeight: 700 }}>Cancel</button>
            </div>
          </dialog>
        </>
        ) : null}
      </div>
    </main>
  );
}
