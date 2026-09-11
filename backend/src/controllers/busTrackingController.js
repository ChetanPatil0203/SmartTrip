const { busTrackingService, delayAlertService } = require("../services/busTrackingService");
const { sendSuccess, sendError } = require("../utils/response");

// -------------------------------------------------------
// TRACKING CONTROLLERS
// -------------------------------------------------------

// GET /api/buses/:scheduleId/tracking/history
const getTrackingHistory = async (req, res, next) => {
  try {
    const { scheduleId } = req.params;
    const result = await busTrackingService.getTrackingHistory(scheduleId, req.query);
    return sendSuccess(res, "Tracking history fetched successfully", result);
  } catch (error) {
    if (error.statusCode) return sendError(res, error.message, error.statusCode);
    next(error);
  }
};

// GET /api/bookings/:bookingId/tracking  (JWT required — handled in bookingRoutes)
const getTrackingByBooking = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.id || req.user.userId;
    const result = await busTrackingService.getTrackingByBooking(bookingId, userId);
    return sendSuccess(res, "Live tracking fetched successfully", result);
  } catch (error) {
    if (error.statusCode) return sendError(res, error.message, error.statusCode, error.errorCode);
    next(error);
  }
};

// -------------------------------------------------------
// DELAY CONTROLLERS
// -------------------------------------------------------

// GET /api/buses/:scheduleId/delay/history
const getDelayHistory = async (req, res, next) => {
  try {
    const { scheduleId } = req.params;
    const result = await delayAlertService.getDelayHistory(scheduleId, req.query);
    return sendSuccess(res, "Delay history fetched successfully", result);
  } catch (error) {
    if (error.statusCode) return sendError(res, error.message, error.statusCode);
    next(error);
  }
};

// GET /api/bookings/:bookingId/delay  (JWT required — handled in bookingRoutes)
const getDelayByBooking = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.id || req.user.userId;
    const result = await delayAlertService.getDelayByBooking(bookingId, userId);
    return sendSuccess(res, "Delay alert fetched successfully", result);
  } catch (error) {
    if (error.statusCode) return sendError(res, error.message, error.statusCode, error.errorCode);
    next(error);
  }
};

module.exports = {
  getTrackingHistory,
  getTrackingByBooking,
  getDelayHistory,
  getDelayByBooking,
};
