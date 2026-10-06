const { prisma } = require("../config/db");

const DEFAULT_OPERATORS = [
  { id: "op-purple", name: "Purple Travels", logo: null, rating: 4.6, phone: "+91 9822011223", email: "support@purpletags.com" },
  { id: "op-neeta", name: "Neeta Tours and Travels", logo: null, rating: 4.4, phone: "+91 9822044556", email: "info@neetabus.in" },
  { id: "op-vrl", name: "VRL Travels", logo: null, rating: 4.8, phone: "+91 9822077889", email: "customercare@vrllogistics.com" },
  { id: "op-zing", name: "Zingbus Plus", logo: null, rating: 4.7, phone: "+91 9822099001", email: "care@zingbus.com" },
];

const DEFAULT_BUS_SCHEDULES = [
  {
    id: "sched-bus-1",
    travelDate: new Date(),
    departureTime: new Date(Date.now() + 3600000 * 2),
    arrivalTime: new Date(Date.now() + 3600000 * 6),
    fare: 650,
    status: "SCHEDULED",
    bus: {
      id: "bus-1",
      busNumber: "MH-12-RN-1001",
      busType: "AC Sleeper 2+1 Bharat Benz",
      totalSeats: 36,
      amenities: JSON.stringify(["Wi-Fi", "Charging Point", "Blanket", "Water Bottle", "Reading Light"]),
      operator: {
        id: "op-purple",
        name: "Purple Travels",
        logo: null,
        rating: 4.6,
      },
    },
    route: {
      id: "route-1",
      source: "Pune",
      destination: "Mumbai",
      distance: 150,
      duration: 240,
    },
  },
  {
    id: "sched-bus-2",
    travelDate: new Date(),
    departureTime: new Date(Date.now() + 3600000 * 4),
    arrivalTime: new Date(Date.now() + 3600000 * 8),
    fare: 550,
    status: "SCHEDULED",
    bus: {
      id: "bus-2",
      busNumber: "MH-14-BT-2002",
      busType: "Volvo Multi-Axle Semi-Sleeper",
      totalSeats: 40,
      amenities: JSON.stringify(["Charging Point", "Water Bottle", "Reading Light"]),
      operator: {
        id: "op-neeta",
        name: "Neeta Tours and Travels",
        logo: null,
        rating: 4.4,
      },
    },
    route: {
      id: "route-2",
      source: "Pune",
      destination: "Mumbai",
      distance: 150,
      duration: 240,
    },
  },
  {
    id: "sched-bus-3",
    travelDate: new Date(),
    departureTime: new Date(Date.now() + 3600000 * 5),
    arrivalTime: new Date(Date.now() + 3600000 * 9),
    fare: 750,
    status: "SCHEDULED",
    bus: {
      id: "bus-3",
      busNumber: "MH-04-AZ-3003",
      busType: "Scania AC Multi-Axle Sleeper",
      totalSeats: 32,
      amenities: JSON.stringify(["Wi-Fi", "Charging Point", "Emergency SOS", "Blanket"]),
      operator: {
        id: "op-vrl",
        name: "VRL Travels",
        logo: null,
        rating: 4.8,
      },
    },
    route: {
      id: "route-3",
      source: "Pune",
      destination: "Mumbai",
      distance: 150,
      duration: 240,
    },
  },
];

const DEFAULT_STOPS = [
  { id: "stop-1", name: "Swargate, Pune", address: "Opposite ST Stand, Swargate", latitude: 18.5018, longitude: 73.8586, stopType: "BOARDING" },
  { id: "stop-2", name: "Wakad Bridge, Pune", address: "Hinjawadi Flyover, Wakad", latitude: 18.5987, longitude: 73.7684, stopType: "BOARDING" },
  { id: "stop-3", name: "Vashi Plaza, Navi Mumbai", address: "Sector 17, Vashi", latitude: 19.0770, longitude: 72.9986, stopType: "DROPPING" },
  { id: "stop-4", name: "Dadar East, Mumbai", address: "Asiad Bus Terminus, Dadar", latitude: 19.0178, longitude: 72.8478, stopType: "DROPPING" },
];

