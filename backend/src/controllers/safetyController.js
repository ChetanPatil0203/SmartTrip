const safetyService = require("../services/safetyService");
const { sendSuccess, sendError } = require("../utils/response");

// POST /api/safety/reports
const createReport = async (req, res, next) => {
  try {
    const userId = req.user.id || req.user.userId;
    const { bookingId, type, description } = req.body;
    const result = await safetyService.createReport({ userId, bookingId, type, description });
    return sendSuccess(res, "Safety report submitted successfully", result, 201);
  } catch (error) {
    if (error.statusCode) return sendError(res, error.message, error.statusCode, error.errorCode);
    next(error);
  }
};

// GET /api/safety/reports
const getUserReports = async (req, res, next) => {
  try {
    const userId = req.user.id || req.user.userId;
    const result = await safetyService.getUserReports(userId, req.query);
    return sendSuccess(res, "Safety reports fetched successfully", result);
  } catch (error) {
    next(error);
  }
};

// GET /api/safety/reports/:id
const getReportById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id || req.user.userId;
    const result = await safetyService.getReportById(id, userId);
    return sendSuccess(res, "Safety report fetched successfully", result);
  } catch (error) {
    if (error.statusCode) return sendError(res, error.message, error.statusCode);
    next(error);
  }
};

module.exports = { createReport, getUserReports, getReportById };
