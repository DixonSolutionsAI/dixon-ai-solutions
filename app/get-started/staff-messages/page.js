"use client";

import { createClient } from "@supabase/supabase-js";
import { useCallback, useEffect, useState } from "react";

const card = { maxWidth: "900px", margin: "0 auto 1rem", background: "#0f172a", border: "1px solid #1e293b", borderRadius: "16px", padding: "1.25rem" };
const field = { width: "100%", borderRadius: "12px", border: "1px solid #334155", background: "#020617", color: "white", padding: "0.8rem 1rem", fontSize: "1rem", boxSizing: "border-box" };
const button = { ...field, width: "auto", cursor: "pointer", fontWeight: 700 };
const label = { display: "grid", gap: "0.4rem", fontWeight: 700 };

function SignIn({ client }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const { error: signInError } = await client.auth.signInWithPassword({ email: email.trim(), password });
      if (signInError) setError("Sign-in failed. Check your credentials or contact your administrator.");
    } catch {
      setError("Unable to reach the sign-in service. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section style={card}>
      <h1 style={{ color: "#7dd3fc", marginTop: 0 }}>Staff Messages sign in</h1>
      <p>Use the secure account provided by your administrator. This is separate from the prototype Employee sign-in.</p>
      <form onSubmit={submit} style={{ display: "grid", gap: "1rem" }}>
        <label style={label}>Account email<input style={field} type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
        <label style={label}>Password<input style={field} type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
        {error && <p role="alert">{error}</p>}
        <div><button style={button} disabled={busy}>{busy ? "Signing in..." : "Sign in"}</button></div>
      </form>
    </section>
  );
}

function Inbox({ client, user }) {
  const [members, setMembers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [view, setView] = useState("inbox");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [directory, results] = await Promise.all([
        client.from("staff_members").select("user_id, display_name").order("display_name"),
        client.from("staff_messages").select("id, sender_id, recipient_id, subject, body, created_at").order("created_at", { ascending: false }),
      ]);
      if (directory.error || results.error) throw directory.error || results.error;
      if (!directory.data.some((member) => member.user_id === user.id)) {
        setError("Your account is not an active staff member. Contact your administrator.");
        setMembers([]);
        setMessages([]);
        return;
      }
      setMembers(directory.data);
      setMessages(results.data);
    } catch {
      setError("Unable to load staff messages. Check your connection or contact your administrator.");
    } finally {
      setLoading(false);
    }
  }, [client, user.id]);

  useEffect(() => { refresh(); }, [refresh]);

  async function send(event) {
    event.preventDefault();
    setError("");
    setNotice("");
    if (!subject.trim() || !body.trim()) {
      setError("Enter a subject and message before sending.");
      return;
    }
    setBusy(true);
    try {
      const { error: sendError } = await client.from("staff_messages").insert({
        recipient_id: recipient,
        subject: subject.trim(),
        body: body.trim(),
      });
      if (sendError) throw sendError;
      setSubject("");
      setBody("");
      setNotice("Message sent to the staff inbox.");
    } catch {
      setError("Unable to confirm delivery. Refresh Sent before trying again to avoid duplicates.");
      return;
    } finally {
      setBusy(false);
    }
    await refresh();
  }

  async function signOut() {
    const { error: signOutError } = await client.auth.signOut();
    if (signOutError) setError("Unable to sign out. Please try again.");
  }

  const colleagues = members.filter((member) => member.user_id !== user.id);
  const displayed = messages.filter((message) => view === "inbox" ? message.recipient_id === user.id : message.sender_id === user.id);
  const nameOf = (id) => members.find((member) => member.user_id === id)?.display_name || "Unavailable staff member";

  return (
    <>
      <section style={card}>
        <h1 style={{ color: "#7dd3fc", marginTop: 0 }}>Staff Messages</h1>
        <p>Private messages between staff in your company. Messages are not email and are not sent outside this workspace.</p>
        <button type="button" style={button} onClick={signOut}>Sign out of Staff Messages</button>
      </section>
      <section style={card}>
        <h2>New message</h2>
        <form onSubmit={send} style={{ display: "grid", gap: "1rem" }}>
          <label style={label}>To
            <select style={field} value={recipient} onChange={(event) => setRecipient(event.target.value)} required>
              <option value="">Select a staff member</option>
              {colleagues.map((member) => <option key={member.user_id} value={member.user_id}>{member.display_name}</option>)}
            </select>
          </label>
          <label style={label}>Subject<input style={field} value={subject} onChange={(event) => setSubject(event.target.value)} maxLength={200} required /></label>
          <label style={label}>Message<textarea style={field} value={body} onChange={(event) => setBody(event.target.value)} maxLength={10000} rows={6} required /></label>
          <div><button style={button} disabled={busy || loading || !colleagues.length}>{busy ? "Sending..." : "Send message"}</button></div>
        </form>
      </section>
      <section style={card}>
        <h2>{view === "inbox" ? "Inbox" : "Sent"}</h2>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <button type="button" style={button} aria-pressed={view === "inbox"} onClick={() => setView("inbox")}>Inbox</button>
          <button type="button" style={button} aria-pressed={view === "sent"} onClick={() => setView("sent")}>Sent</button>
          <button type="button" style={button} disabled={loading} onClick={refresh}>Refresh</button>
        </div>
        {loading ? <p>Loading messages...</p> : displayed.length ? displayed.map((message) => (
          <article key={message.id} style={{ borderTop: "1px solid #334155", marginTop: "1rem", paddingTop: "1rem", overflowWrap: "anywhere" }}>
            <h3>{message.subject}</h3>
            <p>{view === "inbox" ? "From" : "To"}: {nameOf(view === "inbox" ? message.sender_id : message.recipient_id)} · {new Date(message.created_at).toLocaleString()}</p>
            <p style={{ whiteSpace: "pre-wrap" }}>{message.body}</p>
          </article>
        )) : <p>No messages in {view === "inbox" ? "your inbox" : "Sent"}.</p>}
      </section>
      {error && <p role="alert" style={{ ...card, color: "#fca5a5" }}>{error}</p>}
      {notice && <p role="status" style={{ ...card, color: "#86efac" }}>{notice}</p>}
    </>
  );
}

export default function StaffMessagesPage() {
  const [client] = useState(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return null;
    try {
      return createClient(url, key);
    } catch {
      return null;
    }
  });
  const [session, setSession] = useState(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!client) return;
    let active = true;
    let authChanged = false;
    const { data: { subscription } } = client.auth.onAuthStateChange((_event, next) => {
      if (active) { authChanged = true; setSession(next); setReady(true); }
    });
    client.auth.getSession().then(({ data, error: sessionError }) => {
      if (!active || authChanged) return;
      if (sessionError) setError("Unable to restore your staff session. Please refresh or contact your administrator.");
      else setSession(data.session);
      setReady(true);
    }).catch(() => {
      if (active && !authChanged) {
        setError("Unable to restore your staff session. Please refresh or contact your administrator.");
        setReady(true);
      }
    });
    return () => { active = false; subscription.unsubscribe(); };
  }, [client]);

  return (
    <main style={{ padding: "40px 20px 64px" }}>
      {!client ? <section style={card}><h1>Staff Messages unavailable</h1><p>The administrator must configure the Supabase project before staff can sign in.</p></section>
        : error ? <section style={card} role="alert">{error}</section>
          : !ready ? <section style={card}>Loading staff sign-in...</section>
            : session ? <Inbox key={session.user.id} client={client} user={session.user} /> : <SignIn client={client} />}
    </main>
  );
}
