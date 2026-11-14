"use client";

import { useEffect, useState } from "react";
import { useAccess } from "../access-context";
import { useStaff } from "../staff-context";
import { KIND_LABELS, buildSessions, dateKey, formatDuration, needsApproval, periodBounds, reviewTimesheet, summarizeDay, validateEmployee, workedInPeriod } from "../../../lib/staff";
import { deleteStaffDocuments, getStaffDocument, saveStaffDocuments } from "../../staff-document-storage.mjs";

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

  async function submit(event) {
    event.preventDefault();
    const formElement = event.target;
    let uploaded = false;
    try {
      validateEmployee({ ...form, contact }, employees);
      const savedDocuments = await saveStaffDocuments(form.employeeId, documents);
      uploaded = savedDocuments.length > 0;
      try {
        hire({ ...form, contact, documents: savedDocuments });
      } catch (err) {
        if (uploaded) {
          try {
            await deleteStaffDocuments(form.employeeId);
          } catch {
            throw new Error(`${err.message} Uploaded files could not be cleaned up; remove them from this browser's site data.`);
          }
        }
        throw err;
      }
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
          <input style={field} type="file" multiple onChange={(event) => setDocuments([...event.target.files])} />
        </label>
        <p style={{ margin: 0 }}>Select multiple documents at once (up to 10 MB per file). Complete files are stored in this browser and shown under the employee after hiring; they are not shared across devices.</p>
        {documents.length ? <ul aria-label="Selected onboarding documents">{documents.map((document) => <li key={`${document.name}-${document.size}`}>{document.name} · {(document.size / 1024).toFixed(1)} KB</li>)}</ul> : null}
        <label style={label}>Username<input style={field} value={form.username} onChange={update("username")} autoComplete="off" maxLength={32} aria-describedby="username-requirements" required /></label>
        <p id="username-requirements" style={{ margin: 0 }}>Use 2–32 characters with at least 2 letters, at least 1 number and exactly 1 underscore. Spaces, dots and hyphens are not allowed.</p>
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
              <div>{employee.name} · ID {employee.employeeId} · {employee.username} · {employee.hours} h/wk · hired {employee.hireDate} · {employee.passwordHash ? "password set" : "awaiting password"}</div>
              {employee.documents?.length ? <ul aria-label={`${employee.name} onboarding documents`}>{employee.documents.map((document) => (
                <li key={document.id}>{document.name} · {(document.size / 1024).toFixed(1)} KB{" "}
                  <button type="button" onClick={async () => {
                    try {
                      const saved = await getStaffDocument(document.id);
                      if (!saved) throw new Error("This document is missing from this browser's storage.");
                      const url = URL.createObjectURL(saved.file);
                      const link = window.document.createElement("a");
                      link.href = url;
                      link.download = saved.name;
                      link.click();
                      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
                    } catch (err) {
                      setError(err.message);
                    }
                  }} style={{ ...button, padding: "0.2rem 0.6rem", fontSize: "0.85rem" }}>Download</button>
                </li>
              ))}</ul> : null}
              <button type="button" onClick={async () => {
                try {
                  if (employee.documents?.length) await deleteStaffDocuments(employee.employeeId);
                  removeEmployee(employee.employeeId);
                  setError("");
                } catch (err) {
                  setError(err.message);
                }
              }} style={{ ...button, padding: "0.2rem 0.6rem", fontSize: "0.85rem" }}>Remove</button>
            </li>
          ))}
        </ul>
      ) : <p>No employees yet.</p>}
    </section>
  );
}

