const VALID_TYPES = ["BOOKING", "PAYMENT", "DELAY", "CANCELLATION", "REFUND", "OFFER", "GENERAL"];
const VALID_SORT_FIELDS = ["createdAt", "isRead"];
const VALID_SORT_ORDERS = ["asc", "desc"];

const validateListNotifications = (query) => {
  const { page, limit, type, isRead, sortBy, sortOrder } = query;

  if (page !== undefined && page !== "") {
    const parsedPage = parseInt(page, 10);
    if (isNaN(parsedPage) || parsedPage < 1) {
      return { valid: false, message: "page must be a positive integer (>= 1)" };
    }
  }

  if (limit !== undefined && limit !== "") {
    const parsedLimit = parseInt(limit, 10);
    if (isNaN(parsedLimit) || parsedLimit < 1 || parsedLimit > 50) {
      return { valid: false, message: "limit must be an integer between 1 and 50" };
    }
  }

  if (type !== undefined && type !== "") {
    const normType = type.trim().toUpperCase();
    if (!VALID_TYPES.includes(normType)) {
      return { valid: false, message: `Invalid type. Allowed values: ${VALID_TYPES.join(", ")}` };
    }
  }

  if (isRead !== undefined && isRead !== "") {
    if (isRead !== "true" && isRead !== "false") {
      return { valid: false, message: "isRead must be 'true' or 'false'" };
    }
  }

  if (sortBy !== undefined && sortBy !== "") {
    if (!VALID_SORT_FIELDS.includes(sortBy)) {
      return { valid: false, message: `Invalid sortBy. Allowed: ${VALID_SORT_FIELDS.join(", ")}` };
    }
  }

  if (sortOrder !== undefined && sortOrder !== "") {
    if (!VALID_SORT_ORDERS.includes(sortOrder.toLowerCase())) {
      return { valid: false, message: "sortOrder must be 'asc' or 'desc'" };
    }
  }

  return { valid: true };
};

module.exports = { validateListNotifications };
