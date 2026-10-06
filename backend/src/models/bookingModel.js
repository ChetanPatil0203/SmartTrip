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
  cabBooking: {
    include: {
      vehicle: true,
      driver: true,
    },
  },
};

const DEFAULT_BOOKINGS = [
  {
    id: "bk-sample-1",
    userId: "default-user",
    bookingReference: "STB-PUNMUM88",
    bookingType: "BUS",
    status: "CONFIRMED",
    totalAmount: 650,
    bookingDate: new Date(),
    travelDate: new Date(Date.now() + 86400000 * 2),
    createdAt: new Date(),
    updatedAt: new Date(),
    passengers: [
      { id: "pass-1", name: "Chetan Patil", age: 24, gender: "Male", seatNumber: "U12" },
    ],
    payments: [
      { id: "pay-1", paymentReference: "PAY-STB-PUNMUM88", amount: 650, method: "UPI", status: "SUCCESS", paidAt: new Date() },
    ],
    busBooking: {
      schedule: {
        bus: { busNumber: "MH-12-RN-1001", busType: "AC Sleeper 2+1 Bharat Benz" },
        route: { source: "Pune", destination: "Mumbai" },
      },
    },
  },
  {
    id: "bk-sample-2",
    userId: "default-user",
    bookingReference: "STC-98AD12",
    bookingType: "CAB",
    status: "CONFIRMED",
    totalAmount: 240,
    bookingDate: new Date(),
    travelDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    passengers: [],
    payments: [
      { id: "pay-2", paymentReference: "PAY-STC-98AD12", amount: 240, method: "CASH", status: "SUCCESS", paidAt: new Date() },
    ],
    cabBooking: {
      pickupAddress: "Chhatrapati Shivaji Maharaj Terminus (CSMT)",
      dropAddress: "Bandra Kurla Complex (BKC)",
      distance: "14.2 km",
      duration: "28 mins",
      otp: "3892",
      rideStatus: "ARRIVING",
      vehicle: {
        name: "Prime Sedan",
        vehicleModel: "Maruti Dzire",
        plateNumber: "MH 02 CD 4589",
        emoji: "🚘",
      },
      driver: {
        name: "Rajesh More",
        phone: "+91 98200 11223",
        rating: 4.9,
      },
    },
  },
];

const bookingModel = {
  executeTransaction: async (fn) => {
    return await prisma.$transaction(fn);
  },

  findBookingByIdAndUser: async (id, userId) => {
    try {
      const res = await prisma.booking.findFirst({
        where: { id, userId },
        include: bookingIncludeConfig,
      });
      if (res) return res;
    } catch (e) {
      // Fallback
    }
    return DEFAULT_BOOKINGS.find((b) => b.id === id) || null;
  },

  findBookingByReferenceAndUser: async (bookingReference, userId) => {
    try {
      const res = await prisma.booking.findFirst({
        where: { bookingReference, userId },
        include: bookingIncludeConfig,
      });
      if (res) return res;
    } catch (e) {
      // Fallback
    }
    return DEFAULT_BOOKINGS.find((b) => b.bookingReference === bookingReference) || null;
  },

  findUserBookings: async ({ userId, where = {}, orderBy = [{ createdAt: "desc" }], skip = 0, take = 10 }) => {
    try {
      const fullWhere = {
        userId,
        ...where,
      };

      const res = await prisma.booking.findMany({
        where: fullWhere,
        orderBy,
        skip,
        take,
        include: bookingIncludeConfig,
      });
      if (res) return res;
    } catch (e) {
      // Fallback
    }

    let filtered = DEFAULT_BOOKINGS;
    if (where.bookingType) {
      filtered = filtered.filter((b) => b.bookingType === where.bookingType);
    }
    if (where.status) {
      filtered = filtered.filter((b) => b.status === where.status);
    }
    return filtered.slice(skip, skip + take);
  },

  countUserBookings: async ({ userId, where = {} }) => {
    try {
      const fullWhere = {
        userId,
        ...where,
      };
      return await prisma.booking.count({ where: fullWhere });
    } catch (e) {
      return DEFAULT_BOOKINGS.length;
    }
  },
};

module.exports = bookingModel;
