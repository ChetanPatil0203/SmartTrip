const logger = require("../utils/logger");
const { sendError } = require("../utils/response");

const errorHandler = (err, req, res, next) => {
  logger.error(`${err.message} \nStack: ${err.stack}`);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  return sendError(res, message, statusCode);
};

module.exports = errorHandler;
