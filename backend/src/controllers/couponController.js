const couponService = require("../services/couponService");
const { validateCouponInput } = require("../validators/couponValidator");
const { sendSuccess, sendError } = require("../utils/response");

// POST /api/coupons/validate  (JWT required)
const validateCoupon = async (req, res, next) => {
  try {
    const validation = validateCouponInput(req.body);
    if (!validation.valid) {
      return sendError(res, validation.message, 400);
    }

    const { code, bookingType, amount } = req.body;
    // userId from JWT — not from body
    const userId = req.user.id || req.user.userId;

    const result = await couponService.validateCoupon({ code, bookingType, amount, userId });
    return sendSuccess(res, "Coupon applied successfully", result);
  } catch (error) {
    if (error.statusCode) {
      return sendError(res, error.message, error.statusCode, error.errorCode);
    }
    next(error);
  }
};

module.exports = { validateCoupon };
