const VALID_PRIORITIES = ["LOW", "MEDIUM", "HIGH"];
const VALID_STATUSES = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];

const validateCreateTicket = (body) => {
  const { subject, description, priority } = body;

  if (!subject || typeof subject !== "string" || !subject.trim()) {
    return { valid: false, message: "Subject is required" };
  }
  if (subject.trim().length < 3 || subject.trim().length > 200) {
    return { valid: false, message: "Subject must be between 3 and 200 characters" };
  }

  if (!description || typeof description !== "string" || !description.trim()) {
    return { valid: false, message: "Description is required" };
  }
  if (description.trim().length < 10) {
    return { valid: false, message: "Description must be at least 10 characters" };
  }
  if (description.trim().length > 3000) {
    return { valid: false, message: "Description must not exceed 3000 characters" };
  }

  if (priority !== undefined && priority !== "") {
    const norm = (priority + "").trim().toUpperCase();
    if (!VALID_PRIORITIES.includes(norm)) {
      return { valid: false, message: `Invalid priority. Allowed: ${VALID_PRIORITIES.join(", ")}` };
    }
  }

  return { valid: true };
};

const validateUpdateTicket = (body) => {
  const { status } = body;

  if (!status || typeof status !== "string" || !status.trim()) {
    return { valid: false, message: "Status is required for update" };
  }
  const norm = status.trim().toUpperCase();
  if (!VALID_STATUSES.includes(norm)) {
    return { valid: false, message: `Invalid status. Allowed: ${VALID_STATUSES.join(", ")}` };
  }

  return { valid: true };
};

module.exports = { validateCreateTicket, validateUpdateTicket, VALID_PRIORITIES, VALID_STATUSES };
