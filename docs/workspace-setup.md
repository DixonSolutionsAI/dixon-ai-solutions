# Company workspace foundation

This is an early, non-production foundation, not a complete customer support platform. It provides Supabase sign-in, company creation and a company list restricted by membership. Company creation records an audit event. The existing private reply-drafting pilot remains separate: it does not use company context or save conversations. Use fictional or redacted data only.

## Setup

1. Use Node.js 22 or later and run `npm install`.
2. Create a Supabase project. Apply `supabase/migrations/20261113000000_company_foundation.sql` in its SQL editor or using the Supabase CLI migrations workflow. Apply migrations to a fresh project only after reviewing them.
3. Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to the project's URL and publishable or legacy anon key. These values are public; **never use a service-role key**. Configure the existing pilot variables separately if using reply drafting.
4. In Supabase Auth, configure the site URL and allowed redirect URLs for your exact deployment origins, including `http://localhost:3000/auth/callback` for local development and `https://YOUR-DOMAIN/auth/callback` for the deployment. Enable email/password and email confirmation as appropriate. For Google and Microsoft sign-in, configure the respective Supabase Auth providers and their OAuth applications according to Supabase's provider instructions. The provider callbacks point to Supabase; the allowed redirect back to this app is `/auth/callback`.
5. Run `npm run dev`, open **Connections & workspace** in the top navigation, sign in, and create a company. Sign-in requires working Supabase credentials; social sign-in additionally requires configured providers.

Sign-in with Google or Microsoft authenticates a person to the agent only. It does **not** connect Google Sheets, Drive, Teams, Excel or any other company data. No provider connection, token storage, invitations, account recovery screen, subscription, usage limit or team management is implemented. The database role names are groundwork, not a complete permissions system. A user can create multiple companies, but there is no active-company selector or company-specific operational data yet.

## Security and production gates

The app uses the authenticated user's Supabase session and the public key, not a service-role key. Row-level security lets users read only their own memberships and their companies; only owners and admins can read company audit events. The `create_company` function atomically creates the company, owner membership and event. Direct authenticated table writes are not granted. The creation event is the only audit event implemented; this is not a comprehensive or tamper-proof audit system.

Before deploying for real customers, independently test tenant isolation with multiple users, review the SQL, Auth settings and redirect allowlist, enforce organization creation and sign-up limits, add abuse controls and account recovery, review privacy/retention, implement complete role enforcement and audit trails, and perform security and operational review. The included SQL has not been tested against a live Supabase project in this repository. Do not store customer data or provider tokens until these controls are in place.

## Delivery plan

1. **Identity and governance:** organization invitations, owner/admin/agent/viewer permissions enforced server-side and by RLS; company selection; subscriptions and quotas; comprehensive audit history; consent, retention and deletion.
2. **Connections hub:** separate OAuth authorization for Google Workspace, Microsoft 365 and Salesforce; least-privilege scopes, encrypted server-side token storage, rotation, revocation, per-company isolation, connection health and admin approval. Add other databases through explicitly scoped, secure connectors; do not accept arbitrary database URLs without a network and credential security design.
3. **Unified support:** company-scoped customer records, verified identity matching, conversation and transcript storage, web chat widget, inbound email webhooks and voice bridge for Twilio/OpenAI Realtime. Verify webhook signatures, obtain recording consent as required, prevent cross-tenant access, and retain full context for handoff to a human or support desk.
4. **Knowledge and sheets:** document upload, indexing and OpenAI file search with citations, source permissions, expiry/review dates and stale-source handling. Add scoped Google Sheets and Excel access or an internal spreadsheet with explicit per-action permissions and audit events.
5. **Controlled actions:** AI proposes replies and account actions with evidence, scope and risk; authorized humans approve before execution. Use narrowly scoped tools, idempotency, confirmation, execution logs and failure handling. Autonomy must remain disabled until policy, review and controls explicitly allow it.
6. **Reporting and analytics:** scheduled, timezone-aware daily digests using persisted interactions; report unresolved items and handoffs, resolution rates and escalation reasons. Add delivery retries, opt-in and measurable quality checks. Do not present model-estimated sentiment or causality as established fact.
