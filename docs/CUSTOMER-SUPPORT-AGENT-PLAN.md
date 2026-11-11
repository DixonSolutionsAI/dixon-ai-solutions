# Customer-Support AI Agent — Product Plan & Progress Tracker

**Purpose:** Keep this document as the working reminder of the product direction. Upload the latest copy into future planning chats to compare actual work against the roadmap, identify gaps, and agree on the next step.

**Plan version:** 1.0  
**Snapshot date:** 2026-11-11  
**Repository:** `DixonSolutionsAI/dixon-ai-solutions`  
**Working branch:** `feature/zendesk-support-agent-pilot`  
**Current product stage:** Early private prototype; not production-ready.

> Update the progress table and snapshot date whenever implementation or verification changes. A feature is not “done” merely because code exists: record test/build/deployment evidence and any remaining limitations.

## 1. Product vision

Build a broad customer-support agent platform that helps businesses resolve customer issues across channels by combining company knowledge, customer/ticket context, integrations, human oversight, and controlled automation.

The platform should grow beyond drafting replies. The long-term direction includes:

- Company policy and knowledge uploads, updates, source references, and retrieval.
- Customer and ticket context through help-desk, CRM, and order-management integrations.
- Context-preserving escalation and handoff to human support.
- Drafting, review, and—when enabled with appropriate permissions—sending replies from within the platform.
- Carefully scoped customer/account actions, with approval controls, audit trails, and reversibility where possible.
- Business accounts, teams, roles, subscription plans, usage controls, and billing.
- Operational analytics and support across multiple channels, with voice as a later capability.

The initial human-reviewed reply-drafting workflow is a foundation and testable first release—not the intended limit of the product.

## 2. Product principles

1. **Ground answers in evidence.** Prefer approved company policies and connected-system facts; identify sources and flag missing, stale, or conflicting information.
2. **Do not invent facts or claim actions that did not happen.** When uncertain, ask for clarification or escalate.
3. **Human oversight is configurable but safe by default.** Sending messages and consequential actions require explicit authorization and confirmation until separately validated.
4. **Preserve context.** A human handoff should include the customer's issue, relevant history, sources consulted, attempted steps, and the reason for escalation.
5. **Protect tenant and customer data.** Enforce organization boundaries, least privilege, retention choices, and privacy-conscious logs.
6. **Measure outcomes honestly.** Distinguish a generated answer from a verified resolution; track failures, escalation, edits, and approvals.
7. **Build and verify in gates.** Mocked development → automated/local tests → Preview checks → limited real-provider verification → Production readiness review.

## 3. Users and roles (target)

- **Organization owner/admin:** configures organization, knowledge, integrations, roles, plans, and autonomy controls.
- **Support manager/reviewer:** reviews quality, escalations, analytics, and approvals.
- **Support agent:** works cases, edits drafts, escalates, and performs permitted actions.
- **Billing admin:** manages plan, usage, payment, and cancellation.
- **End customer:** receives support through enabled channels; should not see internal review notes or confidential policy content.

## 4. Requirements backlog

### R1 — Complex, context-aware issue resolution

**Need:** The agent should do more than answer FAQs. It should use authorized customer, ticket, order, and case history; handle multi-step workflows; and propose or perform only permitted actions.

**Acceptance criteria:**
- The agent uses only context it is authorized to access and identifies the source of material facts.
- Missing or conflicting data causes a clarification request or human escalation, not a guessed answer.
- Actions are separated from answers and are governed by explicit permissions and approval policy.
- Before/after state and the actor/approver are recorded for supported actions.
- Tests cover missing context, conflicting context, failed integrations, unauthorized actions, and successful approved workflows.

### R2 — Context-preserving escalation and human handoff

**Need:** Move a case to a human without making the customer or support rep repeat information.

**Acceptance criteria:**
- Handoff includes the customer issue, conversation/ticket reference, relevant verified context, policy sources, draft/steps already attempted, and a concise escalation reason.
- The human can see what is known, what is uncertain, and what needs attention.
- Handoff status and subsequent human actions are visible in case history/audit records.
- Sensitive internal notes are not accidentally included in customer-facing text.
- Tests verify context preservation and failure/retry behavior for each integration.

