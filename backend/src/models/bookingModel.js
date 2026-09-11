const { prisma } = require("../config/db");

const bookingIncludeConfig = {
  passengers: {
    select: {
      id: true,
      name: true,
      age: true,
      gender: true,
      phone: true,
      email: true,
      seatNumber: true,
      berthNumber: true,
      roomNumber: true,
    },
  },
  payments: {
    select: {
      id: true,
      paymentReference: true,
      amount: true,
      method: true,
      status: true,
      paidAt: true,
    },
  },
  busBooking: {
    include: {
      schedule: {
        include: {
          bus: true,
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
          train: true,
          route: true,
        },
      },
    },
  },
  flightBooking: {
    include: {
      schedule: {
        include: {
          flight: {
            include: {
              airline: true,
            },
          },
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
};

const bookingModel = {
  executeTransaction: async (fn) => {
    return await prisma.$transaction(fn);
  },

  findBookingByIdAndUser: async (id, userId) => {
    return await prisma.booking.findFirst({
      where: {
        id,
        userId,
      },
      include: bookingIncludeConfig,
    });
  },

  findBookingByReferenceAndUser: async (bookingReference, userId) => {
    return await prisma.booking.findFirst({
      where: {
        bookingReference,
        userId,
      },
      include: bookingIncludeConfig,
    });
  },

  findUserBookings: async ({ userId, where = {}, orderBy = [{ createdAt: "desc" }], skip = 0, take = 10 }) => {
    const fullWhere = {
      userId,
      ...where,
    };

    return await prisma.booking.findMany({
      where: fullWhere,
      orderBy,
      skip,
      take,
      include: bookingIncludeConfig,
    });
  },

  countUserBookings: async ({ userId, where = {} }) => {
    const fullWhere = {
      userId,
      ...where,
    };
    return await prisma.booking.count({ where: fullWhere });
  },
};

module.exports = bookingModel;
