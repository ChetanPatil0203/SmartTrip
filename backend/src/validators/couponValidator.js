const VALID_BOOKING_TYPES = ["BUS", "TRAIN", "FLIGHT", "HOTEL"];

const validateCouponInput = (body) => {
  const { code, bookingType, amount } = body;

  if (!code || typeof code !== "string" || !code.trim()) {
    return { valid: false, message: "Coupon code is required" };
  }

  if (code.trim().length > 50) {
    return { valid: false, message: "Coupon code is too long" };
  }

  if (amount === undefined || amount === null || amount === "") {
    return { valid: false, message: "Booking amount is required" };
  }

  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    return { valid: false, message: "Booking amount must be a positive number" };
  }

  if (bookingType !== undefined && bookingType !== "") {
    const normType = (bookingType + "").trim().toUpperCase();
    if (!VALID_BOOKING_TYPES.includes(normType)) {
      return { valid: false, message: `Invalid bookingType. Allowed: ${VALID_BOOKING_TYPES.join(", ")}` };
    }
  }

  return { valid: true };
};

module.exports = { validateCouponInput };
