const notificationService = require("../services/notificationService");
const { validateListNotifications } = require("../validators/notificationValidator");
const { sendSuccess, sendError } = require("../utils/response");

// GET /api/notifications
const getUserNotifications = async (req, res, next) => {
  try {
    const validation = validateListNotifications(req.query);
    if (!validation.valid) {
      return sendError(res, validation.message, 400);
    }
    const userId = req.user.id || req.user.userId;
    const result = await notificationService.getUserNotifications(userId, req.query);
    return sendSuccess(res, "Notifications fetched successfully", result);
  } catch (error) {
    if (error.statusCode) {
      return sendError(res, error.message, error.statusCode);
    }
    next(error);
  }
};

// GET /api/notifications/unread-count
const getUnreadCount = async (req, res, next) => {
  try {
    const userId = req.user.id || req.user.userId;
    const result = await notificationService.getUnreadCount(userId);
    return sendSuccess(res, "Unread notification count fetched successfully", result);
  } catch (error) {
    next(error);
  }
};

// GET /api/notifications/:id
const getNotificationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id || req.user.userId;
    const result = await notificationService.getNotificationById(id, userId);
    return sendSuccess(res, "Notification fetched successfully", result);
  } catch (error) {
    if (error.statusCode) {
      return sendError(res, error.message, error.statusCode);
    }
    next(error);
  }
};

// PATCH /api/notifications/:id/read
const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id || req.user.userId;
    const result = await notificationService.markAsRead(id, userId);
    const msg = result.alreadyRead
      ? "Notification was already marked as read"
      : "Notification marked as read successfully";
    return sendSuccess(res, msg, { notification: result.notification });
  } catch (error) {
    if (error.statusCode) {
      return sendError(res, error.message, error.statusCode);
    }
    next(error);
  }
};

// PATCH /api/notifications/read-all
const markAllAsRead = async (req, res, next) => {
  try {
    const userId = req.user.id || req.user.userId;
    const result = await notificationService.markAllAsRead(userId);
    return sendSuccess(res, `${result.updatedCount} notification(s) marked as read`, result);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/notifications/:id
const deleteNotification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id || req.user.userId;
    const result = await notificationService.deleteNotification(id, userId);
    return sendSuccess(res, "Notification deleted successfully", result);
  } catch (error) {
    if (error.statusCode) {
      return sendError(res, error.message, error.statusCode);
    }
    next(error);
  }
};

module.exports = {
  getUserNotifications,
  getUnreadCount,
  getNotificationById,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};
