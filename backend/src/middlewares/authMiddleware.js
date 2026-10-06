const jwt = require("jsonwebtoken");
const config = require("../config/env");
const { sendError } = require("../utils/response");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    if (config.nodeEnv === "development") {
      // Dev / viva fallback: never block unauthenticated demo actions with 401
      req.user = {
        id: "9b5a43db-940a-43b8-81ec-8f48f5419cc7",
        userId: "9b5a43db-940a-43b8-81ec-8f48f5419cc7",
        role: "USER",
      };
      return next();
    }
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
    if (config.nodeEnv === "development") {
      req.user = {
        id: "9b5a43db-940a-43b8-81ec-8f48f5419cc7",
        userId: "9b5a43db-940a-43b8-81ec-8f48f5419cc7",
        role: "USER",
      };
      return next();
    }
    return sendError(res, "Invalid or expired token.", 401);
  }
};

module.exports = authMiddleware;
