import PricingContent from "../pricing-content";

export const metadata = {
  title: "All-in-One | OfficeVault AI",
  description:
    "OfficeVault AI — Launch, store, and run your entire business in one workspace.",
};

const card = {
  background: "#0f172a",
  border: "1px solid #1e293b",
  borderRadius: "18px",
  padding: "1.5rem",
};
const eyebrow = {
  textTransform: "uppercase",
  letterSpacing: "0.12em",
  color: "#7dd3fc",
  fontSize: "0.8rem",
  fontWeight: 700,
  marginBottom: "0.5rem",
};
const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "1rem",
  marginTop: "1rem",
};

const pillars = [
  {
    name: "Launch",
    sub: "Self-Serve Setup",
    text: "Owners set up their entire business hub independently, with zero technical help or outside onboarding.",
  },
  {
    name: "Store",
    sub: "The Vault & Library",
    text: "A single, protected location for company documents, sensitive access codes, and your instant-template project library.",
  },
  {
    name: "Run",
    sub: "The Live Workspace",
    text: "AI handles calls, texts, and emails, automatically leading every drafted response with your exact company policies and guidelines.",
  },
];

const copyOptions = [
  {
    label: "Short & Punchy",
    use: "Best for social bios & headers",
    text: "OfficeVault AI — Launch, store, and run your entire business in one workspace.",
  },
  {
    label: "Feature-Focused",
    use: "Best for landing page subheadline",
    text: "Your complete, self-serve company headquarters. Store access codes and documents, pull from a built-in project template library, and manage calls, texts, and emails with policy-backed AI replies.",
  },
  {
    label: "Benefit-Driven",
    use: "Best for solo founders & busy owners",
    text: "Everything you need to start and operate your company in one AI-powered agent—no outside support required.",
  },
];

const features = [
  { name: "The Vault", text: "Secure storage for company documents, SOPs, and access codes." },
  { name: "Live Desk", text: "Your unified inbox for AI-assisted calls, texts, and emails." },
  {
    name: "Policy Shield (or Rule Engine)",
    text: "The setting that ensures company policies and guidelines always appear as the opening line of every drafted customer reply.",
  },
  {
    name: "Project Library",
    text: "Your hub for instant, ready-to-use business and project templates.",
  },
];