### R3 — Reliable company knowledge and policy management

**Need:** Let businesses upload and maintain policies and support materials so users do not need to paste the same details into each request.

**Acceptance criteria:**
- Authorized admins can add, view, update, replace, and remove supported files or knowledge entries.
- Each source has organization ownership, title/type, version, timestamps, and processing status.
- The system extracts/indexes content safely and retrieves relevant passages for a case.
- Drafts/review views show source references; unsupported claims are flagged.
- Conflicting, expired, failed-to-process, and stale documents are surfaced for review.
- Upload size/type limits, malware/content handling, tenant isolation, deletion, and retention are tested.
- The system does not treat document instructions as authority to override system safety or access rules.

### R4 — Governed sending and customer/account actions

**Need:** Allow replies to be sent from the agent without leaving the platform and support selected customer/account actions later.

**Acceptance criteria:**
- Initial send workflow requires a human to inspect/edit and explicitly confirm recipient, channel, and content.
- The system shows the final message and target before sending; prevents accidental duplicate sends where feasible.
- Action permissions are configured per organization/role and checked on the server for every action.
- High-impact actions require approval; unsupported or unauthorized actions are blocked.
- Every attempt and result (including failures) is auditable without storing unnecessary sensitive payloads.
- Provide clear status and safe recovery behavior when a connected service times out or returns an ambiguous result.
- Autonomous sending/actions remain disabled by default until separately evaluated and enabled by an authorized admin.

### R5 — Integrations and source-of-truth context

**Need:** Connect the platform to help desks and business systems so the agent works in the support workflow rather than requiring copying between tools.

**Initial candidates to validate:** Zendesk, Freshdesk, Salesforce, and relevant order-management/e-commerce systems. Prioritize with user research before committing to a provider.

**Acceptance criteria:**
- Admin can connect/disconnect a supported integration using secure authorization and least-privilege scopes.
- The system can retrieve the authorized ticket/customer/order context and show its source and freshness.
- The agent can create/update a draft or send an approved reply in the connected system when that integration supports it.
- Webhook/API authenticity, retries, rate limits, revocation, and error handling are tested.
- Integration credentials are stored as secrets and never exposed to browsers or logs.

### R6 — Accounts, organizations, and access governance

**Need:** Replace the temporary shared pilot code with individual sign-in and organization-level access controls.

**Acceptance criteria:**
- Users belong to an organization and have explicit roles/permissions.
- Organization data, uploaded knowledge, integrations, cases, analytics, and billing are tenant-isolated.
- Admins can invite, change role, suspend, and remove members.
- Server-side authorization protects every private API and resource; UI hiding alone is insufficient.
- Authentication/session, recovery, invitation, and permission-denial paths are tested.
- Audit events cover security-sensitive changes and actions.

### R7 — Autonomy controls and auditability

**Need:** Give businesses clear control over what the agent may do and when it must ask a human.

**Acceptance criteria:**
- Organization-level modes include draft-only, draft-and-approval, and explicitly enabled low-risk actions.
- Policies are enforced server-side and can be overridden only by authorized roles.
- Each decision/action records who/what initiated it, applicable policy, approval, result, and timestamp.
- High-impact, ambiguous, or out-of-policy cases escalate.
- Logs exclude API keys, access tokens, raw provider errors, and unnecessary customer content.

### R8 — Analytics and transparency

**Need:** Explain what the agent did, where it failed, and where humans had to intervene.

**Acceptance criteria:**
- Report drafts, approvals, edits, rejections, escalations and reasons, action attempts/results, and source/knowledge usage.
- Distinguish “reply sent” from “issue resolved”; resolution metrics require an explicit definition and evidence.
- Allow authorized filtering by organization/team, time, integration, and channel.
- Provide privacy-conscious aggregate metrics and appropriate retention/access controls.
- Metrics are tested against known event fixtures and do not infer success from generation alone.

### R9 — Multi-channel support, including future voice

**Need:** Keep policy and case context consistent across web chat, email, ticketing, and later voice/messaging channels.

**Acceptance criteria:**
- Every interaction is associated with a case and channel/source.
- Context and handoff survive channel transitions without leaking data between customers or organizations.
- Channel-specific behavior (format, consent, identity, timing) is explicit and tested.
- Voice is a later release with separate evaluation for transcription quality, consent, accessibility, latency, and escalation.

