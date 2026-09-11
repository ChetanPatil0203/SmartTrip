const { prisma } = require("../config/db");

const refundModel = {
  findRefundById: async (id) => {
    return await prisma.refund.findUnique({
      where: { id },
      include: {
        booking: true,
        payment: true,
      },
    });
  },

  findRefundByBookingId: async (bookingId) => {
    return await prisma.refund.findFirst({
      where: { bookingId },
      include: {
        booking: true,
        payment: true,
      },
    });
  },

  findUserRefunds: async ({ userId, where = {}, orderBy = [{ createdAt: "desc" }], skip = 0, take = 10 }) => {
    const fullWhere = {
      booking: {
        userId,
      },
      ...where,
    };

    return await prisma.refund.findMany({
      where: fullWhere,
      orderBy,
      skip,
      take,
      include: {
        booking: true,
        payment: true,
      },
    });
  },

  countUserRefunds: async ({ userId, where = {} }) => {
    const fullWhere = {
      booking: {
        userId,
      },
      ...where,
    };
    return await prisma.refund.count({ where: fullWhere });
  },
};

module.exports = refundModel;
