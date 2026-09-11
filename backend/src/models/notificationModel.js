const { prisma } = require("../config/db");

const notificationModel = {
  // Create a single notification
  create: async ({ userId, type, title, message }) => {
    return await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        isRead: false,
      },
    });
  },

  // Find notifications for a user with filtering + pagination
  findUserNotifications: async ({ userId, where = {}, orderBy = [{ createdAt: "desc" }], skip = 0, take = 20 }) => {
    const fullWhere = { userId, ...where };
    return await prisma.notification.findMany({
      where: fullWhere,
      orderBy,
      skip,
      take,
    });
  },

  // Count user notifications
  countUserNotifications: async ({ userId, where = {} }) => {
    const fullWhere = { userId, ...where };
    return await prisma.notification.count({ where: fullWhere });
  },

  // Find single notification by id
  findById: async (id) => {
    return await prisma.notification.findUnique({ where: { id } });
  },

  // Mark one notification as read
  markRead: async (id) => {
    return await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  },

  // Mark ALL notifications as read for a user
  markAllRead: async (userId) => {
    return await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  },

  // Delete one notification
  deleteById: async (id) => {
    return await prisma.notification.delete({ where: { id } });
  },

  // Count unread notifications for a user
  countUnread: async (userId) => {
    return await prisma.notification.count({
      where: { userId, isRead: false },
    });
  },
};

module.exports = notificationModel;
