const notificationModel = require("../models/notificationModel");
const fcmService = require("./fcmService");

// Valid NotificationType enum values (matches Prisma schema)
const VALID_TYPES = ["BOOKING", "PAYMENT", "DELAY", "CANCELLATION", "REFUND", "OFFER", "GENERAL"];

const VALID_SORT_FIELDS = ["createdAt", "isRead"];
const VALID_SORT_ORDERS = ["asc", "desc"];

// -------------------------------------------------------
// CORE SERVICE METHODS
// -------------------------------------------------------

const notificationService = {
  // -------------------------------------------------------
  // CREATE NOTIFICATION (used by all helper functions)
  // -------------------------------------------------------
  createNotification: async ({ userId, type = "GENERAL", title, message }) => {
    if (!userId) throw new Error("userId is required");
    if (!title || !message) throw new Error("title and message are required");

    const normType = type.toUpperCase();
    if (!VALID_TYPES.includes(normType)) {
      throw new Error(`Invalid notification type: ${type}`);
    }

    const notif = await notificationModel.create({ userId, type: normType, title, message });

    // Non-blocking trigger push notification to registered devices
    fcmService.sendPushNotification(userId, {
      title,
      body: message,
      data: { id: notif.id, type: normType },
    }).catch(() => {});

    return notif;
  },

  // -------------------------------------------------------
  // GET USER NOTIFICATIONS (paginated + filtered)
  // -------------------------------------------------------
  getUserNotifications: async (userId, query) => {
    const {
      page = 1,
      limit = 20,
      type,
      isRead,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = query;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const where = {};

    // Filter by type
    if (type && type.trim()) {
      const normType = type.trim().toUpperCase();
      if (!VALID_TYPES.includes(normType)) {
        const err = new Error(`Invalid notification type. Allowed: ${VALID_TYPES.join(", ")}`);
        err.statusCode = 400;
        throw err;
      }
      where.type = normType;
    }

    // Filter by isRead
    if (isRead !== undefined && isRead !== "") {
      if (isRead === "true" || isRead === true) {
        where.isRead = true;
      } else if (isRead === "false" || isRead === false) {
        where.isRead = false;
      }
    }

    // Sort
    const normSortBy = VALID_SORT_FIELDS.includes(sortBy) ? sortBy : "createdAt";
    const normSortOrder = VALID_SORT_ORDERS.includes(sortOrder) ? sortOrder : "desc";
    const orderBy = [{ [normSortBy]: normSortOrder }];

    const [notifications, totalCount] = await Promise.all([
      notificationModel.findUserNotifications({ userId, where, orderBy, skip, take: limitNum }),
      notificationModel.countUserNotifications({ userId, where }),
    ]);

    const totalPages = Math.ceil(totalCount / limitNum) || (totalCount > 0 ? 1 : 0);

    return {
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: totalCount,
        totalPages,
      },
      notifications: notifications.map((n) => ({
        id: n.id,
        type: n.type,
        title: n.title,
        message: n.message,
        isRead: n.isRead,
        createdAt: n.createdAt,
      })),
    };
  },

  // -------------------------------------------------------
  // GET SINGLE NOTIFICATION
  // -------------------------------------------------------
  getNotificationById: async (id, userId) => {
    const notification = await notificationModel.findById(id);

    if (!notification) {
      const err = new Error("Notification not found");
      err.statusCode = 404;
      throw err;
    }

    if (notification.userId !== userId) {
      const err = new Error("Notification not found");
      err.statusCode = 404;
      throw err;
    }

    return { notification };
  },

  // -------------------------------------------------------
  // GET UNREAD COUNT
  // -------------------------------------------------------
  getUnreadCount: async (userId) => {
    const count = await notificationModel.countUnread(userId);
    return { count };
  },

  // -------------------------------------------------------
  // MARK ONE AS READ
  // -------------------------------------------------------
  markAsRead: async (id, userId) => {
    const notification = await notificationModel.findById(id);

    if (!notification) {
      const err = new Error("Notification not found");
      err.statusCode = 404;
      throw err;
    }

    if (notification.userId !== userId) {
      const err = new Error("Notification not found");
      err.statusCode = 404;
      throw err;
    }

    if (notification.isRead) {
      // Already read — return idempotently
      return { notification, alreadyRead: true };
    }

    const updated = await notificationModel.markRead(id);
    return { notification: updated, alreadyRead: false };
  },

  // -------------------------------------------------------
  // MARK ALL AS READ
  // -------------------------------------------------------
  markAllAsRead: async (userId) => {
    const result = await notificationModel.markAllRead(userId);
    return { updatedCount: result.count };
  },

  // -------------------------------------------------------
  // DELETE NOTIFICATION
  // -------------------------------------------------------
  deleteNotification: async (id, userId) => {
    const notification = await notificationModel.findById(id);

    if (!notification) {
      const err = new Error("Notification not found");
      err.statusCode = 404;
      throw err;
    }

    if (notification.userId !== userId) {
      const err = new Error("Notification not found");
      err.statusCode = 404;
      throw err;
    }

    await notificationModel.deleteById(id);
    return { deleted: true, id };
  },
};

