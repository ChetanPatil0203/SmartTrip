const aiService = require("../services/aiService");
const { sendSuccess, sendError } = require("../utils/response");

const planTrip = async (req, res, next) => {
  try {
    const {
      origin,
      destination,
      destinations,
      days,
      budget,
      travelType,
      travelStyle,
      passengersCount,
      preferredTransport,
      language,
      query,
    } = req.body;

    if (!destination && !destinations && !query) {
      return sendError(res, "Destination or trip query is required for planning a trip", 400);
    }

    const plan = await aiService.generateTripPlan({
      query,
      origin: origin || "Pune",
      destination,
      destinations,
      days,
      budget,
      travelType: travelType || "Friends",
      travelStyle: travelStyle || "standard",
      passengersCount: passengersCount || 1,
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
