"use client";

import Link from "next/link";
import { useAccess } from "../access-context";

export default function AccessPage() {
  const { accessCode, setAccessCode } = useAccess();

  return (
    <main style={{ minHeight: "100vh", padding: "40px 20px 64px" }}>
      <section aria-labelledby="access-heading" style={{ maxWidth: "900px", margin: "0 auto", background: "#0f172a", border: "1px solid #1e293b", borderRadius: "16px", padding: "1.25rem" }}>
        <h1 id="access-heading" style={{ color: "#7dd3fc", marginTop: 0 }}>Access</h1>
        <label style={{ display: "grid", gap: "0.5rem", fontWeight: 700 }}>
          Pilot access code
          <input
            type="password"
            value={accessCode}
            onChange={(event) => setAccessCode(event.target.value)}
            autoComplete="current-password"
            maxLength={256}
            placeholder="Provided by the pilot owner"
            style={{ width: "100%", borderRadius: "12px", border: "1px solid #334155", background: "#020617", color: "white", padding: "0.9rem 1rem", fontSize: "1rem", lineHeight: 1.5, boxSizing: "border-box" }}
          />
        </label>
        <p>The code is kept in memory while you use Get Started. You will need to enter it again after reloading or leaving this area.</p>
        <p>This pilot sends your inquiry, draft, and uploaded documents to OpenAI to generate responses. Uploaded documents stay in this browser, where anyone using it can access them. Confidentiality cannot be guaranteed; use fictional or redacted information only.</p>
        <Link href="/get-started" style={{ color: "#7dd3fc" }}>Go to Work Space</Link>
      </section>
    </main>
  );
}
