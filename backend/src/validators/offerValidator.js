const VALID_SORT_FIELDS = ["createdAt", "validUntil", "discountValue"];
const VALID_SORT_ORDERS = ["asc", "desc"];

const validateOfferListQuery = (query) => {
  const { page, limit, sortBy, sortOrder } = query;

  if (page !== undefined && page !== "") {
    const p = parseInt(page, 10);
    if (isNaN(p) || p < 1) {
      return { valid: false, message: "page must be a positive integer (>= 1)" };
    }
  }

  if (limit !== undefined && limit !== "") {
    const l = parseInt(limit, 10);
    if (isNaN(l) || l < 1 || l > 50) {
      return { valid: false, message: "limit must be between 1 and 50" };
    }
  }

  if (sortBy !== undefined && sortBy !== "" && !VALID_SORT_FIELDS.includes(sortBy)) {
    return { valid: false, message: `Invalid sortBy. Allowed: ${VALID_SORT_FIELDS.join(", ")}` };
  }

  if (sortOrder !== undefined && sortOrder !== "" && !VALID_SORT_ORDERS.includes(sortOrder)) {
    return { valid: false, message: "sortOrder must be 'asc' or 'desc'" };
  }

  return { valid: true };
};

module.exports = { validateOfferListQuery };
