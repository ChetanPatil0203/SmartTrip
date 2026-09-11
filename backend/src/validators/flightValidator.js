const validateFlightSearch = (query) => {
  const { source, destination, date, returnDate, tripType, passengers, minPrice, maxPrice, cabinClass, sortBy, page, limit } = query;

  if (!source || typeof source !== "string" || !source.trim()) {
    return { valid: false, message: "Source airport (ID, code, city, or name) is required" };
  }

  if (!destination || typeof destination !== "string" || !destination.trim()) {
    return { valid: false, message: "Destination airport (ID, code, city, or name) is required" };
  }

  if (!date || typeof date !== "string" || !date.trim() || isNaN(Date.parse(date.trim()))) {
    return { valid: false, message: "Valid departure date is required (e.g. YYYY-MM-DD)" };
  }

  const parsedTripType = tripType ? tripType.trim().toLowerCase() : "one_way";
  const allowedTripTypes = ["one_way", "round_trip"];
  if (!allowedTripTypes.includes(parsedTripType)) {
    return { valid: false, message: "Invalid tripType. Allowed values: one_way, round_trip" };
  }

  if (parsedTripType === "round_trip") {
    if (!returnDate || typeof returnDate !== "string" || !returnDate.trim() || isNaN(Date.parse(returnDate.trim()))) {
      return { valid: false, message: "Valid returnDate is required for round_trip journeys (e.g. YYYY-MM-DD)" };
    }

    const depTime = Date.parse(date.trim());
    const retTime = Date.parse(returnDate.trim());
    if (retTime < depTime) {
      return { valid: false, message: "returnDate cannot be earlier than departure date" };
    }
  }

  const parsedPassengers = passengers ? parseInt(passengers, 10) : 1;
  if (isNaN(parsedPassengers) || parsedPassengers < 1) {
    return { valid: false, message: "Passengers must be a positive integer" };
  }

  if (cabinClass && typeof cabinClass === "string") {
    const allowedClasses = ["ECONOMY", "PREMIUM_ECONOMY", "BUSINESS", "FIRST"];
    if (!allowedClasses.includes(cabinClass.trim().toUpperCase())) {
      return { valid: false, message: `Invalid cabinClass. Allowed values: ${allowedClasses.join(", ")}` };
    }
  }

  let pMin = undefined;
  let pMax = undefined;

  if (minPrice !== undefined && minPrice !== "") {
    pMin = parseFloat(minPrice);
    if (isNaN(pMin) || pMin < 0) {
      return { valid: false, message: "minPrice cannot be negative" };
    }
  }

  if (maxPrice !== undefined && maxPrice !== "") {
    pMax = parseFloat(maxPrice);
    if (isNaN(pMax) || pMax < 0) {
      return { valid: false, message: "maxPrice cannot be negative" };
    }
  }

  if (pMin !== undefined && pMax !== undefined && pMin > pMax) {
    return { valid: false, message: "minPrice cannot be greater than maxPrice" };
  }

  const allowedSort = ["price_low", "price_high", "departure_early", "departure_late", "duration_short", "duration_long"];
  if (sortBy && !allowedSort.includes(sortBy)) {
    return { valid: false, message: `Invalid sortBy parameter. Allowed values: ${allowedSort.join(", ")}` };
  }

  const parsedPage = page ? parseInt(page, 10) : 1;
  if (isNaN(parsedPage) || parsedPage < 1) {
    return { valid: false, message: "Page must be greater than or equal to 1" };
  }

  const parsedLimit = limit ? parseInt(limit, 10) : 10;
  if (isNaN(parsedLimit) || parsedLimit < 1 || parsedLimit > 50) {
    return { valid: false, message: "Limit must be an integer between 1 and 50" };
  }

  return { valid: true };
};

module.exports = {
  validateFlightSearch,
};