### R10 — Subscription, billing, and usage controls

**Need:** Offer a sustainable paid product with clear plans and predictable limits.

**Decisions required before implementation:** target customer, plan tiers, trial length/eligibility, included seats/usage, overage behavior, cancellation, refunds, retention after expiration, and support expectations.

**Acceptance criteria:**
- Hosted checkout and billing portal are used; payment details are not handled directly by the app.
- Verified, idempotent billing webhooks update server-side subscription state.
- Plan and usage entitlement checks are enforced server-side.
- Trial, payment failure, cancellation, expiration, and reactivation paths are tested.
- Users can see current plan, usage, and what happens at limits/expiration.

## 5. Delivery sequence and release gates

### Gate 0 — Stable branch/build and current MVP baseline
- Keep work on `feature/zendesk-support-agent-pilot` until changes are reviewed.
- Verify commit, GitHub checks, and the actual Vercel Preview branch/commit/status separately.
- Keep `main` separate; inspect and repair it before treating it as deployable.
- Never share environment-variable values in chat or commit them to source.

### Gate 1 — Mocked development
- Add an explicit development-only mock provider with a fixed, clearly labeled simulated response.
- Never allow mock mode to be mistaken for real AI or enabled for Production.
- Keep provider errors sanitized; add timeout and bounded retry behavior.

### Gate 2 — Automated and local tests
- Cover request validation, wrong/missing access code, missing config, mock success, malformed provider result, provider failure/timeout, and draft/review-note response shape.
- Add UI tests where practical and run test/build scripts locally or in CI.
- Use fictional data only; prove tests do not require provider credits or expose secrets.

### Gate 3 — Preview deployment checks
- Confirm Preview deployment branch, commit, and Ready/Failed status in Vercel.
- Confirm required Preview variable names are present without disclosing their values.
- Use fictional data to test wrong code → expected 401.
- Use mock mode to verify the app workflow and visible simulated draft.
- Record deployment URL/commit/status, response status, and sanitized errors. A mock result does not verify model quality.

### Gate 4 — Limited real-provider verification
- Proceed only after API billing and a controlled budget/usage cap are available.
- Make a small number of short requests with fictional data; verify draft and review note, latency, failure behavior, and usage.
- Record results without logging keys or sensitive request/response data.

### Gate 5 — Production readiness and launch
- Do not launch publicly until account authentication, tenant isolation, persistent rate limiting, privacy/data retention, monitoring, abuse controls, billing/usage enforcement, security review, and backup/recovery are addressed for the chosen scope.
- Confirm Production-specific configuration and run a release checklist against the exact production commit.
- Launch incrementally; monitor failures, spend, escalations, customer outcomes, and rollback readiness.

## 6. Market and complaint research plan

The six user-prioritized problem areas are requirements to address: (1) complex issue resolution, (2) context-preserving escalation, (3) knowledge reliability, (4) customization/governance, (5) voice/omnichannel consistency, and (6) analytics transparency.

The initial market scan is directional only. It is not a comprehensive or independently verified audit of all vendors or all online complaints. Continue research by:

- Selecting comparable vendors and user segments (e.g., small-business help desks versus enterprise service platforms).
- Collecting dated, attributable evidence from vendor documentation, release notes, review sites, support forums, and customer discussions.
- Recording source URL, date, vendor/product, complaint/request, evidence type, affected user, and confidence; separate firsthand complaints from marketing claims and analyst predictions.
- Grouping recurring themes, checking frequency and severity, identifying unmet needs, and mapping each to a requirement and test.
- Avoiding “all complaints addressed” claims; state the sources, sample, and known gaps.

## 7. Progress snapshot and evidence

Statuses: **Done (verified)** = implementation and evidence checked; **Implemented—verification pending** = code exists but required test/deployment proof is not recorded; **Not started** = no implementation evidence in this snapshot; **Research needed** = validate scope/evidence before designing.

