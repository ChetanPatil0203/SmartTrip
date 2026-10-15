const express = require("express");
const {
  getUserNotifications,
  getUnreadCount,
  getNotificationById,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  registerFCMToken,
  unregisterFCMToken,
  getFCMStatus,
  sendTestPushNotification,
} = require("../controllers/notificationController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// ALL NOTIFICATION ROUTES REQUIRE JWT AUTH
// -------------------------------------------------------

// GET /api/notifications/fcm-status — get FCM configuration status
router.get("/fcm-status", authMiddleware, getFCMStatus);

// POST /api/notifications/test-push — send a test push notification
router.post("/test-push", authMiddleware, sendTestPushNotification);

// POST /api/notifications/fcm-token — register device token for push notifications
router.post("/fcm-token", authMiddleware, registerFCMToken);

// DELETE /api/notifications/fcm-token — unregister device token
router.delete("/fcm-token", authMiddleware, unregisterFCMToken);

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
