const { prisma } = require("../config/db");

const tripShareModel = {
  create: async ({ bookingId, userId, shareToken, expiresAt }) => {
    return await prisma.tripShare.create({
      data: { bookingId, userId, shareToken, expiresAt },
    });
  },

  findByToken: async (shareToken) => {
    return await prisma.tripShare.findUnique({
      where: { shareToken },
      include: {
        booking: {
          include: {
            busBooking: {
              include: {
                schedule: {
                  include: {
                    bus: { include: { operator: true } },
                    route: true,
                  },
                },
                boardingStop: true,
                droppingStop: true,
              },
            },
            trainBooking: {
              include: {
                schedule: {
                  include: {
                    train: { include: { operator: true } },
                    route: true,
                  },
                },
              },
            },
            flightBooking: {
              include: {
                schedule: {
                  include: {
                    flight: { include: { airline: true } },
                    sourceAirport: true,
                    destinationAirport: true,
                  },
                },
              },
            },
            hotelBooking: {
              include: {
                hotel: true,
                room: true,
              },
            },
          },
        },
      },
    });
  },

  findByBookingAndUser: async (bookingId, userId) => {
    return await prisma.tripShare.findMany({
      where: { bookingId, userId },
      orderBy: { createdAt: "desc" },
    });
  },

  findByIdAndUser: async (id, userId) => {
    return await prisma.tripShare.findFirst({
      where: { id, userId },
    });
  },

  deleteById: async (id) => {
    return await prisma.tripShare.delete({ where: { id } });
  },
};

module.exports = tripShareModel;
