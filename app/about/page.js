export const metadata = {
  title: "About InstantReply AI Agent | Human-Controlled Support AI",
  description:
    "Discover InstantReply AI Agent's focused approach to faster customer support: context-aware reply drafts, human oversight, and workflows designed around your existing support operation.",
};

const sectionStyle = { marginTop: "3rem" };
const cardStyle = {
  background: "#0f172a",
  border: "1px solid #1e293b",
  borderRadius: "18px",
  padding: "1.5rem",
};

export default function AboutPage() {
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
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
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
          About InstantReply
        </p>

        <h1 style={{ fontSize: "clamp(2.3rem, 4vw, 4rem)", lineHeight: 1.1 }}>
          AI that helps your support team reply faster—without taking the human out of support.
        </h1>

        <p style={{ fontSize: "1.15rem", color: "#dfe7f5", maxWidth: "820px" }}>
          InstantReply AI Agent is built around a simple idea: make the next good
          response easier for your team to send. It drafts context-aware replies so
          support professionals can spend less time starting from scratch and more
          time solving the customer&apos;s actual problem.
        </p>

        <section style={sectionStyle}>
          <h2>Not another black-box chatbot</h2>
          <p>
            Many customer-support platforms now offer AI for chat, self-service,
            automation, analytics, and agent assistance. InstantReply takes a more
            focused point of view: start with the moment an agent needs to respond.
            Bring the conversation context together, prepare a useful draft, and keep
            the team in control of what gets sent.
          </p>
          <p>
            The goal is not to replace your support operation or force customers into
            a bot-first experience. It is to help your existing team move through
            repetitive replies faster while preserving human judgment for nuanced,
            sensitive, or unusual requests.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2>What makes our approach different</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1rem",
              marginTop: "1.25rem",
            }}
          >
            <article style={cardStyle}>
              <h3 style={{ marginTop: 0, color: "#7dd3fc" }}>Draft first. Human decides.</h3>
              <p style={{ marginBottom: 0 }}>
                AI should accelerate the work, not silently take over the customer
                relationship. Keep review and approval part of the workflow wherever
                your team needs it.
              </p>
            </article>
            <article style={cardStyle}>
              <h3 style={{ marginTop: 0, color: "#7dd3fc" }}>Context before cleverness.</h3>
              <p style={{ marginBottom: 0 }}>
                A fast answer is only useful when it reflects the conversation. The
                product is centered on using relevant customer and ticket history to
                help shape a more informed draft.
              </p>
            </article>
            <article style={cardStyle}>
              <h3 style={{ marginTop: 0, color: "#7dd3fc" }}>Enhance the stack you have.</h3>
              <p style={{ marginBottom: 0 }}>
                Rather than asking teams to rebuild support around a new chatbot,
                InstantReply is positioned as an agent-assist layer for existing
                workflows, including Zendesk and Intercom.
              </p>
            </article>
            <article style={cardStyle}>
              <h3 style={{ marginTop: 0, color: "#7dd3fc" }}>Outcomes over AI hype.</h3>
              <p style={{ marginBottom: 0 }}>
                We believe performance should be measured against your team&apos;s real
                baseline: response time, resolution quality, customer experience, and
                the amount of rework—not vague claims about AI.
              </p>
            </article>
          </div>
        </section>

        <section style={sectionStyle}>
          <h2>Designed for real support work</h2>
          <p>
            Teams handle conversations across email, live chat, Slack, and WhatsApp.
            InstantReply&apos;s product direction is to help agents bring the right context
            into those moments, prepare a clear reply, and retain control over the final
            message. For routine requests, that can mean less repetitive drafting. For
            complex issues, it means giving people a better starting point—not pretending
            that every situation should be automated.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2>Built on trust, not inflated promises</h2>
          <p>
            Support conversations can contain sensitive information, and customers
            deserve thoughtful handling. Our standard is to be clear about what the AI
            does, give teams control over how it is used, and prove results with
            transparent measurements. Specific performance, privacy, security, and
            compliance commitments should be backed by product evidence before they are
            promised.
          </p>
        </section>

        <section style={{ ...sectionStyle, ...cardStyle }}>
          <h2 style={{ marginTop: 0 }}>Make every reply a better starting point.</h2>
          <p>
            See whether a context-aware, human-controlled reply workflow fits your
            support team.
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
