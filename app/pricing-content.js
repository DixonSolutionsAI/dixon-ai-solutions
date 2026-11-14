import SubscriptionPreview from "./subscription-preview";

const card = {
  background: "#0f172a",
  border: "1px solid #1e293b",
  borderRadius: "18px",
  padding: "1.5rem",
};

const comparison = [
  {
    category: "Business email & productivity",
    vendor: "Microsoft 365 Business Basic",
    price: "$7",
    unit: "per user/month",
    details: "Published U.S. price; excludes taxes. Plan terms apply.",
    href: "https://www.microsoft.com/en-us/licensing/news/2026-M365-Packaging-Pricing-Updates",
  },
  {
    category: "Accounting",
    vendor: "QuickBooks Online Simple Start",
    price: "$38",
    unit: "per month",
    details: "List price; introductory promotions may apply.",
    href: "https://quickbooks.intuit.com/pricing/",
  },
  {
    category: "Team communication",
    vendor: "Slack Pro",
    price: "$8.75",
    unit: "per active user/month",
    details: "Monthly billing; annual billing is less.",
    href: "https://slack.com/pricing",
  },
  {
    category: "Video meetings",
    vendor: "Zoom Workplace Pro",
    price: "$16.99",
    unit: "per user/month",
    details: "Monthly billing; annual billing is less.",
    href: "https://zoom.us/pricing",
  },
  {
    category: "Appointment scheduling",
    vendor: "Calendly Standard",
    price: "$10",
    unit: "per seat/month",
    details: "Monthly billing; invitees do not need paid seats.",
    href: "https://calendly.com/pricing",
  },
  {
    category: "Email marketing",
    vendor: "Mailchimp Essentials",
    price: "$13",
    unit: "per month",
    details: "Starting price for up to 500 contacts.",
    href: "https://mailchimp.com/landers/pricing/essentials/",
  },
  {
    category: "Payroll",
    vendor: "Gusto Simple",
    price: "$49 + $6",
    unit: "monthly base + per person",
    details: "Base fee plus a monthly charge for each person paid.",
    href: "https://gusto.com/product/pricing",
  },
  {
    category: "Customer support platform",
    vendor: "Freshdesk Growth",
    price: "$19",
    unit: "per agent/month",
    details: "Billed annually; includes 500 AI-agent sessions once per account.",
    href: "https://www.freshworks.com/freshdesk/pricing/",
  },
  {
    category: "AI customer support platform",
    vendor: "Intercom Essential",
    price: "$19",
    unit: "per seat/month",
    details: "Billed annually; AI-agent outcome pricing is usage-based.",
    href: "https://www.intercom.com/pricing/calculator",
  },
  {
    category: "Online store (optional)",
    vendor: "Shopify Basic",
    price: "$39",
    unit: "per month",
    details: "Monthly billing; payment processing fees are separate.",
    href: "https://www.shopify.com/pricing",
  },
  {
    category: "Business texting (usage-based)",
    vendor: "Twilio SMS",
    price: "$0.0083",
    unit: "per U.S. message segment",
    details: "Carrier fees and phone-number charges are additional.",
    href: "https://www.twilio.com/en-us/sms/pricing/us",
  },
];

