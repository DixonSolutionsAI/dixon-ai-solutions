"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

const input = { padding: "0.75rem", borderRadius: "8px", border: "1px solid #475569", background: "#020617", color: "white" };
const button = { ...input, cursor: "pointer", fontWeight: 700 };

export default function SignIn({ authError }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState(authError ? "Sign-in could not be completed. Please try again." : "");
  const [busy, setBusy] = useState(false);

  function client() {
    return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  }

  async function submit(event, register) {
    event.preventDefault();
    setBusy(true);
    setStatus("");
    try {
      const supabase = client();
      const result = register
        ? await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/auth/callback` } })
        : await supabase.auth.signInWithPassword({ email, password });
      if (result.error) {
        setStatus(result.error.message);
      } else if (result.data.session) {
        window.location.assign("/workspace");
      } else {
        setStatus("Check your email for a confirmation link, then sign in.");
      }
    } catch {
      setStatus("Could not reach the sign-in service. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function oauth(provider) {
    setBusy(true);
    setStatus("");
    try {
      const { error } = await client().auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${window.location.origin}/auth/callback`, ...(provider === "azure" ? { scopes: "email" } : {}) },
      });
      if (error) {
        setStatus(error.message);
        setBusy(false);
      }
    } catch {
      setStatus("Could not reach the sign-in service. Please try again.");
      setBusy(false);
    }
  }

  return (
    <section>
      <h2>Sign in to your workspace</h2>
      <p>Google and Microsoft buttons sign you into the agent only; they do not connect company data.</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
        <button type="button" disabled={busy} onClick={() => oauth("google")} style={button}>Sign in with Google</button>
        <button type="button" disabled={busy} onClick={() => oauth("azure")} style={button}>Sign in with Microsoft</button>
      </div>
      <form onSubmit={(event) => submit(event, false)} style={{ display: "grid", gap: "0.75rem", maxWidth: "400px", marginTop: "1.5rem" }}>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required style={input} />
        <label htmlFor="password">Password</label>
        <input id="password" type="password" autoComplete="current-password" minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} required style={input} />
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button type="submit" disabled={busy} style={button}>Sign in</button>
          <button type="button" disabled={busy || !email || password.length < 8} onClick={(event) => submit(event, true)} style={button}>Create account</button>
        </div>
      </form>
      {status && <p role="status">{status}</p>}
    </section>
  );
}
