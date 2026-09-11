const trainService = require("../services/trainService");
const { validateTrainSearch } = require("../validators/trainValidator");
const { sendSuccess, sendError } = require("../utils/response");

const getOperators = async (req, res, next) => {
  try {
    const result = await trainService.getAllOperators(req.query);
    return sendSuccess(res, "Train operators retrieved successfully", result);
  } catch (error) {
    next(error);
  }
};

const getOperatorById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await trainService.getOperatorById(id);
    return sendSuccess(res, "Train operator details retrieved", result);
  } catch (error) {
    next(error);
  }
};

const getStations = async (req, res, next) => {
  try {
    const result = await trainService.getAllStations(req.query);
    return sendSuccess(res, "Train stations retrieved successfully", result);
  } catch (error) {
    next(error);
  }
};

const getStationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await trainService.getStationById(id);
    return sendSuccess(res, "Train station details retrieved", result);
  } catch (error) {
    next(error);
  }
};

const getRoutes = async (req, res, next) => {
  try {
    const result = await trainService.getAllRoutes(req.query);
    return sendSuccess(res, "Train routes retrieved successfully", result);
  } catch (error) {
    next(error);
  }
};

const getRouteById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await trainService.getRouteById(id);
    return sendSuccess(res, "Train route details retrieved", result);
  } catch (error) {
    next(error);
  }
};

const searchTrains = async (req, res, next) => {
  try {
    const validation = validateTrainSearch(req.query);
    if (!validation.valid) {
      return sendError(res, validation.message, 400);
    }
    const result = await trainService.searchTrains(req.query);
    return sendSuccess(res, "Train search completed successfully", result);
  } catch (error) {
    next(error);
  }
};

const getScheduleById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await trainService.getScheduleById(id);
    return sendSuccess(res, "Train schedule retrieved successfully", result);
  } catch (error) {
    next(error);
  }
};

const getTrainDetails = async (req, res, next) => {
  try {
    const { scheduleId } = req.params;
    const result = await trainService.getTrainDetails(scheduleId);
    return sendSuccess(res, "Train details retrieved successfully", result);
  } catch (error) {
    next(error);
  }
};

const getTrainClasses = async (req, res, next) => {
  try {
    const { scheduleId } = req.params;
    const result = await trainService.getTrainClasses(scheduleId);
    return sendSuccess(res, "Train classes retrieved successfully", result);
  } catch (error) {
    next(error);
  }
};

const getTrainSeats = async (req, res, next) => {
  try {
    const { scheduleId } = req.params;
    const { classCode } = req.query;
    const result = await trainService.getTrainSeats(scheduleId, classCode);
    return sendSuccess(res, "Train seats retrieved successfully", result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOperators,
  getOperatorById,
  getStations,
  getStationById,
  getRoutes,
  getRouteById,
  searchTrains,
  getScheduleById,
  getTrainDetails,
  getTrainClasses,
  getTrainSeats,
};
