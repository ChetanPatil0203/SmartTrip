const tripShareService = require("../services/tripShareService");
const { sendSuccess, sendError } = require("../utils/response");

// POST /api/trips/:bookingId/share
const createShare = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.id || req.user.userId;
    const result = await tripShareService.createShare(bookingId, userId);
    return sendSuccess(res, "Trip share created successfully", result, 201);
  } catch (error) {
    if (error.statusCode) return sendError(res, error.message, error.statusCode, error.errorCode);
    next(error);
  }
};

// GET /api/trips/:bookingId/shares
const getSharesByBooking = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.id || req.user.userId;
    const result = await tripShareService.getSharesByBooking(bookingId, userId);
    return sendSuccess(res, "Shares fetched successfully", result);
  } catch (error) {
    if (error.statusCode) return sendError(res, error.message, error.statusCode);
    next(error);
  }
};

// DELETE /api/trips/shares/:shareId
const revokeShare = async (req, res, next) => {
  try {
    const { shareId } = req.params;
    const userId = req.user.id || req.user.userId;
    const result = await tripShareService.revokeShare(shareId, userId);
    return sendSuccess(res, "Share revoked successfully", result);
  } catch (error) {
    if (error.statusCode) return sendError(res, error.message, error.statusCode);
    next(error);
  }
};

// GET /api/shared-trips/:token  (PUBLIC)
const getPublicShare = async (req, res, next) => {
  try {
    const { token } = req.params;
    const result = await tripShareService.getPublicShare(token);
    return sendSuccess(res, "Trip information fetched successfully", result);
  } catch (error) {
    if (error.statusCode) return sendError(res, error.message, error.statusCode, error.errorCode);
    next(error);
  }
};

module.exports = { createShare, getSharesByBooking, revokeShare, getPublicShare };
