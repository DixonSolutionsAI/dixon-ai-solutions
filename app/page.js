export const metadata = {
  title: "InstantReply | Human-reviewed AI support reply drafts",
  description:
    "Help customer-support teams prepare context-aware reply drafts while keeping agents responsible for review, accuracy, and the final response.",
};

const sectionStyle = { marginTop: "3rem" };
const cardStyle = {
  background: "#0f172a",
  border: "1px solid #1e293b",
  borderRadius: "18px",
  padding: "1.5rem",
};

const buttonStyle = {
  display: "inline-block",
  background: "#38bdf8",
  color: "#082f49",
  textDecoration: "none",
  padding: "0.9rem 1.4rem",
  borderRadius: "999px",
  fontWeight: 700,
};

export default function Home() {
  return (
    <main
      style={{
        background: "#020617",
        color: "white",
        minHeight: "100vh",
        padding: "40px 20px",
        lineHeight: 1.7,
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <p style={{ textTransform: "uppercase", letterSpacing: "0.12em", color: "#7dd3fc", fontSize: "0.8rem", fontWeight: 700 }}>
          Human-reviewed AI for customer support
        </p>
        <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 5rem)", lineHeight: 1.1, marginBottom: "1rem" }}>
          Give agents a stronger first draft—not another bot to supervise.
        </h1>
        <p style={{ fontSize: "1.2rem", color: "#dfe7f5", maxWidth: "820px" }}>
          InstantReply is designed to help support teams prepare context-aware reply drafts
          while people retain control of review, edits, escalation, and sending.
        </p>
        <div style={{ marginTop: "2rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <a href="mailto:hello@instantreply.ai?subject=InstantReply%20product%20demo" style={buttonStyle}>
            Discuss a Pilot
          </a>
          <a href="#evaluate" style={{ ...buttonStyle, background: "transparent", color: "white", border: "1px solid #334155" }}>
            See what to evaluate
          </a>
        </div>

        <section style={sectionStyle}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
            <article style={cardStyle}>
              <h2 style={{ marginTop: 0, color: "#7dd3fc", fontSize: "1.2rem" }}>Start with context</h2>
              <p style={{ marginBottom: 0 }}>Drafts should reflect the current conversation and relevant customer history—not just produce generic text.</p>
            </article>
            <article style={cardStyle}>
              <h2 style={{ marginTop: 0, color: "#7dd3fc", fontSize: "1.2rem" }}>Keep the agent accountable</h2>
              <p style={{ marginBottom: 0 }}>People review and own the final customer response, especially when judgment or care matters.</p>
            </article>
            <article style={cardStyle}>
              <h2 style={{ marginTop: 0, color: "#7dd3fc", fontSize: "1.2rem" }}>Measure before scaling</h2>
              <p style={{ marginBottom: 0 }}>Evaluate the workflow with your real tickets and baseline metrics before making an ROI or performance claim.</p>
            </article>
          </div>
        </section>

        <section id="how-it-works" style={sectionStyle}>
          <h2>A focused, draft-first approach</h2>
          <div style={{ display: "grid", gap: "1rem", marginTop: "1.25rem" }}>
            <div style={cardStyle}><strong>1. Bring the conversation into context</strong><p style={{ marginBottom: 0 }}>Use the information available in the support workflow to understand what the customer is asking. Validate the actual data sources and connectors in a product evaluation.</p></div>
            <div style={cardStyle}><strong>2. Prepare a useful draft</strong><p style={{ marginBottom: 0 }}>Give the agent a first response to assess and adapt, rather than promising autonomous resolution for every case.</p></div>
            <div style={cardStyle}><strong>3. Review, edit, escalate, or send</strong><p style={{ marginBottom: 0 }}>Keep the support team responsible for accuracy and the final action. Define escalation rules that match your operation.</p></div>
          </div>
        </section>

        <section id="evaluate" style={sectionStyle}>
          <h2>Compare support AI on the work that matters</h2>
          <p>Every vendor has a different scope. Use a real-ticket pilot to compare these criteria instead of relying on broad “best AI” claims.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
            <article style={cardStyle}><h3 style={{ marginTop: 0, color: "#7dd3fc" }}>Drafting or autonomous resolution?</h3><p style={{ marginBottom: 0 }}>Choose whether your priority is agent-assist drafting or an AI that takes customer-facing actions—and verify the product’s actual scope.</p></article>
            <article style={cardStyle}><h3 style={{ marginTop: 0, color: "#7dd3fc" }}>Human handoff and review</h3><p style={{ marginBottom: 0 }}>Test how review, editing, exception handling, and escalation work in the situations your agents encounter.</p></article>
            <article style={cardStyle}><h3 style={{ marginTop: 0, color: "#7dd3fc" }}>Integration and data access</h3><p style={{ marginBottom: 0 }}>Confirm supported systems, required permissions, setup effort, and which customer context is actually available.</p></article>
            <article style={cardStyle}><h3 style={{ marginTop: 0, color: "#7dd3fc" }}>Security, governance, and cost</h3><p style={{ marginBottom: 0 }}>Review current security documentation, data handling, controls, pricing, and any usage-based charges directly with the vendor.</p></article>
          </div>
        </section>

        <section style={sectionStyle}>
          <h2>Questions buyers should ask</h2>
          <div style={{ display: "grid", gap: "1rem" }}>
            <details style={cardStyle}><summary style={{ cursor: "pointer", fontWeight: 700 }}>Will AI replace our support agents?</summary><p>InstantReply’s stated approach is draft-first and human-reviewed. Evaluate whether that fits your workflow; it is not a promise of headcount reduction or a substitute for agent judgment.</p></details>
            <details style={cardStyle}><summary style={{ cursor: "pointer", fontWeight: 700 }}>Will it connect to our support platform?</summary><p>Connector availability depends on your systems and the product’s current implementation. Confirm specific platforms, data access, and setup requirements during evaluation before relying on an integration claim.</p></details>
            <details style={cardStyle}><summary style={{ cursor: "pointer", fontWeight: 700 }}>How do we know the drafts are accurate?</summary><p>Test representative conversations, measure factual and policy errors, and keep an agent review step. Do not treat generated text as verified without review.</p></details>
            <details style={cardStyle}><summary style={{ cursor: "pointer", fontWeight: 700 }}>What about privacy, compliance, and ROI?</summary><p>Review the product’s current security and data-handling documentation with your team. Establish a baseline and pilot measures before making compliance or financial claims.</p></details>
          </div>
        </section>

        <section style={{ ...sectionStyle, ...cardStyle }}>
          <h2 style={{ marginTop: 0 }}>Evaluate the fit with your own support workflow.</h2>
          <p>Bring representative tickets, your integration requirements, and the outcomes you want to measure. We’ll use those to make the conversation specific and evidence-led.</p>
          <a href="mailto:hello@instantreply.ai?subject=InstantReply%20product%20demo" style={buttonStyle}>Discuss a Pilot</a>
        </section>
      </div>
    </main>
  );
}
