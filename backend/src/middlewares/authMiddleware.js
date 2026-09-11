const jwt = require("jsonwebtoken");
const config = require("../config/env");
const { sendError } = require("../utils/response");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return sendError(res, "Access denied. Token missing or invalid.", 401);
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    const userId = decoded.id || decoded.userId;
    req.user = {
      id: userId,
      userId: userId,
      role: decoded.role || "USER",
    };
    next();
  } catch (error) {
    return sendError(res, "Invalid or expired token.", 401);
  }
};

module.exports = authMiddleware;
