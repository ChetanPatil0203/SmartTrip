const { prisma } = require("../config/db");

const safetyModel = {
  create: async ({ userId, bookingId, type, description }) => {
    return await prisma.safetyReport.create({
      data: {
        userId,
        bookingId: bookingId || null,
        type,
        description,
        status: "OPEN",
      },
    });
  },

  findUserReports: async ({ userId, skip = 0, take = 20 }) => {
    return await prisma.safetyReport.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      skip,
      take,
      select: {
        id: true,
        bookingId: true,
        type: true,
        description: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  countUserReports: async (userId) => {
    return await prisma.safetyReport.count({ where: { userId } });
  },

  findByIdAndUser: async (id, userId) => {
    return await prisma.safetyReport.findFirst({
      where: { id, userId },
      select: {
        id: true,
        bookingId: true,
        type: true,
        description: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },
};

module.exports = safetyModel;
