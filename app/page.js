export const metadata = {
  title: "InstantReply AI Agent | AI Customer Support Automation",
  description:
    "InstantReply AI Agent helps enterprise teams reduce first-response time to under 30 seconds with context-aware AI replies across email, chat, Slack, and WhatsApp.",
  keywords: [
    "AI customer support",
    "customer support AI",
    "AI reply agent",
    "enterprise support automation",
    "Zendesk AI",
    "Intercom AI",
    "first response time reduction"
  ],
  openGraph: {
    title: "InstantReply AI Agent",
    description:
      "Context-aware AI agent for enterprise support teams that drafts replies in under 30 seconds across email, chat, Slack, and WhatsApp.",
    type: "website"
  }
};

export default function Home() {
  return (
    <main
      style={{
        fontFamily: "Arial",
        background: "#020617",
        color: "white",
        minHeight: "100vh",
        padding: "40px",
        lineHeight: 1.6
      }}
    >
      <section style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <p
          style={{
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "#7dd3fc",
            fontSize: "0.8rem",
            fontWeight: 700,
            marginBottom: "1rem"
          }}
        >
          InstantReply AI Agent
        </p>

        <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 5rem)", margin: "0 0 1rem" }}>
          Reduce customer support response time from hours to under 30 seconds.
        </h1>

        <p style={{ fontSize: "1.25rem", maxWidth: "780px", color: "#e2e8f0" }}>
          InstantReply AI Agent drafts context-aware responses for enterprise teams
          across email, chat, Slack, and WhatsApp — while integrating with Zendesk
          and Intercom.
        </p>

        <div style={{ marginTop: "2rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <a
            href="https://calendly.com"
            style={{
              display: "inline-block",
              background: "#38bdf8",
              color: "#082f49",
              textDecoration: "none",
              padding: "0.9rem 1.4rem",
              borderRadius: "999px",
              fontWeight: 700
            }}
          >
            Book a Demo
          </a>
          <a
            href="#pricing"
            style={{
              display: "inline-block",
              border: "1px solid #334155",
              color: "white",
              textDecoration: "none",
              padding: "0.9rem 1.4rem",
              borderRadius: "999px",
              fontWeight: 700
            }}
          >
            See Pricing
          </a>
        </div>

        <div
          style={{
            marginTop: "3rem",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "1rem"
          }}
        >
          <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "16px", padding: "1.2rem" }}>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "#7dd3fc" }}>85%</div>
            <div style={{ color: "#cbd5e1" }}>Faster first response</div>
          </div>
          <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "16px", padding: "1.2rem" }}>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "#7dd3fc" }}>1.2s</div>
            <div style={{ color: "#cbd5e1" }}>Average reply generation</div>
          </div>
          <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "16px", padding: "1.2rem" }}>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "#7dd3fc" }}>4.9/5</div>
            <div style={{ color: "#cbd5e1" }}>Customer satisfaction rating</div>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: "1100px", margin: "4rem auto 0" }}>
        <h2>How it works</h2>
        <ul>
          <li>Reads ticket history and customer context</li>
          <li>Drafts accurate responses in under 30 seconds</li>
          <li>Supports email, live chat, Slack, and WhatsApp</li>
          <li>Lets human agents approve or refine before sending</li>
        </ul>
      </section>

      <section id="pricing" style={{ maxWidth: "1100px", margin: "4rem auto 0" }}>
        <h2>Pricing</h2>
        <ul>
          <li>Starter - $49/month</li>
          <li>Growth - $149/month</li>
          <li>Enterprise - Custom</li>
        </ul>
      </section>
    </main>
  );
}
