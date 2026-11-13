import { createSupabaseServerClient, isSupabaseConfigured } from "../../lib/supabase/server";
import { createCompany, signOut } from "./actions";
import SignIn from "./sign-in";

export const dynamic = "force-dynamic";
export const metadata = { title: "Workspace & connections | InstantReply" };

const panel = { background: "#0f172a", border: "1px solid #334155", borderRadius: "16px", padding: "1.25rem", marginTop: "1.5rem" };
const providers = [
  ["Google Workspace", "Google Sheets, Drive and company knowledge"],
  ["Microsoft 365", "Teams, Excel, OneDrive and company knowledge"],
  ["Salesforce", "Customer and account context"],
  ["Other databases and support desks", "External customer data and human handoff"],
];
const errors = {
  name: "Enter a company name between 1 and 100 characters.",
  create: "The company could not be created. Check the Supabase setup and try again.",
  configuration: "The workspace is not configured.",
  signout: "Sign-out failed. Please try again.",
};

export default async function Workspace({ searchParams }) {
  const params = await searchParams;
  let user = null;
  let companies = [];
  let loadError = false;
  let authUnavailable = false;
  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.getUser();
    if (!error) user = data.user;
    else if (error.name !== "AuthSessionMissingError") {
      console.error("Authentication lookup failed", error.name);
      authUnavailable = true;
    }
    if (user) {
      const result = await supabase.from("companies").select("id, name, created_at").order("created_at");
      if (result.error) {
        console.error("Company lookup failed", result.error.code);
        loadError = true;
      } else {
        companies = result.data;
      }
    }
  }

  return (
    <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "2.5rem 20px 4rem", lineHeight: 1.6 }}>
      <p style={{ color: "#7dd3fc", textTransform: "uppercase", letterSpacing: ".1em", fontSize: ".8rem", fontWeight: 700 }}>InstantReply workspace</p>
      <h1>Company workspace & connections</h1>
      <p>This workspace is an early foundation. Do not enter real customer or sensitive data yet.</p>
      {!isSupabaseConfigured() ? (
        <section style={panel}><h2>Setup required</h2><p>The owner must configure Supabase before sign-in or company workspaces are available. See <code>docs/workspace-setup.md</code>.</p></section>
      ) : authUnavailable ? (
        <section style={panel}><p role="alert">The authentication service is unavailable. Please try again later.</p></section>
      ) : !user ? (
        <div style={panel}><SignIn authError={Boolean(params.auth_error)} /></div>
      ) : (
        <>
          <section style={panel}>
            <h2>Your companies</h2>
            <p>Signed in as {user.email}</p>
            {loadError ? <p role="alert">Companies could not be loaded. Check the Supabase setup and try again.</p> : companies.length ? (
              <ul>{companies.map((company) => <li key={company.id}>{company.name}</li>)}</ul>
            ) : <p>No companies yet.</p>}
            {params.created && <p role="status">Company created. You are its owner.</p>}
            {Object.hasOwn(errors, params.error) && <p role="alert">{errors[params.error]}</p>}
            <form action={createCompany} style={{ display: "flex", flexWrap: "wrap", gap: ".75rem", alignItems: "end" }}>
              <label style={{ display: "grid", gap: ".3rem" }}>Company name
                <input name="name" required maxLength={100} style={{ padding: ".7rem", borderRadius: "8px", border: "1px solid #475569", background: "#020617", color: "white" }} />
              </label>
              <button type="submit" style={{ padding: ".75rem", cursor: "pointer" }}>Create company</button>
            </form>
            <form action={signOut} style={{ marginTop: "1rem" }}><button type="submit">Sign out</button></form>
          </section>
          <section style={panel}>
            <h2>Company connections</h2>
            <p>No provider connections are implemented yet. Account sign-in does not grant access to company systems.</p>
            <ul>{providers.map(([name, description]) => <li key={name}><strong>{name}</strong> — {description} <em>(not available yet)</em></li>)}</ul>
          </section>
          <section style={panel}>
            <h2>Support operations</h2>
            <p>Call center, chat, email, customer records, document library, spreadsheets, reports, analytics and human handoff are not available in this workspace yet. The <a href="/" style={{ color: "#7dd3fc" }}>existing reply-drafting pilot</a> remains separate and requires human review.</p>
          </section>
        </>
      )}
    </main>
  );
}
