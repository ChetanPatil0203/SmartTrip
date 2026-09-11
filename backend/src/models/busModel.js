const { prisma } = require("../config/db");

const BusModel = {
  findOperators: async () => {
    return await prisma.busOperator.findMany({
      select: {
        id: true,
        name: true,
        logo: true,
        rating: true,
        phone: true,
        email: true,
      },
      orderBy: { name: "asc" },
    });
  },

  findOperatorById: async (id) => {
    return await prisma.busOperator.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        logo: true,
        rating: true,
        phone: true,
        email: true,
        buses: {
          select: {
            id: true,
            busNumber: true,
            busType: true,
            totalSeats: true,
            amenities: true,
          },
        },
      },
    });
  },

  findRoutes: async (source, destination) => {
    const where = {};
    if (source) {
      where.source = { contains: source.trim() };
    }
    if (destination) {
      where.destination = { contains: destination.trim() };
    }
    return await prisma.busRoute.findMany({
      where,
      select: {
        id: true,
        source: true,
        destination: true,
        distance: true,
        duration: true,
      },
      orderBy: { source: "asc" },
    });
  },

  findRouteById: async (id) => {
    return await prisma.busRoute.findUnique({
      where: { id },
      select: {
        id: true,
        source: true,
        destination: true,
        distance: true,
        duration: true,
        stops: {
          select: {
            id: true,
            name: true,
            address: true,
            latitude: true,
            longitude: true,
            stopType: true,
          },
          orderBy: { name: "asc" },
        },
      },
    });
  },

  buildSearchWhereClause: ({ source, destination, startDate, endDate, busType, minPrice, maxPrice }) => {
    const where = {
      status: { in: ["SCHEDULED", "DELAYED"] },
      route: {
        source: { contains: source.trim() },
        destination: { contains: destination.trim() },
      },
      travelDate: {
        gte: startDate,
        lte: endDate,
      },
    };

    if (busType && busType.trim()) {
      where.bus = {
        busType: { contains: busType.trim() },
      };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.fare = {};
      if (minPrice !== undefined) where.fare.gte = parseFloat(minPrice);
      if (maxPrice !== undefined) where.fare.lte = parseFloat(maxPrice);
    }

    return where;
  },

  searchSchedules: async (where, orderBy, skip, take) => {
    return await prisma.busSchedule.findMany({
      where,
      select: {
        id: true,
        travelDate: true,
        departureTime: true,
        arrivalTime: true,
        fare: true,
        status: true,
        bus: {
          select: {
            id: true,
            busNumber: true,
            busType: true,
            totalSeats: true,
            amenities: true,
            operator: {
              select: {
                id: true,
                name: true,
                logo: true,
                rating: true,
              },
            },
          },
        },
        route: {
          select: {
            id: true,
            source: true,
            destination: true,
            distance: true,
            duration: true,
          },
        },
      },
      orderBy,
      skip,
      take,
    });
  },

  countSchedules: async (where) => {
    return await prisma.busSchedule.count({ where });
  },

  findScheduleById: async (scheduleId) => {
    return await prisma.busSchedule.findUnique({
      where: { id: scheduleId },
      select: {
        id: true,
        travelDate: true,
        departureTime: true,
        arrivalTime: true,
        fare: true,
        status: true,
        bus: {
          select: {
            id: true,
            busNumber: true,
            busType: true,
            totalSeats: true,
            amenities: true,
            operator: {
              select: {
                id: true,
                name: true,
                logo: true,
                rating: true,
                phone: true,
                email: true,
              },
            },
          },
        },
        route: {
          select: {
            id: true,
            source: true,
            destination: true,
            distance: true,
            duration: true,
            stops: {
              select: {
                id: true,
                name: true,
                address: true,
                latitude: true,
                longitude: true,
                stopType: true,
              },
            },
          },
        },
      },
    });
  },

  findSeatsByBusId: async (busId) => {
    return await prisma.busSeat.findMany({
      where: { busId },
      orderBy: [
        { rowNumber: "asc" },
        { columnNumber: "asc" },
      ],
    });
  },

  findStopsByRouteIdAndTypes: async (routeId, stopTypes) => {
    return await prisma.busStop.findMany({
      where: {
        routeId,
        stopType: { in: stopTypes },
      },
      select: {
        id: true,
        name: true,
        address: true,
        latitude: true,
        longitude: true,
        stopType: true,
      },
      orderBy: { name: "asc" },
    });
  },

  findLatestTracking: async (scheduleId) => {
    return await prisma.busTracking.findFirst({
      where: { scheduleId },
      orderBy: { updatedAt: "desc" },
    });
  },

  findLatestDelay: async (scheduleId) => {
    return await prisma.delayAlert.findFirst({
      where: { scheduleId },
      orderBy: { createdAt: "desc" },
    });
  },
};

module.exports = BusModel;