// -------------------------------------------------------
// NOTIFICATION CREATION HELPERS
// (Reusable by other services/controllers)
// -------------------------------------------------------

// Booking confirmed
const createBookingNotification = async (userId, booking) => {
  const typeLabels = { BUS: "bus", TRAIN: "train", FLIGHT: "flight", HOTEL: "hotel" };
  const label = typeLabels[booking.bookingType] || "travel";
  return await notificationService.createNotification({
    userId,
    type: "BOOKING",
    title: "Booking Confirmed",
    message: `Your ${label} booking ${booking.bookingReference} has been confirmed. Have a great journey!`,
  });
};

// Payment success
const createPaymentSuccessNotification = async (userId, booking, amount) => {
  return await notificationService.createNotification({
    userId,
    type: "PAYMENT",
    title: "Payment Successful",
    message: `Payment of ₹${amount} for booking ${booking.bookingReference} was successful.`,
  });
};

// Payment failed
const createPaymentFailedNotification = async (userId, booking) => {
  return await notificationService.createNotification({
    userId,
    type: "PAYMENT",
    title: "Payment Failed",
    message: `Payment for booking ${booking.bookingReference} could not be processed. Please try again.`,
  });
};

// Booking cancelled
const createCancellationNotification = async (userId, booking) => {
  return await notificationService.createNotification({
    userId,
    type: "CANCELLATION",
    title: "Booking Cancelled",
    message: `Your booking ${booking.bookingReference} has been cancelled successfully.`,
  });
};

// Refund initiated (PENDING)
const createRefundInitiatedNotification = async (userId, booking, refundAmount) => {
  return await notificationService.createNotification({
    userId,
    type: "REFUND",
    title: "Refund Initiated",
    message: `Refund of ₹${refundAmount} for booking ${booking.bookingReference} has been initiated. It will be credited within 5-7 business days.`,
  });
};

// Refund completed (COMPLETED)
const createRefundCompletedNotification = async (userId, booking, refundAmount) => {
  return await notificationService.createNotification({
    userId,
    type: "REFUND",
    title: "Refund Completed",
    message: `Your refund of ₹${refundAmount} for booking ${booking.bookingReference} has been processed successfully.`,
  });
};

// Refund failed
const createRefundFailedNotification = async (userId, booking) => {
  return await notificationService.createNotification({
    userId,
    type: "REFUND",
    title: "Refund Failed",
    message: `We were unable to process your refund for booking ${booking.bookingReference}. Please contact support.`,
  });
};

// Trip reminder
const createTripReminderNotification = async (userId, booking, tripDetails) => {
  const { from, to, date } = tripDetails || {};
  const msg = from && to
    ? `Your ${booking.bookingType.toLowerCase()} journey from ${from} to ${to} is scheduled for ${date || "tomorrow"}.`
    : `Your booking ${booking.bookingReference} is coming up soon. Safe travels!`;

  return await notificationService.createNotification({
    userId,
    type: "GENERAL",
    title: "Trip Reminder",
    message: msg,
  });
};

// Bus delay
const createDelayNotification = async (userId, booking, delayMinutes, scheduleInfo) => {
  const delayMsg = delayMinutes
    ? `Your bus is delayed by approximately ${delayMinutes} minutes.`
    : `There is a delay reported for your bus journey.`;
  const ref = booking ? ` (Booking: ${booking.bookingReference})` : "";

  return await notificationService.createNotification({
    userId,
    type: "DELAY",
    title: "Bus Delayed",
    message: `${delayMsg}${ref} We apologise for the inconvenience.`,
  });
};

// Offer
const createOfferNotification = async (userId, offer) => {
  return await notificationService.createNotification({
    userId,
    type: "OFFER",
    title: "New Offer Available",
    message: offer.description || `${offer.title} — Don't miss out on this great deal!`,
  });
};

// System notification
const createSystemNotification = async (userId, title, message) => {
  return await notificationService.createNotification({ userId, type: "GENERAL", title, message });
};

module.exports = {
  ...notificationService,
  createBookingNotification,
  createPaymentSuccessNotification,
  createPaymentFailedNotification,
  createCancellationNotification,
  createRefundInitiatedNotification,
  createRefundCompletedNotification,
  createRefundFailedNotification,
  createTripReminderNotification,
  createDelayNotification,
  createOfferNotification,
  createSystemNotification,
};
