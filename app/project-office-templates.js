"use client";

import { useEffect, useRef, useState } from "react";
import { deleteProjectTemplate, listProjectTemplates, saveProjectTemplate } from "./project-template-storage.mjs";

const buttonStyle = {
  borderRadius: "12px",
  border: "1px solid #334155",
  background: "#0f172a",
  color: "white",
  padding: "0.7rem 1rem",
  fontSize: "1rem",
  cursor: "pointer",
  fontWeight: 700,
};

export default function ProjectOfficeTemplates() {
  const [templates, setTemplates] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const fileInput = useRef(null);

  useEffect(() => {
    let active = true;
    listProjectTemplates().then(
      (items) => { if (active) setTemplates(items); },
      (err) => { if (active) setError(err.message); },
    );
    return () => { active = false; };
  }, []);

  async function upload(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setBusy(true);
    setMessage("");
    setError("");
    try {
      await saveProjectTemplate(file);
      setTemplates(await listProjectTemplates());
      setMessage(`${file.name} uploaded to this browser.`);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function remove(template) {
    if (!window.confirm(`Delete "${template.name}" from this browser?`)) return;
    setBusy(true);
    setMessage("");
    setError("");
    try {
      await deleteProjectTemplate(template.id);
      setTemplates(await listProjectTemplates());
      setMessage(`${template.name} deleted.`);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  function download(template) {
    setError("");
    try {
      const url = URL.createObjectURL(template.file);
      try {
        const link = document.createElement("a");
        link.href = url;
        link.download = template.name;
        link.click();
      } finally {
        URL.revokeObjectURL(url);
      }
    } catch {
      setError("Unable to download this template.");
    }
  }

  return (
    <section aria-labelledby="project-templates-heading">
      <h2 id="project-templates-heading">Project Office Templates</h2>
      <p>Upload your own project files, including Excel spreadsheets and other templates, up to 10 MB per file. Download them in their original format for reuse.</p>
      <p>Files are stored only in this browser, are not shared across devices, and can be accessed by anyone using this browser. Clearing site data removes them. Do not upload sensitive information. These files are not used in AI drafts.</p>
      <input ref={fileInput} type="file" hidden onChange={upload} />
      <button type="button" disabled={busy} onClick={() => fileInput.current.click()} style={buttonStyle}>Upload template</button>
      {message ? <p role="status">{message}</p> : null}
      {error ? <p role="alert" style={{ color: "#fca5a5" }}>{error}</p> : null}
      {!templates && !error ? <p role="status">Loading templates...</p> : null}
      {templates && templates.length === 0 ? <p>No project templates uploaded yet.</p> : null}
      {templates && templates.length > 0 ? (
        <ul style={{ paddingLeft: "1.25rem" }}>
          {templates.map((template) => (
            <li key={template.id} style={{ marginBottom: "0.75rem" }}>
              <span>{template.name}</span>{" "}
              <button type="button" disabled={busy} onClick={() => download(template)} style={buttonStyle} aria-label={`Download ${template.name}`}>Download</button>{" "}
              <button type="button" disabled={busy} onClick={() => remove(template)} style={buttonStyle} aria-label={`Delete ${template.name}`}>Delete</button>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
