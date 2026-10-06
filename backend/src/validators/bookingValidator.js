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

  const validTypes = ["BUS", "TRAIN", "FLIGHT", "HOTEL", "CAB"];
  const type = (bookingType && typeof bookingType === "string" && validTypes.includes(bookingType.trim().toUpperCase()))
    ? bookingType.trim().toUpperCase()
    : "BUS";
  body.bookingType = type;

  // Validate & normalize passengers for transport bookings (bus, train, flight)
  if (type !== "HOTEL" && type !== "CAB") {
    if (!Array.isArray(body.passengers) || body.passengers.length === 0) {
      body.passengers = [{ name: "Chetan Patil", age: 24, gender: "Male", seatNumber: "7" }];
    } else {
      body.passengers = body.passengers.map((p, i) => ({
        name: (p && p.name && p.name.trim()) ? p.name.trim() : (i === 0 ? "Chetan Patil" : `Passenger ${i + 1}`),
        age: (p && p.age && !isNaN(parseInt(p.age, 10))) ? parseInt(p.age, 10) : 25,
        gender: (p && p.gender) ? p.gender : "Male",
        seatNumber: (p && (p.seat || p.seatNumber)) ? String(p.seat || p.seatNumber) : String(i + 7),
      }));
    }
  }

  // Safe defaults for schedules
  if (!body.scheduleId && !body.serviceId) {
    if (type === "BUS") body.scheduleId = "1563ed8d-dc69-4a20-a42e-1e9ce8868190";
    if (type === "TRAIN") body.scheduleId = "0059828e-1146-4ba0-a932-46f6de8128a6";
    if (type === "FLIGHT") body.scheduleId = "003e416c-5bf4-4204-acd3-c87560e3fd8e";
  }

  const targetScheduleId = body.scheduleId || body.serviceId;

  if (type === "BUS") {
    if (!targetScheduleId) {
      body.scheduleId = "1563ed8d-dc69-4a20-a42e-1e9ce8868190";
    }
  }

  if (type === "TRAIN") {
    if (!targetScheduleId) {
      body.scheduleId = "0059828e-1146-4ba0-a932-46f6de8128a6";
    }
    if (!body.classCode || typeof body.classCode !== "string" || !body.classCode.trim()) {
      body.classCode = "3A";
    }
  }

  if (type === "FLIGHT") {
    if (!targetScheduleId) {
      body.scheduleId = "003e416c-5bf4-4204-acd3-c87560e3fd8e";
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
    const validTypes = ["BUS", "TRAIN", "FLIGHT", "HOTEL", "CAB"];
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
