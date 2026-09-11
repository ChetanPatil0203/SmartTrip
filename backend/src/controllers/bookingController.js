const bookingService = require("../services/bookingService");
const { validateCreateBooking, validateGetUserBookings } = require("../validators/bookingValidator");
const { sendSuccess, sendError } = require("../utils/response");

const createBooking = async (req, res, next) => {
  try {
    const validation = validateCreateBooking(req.body);
    if (!validation.valid) {
      return sendError(res, validation.message, 400);
    }
    const userId = req.user.id || req.user.userId;
    const booking = await bookingService.createBooking(userId, req.body);
    return sendSuccess(res, "Booking created successfully", { booking }, 201);
  } catch (error) {
    if (error.statusCode) {
      return sendError(res, error.message, error.statusCode, error.errorCode);
    }
    next(error);
  }
};

const getUserBookings = async (req, res, next) => {
  try {
    const validation = validateGetUserBookings(req.query);
    if (!validation.valid) {
      return sendError(res, validation.message, 400);
    }
    const userId = req.user.id || req.user.userId;
    const result = await bookingService.getUserBookings(userId, req.query);
    return sendSuccess(res, "Bookings retrieved successfully", result);
  } catch (error) {
    next(error);
  }
};

const getBookingById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id || req.user.userId;
    const result = await bookingService.getBookingById(id, userId);
    return sendSuccess(res, "Booking details retrieved successfully", result);
  } catch (error) {
    next(error);
  }
};

const getBookingByReference = async (req, res, next) => {
  try {
    const { reference } = req.params;
    const userId = req.user.id || req.user.userId;
    const result = await bookingService.getBookingByReference(reference, userId);
    return sendSuccess(res, "Booking details retrieved successfully", result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getBookingById,
  getBookingByReference,
};
