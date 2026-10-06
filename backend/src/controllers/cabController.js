const cabService = require("../services/cabService");
const {
  validateCabSearch,
  validateCabBooking,
  validateStatusUpdate,
} = require("../validators/cabValidator");
const { sendSuccess, sendError } = require("../utils/response");

const searchCabs = async (req, res, next) => {
  try {
    const validation = validateCabSearch(req.query);
    if (!validation.valid) {
      return sendError(res, validation.message, 400);
    }
    const result = await cabService.searchCabs(req.query);
    return sendSuccess(res, "Cab and taxi options retrieved successfully", result);
  } catch (error) {
    next(error);
  }
};

const getVehicleById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await cabService.getVehicleById(id);
    return sendSuccess(res, "Vehicle details retrieved", result);
  } catch (error) {
    next(error);
  }
};

const getAllDrivers = async (req, res, next) => {
  try {
    const result = await cabService.getAllDrivers();
    return sendSuccess(res, "Drivers retrieved successfully", result);
  } catch (error) {
    next(error);
  }
};

const estimateFare = async (req, res, next) => {
  try {
    const result = await cabService.estimateFare(req.query);
    return sendSuccess(res, "Fare estimation retrieved successfully", result);
  } catch (error) {
    next(error);
  }
};

const bookCab = async (req, res, next) => {
  try {
    const validation = validateCabBooking(req.body);
    if (!validation.valid) {
      return sendError(res, validation.message, 400);
    }
    const userId = req.user ? (req.user.id || req.user.userId) : null;
    const result = await cabService.bookCab(userId, req.body);
    return sendSuccess(res, "Cab booked successfully! Driver assigned.", result, 201);
  } catch (error) {
    next(error);
  }
};

const getTracking = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const result = await cabService.getTracking(bookingId);
    return sendSuccess(res, "Live tracking details retrieved", result);
  } catch (error) {
    next(error);
  }
};

const updateRideStage = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const validation = validateStatusUpdate(req.body);
    if (!validation.valid) {
      return sendError(res, validation.message, 400);
    }
    const result = await cabService.updateRideStage(bookingId, req.body);
    return sendSuccess(res, "Ride status updated successfully", result);
  } catch (error) {
    next(error);
  }
};

const cancelRide = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const { reason } = req.body;
    const result = await cabService.cancelRide(bookingId, reason);
    return sendSuccess(res, "Cab ride cancelled successfully", result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  searchCabs,
  getVehicleById,
  getAllDrivers,
  estimateFare,
  bookCab,
  getTracking,
  updateRideStage,
  cancelRide,
};
