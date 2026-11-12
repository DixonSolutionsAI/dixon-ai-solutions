"use client";

import { useEffect, useMemo, useState } from "react";
import { LOCATION_DATA, LOCATION_OPTIONS } from "../lib/location-data.js";

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

export default function Home() {
  const [accessCode, setAccessCode] = useState("");
  const [location, setLocation] = useState(LOCATION_OPTIONS[0] || "");
  const [message, setMessage] = useState("");
  const [supportContext, setSupportContext] = useState("");
  const [reply, setReply] = useState("");
  const [reviewNote, setReviewNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("Idle");
  const [pendingId, setPendingId] = useState("");

  const selectedLocationDetails = useMemo(() => LOCATION_DATA[location] || null, [location]);

  useEffect(() => {
    if (!pendingId) return undefined;
    let active = true;

    const pollStatus = async () => {
      try {
        const response = await fetch(`/api/approval-status?pendingId=${encodeURIComponent(pendingId)}`, { cache: "no-store" });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Could not load approval status.");
        if (!active) return;

        setStatus(data.status === "approved" ? "Verified reply is ready." : "Routing to a local specialist for final verification...");
        if (data.status === "approved" && data.approvedReply) {
          setReply(data.approvedReply);
          setReviewNote(data.reviewNote || "Approved by a local reviewer.");
        }
      } catch {
        if (active) setStatus("Still waiting for a local specialist to verify your reply...");
      }
    };

    pollStatus();
    const timer = setInterval(pollStatus, 2000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [pendingId]);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setReply("");
    setReviewNote("");
    setPendingId("");
    setStatus("Drafting response...");

    try {
      const response = await fetch("/api/reply-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessCode, location, message, supportContext }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to submit your request.");
      if (!data.pendingId) throw new Error("The review request was not created. Please try again.");

      setPendingId(data.pendingId);
      setStatus("Routing to a local specialist for final verification...");
    } catch (requestError) {
      setError(requestError.message || "Something went wrong. Please try again.");
      setStatus("Unable to submit your request.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ minHeight: "100vh", background: "#020617", color: "#f8fafc", padding: "40px 20px 64px", fontFamily: "Arial, sans-serif" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <p style={{ color: "#7dd3fc", textTransform: "uppercase", letterSpacing: "0.12em", fontSize: "0.8rem", fontWeight: 700 }}>
          InstantReply · private pilot prototype
        </p>
        <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 3.8rem)", lineHeight: 1.1, marginBottom: "0.8rem" }}>
          A useful first draft. Your agent makes the call.
        </h1>
        <p style={{ color: "#cbd5e1", fontSize: "1.05rem", lineHeight: 1.6, maxWidth: "760px" }}>
          Send a support question to a local specialist. A human verifies the response before it appears here.
        </p>
        <div role="status" aria-live="polite" style={{ ...cardStyle, margin: "1.25rem 0", borderColor: "#1d4ed8" }}>
          <strong style={{ color: "#93c5fd" }}>Status:</strong> {status}
        </div>
        <aside role="note" style={{ ...cardStyle, margin: "1.5rem 0", borderColor: "#854d0e", color: "#fef3c7" }}>
          <strong>Prototype safety:</strong> Use fictional or redacted examples only. Do not enter real customer personal, payment, health, or account information.
        </aside>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1.1rem" }}>
          <label style={{ display: "grid", gap: "0.5rem", fontWeight: 700 }}>
            Pilot access code
            <input type="password" value={accessCode} onChange={(event) => setAccessCode(event.target.value)} autoComplete="current-password" required maxLength={256} style={fieldStyle} placeholder="Provided by the pilot owner" />
          </label>
          <label style={{ display: "grid", gap: "0.5rem", fontWeight: 700 }}>
            Branch location
            <select value={location} onChange={(event) => setLocation(event.target.value)} style={fieldStyle} required>
              {LOCATION_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </label>
          {selectedLocationDetails ? (
            <div style={{ ...cardStyle, borderColor: "#38bdf8" }}>
              <strong style={{ color: "#7dd3fc" }}>Verified local branch details</strong>
              <div style={{ color: "#e2e8f0", display: "grid", gap: "0.35rem", marginTop: "0.6rem" }}>
                <div><strong>Hours:</strong> {selectedLocationDetails.hours}</div>
                <div><strong>Phone:</strong> {selectedLocationDetails.phone}</div>
                <div><strong>Policy:</strong> {selectedLocationDetails.policy}</div>
              </div>
            </div>
          ) : null}
          <label style={{ display: "grid", gap: "0.5rem", fontWeight: 700 }}>
            Customer message <span style={{ color: "#94a3b8", fontWeight: 400 }}>Required · max 5,000 characters</span>
            <textarea value={message} onChange={(event) => setMessage(event.target.value)} required maxLength={5000} rows={6} style={fieldStyle} placeholder="Describe your question..." />
          </label>
          <label style={{ display: "grid", gap: "0.5rem", fontWeight: 700 }}>
            Relevant confirmed details <span style={{ color: "#94a3b8", fontWeight: 400 }}>Optional · max 8,000 characters</span>
            <textarea value={supportContext} onChange={(event) => setSupportContext(event.target.value)} maxLength={8000} rows={4} style={fieldStyle} placeholder="Add relevant confirmed policy or order details. Leave blank if unknown." />
          </label>
          <button type="submit" disabled={loading || !message.trim() || !accessCode.trim()} style={{ width: "fit-content", background: "#38bdf8", color: "#082f49", border: 0, borderRadius: "999px", padding: "0.9rem 1.4rem", fontWeight: 700, cursor: loading ? "wait" : "pointer", opacity: loading || !message.trim() || !accessCode.trim() ? 0.65 : 1 }}>
            {loading ? "Submitting for review…" : "Ask a local specialist"}
          </button>
        </form>

        {error ? <p role="alert" style={{ marginTop: "1rem", padding: "1rem", background: "#7f1d1d", borderRadius: "12px", color: "#fee2e2" }}>{error}</p> : null}
        {reply ? (
          <section aria-labelledby="verified-heading" style={{ ...cardStyle, marginTop: "2rem", borderColor: "#16a34a" }}>
            <h2 id="verified-heading" style={{ color: "#86efac", marginTop: 0 }}>Verified response</h2>
            <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{reply}</p>
            {reviewNote ? <p style={{ color: "#cbd5e1" }}>{reviewNote}</p> : null}
          </section>
        ) : null}
      </div>
    </main>
  );
}
