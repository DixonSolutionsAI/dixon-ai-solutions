"use client";

import { useMemo, useState } from "react";
import { useStaff } from "../staff-context";
import { EVENT_LABELS, dateKey, formatDuration, getAllowedEvents, summarizeDay } from "../../../lib/staff";

const card = { maxWidth: "900px", margin: "0 auto 1rem", background: "#0f172a", border: "1px solid #1e293b", borderRadius: "16px", padding: "1.25rem" };
const field = { width: "100%", borderRadius: "12px", border: "1px solid #334155", background: "#020617", color: "white", padding: "0.8rem 1rem", fontSize: "1rem", boxSizing: "border-box" };
const button = { ...field, width: "auto", cursor: "pointer", fontWeight: 700 };
const label = { display: "grid", gap: "0.4rem", fontWeight: 700 };
const STATUS_TEXT = { out: "Clocked out", working: "Working", lunch: "On lunch", break: "On break" };
const KIND_TEXT = { work: "Work", lunch: "Lunch", break: "Break" };
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

function Report({ events }) {
  const dates = useMemo(() => [...new Set([dateKey(new Date()), ...events.map((event) => dateKey(event.at))])].sort().reverse(), [events]);
  const [date, setDate] = useState(dates[0]);
  const [kind, setKind] = useState("all");
  const summary = summarizeDay(events.filter((event) => dateKey(event.at) === date));
  const sessions = summary.sessions.filter((session) => kind === "all" || session.kind === kind);

  return (
    <section style={card} aria-labelledby="report-heading">
      <h2 id="report-heading" style={{ color: "#7dd3fc", marginTop: 0 }}>Daily log and report</h2>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <label style={label}>Date
          <select style={field} value={date} onChange={(event) => setDate(event.target.value)}>{dates.map((d) => <option key={d} value={d}>{d}</option>)}</select>
        </label>
        <label style={label}>Session type
          <select style={field} value={kind} onChange={(event) => setKind(event.target.value)}>
            <option value="all">All sessions</option>
            <option value="work">Work</option>
            <option value="lunch">Lunch</option>
            <option value="break">Break</option>
          </select>
        </label>
      </div>
      <p>Worked: <strong>{formatDuration(summary.workedMs)}</strong> · Lunch: <strong>{formatDuration(summary.lunchMs)}</strong> · Break: <strong>{formatDuration(summary.breakMs)}</strong></p>
      <p>First clock in: {summary.firstClockIn ? time(summary.firstClockIn) : "—"} · Last clock out: {summary.lastClockOut ? time(summary.lastClockOut) : "—"}</p>
      {sessions.length ? (
        <ul style={{ paddingLeft: "1.25rem" }}>
          {sessions.map((session) => (
            <li key={session.start}>{KIND_TEXT[session.kind]}: {time(session.start)} – {time(session.end)} ({formatDuration(session.durationMs)})</li>
          ))}
        </ul>
      ) : <p>No sessions recorded.</p>}
    </section>
  );
}

export default function EmployeePage() {
  const { employee, myEvents, status, signOut, record } = useStaff();
  const [action, setAction] = useState("");
  const [error, setError] = useState("");
  const allowed = getAllowedEvents(myEvents);
  const selected = allowed.includes(action) ? action : allowed[0];

  if (!employee) return <main style={{ padding: "40px 20px 64px" }}><SignIn /></main>;

  const today = summarizeDay(myEvents.filter((event) => dateKey(event.at) === dateKey(new Date())));

  function submit(event) {
    event.preventDefault();
    try {
      record(selected);
      setError("");
      setAction("");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main style={{ padding: "40px 20px 64px" }}>
      <section style={card} aria-labelledby="employee-heading">
        <h1 id="employee-heading" style={{ color: "#7dd3fc", marginTop: 0 }}>Welcome, {employee.name}</h1>
        <p>Company ID {employee.employeeId} · Status: <strong>{STATUS_TEXT[status]}</strong></p>
        <form onSubmit={submit} style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "end" }}>
          <label style={label}>Time clock action
            <select style={field} value={selected} onChange={(event) => setAction(event.target.value)}>
              {allowed.map((type) => <option key={type} value={type}>{EVENT_LABELS[type]}</option>)}
            </select>
          </label>
          <button type="submit" style={button}>Record</button>
          <button type="button" onClick={signOut} disabled={status !== "out"} title={status !== "out" ? "Clock out before signing out." : undefined} style={{ ...button, background: "transparent", color: "#7dd3fc" }}>Sign out</button>
        </form>
        {error ? <p role="alert" style={{ color: "#fca5a5" }}>{error}</p> : null}
        <p>Today: worked <strong>{formatDuration(today.workedMs)}</strong>, lunch <strong>{formatDuration(today.lunchMs)}</strong>, break <strong>{formatDuration(today.breakMs)}</strong></p>
      </section>
      <Report events={myEvents} />
    </main>
  );
}
