const { prisma } = require("../config/db");

const TrainModel = {
  findOperators: async ({ search, skip, take }) => {
    const where = {};
    if (search && search.trim()) {
      const term = search.trim();
      where.OR = [
        { name: { contains: term } },
        { code: { contains: term } },
      ];
    }
    return await prisma.trainOperator.findMany({
      where,
      select: {
        id: true,
        name: true,
        code: true,
        logo: true,
      },
      orderBy: { name: "asc" },
      skip,
      take,
    });
  },

  countOperators: async ({ search }) => {
    const where = {};
    if (search && search.trim()) {
      const term = search.trim();
      where.OR = [
        { name: { contains: term } },
        { code: { contains: term } },
      ];
    }
    return await prisma.trainOperator.count({ where });
  },

  findOperatorById: async (id) => {
    return await prisma.trainOperator.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        code: true,
        logo: true,
        trains: {
          select: {
            id: true,
            trainNumber: true,
            trainName: true,
          },
          orderBy: { trainNumber: "asc" },
        },
      },
    });
  },

  findStations: async ({ search, city, code, skip, take }) => {
    const where = {};
    if (code && code.trim()) {
      where.code = { contains: code.trim() };
    }
    if (city && city.trim()) {
      where.city = { contains: city.trim() };
    }
    if (search && search.trim()) {
      const term = search.trim();
      where.OR = [
        { name: { contains: term } },
        { code: { contains: term } },
        { city: { contains: term } },
      ];
    }
    return await prisma.trainStation.findMany({
      where,
      select: {
        id: true,
        name: true,
        code: true,
        city: true,
        state: true,
        latitude: true,
        longitude: true,
      },
      orderBy: { name: "asc" },
      skip,
      take,
    });
  },

  countStations: async ({ search, city, code }) => {
    const where = {};
    if (code && code.trim()) {
      where.code = { contains: code.trim() };
    }
    if (city && city.trim()) {
      where.city = { contains: city.trim() };
    }
    if (search && search.trim()) {
      const term = search.trim();
      where.OR = [
        { name: { contains: term } },
        { code: { contains: term } },
        { city: { contains: term } },
      ];
    }
    return await prisma.trainStation.count({ where });
  },

  findStationById: async (id) => {
    return await prisma.trainStation.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        code: true,
        city: true,
        state: true,
        latitude: true,
        longitude: true,
      },
    });
  },

  findStationsByTerm: async (term) => {
    if (!term || !term.trim()) return [];
    const t = term.trim();
    return await prisma.trainStation.findMany({
      where: {
        OR: [
          { id: t },
          { code: { contains: t } },
          { name: { contains: t } },
          { city: { contains: t } },
        ],
      },
      select: { id: true },
    });
  },

  findRoutes: async ({ sourceStationIds, destinationStationIds, skip, take }) => {
    const where = {};
    if (sourceStationIds && sourceStationIds.length > 0) {
      where.sourceStationId = { in: sourceStationIds };
    }
    if (destinationStationIds && destinationStationIds.length > 0) {
      where.destinationStationId = { in: destinationStationIds };
    }

    return await prisma.trainRoute.findMany({
      where,
      select: {
        id: true,
        distance: true,
        duration: true,
        sourceStation: {
          select: {
            id: true,
            name: true,
            code: true,
            city: true,
          },
        },
        destinationStation: {
          select: {
            id: true,
            name: true,
            code: true,
            city: true,
          },
        },
      },
      skip,
      take,
    });
  },

  countRoutes: async ({ sourceStationIds, destinationStationIds }) => {
    const where = {};
    if (sourceStationIds && sourceStationIds.length > 0) {
      where.sourceStationId = { in: sourceStationIds };
    }
    if (destinationStationIds && destinationStationIds.length > 0) {
      where.destinationStationId = { in: destinationStationIds };
    }
    return await prisma.trainRoute.count({ where });
  },

  findRouteById: async (id) => {
    return await prisma.trainRoute.findUnique({
      where: { id },
      select: {
        id: true,
        distance: true,
        duration: true,
        sourceStation: {
          select: {
            id: true,
            name: true,
            code: true,
            city: true,
            state: true,
            latitude: true,
            longitude: true,
          },
        },
        destinationStation: {
          select: {
            id: true,
            name: true,
            code: true,
            city: true,
            state: true,
            latitude: true,
            longitude: true,
          },
        },
        schedules: {
          select: {
            id: true,
            travelDate: true,
            departureTime: true,
            arrivalTime: true,
            status: true,
            train: {
              select: {
                id: true,
                trainNumber: true,
                trainName: true,
              },
            },
          },
          take: 10,
        },
      },
    });
  },

  buildSearchWhereClause: ({ sourceStationIds, destinationStationIds, startDate, endDate, classCode, minPrice, maxPrice }) => {
    const where = {
      status: { in: ["SCHEDULED", "DELAYED"] },
      travelDate: {
        gte: startDate,
        lte: endDate,
      },
    };

    if (sourceStationIds && sourceStationIds.length > 0) {
      where.route = { ...where.route, sourceStationId: { in: sourceStationIds } };
    }

    if (destinationStationIds && destinationStationIds.length > 0) {
      where.route = { ...where.route, destinationStationId: { in: destinationStationIds } };
    }

    if (classCode || minPrice !== undefined || maxPrice !== undefined) {
      where.train = {
        classes: {
          some: {},
        },
      };

      if (classCode && classCode.trim()) {
        where.train.classes.some.classCode = classCode.trim().toUpperCase();
      }

      if (minPrice !== undefined || maxPrice !== undefined) {
        where.train.classes.some.fare = {};
        if (minPrice !== undefined) where.train.classes.some.fare.gte = parseFloat(minPrice);
        if (maxPrice !== undefined) where.train.classes.some.fare.lte = parseFloat(maxPrice);
      }
    }

    return where;
  },

  searchSchedules: async (where, orderBy, skip, take) => {
    return await prisma.trainSchedule.findMany({
      where,
      select: {
        id: true,
        travelDate: true,
        departureTime: true,
        arrivalTime: true,
        status: true,
        train: {
          select: {
            id: true,
            trainNumber: true,
            trainName: true,
            operator: {
              select: {
                id: true,
                name: true,
                code: true,
                logo: true,
              },
            },
            classes: {
              select: {
                id: true,
                classCode: true,
                className: true,
                fare: true,
              },
              orderBy: { fare: "asc" },
            },
          },
        },
        route: {
          select: {
            id: true,
            distance: true,
            duration: true,
            sourceStation: {
              select: {
                id: true,
                name: true,
                code: true,
                city: true,
              },
            },
            destinationStation: {
              select: {
                id: true,
                name: true,
                code: true,
                city: true,
              },
            },
          },
        },
      },
      orderBy,
      skip,
      take,
    });
  },

  countSchedules: async (where) => {
    return await prisma.trainSchedule.count({ where });
  },

  findScheduleById: async (scheduleId) => {
    return await prisma.trainSchedule.findUnique({
      where: { id: scheduleId },
      select: {
        id: true,
        travelDate: true,
        departureTime: true,
        arrivalTime: true,
        status: true,
        train: {
          select: {
            id: true,
            trainNumber: true,
            trainName: true,
            operator: {
              select: {
                id: true,
                name: true,
                code: true,
                logo: true,
              },
            },
            classes: {
              select: {
                id: true,
                classCode: true,
                className: true,
                fare: true,
              },
              orderBy: { fare: "asc" },
            },
          },
        },
        route: {
          select: {
            id: true,
            distance: true,
            duration: true,
            sourceStation: {
              select: {
                id: true,
                name: true,
                code: true,
                city: true,
                state: true,
                latitude: true,
                longitude: true,
              },
            },
            destinationStation: {
              select: {
                id: true,
                name: true,
                code: true,
                city: true,
                state: true,
                latitude: true,
                longitude: true,
              },
            },
          },
        },
      },
    });
  },

  findSeatsByTrainIdAndClass: async (trainId, classCode) => {
    const where = { trainId };
    if (classCode && classCode.trim()) {
      where.classCode = classCode.trim().toUpperCase();
    }
    return await prisma.trainSeat.findMany({
      where,
      orderBy: [
        { coachNumber: "asc" },
        { seatNumber: "asc" },
      ],
    });
  },
};

module.exports = TrainModel;
