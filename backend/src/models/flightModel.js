const { prisma } = require("../config/db");

const FlightModel = {
  findAirlines: async ({ search, skip, take }) => {
    const where = {};
    if (search && search.trim()) {
      const term = search.trim();
      where.OR = [
        { name: { contains: term } },
        { code: { contains: term } },
      ];
    }
    return await prisma.airline.findMany({
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

  countAirlines: async ({ search }) => {
    const where = {};
    if (search && search.trim()) {
      const term = search.trim();
      where.OR = [
        { name: { contains: term } },
        { code: { contains: term } },
      ];
    }
    return await prisma.airline.count({ where });
  },

  findAirlineById: async (id) => {
    return await prisma.airline.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        code: true,
        logo: true,
        flights: {
          select: {
            id: true,
            flightNumber: true,
            aircraft: true,
          },
          orderBy: { flightNumber: "asc" },
        },
      },
    });
  },

  findAirports: async ({ search, city, country, code, skip, take }) => {
    const where = {};
    if (code && code.trim()) {
      where.code = { contains: code.trim() };
    }
    if (city && city.trim()) {
      where.city = { contains: city.trim() };
    }
    if (country && country.trim()) {
      where.country = { contains: country.trim() };
    }
    if (search && search.trim()) {
      const term = search.trim();
      where.OR = [
        { name: { contains: term } },
        { code: { contains: term } },
        { city: { contains: term } },
        { country: { contains: term } },
      ];
    }
    return await prisma.airport.findMany({
      where,
      select: {
        id: true,
        name: true,
        code: true,
        city: true,
        country: true,
        latitude: true,
        longitude: true,
      },
      orderBy: { city: "asc" },
      skip,
      take,
    });
  },

  countAirports: async ({ search, city, country, code }) => {
    const where = {};
    if (code && code.trim()) {
      where.code = { contains: code.trim() };
    }
    if (city && city.trim()) {
      where.city = { contains: city.trim() };
    }
    if (country && country.trim()) {
      where.country = { contains: country.trim() };
    }
    if (search && search.trim()) {
      const term = search.trim();
      where.OR = [
        { name: { contains: term } },
        { code: { contains: term } },
        { city: { contains: term } },
        { country: { contains: term } },
      ];
    }
    return await prisma.airport.count({ where });
  },

  findAirportById: async (id) => {
    return await prisma.airport.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        code: true,
        city: true,
        country: true,
        latitude: true,
        longitude: true,
      },
    });
  },

  findAirportsByTerm: async (term) => {
    if (!term || !term.trim()) return [];
    const t = term.trim();
    return await prisma.airport.findMany({
      where: {
        OR: [
          { id: t },
          { code: { contains: t } },
          { city: { contains: t } },
          { name: { contains: t } },
        ],
      },
      select: { id: true },
    });
  },

  buildSearchWhereClause: ({ sourceAirportIds, destinationAirportIds, startDate, endDate, airlineId, minPrice, maxPrice }) => {
    const where = {
      status: { in: ["SCHEDULED", "DELAYED"] },
      departureDate: {
        gte: startDate,
        lte: endDate,
      },
    };

    if (sourceAirportIds && sourceAirportIds.length > 0) {
      where.sourceAirportId = { in: sourceAirportIds };
    }

    if (destinationAirportIds && destinationAirportIds.length > 0) {
      where.destinationAirportId = { in: destinationAirportIds };
    }

    if (airlineId && airlineId.trim()) {
      where.flight = {
        airlineId: airlineId.trim(),
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
    return await prisma.flightSchedule.findMany({
      where,
      select: {
        id: true,
        departureDate: true,
        departureTime: true,
        arrivalTime: true,
        duration: true,
        fare: true,
        status: true,
        flight: {
          select: {
            id: true,
            flightNumber: true,
            aircraft: true,
            airline: {
              select: {
                id: true,
                name: true,
                code: true,
                logo: true,
              },
            },
          },
        },
        sourceAirport: {
          select: {
            id: true,
            name: true,
            code: true,
            city: true,
            country: true,
          },
        },
        destinationAirport: {
          select: {
            id: true,
            name: true,
            code: true,
            city: true,
            country: true,
          },
        },
      },
      orderBy,
      skip,
      take,
    });
  },

  countSchedules: async (where) => {
    return await prisma.flightSchedule.count({ where });
  },

  findScheduleById: async (scheduleId) => {
    return await prisma.flightSchedule.findUnique({
      where: { id: scheduleId },
      select: {
        id: true,
        departureDate: true,
        departureTime: true,
        arrivalTime: true,
        duration: true,
        fare: true,
        status: true,
        flight: {
          select: {
            id: true,
            flightNumber: true,
            aircraft: true,
            airline: {
              select: {
                id: true,
                name: true,
                code: true,
                logo: true,
              },
            },
            addons: {
              select: {
                id: true,
                name: true,
                description: true,
                price: true,
              },
            },
          },
        },
        sourceAirport: {
          select: {
            id: true,
            name: true,
            code: true,
            city: true,
            country: true,
            latitude: true,
            longitude: true,
          },
        },
        destinationAirport: {
          select: {
            id: true,
            name: true,
            code: true,
            city: true,
            country: true,
            latitude: true,
            longitude: true,
          },
        },
      },
    });
  },

  findSeatsByFlightIdAndClass: async (flightId, seatClass) => {
    const where = { flightId };
    if (seatClass && seatClass.trim()) {
      where.seatClass = seatClass.trim().toUpperCase();
    }
    return await prisma.flightSeat.findMany({
      where,
      orderBy: { seatNumber: "asc" },
    });
  },

  findAddonsByFlightId: async (flightId) => {
    return await prisma.flightAddon.findMany({
      where: { flightId },
      orderBy: { name: "asc" },
    });
  },
};

module.exports = FlightModel;
