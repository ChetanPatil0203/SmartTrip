const busService = require("../services/busService");
const { validateBusSearch } = require("../validators/busValidator");
const { sendSuccess, sendError } = require("../utils/response");

const getOperators = async (req, res, next) => {
  try {
    const result = await busService.getAllOperators();
    return sendSuccess(res, "Bus operators retrieved successfully", result);
  } catch (error) {
    next(error);
  }
};

const getOperatorById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await busService.getOperatorById(id);
    return sendSuccess(res, "Bus operator details retrieved", result);
  } catch (error) {
    next(error);
  }
};

const getRoutes = async (req, res, next) => {
  try {
    const { source, destination } = req.query;
    const result = await busService.getAllRoutes(source, destination);
    return sendSuccess(res, "Bus routes retrieved successfully", result);
  } catch (error) {
    next(error);
  }
};

const getRouteById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await busService.getRouteById(id);
    return sendSuccess(res, "Bus route details retrieved", result);
  } catch (error) {
    next(error);
  }
};

const searchBuses = async (req, res, next) => {
  try {
    const validation = validateBusSearch(req.query);
    if (!validation.valid) {
      return sendError(res, validation.message, 400);
    }
    const result = await busService.searchBuses(req.query);
    return sendSuccess(res, "Bus search completed successfully", result);
  } catch (error) {
    next(error);
  }
};

const getScheduleById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await busService.getScheduleById(id);
    return sendSuccess(res, "Bus schedule retrieved successfully", result);
  } catch (error) {
    next(error);
  }
};

const getBusDetails = async (req, res, next) => {
  try {
    const { scheduleId } = req.params;
    const result = await busService.getBusDetails(scheduleId);
    return sendSuccess(res, "Bus details retrieved successfully", result);
  } catch (error) {
    next(error);
  }
};

const getSeatLayout = async (req, res, next) => {
  try {
    const { scheduleId } = req.params;
    const result = await busService.getSeatLayout(scheduleId);
    return sendSuccess(res, "Bus seat layout retrieved successfully", result);
  } catch (error) {
    next(error);
  }
};

const getBoardingPoints = async (req, res, next) => {
  try {
    const { scheduleId } = req.params;
    const result = await busService.getBoardingPoints(scheduleId);
    return sendSuccess(res, "Boarding points retrieved successfully", result);
  } catch (error) {
    next(error);
  }
};

const getDroppingPoints = async (req, res, next) => {
  try {
    const { scheduleId } = req.params;
    const result = await busService.getDroppingPoints(scheduleId);
    return sendSuccess(res, "Dropping points retrieved successfully", result);
  } catch (error) {
    next(error);
  }
};

const getLiveTracking = async (req, res, next) => {
  try {
    const { scheduleId } = req.params;
    const result = await busService.getLiveTracking(scheduleId);
    return sendSuccess(res, result.message || "Live tracking retrieved successfully", result);
  } catch (error) {
    next(error);
  }
};

const getDelayAlert = async (req, res, next) => {
  try {
    const { scheduleId } = req.params;
    const result = await busService.getDelayAlert(scheduleId);
    return sendSuccess(res, "Delay alert status retrieved successfully", result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOperators,
  getOperatorById,
  getRoutes,
  getRouteById,
  searchBuses,
  getScheduleById,
  getBusDetails,
  getSeatLayout,
  getBoardingPoints,
  getDroppingPoints,
  getLiveTracking,
  getDelayAlert,
};