export default function LandingPage() {
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
        <section>
          <p style={eyebrow}>OfficeVault AI</p>
          <h1 style={{ fontSize: "clamp(2.3rem, 4vw, 4rem)", lineHeight: 1.1 }}>
            Launch, store, and run your entire business in one workspace.
          </h1>
          <p style={{ fontSize: "1.15rem", color: "#dfe7f5", maxWidth: "800px" }}>
            Your complete, self-serve company headquarters. Store access codes and documents, pull
            from a built-in project template library, and manage calls, texts, and emails with
            policy-backed AI replies.
          </p>
          <p style={{ color: "#94a3b8" }}>
            Everything you need to start and operate your company in one AI-powered agent—no
            outside support required.
          </p>
          <a
            href="#get-started"
            style={{
              display: "inline-block",
              marginTop: "0.5rem",
              background: "#38bdf8",
              color: "#082f49",
              fontWeight: 700,
              padding: "0.8rem 1.4rem",
              borderRadius: "999px",
              textDecoration: "none",
            }}
          >
            Get Started
          </a>
        </section>

        <section style={{ marginTop: "3rem" }}>
          <p style={eyebrow}>Why OfficeVault AI</p>
          <h2 style={{ marginTop: 0 }}>
            Secure storage (&ldquo;Vault&rdquo;) meets active daily work (&ldquo;Office&rdquo;)
          </h2>
          <div style={grid}>
            {pillars.map((p) => (
              <article key={p.name} style={card}>
                <h3 style={{ margin: 0, color: "#7dd3fc" }}>{p.name}</h3>
                <p style={{ margin: "0 0 0.5rem", color: "#94a3b8", fontSize: "0.9rem" }}>{p.sub}</p>
                <p style={{ margin: 0, color: "#dfe7f5" }}>{p.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section style={{ marginTop: "3rem" }}>
          <p style={eyebrow}>Messaging</p>
          <h2 style={{ marginTop: 0 }}>One value proposition, three ways to say it</h2>
          <p style={{ color: "#dfe7f5" }}>
            OfficeVault AI is a strong choice because it bridges secure storage (&ldquo;Vault&rdquo;)
            with active daily work (&ldquo;Office&rdquo;). The tagline &ldquo;Launch, store, and run
            your entire business in one workspace&rdquo; communicates the value proposition in under
            ten seconds. Use these variations on your landing page, pitch deck, or signup screen
            depending on how much detail you want upfront.
          </p>
          <div style={grid}>
            {copyOptions.map((c) => (
              <article key={c.label} style={card}>
                <h3 style={{ margin: 0, color: "#7dd3fc" }}>{c.label}</h3>
                <p style={{ margin: "0 0 0.5rem", color: "#94a3b8", fontSize: "0.9rem" }}>{c.use}</p>
                <p style={{ margin: 0, color: "#dfe7f5" }}>{c.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section style={{ marginTop: "3rem" }}>
          <p style={eyebrow}>Inside the app</p>
          <h2 style={{ marginTop: 0 }}>Everything in its place</h2>
          <p style={{ color: "#dfe7f5" }}>
            Core tabs are named to keep the OfficeVault AI theme cohesive across the interface.
          </p>
          <div style={grid}>
            {features.map((f) => (
              <article key={f.name} style={card}>
                <h3 style={{ marginTop: 0 }}>{f.name}</h3>
                <p style={{ margin: 0, color: "#dfe7f5" }}>{f.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="get-started" style={{ marginTop: "3rem", scrollMarginTop: "2rem" }}>
          <p style={eyebrow}>Get Started</p>
          <h2 style={{ marginTop: 0 }}>Choose your next step</h2>
          <p style={{ color: "#dfe7f5", maxWidth: "800px" }}>
            Start using the workspace, talk with us about a demo, or review pricing—all here on
            the All-in-One page.
          </p>
          <div style={grid}>
            <article style={card}>
              <h3 style={{ color: "#7dd3fc", marginTop: 0 }}>Start now</h3>
              <p style={{ color: "#dfe7f5" }}>
                Sign in or complete first-time employee setup to open the workspace.
              </p>
              <a href="/get-started/employee" style={{ color: "#7dd3fc", fontWeight: 700 }}>
                Open employee access
              </a>
            </article>
            <article id="demo" style={{ ...card, scrollMarginTop: "2rem" }}>
              <h3 style={{ color: "#7dd3fc", marginTop: 0 }}>Book a demo</h3>
              <p style={{ color: "#dfe7f5" }}>
                Talk through your support workflow and see whether OfficeVault AI could fit your
                team.
              </p>
              <a
                href="https://calendly.com"
                style={{ color: "#7dd3fc", fontWeight: 700 }}
              >
                Request a demo
              </a>
              <p style={{ color: "#94a3b8", marginBottom: 0 }}>
                Or email{" "}
                <a href="mailto:hello@instantreply.ai" style={{ color: "#7dd3fc" }}>
                  hello@instantreply.ai
                </a>
                .
              </p>
            </article>
            <article style={card}>
              <h3 style={{ color: "#7dd3fc", marginTop: 0 }}>View pricing</h3>
              <p style={{ color: "#dfe7f5" }}>
                Compare proposed plans and common small-business software costs.
              </p>
              <a href="#pricing" style={{ color: "#7dd3fc", fontWeight: 700 }}>
                Compare pricing
              </a>
            </article>
          </div>
        </section>

        <PricingContent />
      </div>
    </main>
  );
}
