// Knowledge-base schema definitions for the next product phase.
// This is intentionally a design scaffold, not a production persistence layer.

const POLICY_STATUS = {
  DRAFT: "draft",
  APPROVED: "approved",
  ARCHIVED: "archived",
  EXPIRED: "expired",
};

const POLICY_TYPE = {
  POLICY: "policy",
  FAQ: "faq",
  SHIPPING: "shipping",
  RETURNS: "returns",
  ESCALATION: "escalation",
  OTHER: "other",
};

const PolicyDocument = {
  id: "policy_123",
  organizationId: "org_abc",
  title: "Shipping and delivery policy",
  type: POLICY_TYPE.SHIPPING,
  status: POLICY_STATUS.APPROVED,
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
  contentHash: "sha256:example",
  status: POLICY_STATUS.APPROVED,
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

module.exports = {
  POLICY_STATUS,
  POLICY_TYPE,
  PolicyDocument,
  PolicyVersion,
  PolicyRetrievalRecord,
  DraftAuditRecord,
};
