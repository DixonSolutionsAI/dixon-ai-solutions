export const metadata = {
  title: "About InstantReply AI Agent | Human-Controlled Support AI",
  description:
    "InstantReply AI Agent helps support teams reduce repetitive reply work with context-aware drafts, human review, and workflows designed for real customer conversations.",
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
          InstantReply AI Agent was built for one purpose: to make the next customer reply
          easier to write, easier to send, and easier to trust. It gives support teams a
          context-aware draft based on the conversation, the customer history, and the
          workflow in front of them—so the team can move faster without losing judgment.
        </p>

        <section style={sectionStyle}>
          <h2>Why support teams need a better starting point</h2>
          <p>
            The modern support queue is crowded with repetitive requests, repeated context
            gathering, and pressure to respond quickly without sacrificing quality. Teams
            are expected to be fast, helpful, and consistent across every channel—while
            still handling the conversations that require nuanced judgment.
          </p>
          <p>
            InstantReply AI Agent helps solve that tension. Instead of replacing the agent,
            it gives the agent a clearer, more informed starting point. That means less time
            staring at a blank reply, less rework, and more energy spent on the issues that
            actually need a human touch.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2>Built for real support work</h2>
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
                AI should accelerate the work, not take it out of the team&apos;s hands. Every
                workflow keeps review and approval in the loop wherever your team needs it.
              </p>
            </article>
            <article style={cardStyle}>
              <h3 style={{ marginTop: 0, color: "#7dd3fc" }}>Context before cleverness.</h3>
              <p style={{ marginBottom: 0 }}>
                A fast answer is only useful if it reflects the situation. InstantReply uses
                customer history and conversation context to help shape a more informed draft.
              </p>
            </article>
            <article style={cardStyle}>
              <h3 style={{ marginTop: 0, color: "#7dd3fc" }}>Enhance the stack you already use.</h3>
              <p style={{ marginBottom: 0 }}>
                Rather than forcing teams into a new support system, we fit into the tools and
                workflows they already rely on, including Zendesk and Intercom.
              </p>
            </article>
            <article style={cardStyle}>
              <h3 style={{ marginTop: 0, color: "#7dd3fc" }}>Outcomes over hype.</h3>
              <p style={{ marginBottom: 0 }}>
                We measure value by the real outcomes support teams care about: response time,
                consistency, customer experience, and the amount of repetitive work removed.
              </p>
            </article>
          </div>
        </section>

        <section style={sectionStyle}>
          <h2>Not another black-box chatbot</h2>
          <p>
            Many customer support tools offer AI as a broad suite of features, but a lot of
            that value is disconnected from the actual work happening in the inbox. The
            strongest AI for support is the kind that helps a real team work faster without
            creating confusion, friction, or a loss of trust.
          </p>
          <p>
            InstantReply is built with that reality in mind. It is not designed to replace
            the support team with a bot-first experience. It is designed to help your team
            move more efficiently, handle high-volume conversations more consistently, and
            stay focused on the moments that require real human judgment.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2>Built on trust, not inflated promises</h2>
          <p>
            Support conversations can carry sensitive customer information, and that requires
            thoughtful handling. That is why the product is built around transparency, human
            review, and clear operational control. We believe AI should make teams faster
            without making them less accountable.
          </p>
          <p>
            The goal is simple: deliver a more useful reply, reduce repetitive work, and give
            support teams a tool they can trust in everyday execution.
          </p>
        </section>

        <section style={{ ...sectionStyle, ...cardStyle }}>
          <h2 style={{ marginTop: 0 }}>Make every reply a stronger starting point.</h2>
          <p>
            See how InstantReply AI Agent fits into your support workflow and helps your team
            respond with more speed, more clarity, and more confidence.
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
