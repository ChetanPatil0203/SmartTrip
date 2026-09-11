const supportService = require("../services/supportService");
const { validateCreateTicket, validateUpdateTicket } = require("../validators/supportValidator");
const { sendSuccess, sendError } = require("../utils/response");

// POST /api/support/tickets
const createTicket = async (req, res, next) => {
  try {
    const validation = validateCreateTicket(req.body);
    if (!validation.valid) return sendError(res, validation.message, 400);

    const userId = req.user.id || req.user.userId;
    const { bookingId, subject, description, priority } = req.body;

    const result = await supportService.createTicket({ userId, bookingId, subject, description, priority });
    return sendSuccess(res, "Support ticket created successfully", result, 201);
  } catch (error) {
    if (error.statusCode) return sendError(res, error.message, error.statusCode, error.errorCode);
    next(error);
  }
};

// GET /api/support/tickets
const getUserTickets = async (req, res, next) => {
  try {
    const userId = req.user.id || req.user.userId;
    const result = await supportService.getUserTickets(userId, req.query);
    return sendSuccess(res, "Support tickets fetched successfully", result);
  } catch (error) {
    next(error);
  }
};

// GET /api/support/tickets/:id
const getTicketById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id || req.user.userId;
    const result = await supportService.getTicketById(id, userId);
    return sendSuccess(res, "Support ticket fetched successfully", result);
  } catch (error) {
    if (error.statusCode) return sendError(res, error.message, error.statusCode);
    next(error);
  }
};

// PATCH /api/support/tickets/:id
const updateTicket = async (req, res, next) => {
  try {
    const validation = validateUpdateTicket(req.body);
    if (!validation.valid) return sendError(res, validation.message, 400);

    const { id } = req.params;
    const userId = req.user.id || req.user.userId;
    const { status } = req.body;

    const result = await supportService.updateTicketStatus(id, userId, status);
    return sendSuccess(res, "Support ticket updated successfully", result);
  } catch (error) {
    if (error.statusCode) return sendError(res, error.message, error.statusCode, error.errorCode);
    next(error);
  }
};

module.exports = { createTicket, getUserTickets, getTicketById, updateTicket };
