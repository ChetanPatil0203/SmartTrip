const validateCabSearch = (query) => {
  const { category, isEv } = query;
  const validCategories = ["all", "auto", "cab", "sedan", "suv", "ev"];

  if (category && !validCategories.includes(category.toLowerCase())) {
    return {
      valid: false,
      message: `Invalid category. Allowed: ${validCategories.join(", ")}`,
    };
  }

  return { valid: true };
};

const validateCabBooking = (body) => {
  const { pickupAddress, dropAddress, vehicleId } = body;

  if (!pickupAddress || !pickupAddress.trim()) {
    return { valid: false, message: "pickupAddress is required" };
  }
  if (!dropAddress || !dropAddress.trim()) {
    return { valid: false, message: "dropAddress is required" };
  }
  if (!vehicleId || !vehicleId.trim()) {
    return { valid: false, message: "vehicleId is required" };
  }

  return { valid: true };
};

const validateStatusUpdate = (body) => {
  const { stage, status } = body;
  const validStages = [1, 2, 3, 4];
  const validStatuses = ["SEARCHING", "ACCEPTED", "ARRIVING", "ARRIVED", "IN_PROGRESS", "COMPLETED", "CANCELLED"];

  if (stage !== undefined && !validStages.includes(Number(stage))) {
    return { valid: false, message: "Invalid stage. Must be 1 (Arriving), 2 (Arrived), 3 (In Transit), or 4 (Completed)" };
  }

  if (status && !validStatuses.includes(status.toUpperCase())) {
    return { valid: false, message: `Invalid status. Allowed: ${validStatuses.join(", ")}` };
  }

  return { valid: true };
};

module.exports = {
  validateCabSearch,
  validateCabBooking,
  validateStatusUpdate,
};
