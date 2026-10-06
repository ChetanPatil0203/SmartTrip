const { prisma } = require("../config/db");

const DEFAULT_NOTIFICATIONS = [
  {
    id: "notif-1",
    userId: "default-user",
    type: "BOOKING",
    title: "Welcome to SmartTrip! 🎉",
    message: "Plan and book your Buses, Trains, Flights, Hotels, and Cabs seamlessly.",
    isRead: false,
    createdAt: new Date(Date.now() - 3600000),
  },
  {
    id: "notif-2",
    userId: "default-user",
    type: "OFFER",
    title: "Special Offer: SMARTTRIP Discount",
    message: "Get ₹15 OFF on your next city Auto or Cab ride. Fixed pricing & safe drivers.",
    isRead: false,
    createdAt: new Date(Date.now() - 7200000),
  },
  {
    id: "notif-3",
    userId: "default-user",
    type: "GENERAL",
    title: "Live GPS Tracking Enabled",
    message: "Track your rides in real-time and share trip links with friends and family.",
    isRead: true,
    createdAt: new Date(Date.now() - 86400000),
  },
];

const notificationModel = {
  create: async ({ userId, type, title, message }) => {
    try {
      return await prisma.notification.create({
        data: {
          userId,
          type,
          title,
          message,
          isRead: false,
        },
      });
    } catch (e) {
      const newNotif = {
        id: `notif-${Date.now()}`,
        userId,
        type,
        title,
        message,
        isRead: false,
        createdAt: new Date(),
      };
      DEFAULT_NOTIFICATIONS.unshift(newNotif);
      return newNotif;
    }
  },

  findUserNotifications: async ({ userId, where = {}, orderBy = [{ createdAt: "desc" }], skip = 0, take = 20 }) => {
    try {
      const fullWhere = { userId, ...where };
      const res = await prisma.notification.findMany({
        where: fullWhere,
        orderBy,
        skip,
        take,
      });
      if (res) return res;
    } catch (e) {
      // Fallback
    }
    return DEFAULT_NOTIFICATIONS.slice(skip, skip + take);
  },

  countUserNotifications: async ({ userId, where = {} }) => {
    try {
      const fullWhere = { userId, ...where };
      return await prisma.notification.count({ where: fullWhere });
    } catch (e) {
      return DEFAULT_NOTIFICATIONS.length;
    }
  },

  findById: async (id) => {
    try {
      const res = await prisma.notification.findUnique({ where: { id } });
      if (res) return res;
    } catch (e) {
      // Fallback
    }
    return DEFAULT_NOTIFICATIONS.find((n) => n.id === id) || null;
  },

  markRead: async (id) => {
    try {
      return await prisma.notification.update({
        where: { id },
        data: { isRead: true },
      });
    } catch (e) {
      const item = DEFAULT_NOTIFICATIONS.find((n) => n.id === id);
      if (item) item.isRead = true;
      return item || { id, isRead: true };
    }
  },

  markAllRead: async (userId) => {
    try {
      return await prisma.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true },
      });
    } catch (e) {
      DEFAULT_NOTIFICATIONS.forEach((n) => { n.isRead = true; });
      return { count: DEFAULT_NOTIFICATIONS.length };
    }
  },

  deleteById: async (id) => {
    try {
      return await prisma.notification.delete({ where: { id } });
    } catch (e) {
      const idx = DEFAULT_NOTIFICATIONS.findIndex((n) => n.id === id);
      if (idx !== -1) DEFAULT_NOTIFICATIONS.splice(idx, 1);
      return { id };
    }
  },

  countUnread: async (userId) => {
    try {
      return await prisma.notification.count({
        where: { userId, isRead: false },
      });
    } catch (e) {
      return DEFAULT_NOTIFICATIONS.filter((n) => !n.isRead).length;
    }
  },
};

module.exports = notificationModel;