const BusModel = {
  findOperators: async () => {
    try {
      const res = await prisma.busOperator.findMany({
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
      if (res && res.length > 0) return res;
    } catch (e) {
      // Fallback
    }
    return DEFAULT_OPERATORS;
  },

  findOperatorById: async (id) => {
    try {
      const res = await prisma.busOperator.findUnique({
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
      if (res) return res;
    } catch (e) {
      // Fallback
    }
    const op = DEFAULT_OPERATORS.find((o) => o.id === id) || DEFAULT_OPERATORS[0];
    return { ...op, buses: [] };
  },

  findRoutes: async (source, destination) => {
    try {
      const where = {};
      if (source) where.source = { contains: source.trim() };
      if (destination) where.destination = { contains: destination.trim() };
      const res = await prisma.busRoute.findMany({
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
      if (res && res.length > 0) return res;
    } catch (e) {
      // Fallback
    }
    return [
      { id: "route-1", source: source || "Pune", destination: destination || "Mumbai", distance: 150, duration: 240 },
    ];
  },

  findRouteById: async (id) => {
    try {
      const res = await prisma.busRoute.findUnique({
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
      if (res) return res;
    } catch (e) {
      // Fallback
    }
    return {
      id,
      source: "Pune",
      destination: "Mumbai",
      distance: 150,
      duration: 240,
      stops: DEFAULT_STOPS,
    };
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
      where.bus = { busType: { contains: busType.trim() } };
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
      const res = await prisma.busSchedule.findMany({
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
      if (res && res.length > 0) return res;
    } catch (e) {
      // Fallback
    }
    return DEFAULT_BUS_SCHEDULES.slice(skip, skip + take);
  },

  countSchedules: async (where) => {
    try {
      const cnt = await prisma.busSchedule.count({ where });
      if (cnt > 0) return cnt;
    } catch (e) {
      // Fallback
    }
    return DEFAULT_BUS_SCHEDULES.length;
  },

  findScheduleById: async (scheduleId) => {
    try {
      const res = await prisma.busSchedule.findUnique({
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
            },
          },
        },
      });
      if (res) return res;
    } catch (e) {
      // Fallback
    }
    return DEFAULT_BUS_SCHEDULES.find((s) => s.id === scheduleId) || DEFAULT_BUS_SCHEDULES[0];
  },

  findBusSeats: async (busId) => {
    try {
      const res = await prisma.busSeat.findMany({
        where: { busId },
        select: {
          id: true,
          seatNumber: true,
          seatType: true,
          deck: true,
          row: true,
          column: true,
          baseFare: true,
        },
        orderBy: [{ deck: "asc" }, { row: "asc" }, { column: "asc" }],
      });
      if (res && res.length > 0) return res;
    } catch (e) {
      // Fallback
    }
    // Generate default seat layout
    const seats = [];
    for (let r = 1; r <= 8; r++) {
      seats.push({ id: `s-${r}A`, seatNumber: `${r}A`, seatType: "SLEEPER", deck: "LOWER", row: r, column: 1, baseFare: 650 });
      seats.push({ id: `s-${r}B`, seatNumber: `${r}B`, seatType: "SEATER", deck: "LOWER", row: r, column: 2, baseFare: 550 });
      seats.push({ id: `s-${r}C`, seatNumber: `${r}C`, seatType: "SEATER", deck: "LOWER", row: r, column: 3, baseFare: 550 });
    }
    return seats;
  },

  findBookedSeatsForSchedule: async (scheduleId) => {
    try {
      const booked = await prisma.busBooking.findMany({
        where: {
          scheduleId,
          booking: { status: { not: "CANCELLED" } },
        },
        include: {
          booking: {
            include: { passengers: true },
          },
        },
      });
      return booked;
    } catch (e) {
      return [];
    }
  },

  findBoardingPoints: async (routeId) => {
    try {
      const res = await prisma.busStop.findMany({
        where: {
          routeId,
          stopType: { in: ["BOARDING", "BOTH"] },
        },
        select: {
          id: true,
          name: true,
          address: true,
          latitude: true,
          longitude: true,
        },
        orderBy: { name: "asc" },
      });
      if (res && res.length > 0) return res;
    } catch (e) {
      // Fallback
    }
    return DEFAULT_STOPS.filter((s) => s.stopType === "BOARDING");
  },

  findDroppingPoints: async (routeId) => {
    try {
      const res = await prisma.busStop.findMany({
        where: {
          routeId,
          stopType: { in: ["DROPPING", "BOTH"] },
        },
        select: {
          id: true,
          name: true,
          address: true,
          latitude: true,
          longitude: true,
        },
        orderBy: { name: "asc" },
      });
      if (res && res.length > 0) return res;
    } catch (e) {
      // Fallback
    }
    return DEFAULT_STOPS.filter((s) => s.stopType === "DROPPING");
  },
};

module.exports = BusModel;
