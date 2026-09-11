const flightService = require("../services/flightService");
const { validateFlightSearch } = require("../validators/flightValidator");
const { sendSuccess, sendError } = require("../utils/response");

const getAirlines = async (req, res, next) => {
  try {
    const result = await flightService.getAllAirlines(req.query);
    return sendSuccess(res, "Airlines retrieved successfully", result);
  } catch (error) {
    next(error);
  }
};

const getAirlineById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await flightService.getAirlineById(id);
    return sendSuccess(res, "Airline details retrieved successfully", result);
  } catch (error) {
    next(error);
  }
};

const getAirports = async (req, res, next) => {
  try {
    const result = await flightService.getAllAirports(req.query);
    return sendSuccess(res, "Airports retrieved successfully", result);
  } catch (error) {
    next(error);
  }
};

const getAirportById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await flightService.getAirportById(id);
    return sendSuccess(res, "Airport details retrieved successfully", result);
  } catch (error) {
    next(error);
  }
};

const searchFlights = async (req, res, next) => {
  try {
    const validation = validateFlightSearch(req.query);
    if (!validation.valid) {
      return sendError(res, validation.message, 400);
    }
    const result = await flightService.searchFlights(req.query);
    return sendSuccess(res, "Flight search completed successfully", result);
  } catch (error) {
    next(error);
  }
};

const getScheduleById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await flightService.getScheduleById(id);
    return sendSuccess(res, "Flight schedule retrieved successfully", result);
  } catch (error) {
    next(error);
  }
};

const getFlightDetails = async (req, res, next) => {
  try {
    const { scheduleId } = req.params;
    const result = await flightService.getFlightDetails(scheduleId);
    return sendSuccess(res, "Flight details retrieved successfully", result);
  } catch (error) {
    next(error);
  }
};

const getFlightSeats = async (req, res, next) => {
  try {
    const { scheduleId } = req.params;
    const { classCode } = req.query;
    const result = await flightService.getFlightSeats(scheduleId, classCode);
    return sendSuccess(res, "Flight seats retrieved successfully", result);
  } catch (error) {
    next(error);
  }
};

const getFlightAddons = async (req, res, next) => {
  try {
    const { scheduleId } = req.params;
    const result = await flightService.getFlightAddons(scheduleId);
    return sendSuccess(res, "Flight addons retrieved successfully", result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAirlines,
  getAirlineById,
  getAirports,
  getAirportById,
  searchFlights,
  getScheduleById,
  getFlightDetails,
  getFlightSeats,
  getFlightAddons,
};
