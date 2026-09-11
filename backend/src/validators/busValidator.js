const validateBusSearch = (query) => {
  const { source, destination, date, passengers, minPrice, maxPrice, sortBy, page, limit } = query;

  if (!source || typeof source !== "string" || !source.trim()) {
    return { valid: false, message: "Source location is required" };
  }

  if (!destination || typeof destination !== "string" || !destination.trim()) {
    return { valid: false, message: "Destination location is required" };
  }

  if (!date || typeof date !== "string" || !date.trim() || isNaN(Date.parse(date.trim()))) {
    return { valid: false, message: "Valid travel date is required (e.g. YYYY-MM-DD)" };
  }

  const parsedPassengers = passengers ? parseInt(passengers, 10) : 1;
  if (isNaN(parsedPassengers) || parsedPassengers < 1) {
    return { valid: false, message: "Passengers must be a positive integer" };
  }

  if (minPrice !== undefined && minPrice !== "") {
    const pMin = parseFloat(minPrice);
    if (isNaN(pMin) || pMin < 0) {
      return { valid: false, message: "minPrice cannot be negative" };
    }
  }

  if (maxPrice !== undefined && maxPrice !== "") {
    const pMax = parseFloat(maxPrice);
    if (isNaN(pMax) || pMax < 0) {
      return { valid: false, message: "maxPrice cannot be negative" };
    }
  }

  const allowedSort = ["price_low", "price_high", "departure_early", "departure_late", "rating"];
  if (sortBy && !allowedSort.includes(sortBy)) {
    return { valid: false, message: `Invalid sortBy parameter. Allowed values: ${allowedSort.join(", ")}` };
  }

  const parsedPage = page ? parseInt(page, 10) : 1;
  if (isNaN(parsedPage) || parsedPage < 1) {
    return { valid: false, message: "Page must be greater than or equal to 1" };
  }

  const parsedLimit = limit ? parseInt(limit, 10) : 20;
  if (isNaN(parsedLimit) || parsedLimit < 1 || parsedLimit > 50) {
    return { valid: false, message: "Limit must be an integer between 1 and 50" };
  }

  return { valid: true };
};

module.exports = {
  validateBusSearch,
};
