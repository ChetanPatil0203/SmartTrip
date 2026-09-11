const reviewService = require("../services/reviewService");
const { validateCreateReview, validateUpdateReview } = require("../validators/reviewValidator");
const { sendSuccess, sendError } = require("../utils/response");

// POST /api/reviews  (JWT required)
const createReview = async (req, res, next) => {
  try {
    const validation = validateCreateReview(req.body);
    if (!validation.valid) return sendError(res, validation.message, 400);

    const userId = req.user.id || req.user.userId;
    const { bookingId, rating, title, comment } = req.body;

    const result = await reviewService.createReview({ userId, bookingId, rating, title, comment });
    return sendSuccess(res, "Review submitted successfully", result, 201);
  } catch (error) {
    if (error.statusCode) return sendError(res, error.message, error.statusCode, error.errorCode);
    next(error);
  }
};

// GET /api/reviews  (PUBLIC)
const getReviews = async (req, res, next) => {
  try {
    const result = await reviewService.getReviews(req.query);
    return sendSuccess(res, "Reviews fetched successfully", result);
  } catch (error) {
    next(error);
  }
};

// GET /api/reviews/:id  (PUBLIC)
const getReviewById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await reviewService.getReviewById(id);
    return sendSuccess(res, "Review fetched successfully", result);
  } catch (error) {
    if (error.statusCode) return sendError(res, error.message, error.statusCode);
    next(error);
  }
};

// PATCH /api/reviews/:id  (JWT required — owner only)
const updateReview = async (req, res, next) => {
  try {
    const validation = validateUpdateReview(req.body);
    if (!validation.valid) return sendError(res, validation.message, 400);

    const { id } = req.params;
    const userId = req.user.id || req.user.userId;
    const result = await reviewService.updateReview(id, userId, req.body);
    return sendSuccess(res, "Review updated successfully", result);
  } catch (error) {
    if (error.statusCode) return sendError(res, error.message, error.statusCode);
    next(error);
  }
};

// DELETE /api/reviews/:id  (JWT required — owner only)
const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id || req.user.userId;
    const result = await reviewService.deleteReview(id, userId);
    return sendSuccess(res, "Review deleted successfully", result);
  } catch (error) {
    if (error.statusCode) return sendError(res, error.message, error.statusCode);
    next(error);
  }
};

module.exports = { createReview, getReviews, getReviewById, updateReview, deleteReview };
