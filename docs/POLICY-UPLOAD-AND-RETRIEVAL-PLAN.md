# Policy Upload and Retrieval — Requirements & Data Model

## Purpose

This plan defines the first structured requirement after the current human-reviewed reply-drafting MVP: turn ad hoc copied policy text into a reusable knowledge layer that is governed, versioned, retrievable, and auditable.

The goal is to reduce repeated copy-paste work for support owners while preserving safety and traceability.

## Product requirement

Support teams should be able to upload company policies, FAQs, or approved support instructions and have the agent use them automatically during draft generation, without guessing or inventing missing facts.

## Scope

This phase covers:
- policy upload and storage
- versioning and admin ownership
- retrieval for relevant support cases
- source references in generated drafts and review notes
- validations for missing, stale, or conflicting policies
- admin actions for updates and deletions
- privacy-safe access and audit logging

This phase does not include unrestricted autonomous sending, full billing/plan management, or public customer access.

## Primary user goals

- Support admin uploads a policy once and reuses it across many customer cases.
- Support agent sees the relevant policy section rather than manually copying and pasting details.
- The app flags missing or contradictory policy sources before a draft is sent.
- A human reviewer can verify which policy was consulted and whether it was current and approved.

## Functional requirements

### 1. Policy upload

An authorized admin must be able to create a policy document record with:
- organization / team scope
- title
- type (policy, FAQ, shipping info, return policy, escalation guidance, etc.)
- source or file reference
- status (draft, approved, expired, archived)
- createdAt, updatedAt, createdBy, updatedBy
- version number
- optional tags or categories

Support for:
- plain text paste
- uploaded text file
- PDF or document upload if the team chooses to support it later

Validation rules:
- require title and content
- reject empty or duplicate content when a policy is a near-copy of an existing approved policy
- preserve owner/organization visibility boundaries
- do not allow non-admin users to publish or update a policy

### 2. Policy versioning

Every policy change creates a new version record.

Versioned contents must include:
- file or text content hash
- version number
- effective date
- expiry date (if applicable)
- previous version reference
- status: active, draft, archived, expired

Acceptance behavior:
- active policies are eligible for retrieval
- expired or archived policies are excluded from active retrieval
- a reviewer can see the difference between versions

### 3. Retrieval for support context

When a support message is submitted, the system should retrieve the relevant policy sections to accompany the request.

Required retrieval conditions:
- organization-scoped search
- relevance based on message content and policy tags
- use only active and approved policies
- exclude expired, archived, or unapproved items
- prefer the most relevant and most recent approved version

Result fields:
- policyId
- policyVersionId
- title
- snippet or excerpt
- source reference
- confidence score
- retrieval timestamp
- reason for retrieval or match type

### 4. Drafting with policy context

The draft-generation service should receive:
- customer message
- optional free-form support context
- retrieved policy excerpts
- known customer data only if allowed by permissions and integration context

The response should include:
- generated reply text
- reviewNote
- policyReferences array with source names/versions
- a flag when the system had insufficient policy support or conflicting policy sources

### 5. Human review and trust gating

Before a draft is accepted or sent, a human must be able to verify:
- the applicable policy section or excerpts used
- whether a policy was current and approved
- whether the answer included facts not supported by policy or customer data
- whether the draft conflicts with other policies or recent updates

If no relevant policy is found, the system must either:
- ask for clarification, or
- escalate to a human reviewer if the case is sensitive or ambiguous

### 6. Governance and privacy

Policy data must be partitioned by organization and access role.

Required protections:
- admin-only upload/update
- access checks on every fetch and mutation
- no cross-tenant retrieval
- no policy text copied into browser-exposed UI unless necessary for review
- audit of upload, update, archive, and retrieval events
- redaction or sanitization of sensitive policy content in logs

## Data model (initial design)

The following data model is the first version for implementation.

```js
// Initial data shape used in the app layer

const PolicyDocument = {
  id: "policy_123",
  organizationId: "org_abc",
  title: "Shipping and delivery policy",
  type: "policy",
  status: "approved",
  createdAt: "2026-11-11T00:00:00Z",
  updatedAt: "2026-11-11T00:00:00Z",
  createdBy: "user_001",
  updatedBy: "user_001",
  tags: ["shipping", "delivery", "customer-support"],
  activeVersionId: "policy_version_456",
};

const PolicyVersion = {
  id: "policy_version_456",
  policyId: "policy_123",
  versionNumber: 2,
  content: "Standard shipping takes 5-7 business days.",
  contentHash: "sha256:...",
  status: "approved",
  effectiveFrom: "2026-10-15T00:00:00Z",
  effectiveUntil: null,
  createdAt: "2026-11-11T00:00:00Z",
  createdBy: "user_001",
  sourceFileName: "shipping-policy-v2.txt",
};

const PolicyRetrievalRecord = {
  id: "retrieval_001",
  organizationId: "org_abc",
  caseId: "case_123",
  policyId: "policy_123",
  policyVersionId: "policy_version_456",
  excerpt: "Standard shipping takes 5-7 business days.",
  score: 0.96,
  sourceType: "semantic_search",
  retrievedAt: "2026-11-11T00:00:00Z",
  userId: "user_002",
};

const DraftAuditRecord = {
  id: "audit_001",
  organizationId: "org_abc",
  caseId: "case_123",
  draftId: "draft_777",
  userId: "user_002",
  action: "draft_generated",
  policyIds: ["policy_123"],
  policyVersions: ["policy_version_456"],
  createdAt: "2026-11-11T00:00:00Z",
};
```

## Acceptance and verification checklist

For this phase, the product is ready only when:
- admins can upload and update policy records
- policy versioning works
- active and expired versions are handled correctly
- relevant policy excerpts are retrieved during a case request
- draft output references the policy source(s)
- missing or conflicting policy data triggers clarification or escalation
- data is scoped to org/team and protected from cross-user access
- uploads and changes are logged in an audit trail

## Release gates for this phase

### Gate A — policy model and schema ready
- policy document model exists and is documented
- admin permissions are defined
- statuses and versioning rules are documented

### Gate B — retrieval contract defined
- policy retrieval result JSON is defined
- same structure is used by app, review tool, and future integrations

### Gate C — admin review flow defined
- reviewers can see policy source and history
- conflicting policy state is visible before a reply is approved

### Gate D — tests and safety checks written
- missing policy case
- conflicting policy case
- expired policy case
- unauthorized policy access attempt
- large upload rejection or size cap

## Operational notes

- Do not store raw provider errors or customer content in plain logs.
- Use an explicit policy source reference in the review note so the human reviewer can verify the draft quickly.
- Keep the first version simple: one policy document type, versioning, retrieval, and review references.
- Do not allow the AI to “invent” policy content when a document is missing or stale.

## Next implementation tasks

1. Define the admin policy-upload API contract.
2. Define the organization/team access schema.
3. Add a request/response schema for retrieval results used by the draft route.
4. Add tests for missing, stale, and conflicting policy records.
5. Update the roadmap and progress tracker after code/doc changes.

## Related product plan

See also: `docs/CUSTOMER-SUPPORT-AGENT-PLAN.md`.
