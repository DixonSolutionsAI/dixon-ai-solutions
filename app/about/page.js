export const metadata = {
  title: "About OfficeVault AI | AI Office Workspace",
  description:
    "Explore OfficeVault AI's human-reviewed response drafting, reusable templates, and vision for a connected AI office workspace.",
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
          About OfficeVault AI
        </p>

        <h1 style={{ fontSize: "clamp(2.3rem, 4vw, 4rem)", lineHeight: 1.1 }}>
          An AI office workspace built around people, projects, and better responses.
        </h1>

        <p style={{ fontSize: "1.15rem", color: "#dfe7f5", maxWidth: "820px" }}>
          OfficeVault AI brings AI-assisted response drafting and reusable resources together
          with human oversight. The current pilot helps teams prepare responses using an inquiry
          and optional company policies and guidelines, while keeping review and editing in
          the hands of the person doing the work.
        </p>

        <section style={sectionStyle}>
          <h2>What the workspace offers</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1rem",
              marginTop: "1.25rem",
            }}
          >
            <article style={cardStyle}>
              <h3 style={{ marginTop: 0, color: "#7dd3fc" }}>AI drafts, human decisions</h3>
              <p style={{ marginBottom: 0 }}>
                Generate and edit email, text, and call response drafts, then review and approve
                them yourself. The agent does not send messages or make calls: approved emails
                open in your default email app for you to review and send.
              </p>
            </article>
            <article style={cardStyle}>
              <h3 style={{ marginTop: 0, color: "#7dd3fc" }}>Reusable responses</h3>
              <p style={{ marginBottom: 0 }}>
                Save approved text and call responses as named templates for manual reuse.
                These templates are stored only in the current browser and are not shared
                across devices.
              </p>
            </article>
            <article style={cardStyle}>
              <h3 style={{ marginTop: 0, color: "#7dd3fc" }}>Company documents</h3>
              <p style={{ marginBottom: 0 }}>
                Upload company policy and guidelines as text or text-based PDF files to provide
                context for drafts. Document text is stored in this browser and sent to OpenAI
                when generating responses; use fictional or redacted information in the pilot.
              </p>
            </article>
          </div>
        </section>

        <section style={sectionStyle}>
          <h2>The connected office vision</h2>
          <p>
            The broader vision includes a Project Office Library with prepared business and
            project templates, giving teams a starting point for everyday work. The current
            pilot supports saved response templates and lets you upload your own project
            templates in Company Documents; a prepared project template library is not yet
            available.
          </p>
          <p>
            We also envision easier connections to tools and information teams already use,
            such as Microsoft 365, Excel spreadsheets and templates, and customer file
            databases. These integrations are not currently implemented, and customer records
            cannot yet be searched or stored through the workspace.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2>Why support teams need a better starting point</h2>
          <p>
            The modern support queue is crowded with repetitive requests, repeated context
            gathering, and pressure to respond quickly without sacrificing quality. Teams
            are expected to be fast, helpful, and consistent across every channel—while
            still handling the conversations that require nuanced judgment.
          </p>
          <p>
            OfficeVault AI helps solve that tension. Instead of replacing the agent,
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
                pilot keeps review, editing, and approval in the hands of your team.
              </p>
            </article>
            <article style={cardStyle}>
              <h3 style={{ marginTop: 0, color: "#7dd3fc" }}>Context before cleverness.</h3>
              <p style={{ marginBottom: 0 }}>
                A fast answer is only useful if it reflects the situation. OfficeVault AI uses
                the inquiry and any uploaded company policy and guidelines to help shape a
                more informed draft.
              </p>
            </article>
            <article style={cardStyle}>
              <h3 style={{ marginTop: 0, color: "#7dd3fc" }}>Designed for connected work.</h3>
              <p style={{ marginBottom: 0 }}>
                The vision is to connect office tools and customer information to the workspace.
                Those connections are not yet available in the pilot.
              </p>
            </article>
            <article style={cardStyle}>
              <h3 style={{ marginTop: 0, color: "#7dd3fc" }}>Outcomes over hype.</h3>
              <p style={{ marginBottom: 0 }}>
                We focus on the outcomes teams care about: response time, consistency, customer
                experience, and reducing repetitive work.
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
            OfficeVault AI is built with that reality in mind. It is not designed to replace
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
            The pilot has not been validated for production customer data. Use fictional or
            redacted cases and review each draft before using it.
          </p>
        </section>

        <section style={{ ...sectionStyle, ...cardStyle }}>
          <h2 style={{ marginTop: 0 }}>Make every reply a stronger starting point.</h2>
          <p>
            See how OfficeVault AI fits into your support workflow and helps your team
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
