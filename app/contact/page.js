export const metadata = {
  title: "Contact | OfficeVault AI",
  description:
    "Contact OfficeVault AI to learn how support teams can reduce reply time, improve consistency, and keep human review in the loop.",
};

const sectionStyle = { marginTop: "3rem" };
const cardStyle = {
  background: "#0f172a",
  border: "1px solid #1e293b",
  borderRadius: "18px",
  padding: "1.5rem",
};

export default function ContactPage() {
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
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
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
          Contact
        </p>

        <h1 style={{ fontSize: "clamp(2.3rem, 4vw, 4rem)", lineHeight: 1.1 }}>
          Start a smarter support workflow.
        </h1>

        <p style={{ fontSize: "1.15rem", color: "#dfe7f5", maxWidth: "760px" }}>
          Whether you want to reduce repetitive reply work, improve response speed, or test a
          human-controlled AI workflow for your support team, we&apos;d be glad to talk through
          your goals.
        </p>

        <section style={{ ...sectionStyle, ...cardStyle }}>
          <h2 style={{ marginTop: 0 }}>Book a conversation</h2>
          <p style={{ marginBottom: "1.5rem" }}>
            Learn how OfficeVault AI could fit into your support stack and help your
            team respond faster with better context.
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

        <section style={sectionStyle}>
          <h2>Questions we can help answer</h2>
          <ul>
            <li>How would AI reply drafting fit into our current workflow?</li>
            <li>Can we keep a human review step before sending?</li>
            <li>Which support channels should we start with?</li>
            <li>How do we integrate with Zendesk, Intercom, or our current stack?</li>
          </ul>
        </section>

        <section style={sectionStyle}>
          <h2>Get in touch</h2>
          <p>Email: hello@instantreply.ai</p>
          <p>Available for product demos, onboarding discussions, and workflow planning.</p>
        </section>
      </div>
    </main>
  );
}
