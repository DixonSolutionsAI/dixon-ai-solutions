import { useState } from "react";

const inputStyle = {
  width: "100%",
  minHeight: "140px",
  borderRadius: "14px",
  border: "1px solid #334155",
  background: "#0f172a",
  color: "white",
  padding: "1rem",
  fontSize: "1rem",
  resize: "vertical",
  boxSizing: "border-box",
};

export default function Home() {
  const [message, setMessage] = useState(
    "Hi, I paid for shipping but my order still says pending. Can someone check this?"
  );
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult("");

    try {
      const response = await fetch("/api/reply-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to generate a draft.");
      }

      setResult(data.reply);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#020617",
        color: "white",
        padding: "48px 20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: "960px", margin: "0 auto" }}>
        <p
          style={{
            color: "#7dd3fc",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            fontWeight: 700,
            fontSize: "0.8rem",
            marginBottom: "1rem",
          }}
        >
          InstantReply support agent
        </p>

        <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", lineHeight: 1.1, marginBottom: "1rem" }}>
          Draft a customer-support reply from the conversation.
        </h1>

        <p style={{ fontSize: "1.1rem", color: "#dfe7f5", maxWidth: "760px", marginBottom: "2rem" }}>
          This MVP focuses on a safe, human-reviewed reply workflow: the AI creates a first draft,
          the agent reviews it, edits it, and sends only after approval.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem" }}>
          <label style={{ display: "grid", gap: "0.5rem", fontWeight: 700 }}>
            Customer message
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={inputStyle}
              placeholder="Paste a customer message here..."
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "fit-content",
              background: "#38bdf8",
              color: "#082f49",
              border: "none",
              borderRadius: "999px",
              padding: "0.9rem 1.4rem",
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Generating draft..." : "Generate draft"}
          </button>
        </form>

        {error ? (
          <div
            style={{
              marginTop: "1.5rem",
              background: "#7f1d1d",
              border: "1px solid #ef4444",
              borderRadius: "14px",
              padding: "1rem",
              color: "#fee2e2",
            }}
          >
            {error}
          </div>
        ) : null}

        {result ? (
          <section
            style={{
              marginTop: "2rem",
              background: "#0f172a",
              border: "1px solid #1e293b",
              borderRadius: "18px",
              padding: "1.25rem",
            }}
          >
            <h2 style={{ marginTop: 0, marginBottom: "0.75rem", color: "#7dd3fc" }}>
              Suggested response draft
            </h2>
            <div
              style={{
                whiteSpace: "pre-wrap",
                lineHeight: 1.7,
                color: "#e2e8f0",
              }}
            >
              {result}
            </div>
            <p style={{ marginTop: "1rem", marginBottom: 0, color: "#cbd5e1" }}>
              Human review is still required before sending.
            </p>
          </section>
        ) : null}
      </div>
    </main>
  );
}
