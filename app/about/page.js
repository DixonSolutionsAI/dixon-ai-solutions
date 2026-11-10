export const metadata = {
  title: "About InstantReply AI Agent | Enterprise Support Automation",
  description:
    "Learn how InstantReply AI Agent helps enterprise support teams reduce response time, automate repetitive replies, and keep human agents focused on high-value work.",
};

export default function AboutPage() {
  return (
    <main
      style={{
        fontFamily: "Arial",
        background: "#020617",
        color: "white",
        minHeight: "100vh",
        padding: "40px 20px",
        lineHeight: 1.7,
      }}
    >
      <div style={{ maxWidth: "980px", margin: "0 auto" }}>
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

        <h1 style={{ fontSize: "clamp(2.3rem, 4vw, 4rem)", marginBottom: "1.25rem" }}>
          Built for support teams that can’t afford slow replies.
        </h1>

        <p style={{ fontSize: "1.15rem", color: "#dfe7f5", maxWidth: "800px" }}>
          InstantReply AI Agent was created for one reason: modern support teams are
          overwhelmed by volume, context switching, and the pressure to answer quickly
          without sacrificing quality.
        </p>

        <section style={{ marginTop: "2.5rem" }}>
          <h2>What we solve</h2>
          <p>
            Customer support teams lose time every day on repetitive, low-value replies.
            Agents are forced to search through tickets, summarize conversations, and draft
            responses from scratch while the queue keeps growing.
          </p>
          <p>
            InstantReply AI Agent reduces that burden by reading the full support context,
            understanding the customer intent, and drafting accurate, brand-safe replies in
            seconds instead of minutes.
          </p>
        </section>

        <section style={{ marginTop: "2.5rem" }}>
          <h2>How it works</h2>
          <ul>
            <li>Pulls context from tickets, customer history, and support channels</li>
            <li>Identifies the intent behind the incoming request</li>
            <li>Drafts a response tailored to the customer and business rules</li>
            <li>Routes the result to a human agent for final approval when needed</li>
          </ul>
        </section>

        <section style={{ marginTop: "2.5rem" }}>
          <h2>Why teams adopt it</h2>
          <p>
            Support leaders want faster response times without sacrificing consistency,
            compliance, or customer trust. InstantReply helps teams do exactly that by
            combining AI speed with human oversight.
          </p>
          <p>
            Whether a queue is growing across email, live chat, Slack, or WhatsApp,
            the platform is designed to shrink the response gap and keep teams focused on
            more complex, high-value conversations.
          </p>
        </section>

        <section style={{ marginTop: "3rem" }}>
          <h2>Built for enterprise workflows</h2>
          <p>
            InstantReply is designed for support organizations that need more than just a
            chatbot. It fits into real operational workflows, integrates with modern support
            stacks, and gives teams a practical way to automate repetitive messaging while
            preserving control.
          </p>
        </section>

        <div
          style={{
            marginTop: "3rem",
            background: "#0f172a",
            border: "1px solid #1e293b",
            borderRadius: "18px",
            padding: "2rem",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Ready to reduce response time?</h3>
          <p style={{ marginBottom: "1.25rem" }}>
            See how InstantReply AI Agent can help your support team respond faster and work smarter.
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
        </div>
      </div>
    </main>
  );
}