| Item | Status at snapshot | Evidence / next verification |
|---|---|---|
| Feature branch baseline and prior GitHub CI | Done (verified at prior commit) | Branch was `feature/zendesk-support-agent-pilot`; commit `2b98a5e` had successful combined GitHub status. Recheck checks for later commits. |
| Current reply-drafting prototype | Implemented—verification pending | Accepts message and optional support details, returns reply/review note; uses temporary shared pilot code and OpenAI provider. Not a complete support platform. |
| Mock mode and sanitized provider logging | Implemented—verification pending | Added on feature branch in commit `77ca0f838b2e8eef9129a88efedb439bcff17a18`; mock requires `DRAFT_PROVIDER=mock`; response is labeled. Verify tests/build/Preview. |
| Automated mock test and `npm test` script | Implemented—verification pending | Test and script added in the same commit; no test-run result recorded here. |
| Preview variables | Needs user/dashboard verification | User reported `OPENAI_MODEL` missing and prepared `OPENAI_MODEL=gpt-4o-mini` in Preview; screenshot showed the add-variable form before submission. Confirm saved and redeploy. Never share values. |
| Real API request | Blocked / not verified | Previous request reached provider but returned `429 credit_balance_exhausted`. Real draft verification requires billing/credits and controlled spend. |
| Wrong-code 401 Preview test | Not verified | Run after mock deployment with fictional data; record status and sanitized response only. |
| Policy upload, retrieval, citations, freshness | Not started | Define supported file types, storage, tenant boundaries, indexing/retrieval, deletion, source citations, and tests. |
| Context-preserving handoff | Not started | Define case/handoff schema and first destination. |
| Help-desk/CRM/order integrations | Not started | Research target customers and select first integration. |
| Accounts, roles, organization isolation | Not started | Replace shared pilot code before multi-customer use. |
| Persistent rate limit, privacy monitoring, action audit | Not started | Design for deployment environment; serverless in-memory rate limiting is not a production control. |
| In-platform send and controlled actions | Not started | Require integration, authorization, approval UX, idempotency, and audit history. |
| Analytics / omnichannel / voice | Not started | Define metrics and channel scope; voice is later-stage. |
| Plans, trials, usage limits, subscription billing | Not started | Decide commercial rules before integrating hosted checkout/webhooks. |
| Market research backlog | In progress / incomplete | Six themes recorded above; conduct source-by-source review and keep evidence log. |
| `main` branch production readiness | Not approved | Earlier main change requires separate review and repair; do not infer readiness from feature-branch CI. |

## 8. Next actions (in order)

1. Confirm the latest feature-branch commit and check results, then verify Vercel Preview is for that exact branch/commit and is Ready.
2. Confirm `OPENAI_MODEL` was saved for Preview; it is optional because the code defaults to `gpt-4o-mini`. Keep provider credentials and pilot code secret.
3. Run automated tests and build; fix failures before Preview testing.
4. Set `DRAFT_PROVIDER=mock` only in a non-production development/Preview environment if needed, redeploy, and verify mock success plus wrong-code 401 with fictional input.
5. Create detailed stories and technical design for policy upload/retrieval, organization data isolation, handoff, first help-desk integration, and safe in-platform sending.
6. Continue market/complaint research with a traceable source log and use evidence to prioritize, not to promise universal coverage.
7. Revisit real-provider and production gates only when billing, access controls, privacy, cost limits, and verification criteria are ready.

## 9. Progress update template

Copy this section when updating the document after a work session:

```text
Update date:
Branch / commit:
Feature or requirement changed:
Implementation evidence (files/PR/commit):
Tests run and results:
Build/CI status:
Preview deployment branch / commit / status:
Manual test and response status (no secrets or customer data):
Known issue or blocker:
Next smallest step:
Requirement status: Not started / In progress / Implemented—verification pending / Done (verified)
```

## 10. Decision log

| Date | Decision | Notes / follow-up |
|---|---|---|
| 2026-11-11 | Product direction is a broad customer-support platform, not only reply drafting. | Stage delivery and verification; do not claim all market complaints/features are covered. |
| 2026-11-11 | Initial product requirements include the six user-prioritized complaint areas. | Keep these as explicit requirements and measure each with acceptance criteria. |
| 2026-11-11 | Development proceeds through mocked development, automated/local tests, Preview checks, limited real-API verification, then Production readiness. | Mocked behavior does not prove live AI quality. |
```
