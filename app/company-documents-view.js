"use client";

import { useEffect, useRef, useState } from "react";
import { documentKeys, getDocuments } from "./browser-documents";
import { readDocument } from "./document-upload.mjs";

const buttonStyle = {
  borderRadius: "12px",
  border: "1px solid #334155",
  background: "#0f172a",
  color: "white",
  padding: "0.9rem 1rem",
  fontSize: "1rem",
  cursor: "pointer",
  fontWeight: 700,
};

export default function CompanyDocuments() {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState(null);
  const policyFile = useRef(null);
  const guidelinesFile = useRef(null);

  useEffect(() => {
    function refreshDocuments() {
      try {
        const documents = getDocuments();
        setStatus({ policy: Boolean(documents.companyPolicy), guidelines: Boolean(documents.companyGuidelines) });
        setError("");
      } catch (storageError) {
        setError(storageError.message);
      }
    }
    refreshDocuments();
    window.addEventListener("storage", refreshDocuments);
    return () => window.removeEventListener("storage", refreshDocuments);
  }, []);

  async function uploadDocument(kind, event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setMessage("");
    setError("");
    setBusy(true);
    try {
      const content = await readDocument(file);
      try {
        localStorage.setItem(documentKeys[kind], content);
      } catch {
        throw new Error("Unable to save the document in this browser. Check site storage and available space.");
      }
      setStatus((previous) => ({ ...previous, [kind]: true }));
      setMessage(`${kind === "policy" ? "Policy" : "Guidelines"} saved in this browser. New drafts will use it.`);
    } catch (uploadError) {
      setError(uploadError.message || "Unable to upload the document.");
    } finally {
      setBusy(false);
    }
  }

  function downloadDocument(kind) {
    setMessage("");
    setError("");
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
      setMessage(`${kind === "policy" ? "Policy" : "Guidelines"} downloaded.`);
    } catch (downloadError) {
      setError(downloadError.message || "Unable to download the document.");
    }
  }

  return (
    <main style={{ minHeight: "100vh", padding: "40px 20px 64px" }}>
      <section aria-labelledby="documents-heading" style={{ maxWidth: "900px", margin: "0 auto", background: "#0f172a", border: "1px solid #1e293b", borderRadius: "16px", padding: "1.25rem" }}>
        <h1 id="documents-heading" style={{ color: "#7dd3fc", marginTop: 0 }}>Company documents</h1>
        <p>Upload UTF-8 .txt or text-based .pdf files. Text must be at most 16,000 bytes; PDF files must be at most 10 MB. Scanned PDFs require OCR first. PDF text is extracted in your browser and downloads as .txt. Text is stored only in this browser, not shared with other users or devices. Anyone using this browser can read or replace it; clearing site data removes it. Document text is sent to OpenAI when generating a response.</p>
        {status ? <p>Policy: {status.policy ? "uploaded" : "not uploaded"} · Guidelines: {status.guidelines ? "uploaded" : "not uploaded"}</p> : null}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
          <input ref={policyFile} type="file" accept=".txt,text/plain,.pdf,application/pdf" hidden onChange={(event) => uploadDocument("policy", event)} />
          <button type="button" disabled={busy} onClick={() => policyFile.current.click()} style={buttonStyle}>Upload Policy</button>
          <button type="button" disabled={busy} onClick={() => downloadDocument("policy")} style={buttonStyle}>Download Policy</button>
          <input ref={guidelinesFile} type="file" accept=".txt,text/plain,.pdf,application/pdf" hidden onChange={(event) => uploadDocument("guidelines", event)} />
          <button type="button" disabled={busy} onClick={() => guidelinesFile.current.click()} style={buttonStyle}>Upload Guidelines</button>
          <button type="button" disabled={busy} onClick={() => downloadDocument("guidelines")} style={buttonStyle}>Download Guidelines</button>
        </div>
        {busy ? <p role="status">Processing document...</p> : null}
        {message ? <p role="status">{message}</p> : null}
        {error ? <p role="alert" style={{ color: "#fca5a5" }}>{error}</p> : null}
      </section>
    </main>
  );
}
