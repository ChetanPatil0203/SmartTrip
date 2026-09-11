const BusModel = require("../models/busModel");

const parseAmenities = (amenitiesString) => {
  if (!amenitiesString) return [];
  if (Array.isArray(amenitiesString)) return amenitiesString;
  try {
    const parsed = JSON.parse(amenitiesString);
    if (Array.isArray(parsed)) return parsed;
  } catch (e) {
    // String is comma-separated
  }
  return amenitiesString
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

const busService = {
  getAllOperators: async () => {
    const operators = await BusModel.findOperators();
    return { operators };
  },

  getOperatorById: async (id) => {
    const operator = await BusModel.findOperatorById(id);
    if (!operator) {
      const error = new Error("Bus operator not found");
      error.statusCode = 404;
      throw error;
    }
    return { operator };
  },

  getAllRoutes: async (source, destination) => {
    const routes = await BusModel.findRoutes(source, destination);
    return { routes };
  },

  getRouteById: async (id) => {
    const route = await BusModel.findRouteById(id);
    if (!route) {
      const error = new Error("Bus route not found");
      error.statusCode = 404;
      throw error;
    }
    return { route };
  },

  searchBuses: async (query) => {
    const { source, destination, date, passengers = 1, busType, minPrice, maxPrice, sortBy = "departure_early", page = 1, limit = 20 } = query;

    const reqPassengers = parseInt(passengers, 10) || 1;
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    // Build Date range for the requested travel date
    const travelDateObj = new Date(date.trim());
    const startDate = new Date(travelDateObj);
    startDate.setUTCHours(0, 0, 0, 0);

    const endDate = new Date(travelDateObj);
    endDate.setUTCHours(23, 59, 59, 999);

    const where = BusModel.buildSearchWhereClause({
      source,
      destination,
      startDate,
      endDate,
      busType,
      minPrice,
      maxPrice,
    });

    // Map Sorting
    let orderBy = [{ departureTime: "asc" }];
    if (sortBy === "price_low") {
      orderBy = [{ fare: "asc" }];
    } else if (sortBy === "price_high") {
      orderBy = [{ fare: "desc" }];
    } else if (sortBy === "departure_late") {
      orderBy = [{ departureTime: "desc" }];
    } else if (sortBy === "rating") {
      orderBy = [{ bus: { operator: { rating: "desc" } } }];
    }

    const [rawSchedules, totalCount] = await Promise.all([
      BusModel.searchSchedules(where, orderBy, skip, limitNum),
      BusModel.countSchedules(where),
    ]);

    const formattedBuses = rawSchedules
      .map((sched) => {
        const availableSeats = sched.bus.totalSeats;
        return {
          scheduleId: sched.id,
          busId: sched.bus.id,
          busNumber: sched.bus.busNumber,
          operator: {
            id: sched.bus.operator.id,
            name: sched.bus.operator.name,
            logo: sched.bus.operator.logo,
            rating: sched.bus.operator.rating,
          },
          busType: sched.bus.busType,
          departureTime: sched.departureTime,
          arrivalTime: sched.arrivalTime,
          fare: sched.fare,
          availableSeats,
          status: sched.status,
          route: {
            id: sched.route.id,
            source: sched.route.source,
            destination: sched.route.destination,
            distance: sched.route.distance,
            duration: sched.route.duration,
          },
        };
      })
      .filter((b) => b.availableSeats >= reqPassengers);

    const totalPages = Math.ceil(totalCount / limitNum) || 1;

    return {
      search: {
        source: source.trim(),
        destination: destination.trim(),
        date: date.trim(),
        passengers: reqPassengers,
      },
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: totalCount,
        totalPages,
      },
      buses: formattedBuses,
    };
  },

  getBusDetails: async (scheduleId) => {
    const sched = await BusModel.findScheduleById(scheduleId);
    if (!sched) {
      const error = new Error("Bus schedule not found");
      error.statusCode = 404;
      throw error;
    }

    const boardingPoints = sched.route.stops.filter((s) => s.stopType === "BOARDING" || s.stopType === "BOTH");
    const droppingPoints = sched.route.stops.filter((s) => s.stopType === "DROPPING" || s.stopType === "BOTH");
    const amenities = parseAmenities(sched.bus.amenities);

    return {
      bus: {
        scheduleId: sched.id,
        status: sched.status,
        fare: sched.fare,
        timing: {
          travelDate: sched.travelDate.toISOString().split("T")[0],
          departureTime: sched.departureTime,
          arrivalTime: sched.arrivalTime,
        },
        bus: {
          id: sched.bus.id,
          busNumber: sched.bus.busNumber,
          busType: sched.bus.busType,
          totalSeats: sched.bus.totalSeats,
        },
        operator: sched.bus.operator,
        route: {
          id: sched.route.id,
          source: sched.route.source,
          destination: sched.route.destination,
          distance: sched.route.distance,
          duration: sched.route.duration,
        },
        amenities,
        availableSeats: sched.bus.totalSeats,
        boardingPoints,
        droppingPoints,
      },
    };
  },

  getSeatLayout: async (scheduleId) => {
    const sched = await BusModel.findScheduleById(scheduleId);
    if (!sched) {
      const error = new Error("Bus schedule not found");
      error.statusCode = 404;
      throw error;
    }

    const seats = await BusModel.findSeatsByBusId(sched.bus.id);
    const formattedSeats = seats.map((seat) => ({
      id: seat.id,
      seatNumber: seat.seatNumber,
      seatType: seat.seatType,
      rowNumber: seat.rowNumber,
      columnNumber: seat.columnNumber,
      status: "AVAILABLE",
      fare: sched.fare,
    }));

    return {
      scheduleId: sched.id,
      totalSeats: sched.bus.totalSeats,
      seats: formattedSeats,
    };
  },

  getBoardingPoints: async (scheduleId) => {
    const sched = await BusModel.findScheduleById(scheduleId);
    if (!sched) {
      const error = new Error("Bus schedule not found");
      error.statusCode = 404;
      throw error;
    }

    const boardingPoints = await BusModel.findStopsByRouteIdAndTypes(sched.route.id, ["BOARDING", "BOTH"]);
    return {
      scheduleId: sched.id,
      boardingPoints,
    };
  },

  getDroppingPoints: async (scheduleId) => {
    const sched = await BusModel.findScheduleById(scheduleId);
    if (!sched) {
      const error = new Error("Bus schedule not found");
      error.statusCode = 404;
      throw error;
    }

    const droppingPoints = await BusModel.findStopsByRouteIdAndTypes(sched.route.id, ["DROPPING", "BOTH"]);
    return {
      scheduleId: sched.id,
      droppingPoints,
    };
  },

  getScheduleById: async (id) => {
    const sched = await BusModel.findScheduleById(id);
    if (!sched) {
      const error = new Error("Bus schedule not found");
      error.statusCode = 404;
      throw error;
    }
    return { schedule: sched };
  },

  getLiveTracking: async (scheduleId) => {
    const sched = await BusModel.findScheduleById(scheduleId);
    if (!sched) {
      const error = new Error("Bus schedule not found");
      error.statusCode = 404;
      throw error;
    }

    const tracking = await BusModel.findLatestTracking(scheduleId);
    if (!tracking) {
      return {
        tracking: null,
        message: "Live tracking is currently unavailable",
      };
    }

    return { tracking };
  },

  getDelayAlert: async (scheduleId) => {
    const sched = await BusModel.findScheduleById(scheduleId);
    if (!sched) {
      const error = new Error("Bus schedule not found");
      error.statusCode = 404;
      throw error;
    }

    const delay = await BusModel.findLatestDelay(scheduleId);
    return { delay: delay || null };
  },
};

module.exports = busService;