export default function PricingPage() {
  return (
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
      style={{ padding: "48px 0", lineHeight: 1.7 }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <p
          style={{
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "#7dd3fc",
            fontSize: "0.8rem",
            fontWeight: 700,
            marginBottom: "0.5rem",
          }}
        >
          Pricing
        </p>
        <h2
          id="pricing-heading"
          style={{ fontSize: "clamp(2.2rem, 4vw, 3.5rem)", lineHeight: 1.1 }}
        >
          One focused workflow. Clear monthly rates.
        </h2>
        <p style={{ color: "#dfe7f5", maxWidth: "820px" }}>
          OfficeVault AI is designed around policy-aware support drafts with a human in control.
          The monthly prices below are per company and intended to make that workflow accessible
          to smaller teams. Subscriptions are not available for purchase yet.
        </p>

        <SubscriptionPreview providers={comparison.map(({ vendor }) => vendor)} />

        <section style={{ marginTop: "3.5rem" }} aria-labelledby="stack-heading">
          <h3 id="stack-heading">Common software costs for a small business</h3>
          <p style={{ color: "#dfe7f5", maxWidth: "900px" }}>
            These are examples of separate tools a business might use, not a required bundle.
            Pick services that fit your business and avoid paying for overlapping features.
            OfficeVault AI is not a replacement for accounting, payroll, productivity, payments,
            ecommerce, or every customer-support platform.
          </p>
          <p id="connections-preview" role="note" style={{ color: "#fde68a" }}>
            Connection controls are placeholders only. None of these services can be connected to
            the agent yet; no account information or data is shared.
          </p>
          <div style={{ overflowX: "auto", marginTop: "1.25rem" }}>
            <table
              style={{
                width: "100%",
                minWidth: "950px",
                borderCollapse: "collapse",
                background: "#0f172a",
                border: "1px solid #1e293b",
              }}
            >
              <caption
                style={{
                  textAlign: "left",
                  padding: "0.75rem",
                  color: "#94a3b8",
                }}
              >
                Representative U.S. list prices, checked November 13, 2026. Units and billing
                terms differ by provider.
              </caption>
              <thead>
                <tr>
                  {["Category", "Example plan", "Starting price", "Notes", "Agent connection"].map((heading) => (
                    <th
                      key={heading}
                      scope="col"
                      style={{
                        textAlign: "left",
                        padding: "0.8rem",
                        borderBottom: "1px solid #334155",
                        color: "#7dd3fc",
                      }}
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparison.map((item) => (
                  <tr key={item.vendor}>
                    <th
                      scope="row"
                      style={{
                        textAlign: "left",
                        padding: "0.8rem",
                        borderBottom: "1px solid #1e293b",
                      }}
                    >
                      {item.category}
                    </th>
                    <td style={{ padding: "0.8rem", borderBottom: "1px solid #1e293b" }}>
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: "#7dd3fc" }}
                      >
                        {item.vendor}
                      </a>
                    </td>
                    <td style={{ padding: "0.8rem", borderBottom: "1px solid #1e293b" }}>
                      {item.price} <span style={{ color: "#94a3b8" }}>{item.unit}</span>
                    </td>
                    <td style={{ padding: "0.8rem", borderBottom: "1px solid #1e293b" }}>
                      {item.details}
                    </td>
                    <td style={{ padding: "0.8rem", borderBottom: "1px solid #1e293b" }}>
                      <button
                        type="button"
                        disabled
                        aria-label={`Connect ${item.vendor} to OfficeVault AI`}
                        aria-describedby="connections-preview"
                        style={{ background: "#334155", color: "#cbd5e1", border: 0, borderRadius: "8px", padding: "0.6rem 0.8rem", cursor: "not-allowed", whiteSpace: "nowrap" }}
                      >
                        Connect
                      </button>
                      <div style={{ color: "#94a3b8", fontSize: "0.85rem" }}>Not available</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ color: "#94a3b8", fontSize: "0.9rem", marginTop: "1rem" }}>
            This comparison is illustrative, not exhaustive or a like-for-like feature comparison.
            Vendor prices, promotions, taxes, billing terms, and usage fees can change. Confirm
            current pricing with each provider before purchasing.
          </p>
        </section>

        <section style={{ ...card, marginTop: "2rem" }}>
          <h3 style={{ color: "#7dd3fc", marginTop: 0 }}>
            Where OfficeVault AI can be cost-efficient
          </h3>
          <p style={{ marginBottom: 0 }}>
            A shared, draft-first support workflow can bring company context, policies, and reply
            preparation together, reducing handoffs and the need for separate AI drafting tools.
            It is a focused workspace for support—not a claim that one subscription replaces
            every platform a company needs. Any savings depend on your current stack and on which
            overlapping services you can actually retire.
          </p>
        </section>
      </div>
    </section>
  );
}
