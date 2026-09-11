const cancellationService = require("../services/cancellationService");
const { validateCancelBooking, validatePaginationAndFilters } = require("../validators/cancellationValidator");
const { sendSuccess, sendError } = require("../utils/response");

// POST /api/cancellations
const cancelBooking = async (req, res, next) => {
  try {
    const validation = validateCancelBooking(req.body);
    if (!validation.valid) {
      return sendError(res, validation.message, 400);
    }
    const userId = req.user.id || req.user.userId;
    const result = await cancellationService.cancelBooking(userId, req.body);
    return sendSuccess(res, result.message || "Booking cancelled successfully", result, 200);
  } catch (error) {
    if (error.statusCode) {
      return sendError(res, error.message, error.statusCode, error.errorCode);
    }
    next(error);
  }
};

// GET /api/cancellations
const getUserCancellations = async (req, res, next) => {
  try {
    const validation = validatePaginationAndFilters(req.query);
    if (!validation.valid) {
      return sendError(res, validation.message, 400);
    }
    const userId = req.user.id || req.user.userId;
    const result = await cancellationService.getUserCancellations(userId, req.query);
    return sendSuccess(res, "Cancellations retrieved successfully", result);
  } catch (error) {
    next(error);
  }
};

// GET /api/cancellations/booking/:bookingId
const getCancellationByBookingId = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.id || req.user.userId;
    const result = await cancellationService.getCancellationByBookingId(bookingId, userId);
    return sendSuccess(res, "Cancellation details retrieved successfully", result);
  } catch (error) {
    if (error.statusCode) {
      return sendError(res, error.message, error.statusCode, error.errorCode);
    }
    next(error);
  }
};

// GET /api/cancellations/refund/:bookingId
const getRefundStatus = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.id || req.user.userId;
    const result = await cancellationService.getRefundStatus(bookingId, userId);
    return sendSuccess(res, "Refund status retrieved successfully", result);
  } catch (error) {
    if (error.statusCode) {
      return sendError(res, error.message, error.statusCode, error.errorCode);
    }
    next(error);
  }
};

// PATCH /api/cancellations/refund/:refundId/process
const processRefund = async (req, res, next) => {
  try {
    const { refundId } = req.params;
    const userId = req.user.id || req.user.userId;
    const result = await cancellationService.processRefund(refundId, userId);
    return sendSuccess(res, result.message || "Refund processed successfully", result);
  } catch (error) {
    if (error.statusCode) {
      return sendError(res, error.message, error.statusCode, error.errorCode);
    }
    next(error);
  }
};

// GET /api/cancellations/:id
const getCancellationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id || req.user.userId;
    const result = await cancellationService.getCancellationById(id, userId);
    return sendSuccess(res, "Cancellation details retrieved successfully", result);
  } catch (error) {
    if (error.statusCode) {
      return sendError(res, error.message, error.statusCode, error.errorCode);
    }
    next(error);
  }
};

module.exports = {
  cancelBooking,
  getUserCancellations,
  getCancellationByBookingId,
  getRefundStatus,
  processRefund,
  getCancellationById,
};
