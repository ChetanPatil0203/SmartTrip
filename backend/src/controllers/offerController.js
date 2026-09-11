const offerService = require("../services/offerService");
const { validateOfferListQuery } = require("../validators/offerValidator");
const { sendSuccess, sendError } = require("../utils/response");

// GET /api/offers
const getOffers = async (req, res, next) => {
  try {
    const validation = validateOfferListQuery(req.query);
    if (!validation.valid) {
      return sendError(res, validation.message, 400);
    }
    const result = await offerService.getActiveOffers(req.query);
    return sendSuccess(res, "Offers fetched successfully", result);
  } catch (error) {
    next(error);
  }
};

// GET /api/offers/:id
const getOfferById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await offerService.getOfferById(id);
    return sendSuccess(res, "Offer fetched successfully", result);
  } catch (error) {
    if (error.statusCode) {
      return sendError(res, error.message, error.statusCode, error.errorCode);
    }
    next(error);
  }
};

module.exports = { getOffers, getOfferById };
