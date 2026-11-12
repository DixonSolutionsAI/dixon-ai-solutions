const TEMPLATE_KEY = "instantreply-response-templates";
const TEMPLATE_TYPES = new Set(["text_message", "call_prompts"]);

function createMailtoUrl({ to, cc, subject, body, signature }) {
  function addresses(value, required) {
    const list = value.split(",").map((address) => address.trim()).filter(Boolean);
    if ((required && !list.length) || list.some((address) => !/^[^\s@,<>]+@[^\s@,<>]+$/.test(address))) {
      throw new Error(required ? "Enter valid recipient email addresses, separated by commas." : "Enter valid Cc email addresses, separated by commas.");
    }
    return list.map(encodeURIComponent).join(",");
  }
  const recipient = addresses(to, true);
  const copies = addresses(cc, false);
  const text = signature.trim() ? `${body}\n\n${signature}` : body;
  const lines = text.replace(/\r\n|\r|\n/g, "\r\n");
  return `mailto:${recipient}?${copies ? `cc=${copies}&` : ""}subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines)}`;
}

function readTemplates(storage) {
  const raw = storage.getItem(TEMPLATE_KEY);
  if (raw === null) return [];
  const templates = JSON.parse(raw);
  if (!Array.isArray(templates) || !templates.every((item) =>
    item && typeof item.id === "string" && TEMPLATE_TYPES.has(item.type) &&
    typeof item.label === "string" && item.label.trim() && typeof item.body === "string" && item.body.trim()
  )) {
    throw new Error("Saved response templates are invalid.");
  }
  return templates;
}

function saveTemplate(storage, template) {
  const templates = readTemplates(storage);
  if (!TEMPLATE_TYPES.has(template.type) || !template.label.trim() || !template.body.trim()) {
    throw new Error("Enter a template name and response.");
  }
  if (template.label.length > 100 || template.body.length > 5000) {
    throw new Error("Template name or response is too long.");
  }
  if (templates.length >= 50) throw new Error("Delete a template before saving more than 50.");
  const updated = [...templates, template];
  storage.setItem(TEMPLATE_KEY, JSON.stringify(updated));
  return updated;
}

function deleteTemplate(storage, id) {
  const updated = readTemplates(storage).filter((template) => template.id !== id);
  storage.setItem(TEMPLATE_KEY, JSON.stringify(updated));
  return updated;
}

module.exports = { createMailtoUrl, readTemplates, saveTemplate, deleteTemplate };