function StaffVault() {
  const { unlocked } = useAccess();
  const { employees, events, approvals, approveTimesheet } = useStaff();
  const [view, setView] = useState("storage");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [date, setDate] = useState(() => dateKey(new Date()));
  const [periodDate, setPeriodDate] = useState(() => dateKey(new Date()));
  const [periods, setPeriods] = useState({});
  const [now, setNow] = useState(() => new Date());
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);
  const employeeId = employees.some((employee) => employee.employeeId === selectedEmployee) ? selectedEmployee : employees[0]?.employeeId || "";
  const mine = events.filter((event) => event.employeeId === employeeId);
  const summary = summarizeDay(mine, now, date);
  const review = reviewTimesheet(mine, date, now);
  const approval = approvals.find((item) => item.employeeId === employeeId && item.day === date && item.signature === review.signature);
  const flagged = employees.flatMap((employee) => buildSessions(events.filter((event) => event.employeeId === employee.employeeId), now)
    .filter(needsApproval)
    .map((session) => ({ employee, session })));

  function approve() {
    try {
      approveTimesheet(employeeId, date, review.signature);
      setError("");
      setNotice("Timesheet approved in this browser.");
    } catch (err) {
      setError(err.message);
      setNotice("");
    }
  }

  function selectTimesheet(id, day, scroll = false) {
    setSelectedEmployee(id);
    setDate(day);
    setError("");
    setNotice("");
    if (scroll) document.getElementById("daily-timesheet-heading")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <section style={card} aria-labelledby="vault-heading">
      <h2 id="vault-heading" style={heading}>Staff Vault</h2>
      <p>Records and approvals are stored only in this browser. They are not shared across devices and can be altered by anyone with access to the browser; this is not a secure payroll record.</p>
      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        <button type="button" style={button} aria-pressed={view === "storage"} onClick={() => setView("storage")}>Storage</button>
        <button type="button" style={button} aria-pressed={view === "timesheets"} onClick={() => setView("timesheets")}>Employee timesheets</button>
      </div>
      {view === "storage" ? <>
      <p>Choose where employee records, time logs and onboarding documents should be stored. Connecting is not available yet.</p>
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
      </> : !unlocked ? <p>Unlock the pilot to view timesheets and review sessions.</p> : <>
        <h3>Over-limit sessions</h3>
        <p>More than 30 minutes for a 30 minute break, or more than one hour for any other session, is flagged. Every daily timesheet requires supervisor review, including those without flagged sessions.</p>
        {error ? <p role="alert" style={{ color: "#fca5a5" }}>{error}</p> : null}
        {notice ? <p role="status" style={{ color: "#86efac" }}>{notice}</p> : null}
        {flagged.length ? <ul>{flagged.map(({ employee, session }) => (
          <li key={`${employee.employeeId}-${session.start}`} style={{ marginBottom: "0.75rem" }}>
            {employee.name} · {employee.employeeId} · {KIND_LABELS[session.kind]} · {new Date(session.start).toLocaleString()} · {formatDuration(session.durationMs)}{session.end ? "" : " (in progress)"}{" "}
            <button type="button" style={button} onClick={() => selectTimesheet(employee.employeeId, dateKey(session.start), true)}>Review timesheet</button>
          </li>
        ))}</ul> : <p>No over-limit sessions recorded.</p>}
        <h3 id="daily-timesheet-heading">Employee daily timesheet</h3>
        {employees.length ? <>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <label style={label}>Employee
              <select style={field} value={employeeId} onChange={(event) => selectTimesheet(event.target.value, date)}>
                {employees.map((employee) => <option key={employee.employeeId} value={employee.employeeId}>{employee.name} · {employee.employeeId}</option>)}
              </select>
            </label>
            <label style={label}>Date<input style={field} type="date" value={date} onChange={(event) => selectTimesheet(employeeId, event.target.value)} /></label>
          </div>
          <p>Worked: {formatDuration(summary.workedMs)} · Lunch: {formatDuration(summary.lunchMs)} · Break: {formatDuration(summary.breakMs)}</p>
          {summary.sessions.length ? <ul>{summary.sessions.map((session) => <li key={session.start}>{KIND_LABELS[session.kind]} · {new Date(session.start).toLocaleTimeString()} – {session.end ? new Date(session.end).toLocaleTimeString() : "now"} · {formatDuration(session.durationMs)}</li>)}</ul> : <p>No sessions recorded for this date.</p>}
          <p>Timesheet status: <strong>{approval ? `Approved ${new Date(approval.at).toLocaleString()}` : review.sessions.length ? "Awaiting supervisor approval" : "No recorded sessions"}</strong></p>
          <p>Review the sessions above, then approve. Sessions still in progress must end first. A changed timesheet requires a new approval.</p>
          <button type="button" style={button} disabled={!review.canApprove || Boolean(approval)} onClick={approve}>Approve reviewed timesheet</button>
        </> : <p>No employees in this browser.</p>}
        <h3>All employee hours</h3>
        <p>Worked time includes Cue Time and Meeting, but excludes lunch and breaks. Totals include unapproved and in-progress time. Weeks run Monday–Sunday; biweekly periods begin January 5, 2026. Monthly totals use calendar months.</p>
        <label style={label}>Period containing date<input type="date" style={field} value={periodDate} onChange={(event) => setPeriodDate(event.target.value)} /></label>
        {employees.length ? <ul style={{ paddingLeft: "1.25rem" }}>{employees.map((employee) => {
          const period = periods[employee.employeeId] || "weekly";
          const bounds = periodBounds(periodDate, period);
          const employeeEvents = events.filter((event) => event.employeeId === employee.employeeId);
          const lastDay = bounds ? new Date(bounds[1].getFullYear(), bounds[1].getMonth(), bounds[1].getDate() - 1) : null;
          const days = [];
          if (bounds) {
            for (const cursor = new Date(bounds[0]); cursor < bounds[1]; cursor.setDate(cursor.getDate() + 1)) {
              const day = dateKey(cursor);
              const dayReview = reviewTimesheet(employeeEvents, day, now);
              if (!dayReview.sessions.length) continue;
              const approved = approvals.some((item) => item.employeeId === employee.employeeId && item.day === day && item.signature === dayReview.signature);
              days.push({ day, approved });
            }
          }
          return <li key={employee.employeeId} style={{ margin: "1rem 0" }}>
            <strong>{employee.name}</strong> · {employee.employeeId}
            <label style={label}>Period for {employee.name}
              <select style={field} value={period} onChange={(event) => setPeriods({ ...periods, [employee.employeeId]: event.target.value })}>
                <option value="weekly">Weekly</option>
                <option value="biweekly">Biweekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </label>
            {bounds ? <p>{dateKey(bounds[0])} – {dateKey(lastDay)}: <strong>{formatDuration(workedInPeriod(employeeEvents, ...bounds, now))}</strong></p> : <p>Select a valid period date.</p>}
            <details>
              <summary>Daily timesheets ({days.filter((day) => !day.approved).length} awaiting approval)</summary>
              {days.length ? <ul>{days.map(({ day, approved }) => <li key={day} style={{ margin: "0.5rem 0" }}>{day} · {approved ? "Approved" : "Awaiting approval"}{" "}
                <button type="button" style={button} onClick={() => selectTimesheet(employee.employeeId, day, true)}>Review {employee.name} · {day}</button>
              </li>)}</ul> : <p>No recorded sessions in this period.</p>}
            </details>
          </li>;
        })}</ul> : <p>No employees in this browser.</p>}
        <h3>Invoice and payment connections</h3>
        <p>QuickBooks and other invoice or payment connections are not available yet. No timesheets or payments are sent.</p>
        <button type="button" disabled title="Not yet implemented" style={{ ...button, cursor: "not-allowed", opacity: 0.6 }}>Connect QuickBooks or payment provider (coming soon)</button>
      </>}
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
