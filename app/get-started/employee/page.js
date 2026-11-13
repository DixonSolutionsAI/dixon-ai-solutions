"use client";

import { useEffect, useState } from "react";
import { useStaff } from "../staff-context";
import { EVENT_LABELS, KIND_LABELS, dateKey, formatDuration, getAllowedEvents, summarizeDay } from "../../../lib/staff";

const card = { maxWidth: "900px", margin: "0 auto 1rem", background: "#0f172a", border: "1px solid #1e293b", borderRadius: "16px", padding: "1.25rem" };
const field = { width: "100%", borderRadius: "12px", border: "1px solid #334155", background: "#020617", color: "white", padding: "0.8rem 1rem", fontSize: "1rem", boxSizing: "border-box" };
const button = { ...field, width: "auto", cursor: "pointer", fontWeight: 700 };
const label = { display: "grid", gap: "0.4rem", fontWeight: 700 };
const STATUS_TEXT = { out: "Clocked out", working: "Working", lunch: "On lunch", break: "On break", break30: "On 30 minute break", break60: "On hour break", cue: "In Cue Time", meeting: "In a meeting" };
const time = (iso) => (iso ? new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) : "now");

function SignIn() {
  const { signIn, setPassword, ready } = useStaff();
  const [mode, setMode] = useState("signin");
  const [form, setForm] = useState({ username: "", id: "", password: "" });
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const update = (key) => (event) => setForm({ ...form, [key]: event.target.value });

  async function submit(event) {
    event.preventDefault();
    setError("");
    try {
      if (mode === "setup") {
        await setPassword(form.username, form.id, form.password);
        setNotice("Password saved. Sign in below.");
        setMode("signin");
        setForm({ ...form, password: "" });
      } else {
        await signIn(form.username, form.id, form.password);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section style={card} aria-labelledby="signin-heading">
      <h1 id="signin-heading" style={{ color: "#7dd3fc", marginTop: 0 }}>Employee {mode === "signin" ? "sign in" : "first-time setup"}</h1>
      <p>You must sign in and clock in before you can use the Work Space.</p>
      <form onSubmit={submit} style={{ display: "grid", gap: "1rem" }}>
        <label style={label}>Username<input style={field} value={form.username} onChange={update("username")} autoComplete="username" required /></label>
        <label style={label}>Company ID<input style={field} value={form.id} onChange={update("id")} required /></label>
        <label style={label}>{mode === "setup" ? "Choose a password (8+ characters)" : "Password"}
          <input style={field} type="password" value={form.password} onChange={update("password")} autoComplete={mode === "setup" ? "new-password" : "current-password"} required />
        </label>
        {error ? <p role="alert" style={{ color: "#fca5a5", margin: 0 }}>{error}</p> : null}
        {notice ? <p role="status" style={{ color: "#86efac", margin: 0 }}>{notice}</p> : null}
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <button type="submit" disabled={!ready} style={button}>{mode === "setup" ? "Save password" : "Sign in"}</button>
          <button type="button" style={{ ...button, background: "transparent", color: "#7dd3fc" }} onClick={() => { setMode(mode === "signin" ? "setup" : "signin"); setError(""); setNotice(""); }}>
            {mode === "signin" ? "First time? Set your password" : "Back to sign in"}
          </button>
        </div>
      </form>
    </section>
  );
}

function Report({ events, employee, now }) {
  const [date, setDate] = useState(() => dateKey(new Date()));
  const [kind, setKind] = useState("all");
  const [message, setMessage] = useState("");
  const summary = summarizeDay(events, now, date);
  const sessions = summary.sessions.filter((session) => kind === "all" || session.kind === kind);
  const text = [
    `Timesheet: ${employee.name} (${employee.employeeId})`,
    `Date: ${date}`,
    `Worked: ${formatDuration(summary.workedMs)} · Lunch: ${formatDuration(summary.lunchMs)} · Break: ${formatDuration(summary.breakMs)}`,
    ...summary.sessions.map((session) => `${KIND_LABELS[session.kind]}: ${time(session.start)} – ${time(session.end)} (${formatDuration(session.durationMs)})`),
  ].join("\n");

  function print() {
    const popup = window.open("", "_blank");
    if (!popup) {
      setMessage("Unable to open the print window. Allow pop-ups and try again.");
      return;
    }
    popup.document.title = "Timesheet";
    const content = popup.document.createElement("pre");
    content.style.whiteSpace = "pre-wrap";
    content.textContent = text;
    popup.document.body.appendChild(content);
    popup.print();
  }

  async function share() {
    setMessage("");
    try {
      if (navigator.share) {
        await navigator.share({ title: "Timesheet", text });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        setMessage("Timesheet copied to the clipboard.");
      } else {
        setMessage("Sharing is unavailable in this browser. Use Print instead.");
      }
    } catch (err) {
      if (err.name !== "AbortError") setMessage("Unable to share the timesheet. Try Print instead.");
    }
  }

  return (
    <section style={card} aria-labelledby="report-heading">
      <h2 id="report-heading" style={{ color: "#7dd3fc", marginTop: 0 }}>Daily log and report</h2>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <label style={label}>Date
          <input style={field} type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        </label>
        <label style={label}>Session type
          <select style={field} value={kind} onChange={(event) => setKind(event.target.value)}>
            <option value="all">All sessions</option>
            <option value="work">Work</option>
            <option value="lunch">Lunch</option>
            <option value="break">Break</option>
            <option value="break30">30 minute break</option>
            <option value="break60">Hour break</option>
            <option value="cue">Cue Time</option>
            <option value="meeting">Meeting</option>
          </select>
        </label>
      </div>
      <p>Worked: <strong>{formatDuration(summary.workedMs)}</strong> · Lunch: <strong>{formatDuration(summary.lunchMs)}</strong> · Break: <strong>{formatDuration(summary.breakMs)}</strong></p>
      <p>First clock in: {summary.firstClockIn ? time(summary.firstClockIn) : "—"} · Last clock out: {summary.lastClockOut ? time(summary.lastClockOut) : "—"}</p>
      {sessions.length ? (
        <ul style={{ paddingLeft: "1.25rem" }}>
          {sessions.map((session) => (
            <li key={session.start}>{KIND_LABELS[session.kind]}: {time(session.start)} – {time(session.end)} ({formatDuration(session.durationMs)})</li>
          ))}
        </ul>
      ) : <p>No sessions recorded.</p>}
      <h3>Keep a copy of this timesheet</h3>
      <p>Print or share the full timesheet for {date}. Records are stored only in this browser.</p>
      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        <button type="button" style={button} onClick={print}>Print timesheet</button>
        <button type="button" style={button} onClick={share}>Share timesheet</button>
      </div>
      {message ? <p role="status">{message}</p> : null}
    </section>
  );
}

export default function EmployeePage() {
  const { employee, myEvents, status, signOut, record } = useStaff();
  const [error, setError] = useState("");
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);
  const allowed = getAllowedEvents(myEvents);

  if (!employee) return <main style={{ padding: "40px 20px 64px" }}><SignIn /></main>;

  const today = summarizeDay(myEvents, now, dateKey(now));

  function selectAction(event) {
    const selected = event.target.value;
    if (!selected) return;
    try {
      record(selected);
      setError("");
      setNow(new Date());
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main style={{ padding: "40px 20px 64px" }}>
      <section style={card} aria-labelledby="employee-heading">
        <h1 id="employee-heading" style={{ color: "#7dd3fc", marginTop: 0 }}>Welcome, {employee.name}</h1>
        <p>Company ID {employee.employeeId} · Status: <strong>{STATUS_TEXT[status]}</strong></p>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "end" }}>
          <label style={label}>Time clock action
            <select style={field} value="" onChange={selectAction}>
              <option value="">Select an action</option>
              {allowed.map((type) => <option key={type} value={type}>{EVENT_LABELS[type]}</option>)}
            </select>
          </label>
          <button type="button" onClick={signOut} disabled={status !== "out"} title={status !== "out" ? "Clock out before signing out." : undefined} style={{ ...button, background: "transparent", color: "#7dd3fc" }}>Sign out</button>
        </div>
        {error ? <p role="alert" style={{ color: "#fca5a5" }}>{error}</p> : null}
        <p>Actions are recorded immediately. Sessions exceeding their limit require supervisor review in this browser.</p>
        <p>Today ({dateKey(now)}): worked <strong>{formatDuration(today.workedMs)}</strong>, lunch <strong>{formatDuration(today.lunchMs)}</strong>, break <strong>{formatDuration(today.breakMs)}</strong></p>
      </section>
      <Report events={myEvents} employee={employee} now={now} />
    </main>
  );
}
