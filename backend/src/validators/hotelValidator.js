const isValidDateString = (dateStr) => {
  if (typeof dateStr !== "string" || !dateStr.trim()) return false;
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr.trim())) return false;
  const parsed = Date.parse(dateStr.trim());
  return !isNaN(parsed);
};

const validateHotelSearch = (query) => {
  const {
    checkIn,
    checkOut,
    guests,
    rooms,
    minPrice,
    maxPrice,
    minRating,
    maxRating,
    sortBy,
    page,
    limit,
  } = query;

  // CheckIn & CheckOut consistency
  if (checkIn && !checkOut) {
    return { valid: false, message: "checkOut date is required when checkIn is provided" };
  }
  if (checkOut && !checkIn) {
    return { valid: false, message: "checkIn date is required when checkOut is provided" };
  }

  if (checkIn && checkOut) {
    if (!isValidDateString(checkIn)) {
      return { valid: false, message: "Valid checkIn date is required (YYYY-MM-DD)" };
    }
    if (!isValidDateString(checkOut)) {
      return { valid: false, message: "Valid checkOut date is required (YYYY-MM-DD)" };
    }

    const inTime = Date.parse(checkIn.trim());
    const outTime = Date.parse(checkOut.trim());
    if (outTime <= inTime) {
      return { valid: false, message: "checkOut must be later than checkIn date" };
    }
  }

  // Guests & Rooms
  if (guests !== undefined && guests !== "") {
    const parsedGuests = parseInt(guests, 10);
    if (isNaN(parsedGuests) || parsedGuests < 1) {
      return { valid: false, message: "guests must be a positive integer (minimum 1)" };
    }
  }

  if (rooms !== undefined && rooms !== "") {
    const parsedRooms = parseInt(rooms, 10);
    if (isNaN(parsedRooms) || parsedRooms < 1) {
      return { valid: false, message: "rooms must be a positive integer (minimum 1)" };
    }
  }

  // Price Filters
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

  // Rating Filters
  let rMin = undefined;
  let rMax = undefined;

  if (minRating !== undefined && minRating !== "") {
    rMin = parseFloat(minRating);
    if (isNaN(rMin) || rMin < 0 || rMin > 5) {
      return { valid: false, message: "minRating must be a number between 0 and 5" };
    }
  }

  if (maxRating !== undefined && maxRating !== "") {
    rMax = parseFloat(maxRating);
    if (isNaN(rMax) || rMax < 0 || rMax > 5) {
      return { valid: false, message: "maxRating must be a number between 0 and 5" };
    }
  }

  if (rMin !== undefined && rMax !== undefined && rMin > rMax) {
    return { valid: false, message: "minRating cannot be greater than maxRating" };
  }

  // SortBy
  const allowedSort = ["price_low", "price_high", "rating_high", "rating_low", "name_asc", "name_desc"];
  if (sortBy && !allowedSort.includes(sortBy)) {
    return { valid: false, message: `Invalid sortBy parameter. Allowed values: ${allowedSort.join(", ")}` };
  }

  // Pagination
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

  return { valid: true };
};

module.exports = {
  isValidDateString,
  validateHotelSearch,
};
