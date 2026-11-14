"use client";

import { useState } from "react";
import { subscriptionPlans } from "../subscription-plans";

const card = {
  background: "#0f172a",
  border: "1px solid #1e293b",
  borderRadius: "18px",
  padding: "1.5rem",
};

export default function BillingPage() {
  const [selected, setSelected] = useState(null);
  const plan = subscriptionPlans.find((item) => item.name === selected);

  return (
    <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "48px 20px 72px", lineHeight: 1.6 }}>
      <p style={{ color: "#7dd3fc", textTransform: "uppercase", letterSpacing: "0.12em", fontSize: "0.8rem", fontWeight: 700 }}>Billing</p>
      <h1 style={{ fontSize: "clamp(2.2rem, 4vw, 3.5rem)", lineHeight: 1.1 }}>Choose a plan for your company</h1>
      <p style={{ maxWidth: "800px", color: "#dfe7f5" }}>
        Preview monthly subscription options for OfficeVault AI. Prices are per company.
      </p>
      <p role="note" style={{ ...card, borderColor: "#854d0e", color: "#fde68a" }}>
        Billing is a preview. Company registration, subscription management and checkout are not
        available yet. No payment will be collected.
      </p>

      <section aria-labelledby="plans-heading" style={{ marginTop: "2.5rem" }}>
        <h2 id="plans-heading">Subscription plans</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
          {subscriptionPlans.map((item) => (
            <article key={item.name} style={{ ...card, borderColor: selected === item.name ? "#38bdf8" : "#1e293b" }}>
              <h3 style={{ color: "#7dd3fc", marginTop: 0 }}>{item.name}</h3>
              <p style={{ fontSize: "2rem", fontWeight: 700, margin: "0.5rem 0" }}>
                {item.price}<span style={{ fontSize: "1rem", fontWeight: 400 }}> / company / month</span>
              </p>
              <p style={{ color: "#dfe7f5" }}>{item.audience}</p>
              <button
                type="button"
                aria-pressed={selected === item.name}
                onClick={() => setSelected(item.name)}
                style={{ background: selected === item.name ? "#38bdf8" : "transparent", color: selected === item.name ? "#082f49" : "#7dd3fc", border: "1px solid #38bdf8", padding: "0.7rem 1rem", borderRadius: "999px", fontWeight: 700, cursor: "pointer" }}
              >
                {selected === item.name ? "Selected" : `Select ${item.name}`}
              </button>
            </article>
          ))}
        </div>
        <p style={{ color: "#cbd5e1" }}>Seat limits, included usage and final plan features are still to be confirmed. Taxes and third-party fees may apply.</p>
      </section>

      <section aria-labelledby="setup-heading" style={{ ...card, marginTop: "2.5rem" }}>
        <h2 id="setup-heading" style={{ marginTop: 0 }}>Subscription setup</h2>
        <ol style={{ paddingLeft: "1.25rem" }}>
          <li>Create and verify your company administrator account when registration becomes available.</li>
          <li>Choose a monthly plan for your company.</li>
          <li>Complete secure checkout when payments are connected. Agent access will require an active subscription.</li>
        </ol>
        <p>Planned payment options include cards and supported digital wallets, such as Apple Pay and Google Pay. Availability will depend on the payment provider and device.</p>
        <p role="status">{plan ? `Preview selection: ${plan.name} at ${plan.price} per company per month.` : "Select a plan to preview your subscription."}</p>
        <button type="button" disabled style={{ background: "#334155", color: "#cbd5e1", border: 0, padding: "0.8rem 1.25rem", borderRadius: "999px", fontWeight: 700, cursor: "not-allowed" }}>Pay now</button>
        <p style={{ color: "#cbd5e1", marginBottom: 0 }}>Pay now will be available after account registration and Stripe checkout are configured.</p>
      </section>
    </main>
  );
}
