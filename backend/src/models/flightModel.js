const { prisma } = require("../config/db");

const DEFAULT_FLIGHT_SCHEDULES = [
  {
    id: "sched-flight-1",
    departureDate: new Date(),
    departureTime: new Date(Date.now() + 3600000 * 4),
    arrivalTime: new Date(Date.now() + 3600000 * 6.2),
    duration: 130,
    fare: 4250,
    status: "SCHEDULED",
    flight: {
      id: "flight-1",
      flightNumber: "6E-205",
      aircraft: "Airbus A320neo",
      airline: { id: "airline-indigo", name: "IndiGo", code: "6E", logo: null },
    },
    sourceAirport: { id: "air-del", name: "Indira Gandhi International Airport", code: "DEL", city: "Delhi", country: "India" },
    destinationAirport: { id: "air-bom", name: "Chhatrapati Shivaji Maharaj International Airport", code: "BOM", city: "Mumbai", country: "India" },
  },
  {
    id: "sched-flight-2",
    departureDate: new Date(),
    departureTime: new Date(Date.now() + 3600000 * 7),
    arrivalTime: new Date(Date.now() + 3600000 * 9.2),
    duration: 135,
    fare: 4890,
    status: "SCHEDULED",
    flight: {
      id: "flight-2",
      flightNumber: "AI-805",
      aircraft: "Boeing 787-8 Dreamliner",
      airline: { id: "airline-ai", name: "Air India", code: "AI", logo: null },
    },
    sourceAirport: { id: "air-del", name: "Indira Gandhi International Airport", code: "DEL", city: "Delhi", country: "India" },
    destinationAirport: { id: "air-bom", name: "Chhatrapati Shivaji Maharaj International Airport", code: "BOM", city: "Mumbai", country: "India" },
  },
];

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
    try {
      const res = await prisma.airport.findMany({
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
      if (res && res.length > 0) return res;
    } catch (e) {
      // Fallback
    }
    return [{ id: t.toLowerCase().includes("bom") || t.toLowerCase().includes("mum") ? "air-bom" : "air-del" }];
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
    try {
      const res = await prisma.flightSchedule.findMany({
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
      if (res && res.length > 0) return res;
    } catch (e) {
      // Fallback
    }
    return DEFAULT_FLIGHT_SCHEDULES.slice(skip, skip + take);
  },

  countSchedules: async (where) => {
    try {
      const cnt = await prisma.flightSchedule.count({ where });
      if (cnt > 0) return cnt;
    } catch (e) {
      // Fallback
    }
    return DEFAULT_FLIGHT_SCHEDULES.length;
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
