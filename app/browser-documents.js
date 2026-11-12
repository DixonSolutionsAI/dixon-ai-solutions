export const documentKeys = {
  policy: "instantreply-policy",
  guidelines: "instantreply-guidelines",
};

export function getDocuments() {
  try {
    return {
      companyPolicy: localStorage.getItem(documentKeys.policy) || "",
      companyGuidelines: localStorage.getItem(documentKeys.guidelines) || "",
    };
  } catch {
    throw new Error("Cannot access browser document storage. Enable site storage and try again.");
  }
}
