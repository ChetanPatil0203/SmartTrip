const paymentService = require("../services/paymentService");
const { validateCreateOrder, validateVerifyPayment } = require("../validators/paymentValidator");
const { sendSuccess, sendError } = require("../utils/response");

const createOrder = async (req, res, next) => {
  try {
    const validation = validateCreateOrder(req.body);
    if (!validation.valid) {
      return sendError(res, validation.message, 400);
    }
    const userId = req.user.id || req.user.userId;
    const result = await paymentService.createOrder(userId, req.body);
    return sendSuccess(res, "Payment order created successfully", result, 201);
  } catch (error) {
    if (error.statusCode) {
      return sendError(res, error.message, error.statusCode, error.errorCode);
    }
    next(error);
  }
};

const verifyPayment = async (req, res, next) => {
  try {
    const validation = validateVerifyPayment(req.body);
    if (!validation.valid) {
      return sendError(res, validation.message, 400);
    }
    const userId = req.user.id || req.user.userId;
    const result = await paymentService.verifyPayment(userId, req.body);
    return sendSuccess(res, result.message, result);
  } catch (error) {
    if (error.statusCode) {
      return sendError(res, error.message, error.statusCode, error.errorCode);
    }
    next(error);
  }
};

const getPaymentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id || req.user.userId;
    const result = await paymentService.getPaymentById(id, userId);
    return sendSuccess(res, "Payment details retrieved successfully", result);
  } catch (error) {
    if (error.statusCode) {
      return sendError(res, error.message, error.statusCode);
    }
    next(error);
  }
};

const getPaymentByBooking = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.id || req.user.userId;
    const result = await paymentService.getPaymentByBookingId(bookingId, userId);
    return sendSuccess(res, "Payment details retrieved successfully", result);
  } catch (error) {
    if (error.statusCode) {
      return sendError(res, error.message, error.statusCode);
    }
    next(error);
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  getPaymentById,
  getPaymentByBooking,
};
