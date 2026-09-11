const { prisma } = require("../config/db");

const supportModel = {
  create: async ({ userId, bookingId, subject, description, priority }) => {
    return await prisma.supportTicket.create({
      data: {
        userId,
        bookingId: bookingId || null,
        subject,
        description,
        priority: priority || "MEDIUM",
        status: "OPEN",
      },
    });
  },

  findUserTickets: async ({ userId, skip = 0, take = 20 }) => {
    return await prisma.supportTicket.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      skip,
      take,
      select: {
        id: true,
        bookingId: true,
        subject: true,
        description: true,
        status: true,
        priority: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  countUserTickets: async (userId) => {
    return await prisma.supportTicket.count({ where: { userId } });
  },

  findByIdAndUser: async (id, userId) => {
    return await prisma.supportTicket.findFirst({
      where: { id, userId },
      select: {
        id: true,
        bookingId: true,
        subject: true,
        description: true,
        status: true,
        priority: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  updateStatus: async (id, status) => {
    return await prisma.supportTicket.update({
      where: { id },
      data: { status },
      select: {
        id: true,
        subject: true,
        status: true,
        priority: true,
        updatedAt: true,
      },
    });
  },
};

module.exports = supportModel;
