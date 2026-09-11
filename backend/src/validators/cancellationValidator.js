const validateCancelBooking = (body) => {
  if (body && typeof body === "object" && body.reason !== undefined) {
    if (typeof body.reason !== "string") {
      return { valid: false, message: "Cancellation reason must be a text string" };
    }
  }
  return { valid: true };
};

const validatePaginationAndFilters = (query) => {
  const { page, limit, status, bookingType } = query;

  if (page !== undefined && page !== "") {
    const parsedPage = parseInt(page, 10);
    if (isNaN(parsedPage) || parsedPage < 1) {
      return { valid: false, message: "Page must be greater than or equal to 1" };
    }
  }

  if (limit !== undefined && limit !== "") {
    const parsedLimit = parseInt(limit, 10);
    if (isNaN(parsedLimit) || parsedLimit < 1 || parsedLimit > 50) {
      return { valid: false, message: "Limit must be an integer between 1 and 50" };
    }
  }

  if (status && typeof status === "string") {
    const validStatuses = ["REQUESTED", "PROCESSED", "REJECTED", "PENDING", "PROCESSING", "COMPLETED", "FAILED"];
    if (!validStatuses.includes(status.trim().toUpperCase())) {
      return { valid: false, message: `Invalid status filter. Allowed values: ${validStatuses.join(", ")}` };
    }
  }

  if (bookingType && typeof bookingType === "string") {
    const validTypes = ["BUS", "TRAIN", "FLIGHT", "HOTEL"];
    if (!validTypes.includes(bookingType.trim().toUpperCase())) {
      return { valid: false, message: `Invalid bookingType filter. Allowed values: ${validTypes.join(", ")}` };
    }
  }

  return { valid: true };
};

module.exports = {
  validateCancelBooking,
  validatePaginationAndFilters,
};
