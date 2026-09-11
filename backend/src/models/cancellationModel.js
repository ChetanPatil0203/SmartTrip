const { prisma } = require("../config/db");

const cancellationModel = {
  findCancellationByBookingId: async (bookingId) => {
    return await prisma.cancellation.findFirst({
      where: { bookingId },
      include: {
        booking: true,
      },
    });
  },

  findCancellationById: async (id) => {
    return await prisma.cancellation.findUnique({
      where: { id },
      include: {
        booking: true,
      },
    });
  },

  findUserCancellations: async ({ userId, where = {}, orderBy = [{ cancelledAt: "desc" }], skip = 0, take = 10 }) => {
    const fullWhere = {
      booking: {
        userId,
      },
      ...where,
    };

    return await prisma.cancellation.findMany({
      where: fullWhere,
      orderBy,
      skip,
      take,
      include: {
        booking: true,
      },
    });
  },

  countUserCancellations: async ({ userId, where = {} }) => {
    const fullWhere = {
      booking: {
        userId,
      },
      ...where,
    };
    return await prisma.cancellation.count({ where: fullWhere });
  },

  executeCancellationTransaction: async (txFn) => {
    return await prisma.$transaction(txFn);
  },
};

module.exports = cancellationModel;
