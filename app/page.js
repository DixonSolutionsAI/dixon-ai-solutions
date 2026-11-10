export const metadata = {
  title: "InstantReply AI Agent | AI Customer Support Automation",
  description:
    "InstantReply AI Agent helps support teams reduce repetitive reply work with context-aware AI drafts, human review, and multi-channel customer support workflows.",
};

const sectionStyle = { marginTop: "3rem" };
const cardStyle = {
  background: "#0f172a",
  border: "1px solid #1e293b",
  borderRadius: "18px",
  padding: "1.5rem",
};

export default function Home() {
  return (
    <main
      style={{
        fontFamily: "Arial, sans-serif",
        background: "#020617",
        color: "white",
        minHeight: "100vh",
        padding: "40px 20px",
        lineHeight: 1.7,
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <p
          style={{
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "#7dd3fc",
            fontSize: "0.8rem",
            fontWeight: 700,
            marginBottom: "1rem",
          }}
        >
          InstantReply AI Agent
        </p>

        <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 5rem)", lineHeight: 1.1, marginBottom: "1rem" }}>
          Give customers faster replies without losing the human touch.
        </h1>

        <p style={{ fontSize: "1.2rem", color: "#dfe7f5", maxWidth: "820px" }}>
          InstantReply AI Agent helps support teams draft context-aware customer replies
          across email, chat, Slack, and WhatsApp—while keeping people in control of the
          final response.
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
              fontWeight: 700,
            }}
          >
            Book a Demo
          </a>
          <a
            href="#how-it-works"
            style={{
              display: "inline-block",
              border: "1px solid #334155",
              color: "white",
              textDecoration: "none",
              padding: "0.9rem 1.4rem",
              borderRadius: "999px",
              fontWeight: 700,
            }}
          >
            See How It Works
          </a>
        </div>

        <section style={sectionStyle}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1rem",
            }}
          >
            <article style={cardStyle}>
              <h3 style={{ marginTop: 0, color: "#7dd3fc" }}>Context-aware drafts</h3>
              <p style={{ marginBottom: 0 }}>
                Pull in customer history and conversation details so responses feel informed,
                not generic.
              </p>
            </article>
            <article style={cardStyle}>
              <h3 style={{ marginTop: 0, color: "#7dd3fc" }}>Human in the loop</h3>
              <p style={{ marginBottom: 0 }}>
                Keep agents in control of approval, refinement, and escalation to protect
                customer trust.
              </p>
            </article>
            <article style={cardStyle}>
              <h3 style={{ marginTop: 0, color: "#7dd3fc" }}>Works with your stack</h3>
              <p style={{ marginBottom: 0 }}>
                Fit into the tools your team already uses, including Zendesk and Intercom.
              </p>
            </article>
          </div>
        </section>

        <section id="how-it-works" style={sectionStyle}>
          <h2>Designed to make support faster without creating a bot trap.</h2>
          <div style={{ display: "grid", gap: "1rem", marginTop: "1.25rem" }}>
            <div style={cardStyle}>
              <strong>1. Capture the right context</strong>
              <p style={{ marginBottom: 0 }}>
                InstantReply reads the active conversation and relevant history so the reply is
                grounded in what the customer actually needs.
              </p>
            </div>
            <div style={cardStyle}>
              <strong>2. Draft a useful response</strong>
              <p style={{ marginBottom: 0 }}>
                It generates a clear, brand-aware draft that helps agents respond quickly and
                consistently across support channels.
              </p>
            </div>
            <div style={cardStyle}>
              <strong>3. Keep humans in control</strong>
              <p style={{ marginBottom: 0 }}>
                Agents can review, edit, or escalate before sending—so customer experience stays
                thoughtful, not automated.
              </p>
            </div>
          </div>
        </section>

        <section style={sectionStyle}>
          <h2>Why support teams adopt it</h2>
          <ul>
            <li>Reduce repetitive reply work across email, chat, and messaging channels</li>
            <li>Improve response consistency without forcing a bot-first experience</li>
            <li>Give agents a stronger starting point instead of a blank inbox</li>
            <li>Keep human judgment in place for nuanced or sensitive conversations</li>
          </ul>
        </section>

        <section style={{ ...sectionStyle, ...cardStyle }}>
          <h2 style={{ marginTop: 0 }}>See how it fits your workflow.</h2>
          <p>
            Whether you want to speed up first replies, standardize response quality, or add
            AI support without losing control, InstantReply can help you evaluate the fit.
          </p>
          <a
            href="https://calendly.com"
            style={{
              display: "inline-block",
              background: "#38bdf8",
              color: "#082f49",
              textDecoration: "none",
              padding: "0.9rem 1.4rem",
              borderRadius: "999px",
              fontWeight: 700,
            }}
          >
            Book a Demo
          </a>
        </section>
      </div>
    </main>
  );
}
