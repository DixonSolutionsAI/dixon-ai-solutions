"use client";

import { useState } from "react";
import { useAccess } from "../access-context";
import { useStaff } from "../staff-context";

const card = { maxWidth: "900px", margin: "0 auto 1rem", background: "#0f172a", border: "1px solid #1e293b", borderRadius: "16px", padding: "1.25rem" };
const field = { width: "100%", borderRadius: "12px", border: "1px solid #334155", background: "#020617", color: "white", padding: "0.8rem 1rem", fontSize: "1rem", boxSizing: "border-box" };
const button = { ...field, width: "auto", cursor: "pointer", fontWeight: 700 };
const label = { display: "grid", gap: "0.4rem", fontWeight: 700 };
const heading = { color: "#7dd3fc", marginTop: 0 };
const emptyHire = { name: "", hireDate: "", employeeId: "", hours: "", username: "" };

function Unlock() {
  const { unlocked, unlock, lock } = useAccess();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setError("");
    try {
      await unlock(code);
      setCode("");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section style={card} aria-labelledby="unlock-heading">
      <h2 id="unlock-heading" style={heading}>Administrator unlock</h2>
      {unlocked ? (
        <>
          <p role="status">The pilot is unlocked for this browser. Employees cannot see the code.</p>
          <button type="button" onClick={lock} style={button}>Lock pilot</button>
        </>
      ) : (
        <form onSubmit={submit} style={{ display: "grid", gap: "0.75rem" }}>
          <label style={label}>Pilot access code
            <input type="password" value={code} onChange={(event) => setCode(event.target.value)} autoComplete="off" maxLength={256} placeholder="Provided by the pilot owner" style={field} />
          </label>
          <p style={{ margin: 0 }}>The code is sent once, stored only in a secure cookie, and never shown to employees.</p>
          {error ? <p role="alert" style={{ color: "#fca5a5", margin: 0 }}>{error}</p> : null}
          <button type="submit" disabled={!code.trim()} style={{ ...button, justifySelf: "start" }}>Unlock pilot</button>
        </form>
      )}
    </section>
  );
}

function EmployeeHire() {
  const { employees, hire, removeEmployee } = useStaff();
  const [form, setForm] = useState(emptyHire);
  const [contact, setContact] = useState({ email: "", phone: "" });
  const [contactOpen, setContactOpen] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const update = (key) => (event) => setForm({ ...form, [key]: event.target.value });

  function submit(event) {
    event.preventDefault();
    const formElement = event.target;
    try {
      hire({ ...form, contact, documents });
      setNotice(`${form.name} added. They can now set a password on the Employee tab.`);
      setError("");
      setForm(emptyHire);
      setContact({ email: "", phone: "" });
      setDocuments([]);
      formElement.reset();
    } catch (err) {
      setError(err.message);
      setNotice("");
    }
  }

  return (
    <section style={card} aria-labelledby="hire-heading">
      <h2 id="hire-heading" style={heading}>Employee Hire</h2>
      <form onSubmit={submit} style={{ display: "grid", gap: "1rem" }}>
        <label style={label}>Name<input style={field} value={form.name} onChange={update("name")} required /></label>
        <label style={label}>Hire Date<input style={field} type="date" value={form.hireDate} onChange={update("hireDate")} required /></label>
        <div>
          <button type="button" style={button} onClick={() => setContactOpen(true)}>Contact Details{contact.email || contact.phone ? " ✓" : ""}</button>
        </div>
        <label style={label}>Employee ID<input style={field} value={form.employeeId} onChange={update("employeeId")} required /></label>
        <label style={label}>Hours (per week)<input style={field} type="number" min="1" max="168" value={form.hours} onChange={update("hours")} required /></label>
        <label style={label}>Onboarding documents
          <input style={field} type="file" multiple onChange={(event) => setDocuments([...event.target.files].map(({ name, size }) => ({ name, size })))} />
        </label>
        <p style={{ margin: 0 }}>Only file names are recorded for now. Files are not stored until a Staff Vault is connected.</p>
        <label style={label}>Username<input style={field} value={form.username} onChange={update("username")} autoComplete="off" required /></label>
        {error ? <p role="alert" style={{ color: "#fca5a5", margin: 0 }}>{error}</p> : null}
        {notice ? <p role="status" style={{ color: "#86efac", margin: 0 }}>{notice}</p> : null}
        <button type="submit" style={{ ...button, justifySelf: "start" }}>Hire employee</button>
      </form>

      {contactOpen ? (
        <dialog open aria-label="Contact details" style={{ background: "#0f172a", color: "white", border: "1px solid #334155", borderRadius: "16px", padding: "1.25rem", width: "min(420px, 90vw)" }}>
          <div style={{ display: "grid", gap: "1rem" }}>
            <label style={label}>Email<input style={field} type="email" value={contact.email} onChange={(event) => setContact({ ...contact, email: event.target.value })} /></label>
            <label style={label}>Phone<input style={field} type="tel" value={contact.phone} onChange={(event) => setContact({ ...contact, phone: event.target.value })} /></label>
            <button type="button" style={button} onClick={() => setContactOpen(false)}>Done</button>
          </div>
        </dialog>
      ) : null}

      <h3>Employees</h3>
      {employees.length ? (
        <ul style={{ paddingLeft: "1.25rem" }}>
          {employees.map((employee) => (
            <li key={employee.employeeId} style={{ marginBottom: "0.5rem" }}>
              {employee.name} · ID {employee.employeeId} · {employee.username} · {employee.hours} h/wk · hired {employee.hireDate} · {employee.passwordHash ? "password set" : "awaiting password"}{" "}
              <button type="button" onClick={() => removeEmployee(employee.employeeId)} style={{ ...button, padding: "0.2rem 0.6rem", fontSize: "0.85rem" }}>Remove</button>
            </li>
          ))}
        </ul>
      ) : <p>No employees yet.</p>}
    </section>
  );
}

function StaffVault() {
  return (
    <section style={card} aria-labelledby="vault-heading">
      <h2 id="vault-heading" style={heading}>Staff Vault</h2>
      <p>Choose where employee records, time logs and onboarding documents should be stored. Connecting is not available yet; for now employee data lives only in this browser.</p>
      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "end" }}>
        <label style={label}>Storage provider
          <select style={field} defaultValue="">
            <option value="" disabled>Select a provider</option>
            <option>Supabase</option>
            <option>Microsoft 365 / SharePoint</option>
            <option>Google Cloud / Drive</option>
            <option>Other</option>
          </select>
        </label>
        <button type="button" disabled title="Not yet implemented" style={{ ...button, cursor: "not-allowed", opacity: 0.6 }}>Connect (coming soon)</button>
      </div>
    </section>
  );
}

export default function AccessPage() {
  const { unlocked } = useAccess();

  return (
    <main style={{ minHeight: "100vh", padding: "40px 20px 64px" }}>
      <section style={card} aria-labelledby="access-heading">
        <h1 id="access-heading" style={heading}>Access</h1>
        <p>This pilot sends your inquiry, draft, and uploaded documents to OpenAI to generate responses. Uploaded documents stay in this browser, where anyone using it can access them. Confidentiality cannot be guaranteed; use fictional or redacted information only.</p>
      </section>
      <Unlock />
      {unlocked ? <EmployeeHire /> : <section style={card}><p style={{ margin: 0 }}>Unlock the pilot to hire employees.</p></section>}
      <StaffVault />
    </main>
  );
}
