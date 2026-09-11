const express = require("express");
const {
  getUserNotifications,
  getUnreadCount,
  getNotificationById,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} = require("../controllers/notificationController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// ALL NOTIFICATION ROUTES REQUIRE JWT AUTH
// -------------------------------------------------------

// GET /api/notifications — list with pagination + filters
router.get("/", authMiddleware, getUserNotifications);

// GET /api/notifications/unread-count — must come BEFORE /:id
router.get("/unread-count", authMiddleware, getUnreadCount);

// PATCH /api/notifications/read-all — must come BEFORE /:id/read
router.patch("/read-all", authMiddleware, markAllAsRead);

// GET /api/notifications/:id — single notification
router.get("/:id", authMiddleware, getNotificationById);

// PATCH /api/notifications/:id/read — mark one as read
router.patch("/:id/read", authMiddleware, markAsRead);

// DELETE /api/notifications/:id
router.delete("/:id", authMiddleware, deleteNotification);

module.exports = router;
