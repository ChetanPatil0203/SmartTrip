const isValidDateString = (dateStr) => {
  if (typeof dateStr !== "string" || !dateStr.trim()) return false;
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr.trim())) return false;
  const parsed = Date.parse(dateStr.trim());
  return !isNaN(parsed);
};

const validateCreateBooking = (body) => {
  if (!body || typeof body !== "object") {
    return { valid: false, message: "Invalid request payload" };
  }

  const {
    bookingType,
    scheduleId,
    serviceId,
    hotelId,
    roomId,
    checkInDate,
    checkIn,
    checkOutDate,
    checkOut,
    numberOfRooms,
    rooms,
    numberOfGuests,
    guests,
    passengers,
    classCode,
    totalAmount,
  } = body;

  const validTypes = ["BUS", "TRAIN", "FLIGHT", "HOTEL"];
  if (!bookingType || typeof bookingType !== "string" || !validTypes.includes(bookingType.trim().toUpperCase())) {
    return { valid: false, message: `Invalid bookingType. Allowed values: ${validTypes.join(", ")}` };
  }

  const type = bookingType.trim().toUpperCase();

  // Validate passengers for transport bookings
  if (type !== "HOTEL") {
    if (!Array.isArray(passengers) || passengers.length === 0) {
      return { valid: false, message: "At least one passenger is required for transport bookings" };
    }

    for (let i = 0; i < passengers.length; i++) {
      const p = passengers[i];
      if (!p || typeof p !== "object") {
        return { valid: false, message: `Invalid passenger details at index ${i}` };
      }
      if (!p.name || typeof p.name !== "string" || !p.name.trim()) {
        return { valid: false, message: `Passenger name is required at index ${i}` };
      }
      if (p.age !== undefined && p.age !== null) {
        const parsedAge = parseInt(p.age, 10);
        if (isNaN(parsedAge) || parsedAge < 0 || parsedAge > 120) {
          return { valid: false, message: `Valid passenger age is required at index ${i}` };
        }
      }
    }
  }

  // Service specific validations
  const targetScheduleId = scheduleId || serviceId;

  if (type === "BUS") {
    if (!targetScheduleId || typeof targetScheduleId !== "string" || !targetScheduleId.trim()) {
      return { valid: false, message: "Bus scheduleId is required" };
    }
  }

  if (type === "TRAIN") {
    if (!targetScheduleId || typeof targetScheduleId !== "string" || !targetScheduleId.trim()) {
      return { valid: false, message: "Train scheduleId is required" };
    }
    if (!classCode || typeof classCode !== "string" || !classCode.trim()) {
      return { valid: false, message: "Train classCode is required (e.g. 3A, SL, 2A)" };
    }
  }

  if (type === "FLIGHT") {
    if (!targetScheduleId || typeof targetScheduleId !== "string" || !targetScheduleId.trim()) {
      return { valid: false, message: "Flight scheduleId is required" };
    }
  }

  if (type === "HOTEL") {
    if (!hotelId || typeof hotelId !== "string" || !hotelId.trim()) {
      return { valid: false, message: "hotelId is required" };
    }
    if (!roomId || typeof roomId !== "string" || !roomId.trim()) {
      return { valid: false, message: "roomId is required" };
    }

    const inDate = checkInDate || checkIn;
    const outDate = checkOutDate || checkOut;

    if (!inDate || !isValidDateString(inDate)) {
      return { valid: false, message: "Valid checkInDate is required (YYYY-MM-DD)" };
    }
    if (!outDate || !isValidDateString(outDate)) {
      return { valid: false, message: "Valid checkOutDate is required (YYYY-MM-DD)" };
    }

    const inTime = Date.parse(inDate.trim());
    const outTime = Date.parse(outDate.trim());
    if (outTime <= inTime) {
      return { valid: false, message: "checkOutDate must be later than checkInDate" };
    }

    const reqRooms = numberOfRooms || rooms || 1;
    const parsedRooms = parseInt(reqRooms, 10);
    if (isNaN(parsedRooms) || parsedRooms < 1) {
      return { valid: false, message: "numberOfRooms must be a positive integer" };
    }

    const reqGuests = numberOfGuests || guests || 1;
    const parsedGuests = parseInt(reqGuests, 10);
    if (isNaN(parsedGuests) || parsedGuests < 1) {
      return { valid: false, message: "numberOfGuests must be a positive integer" };
    }
  }

  // Validate totalAmount if provided
  if (totalAmount !== undefined && totalAmount !== null && totalAmount !== "") {
    const parsedAmount = parseFloat(totalAmount);
    if (isNaN(parsedAmount) || parsedAmount < 0) {
      return { valid: false, message: "totalAmount must be a non-negative number" };
    }
  }

  return { valid: true };
};

const validateGetUserBookings = (query) => {
  const { bookingType, status, page, limit } = query;

  if (bookingType && typeof bookingType === "string") {
    const validTypes = ["BUS", "TRAIN", "FLIGHT", "HOTEL"];
    if (!validTypes.includes(bookingType.trim().toUpperCase())) {
      return { valid: false, message: `Invalid bookingType. Allowed values: ${validTypes.join(", ")}` };
    }
  }

  if (status && typeof status === "string") {
    const validStatuses = ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED", "REFUNDED"];
    if (!validStatuses.includes(status.trim().toUpperCase())) {
      return { valid: false, message: `Invalid status. Allowed values: ${validStatuses.join(", ")}` };
    }
  }

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
  validateCreateBooking,
  validateGetUserBookings,
};
