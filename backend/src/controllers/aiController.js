const aiService = require("../services/aiService");
const { sendSuccess, sendError } = require("../utils/response");

const planTrip = async (req, res, next) => {
  try {
    const { origin, destination, days, budget, travelType, preferredTransport, language } = req.body;

    if (!destination) {
      return sendError(res, "Destination is required for planning a trip", 400);
    }

    const plan = await aiService.generateTripPlan({
      origin: origin || "Pune",
      destination,
      days: days || 3,
      budget: budget || 10000,
      travelType: travelType || "Friends",
      preferredTransport: preferredTransport || "Any",
      language: language || "mr",
    });

    return sendSuccess(res, "Trip plan generated successfully", plan);
  } catch (error) {
    next(error);
  }
};

const supportChat = async (req, res, next) => {
  try {
    const { query, language, userContext } = req.body;

    if (!query) {
      return sendError(res, "Query message is required", 400);
    }

    const response = await aiService.answerSupportQuery({
      query,
      language: language || "mr",
      userContext: userContext || {},
    });

    return sendSuccess(res, "AI query processed", response);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  planTrip,
  supportChat,
};
