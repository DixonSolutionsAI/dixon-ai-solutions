export const metadata = {
  title: "Services | InstantReply AI Agent",
  description:
    "Explore how InstantReply AI Agent helps support teams reduce repetitive response work, improve response speed, and maintain human oversight across key support channels.",
};

const sectionStyle = { marginTop: "3rem" };
const cardStyle = {
  background: "#0f172a",
  border: "1px solid #1e293b",
  borderRadius: "18px",
  padding: "1.5rem",
};

export default function ServicesPage() {
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
          Services
        </p>

        <h1 style={{ fontSize: "clamp(2.3rem, 4vw, 4rem)", lineHeight: 1.1 }}>
          Built to keep support teams fast, clear, and in control.
        </h1>

        <p style={{ fontSize: "1.15rem", color: "#dfe7f5", maxWidth: "820px" }}>
          InstantReply AI Agent helps support teams move faster by turning customer
          conversations into useful, human-reviewed reply drafts—without removing the
          judgment and accountability of the team handling the case.
        </p>

        <section style={sectionStyle}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "1rem",
            }}
          >
            <article style={cardStyle}>
              <h3 style={{ marginTop: 0, color: "#7dd3fc" }}>AI Reply Drafting</h3>
              <p style={{ marginBottom: 0 }}>
                Turn incoming customer conversations into high-quality, context-aware reply
                drafts so agents can respond faster with less blank-page friction.
              </p>
            </article>
            <article style={cardStyle}>
              <h3 style={{ marginTop: 0, color: "#7dd3fc" }}>Context-Aware Support</h3>
              <p style={{ marginBottom: 0 }}>
                Pull in relevant customer history and conversation context so each response
                feels informed instead of generic.
              </p>
            </article>
            <article style={cardStyle}>
              <h3 style={{ marginTop: 0, color: "#7dd3fc" }}>Human Review Workflow</h3>
              <p style={{ marginBottom: 0 }}>
                Keep people in the loop for approval, refinement, and escalation so teams stay
                in control of the customer experience.
              </p>
            </article>
            <article style={cardStyle}>
              <h3 style={{ marginTop: 0, color: "#7dd3fc" }}>Multi-Channel Support</h3>
              <p style={{ marginBottom: 0 }}>
                Support your team across email, live chat, Slack, and WhatsApp without forcing
                a major process overhaul.
              </p>
            </article>
          </div>
        </section>

        <section style={sectionStyle}>
          <h2>How it works</h2>
          <div style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}>
            <div style={cardStyle}>
              <strong>1. Capture the customer context</strong>
              <p style={{ marginBottom: 0 }}>
                InstantReply looks at the current conversation and relevant support history to
                understand what the customer needs.
              </p>
            </div>
            <div style={cardStyle}>
              <strong>2. Draft a useful reply</strong>
              <p style={{ marginBottom: 0 }}>
                The system prepares a clear, brand-aware response that reflects the context and
                the support workflow behind it.
              </p>
            </div>
            <div style={cardStyle}>
              <strong>3. Human review and send</strong>
              <p style={{ marginBottom: 0 }}>
                Agents review, refine, or approve the draft before sending—keeping quality and
                accountability in the hands of the team.
              </p>
            </div>
          </div>
        </section>

        <section style={sectionStyle}>
          <h2>Who it is for</h2>
          <ul>
            <li>Support teams handling high-volume repetitive conversations</li>
            <li>Organizations looking to reduce response time without sacrificing quality</li>
            <li>Businesses already using Zendesk, Intercom, or similar support tools</li>
            <li>Teams that need AI to accelerate work without removing human oversight</li>
          </ul>
        </section>

        <section style={sectionStyle}>
          <h2>What teams gain</h2>
          <ul>
            <li>Faster response time for recurring customer questions</li>
            <li>More consistent first drafts across conversations and channels</li>
            <li>Less repetitive work for support agents</li>
            <li>More time for complex, high-value customer interactions</li>
          </ul>
        </section>

        <section style={{ ...sectionStyle, ...cardStyle }}>
          <h2 style={{ marginTop: 0 }}>Ready to reduce response time without losing control?</h2>
          <p>
            See how InstantReply AI Agent can fit into your support workflow and help your
            team reply faster with better context.
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
