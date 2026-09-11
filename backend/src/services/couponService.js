const couponModel = require("../models/couponModel");
const { prisma } = require("../config/db");

const VALID_BOOKING_TYPES = ["BUS", "TRAIN", "FLIGHT", "HOTEL"];

// -------------------------------------------------------
// SERVER-SIDE DISCOUNT CALCULATOR
// -------------------------------------------------------
function calculateDiscount(coupon, amount) {
  let discount = 0;

  if (coupon.discountType === "PERCENTAGE") {
    discount = (amount * coupon.discountValue) / 100;
  } else if (coupon.discountType === "FLAT") {
    discount = coupon.discountValue;
  }

  // Apply max discount cap
  if (coupon.maxDiscount && discount > coupon.maxDiscount) {
    discount = coupon.maxDiscount;
  }

  // Discount cannot exceed booking amount
  if (discount > amount) {
    discount = amount;
  }

  // Discount cannot be negative
  if (discount < 0) discount = 0;

  // Round to 2 decimal places
  discount = Math.round(discount * 100) / 100;
  const finalAmount = Math.round((amount - discount) * 100) / 100;

  return { discount, finalAmount };
}

const couponService = {
  // -------------------------------------------------------
  // VALIDATE COUPON (JWT required — userId from token)
  // -------------------------------------------------------
  validateCoupon: async ({ code, bookingType, amount }) => {
    if (!code || typeof code !== "string" || !code.trim()) {
      const err = new Error("Coupon code is required");
      err.statusCode = 400;
      err.errorCode = "INVALID_INPUT";
      throw err;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      const err = new Error("A valid positive booking amount is required");
      err.statusCode = 400;
      err.errorCode = "INVALID_INPUT";
      throw err;
    }

    const normCode = code.trim().toUpperCase();
    const coupon = await couponModel.findByCode(normCode);

    // 1. Coupon exists?
    if (!coupon) {
      const err = new Error("Invalid coupon code");
      err.statusCode = 404;
      err.errorCode = "COUPON_INVALID";
      throw err;
    }

    // 2. Coupon active?
    if (!coupon.isActive) {
      const err = new Error("This coupon is no longer active");
      err.statusCode = 400;
      err.errorCode = "COUPON_INACTIVE";
      throw err;
    }

    const now = new Date();

    // 3. Not started yet?
    if (coupon.validFrom > now) {
      const err = new Error("This coupon is not yet active");
      err.statusCode = 400;
      err.errorCode = "COUPON_NOT_STARTED";
      throw err;
    }

    // 4. Expired?
    if (coupon.validUntil < now) {
      const err = new Error("This coupon has expired");
      err.statusCode = 400;
      err.errorCode = "COUPON_EXPIRED";
      throw err;
    }

    // 5. Minimum booking amount?
    if (coupon.minBookingAmount && parsedAmount < coupon.minBookingAmount) {
      const err = new Error(`Minimum booking amount of ₹${coupon.minBookingAmount} required to use this coupon`);
      err.statusCode = 400;
      err.errorCode = "COUPON_MIN_AMOUNT_NOT_MET";
      throw err;
    }

    // 6. Global usage limit?
    if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
      const err = new Error("This coupon has reached its usage limit");
      err.statusCode = 400;
      err.errorCode = "COUPON_USAGE_LIMIT_REACHED";
      throw err;
    }

    // 7. Booking type check (Coupon schema has no bookingType field — applies to all types)
    // But if bookingType sent, we validate it's a known type
    if (bookingType) {
      const normType = bookingType.trim().toUpperCase();
      if (!VALID_BOOKING_TYPES.includes(normType)) {
        const err = new Error(`Invalid booking type. Allowed: ${VALID_BOOKING_TYPES.join(", ")}`);
        err.statusCode = 400;
        err.errorCode = "INVALID_BOOKING_TYPE";
        throw err;
      }
    }

    // 8. SERVER-SIDE discount calculation
    const { discount, finalAmount } = calculateDiscount(coupon, parsedAmount);

    return {
      couponCode: coupon.code,
      couponId: coupon.id,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discount,
      originalAmount: parsedAmount,
      finalAmount,
      description: coupon.description,
    };
  },

  // -------------------------------------------------------
  // APPLY COUPON USAGE (call after successful booking/payment)
  // Used internally — increments usedCount
  // -------------------------------------------------------
  applyCouponUsage: async (couponId, tx = null) => {
    try {
      // Re-check usage limit before consuming (double safety)
      const coupon = tx
        ? await tx.coupon.findUnique({ where: { id: couponId } })
        : await couponModel.findById(couponId);

      if (!coupon) return null;

      if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
        const err = new Error("Coupon usage limit reached");
        err.statusCode = 409;
        err.errorCode = "COUPON_USAGE_LIMIT_REACHED";
        throw err;
      }

      return await couponModel.incrementUsage(couponId, tx);
    } catch (error) {
      throw error;
    }
  },

  // Expose for external use (e.g., bookingService integration)
  calculateDiscount,
};

module.exports = couponService;
