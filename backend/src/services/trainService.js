const TrainModel = require("../models/trainModel");

const trainService = {
  getAllOperators: async ({ search, page = 1, limit = 20 }) => {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const [operators, totalCount] = await Promise.all([
      TrainModel.findOperators({ search, skip, take: limitNum }),
      TrainModel.countOperators({ search }),
    ]);

    const totalPages = Math.ceil(totalCount / limitNum) || (operators.length > 0 ? 1 : 0);

    return {
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: totalCount,
        totalPages,
      },
      operators,
    };
  },

  getOperatorById: async (id) => {
    const operator = await TrainModel.findOperatorById(id);
    if (!operator) {
      const error = new Error("Train operator not found");
      error.statusCode = 404;
      throw error;
    }
    return { operator };
  },

  getAllStations: async ({ search, city, code, page = 1, limit = 20 }) => {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const [stations, totalCount] = await Promise.all([
      TrainModel.findStations({ search, city, code, skip, take: limitNum }),
      TrainModel.countStations({ search, city, code }),
    ]);

    const totalPages = Math.ceil(totalCount / limitNum) || (stations.length > 0 ? 1 : 0);

    return {
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: totalCount,
        totalPages,
      },
      stations,
    };
  },

  getStationById: async (id) => {
    const station = await TrainModel.findStationById(id);
    if (!station) {
      const error = new Error("Train station not found");
      error.statusCode = 404;
      throw error;
    }
    return { station };
  },

  getAllRoutes: async ({ source, destination, page = 1, limit = 20 }) => {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    let sourceStationIds = [];
    if (source && source.trim()) {
      const matched = await TrainModel.findStationsByTerm(source);
      sourceStationIds = matched.map((s) => s.id);
    }

    let destinationStationIds = [];
    if (destination && destination.trim()) {
      const matched = await TrainModel.findStationsByTerm(destination);
      destinationStationIds = matched.map((s) => s.id);
    }

    const [routes, totalCount] = await Promise.all([
      TrainModel.findRoutes({ sourceStationIds, destinationStationIds, skip, take: limitNum }),
      TrainModel.countRoutes({ sourceStationIds, destinationStationIds }),
    ]);

    const totalPages = Math.ceil(totalCount / limitNum) || (routes.length > 0 ? 1 : 0);

    return {
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: totalCount,
        totalPages,
      },
      routes,
    };
  },

  getRouteById: async (id) => {
    const route = await TrainModel.findRouteById(id);
    if (!route) {
      const error = new Error("Train route not found");
      error.statusCode = 404;
      throw error;
    }
    return { route };
  },

  searchTrains: async (query) => {
    const { source, destination, date, passengers = 1, classCode, minPrice, maxPrice, sortBy = "departure_early", page = 1, limit = 10 } = query;

    const reqPassengers = parseInt(passengers, 10) || 1;
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    // Resolve source & destination station IDs
    const [sourceStations, destStations] = await Promise.all([
      TrainModel.findStationsByTerm(source),
      TrainModel.findStationsByTerm(destination),
    ]);

    const sourceStationIds = sourceStations.map((s) => s.id);
    const destinationStationIds = destStations.map((s) => s.id);

    // If source or destination string was provided but matches 0 stations in DB
    if ((source && sourceStationIds.length === 0) || (destination && destinationStationIds.length === 0)) {
      return {
        search: {
          source: source.trim(),
          destination: destination.trim(),
          date: date.trim(),
          passengers: reqPassengers,
          classCode: classCode ? classCode.trim() : null,
        },
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: 0,
          totalPages: 0,
        },
        trains: [],
      };
    }

    // Build travelDate range
    const travelDateObj = new Date(date.trim());
    const startDate = new Date(travelDateObj);
    startDate.setUTCHours(0, 0, 0, 0);

    const endDate = new Date(travelDateObj);
    endDate.setUTCHours(23, 59, 59, 999);

    const where = TrainModel.buildSearchWhereClause({
      sourceStationIds,
      destinationStationIds,
      startDate,
      endDate,
      classCode,
      minPrice,
      maxPrice,
    });

    let orderBy = [{ departureTime: "asc" }];
    if (sortBy === "departure_late") {
      orderBy = [{ departureTime: "desc" }];
    }

    const [rawSchedules, totalCount] = await Promise.all([
      TrainModel.searchSchedules(where, orderBy, skip, limitNum),
      TrainModel.countSchedules(where),
    ]);

    let formattedTrains = rawSchedules.map((sched) => {
      const classes = sched.train.classes || [];
      const minFare = classes.length > 0 ? Math.min(...classes.map((c) => c.fare)) : 0;

      return {
        scheduleId: sched.id,
        train: {
          id: sched.train.id,
          number: sched.train.trainNumber,
          name: sched.train.trainName,
        },
        operator: sched.train.operator,
        source: sched.route.sourceStation,
        destination: sched.route.destinationStation,
        departure: sched.departureTime,
        arrival: sched.arrivalTime,
        duration: sched.route.duration,
        status: sched.status,
        classes: classes.map((c) => ({
          id: c.id,
          classCode: c.classCode,
          className: c.className,
          fare: c.fare,
          availableSeats: "AVAILABLE",
        })),
        minFare,
        fare: minFare,
        travelDate: sched.travelDate.toISOString().split("T")[0],
      };
    });

    // In-memory sort for price if requested
    if (sortBy === "price_low") {
      formattedTrains.sort((a, b) => a.minFare - b.minFare);
    } else if (sortBy === "price_high") {
      formattedTrains.sort((a, b) => b.minFare - a.minFare);
    }

    const totalPages = Math.ceil(totalCount / limitNum) || (totalCount > 0 ? 1 : 0);

    return {
      search: {
        source: source.trim(),
        destination: destination.trim(),
        date: date.trim(),
        passengers: reqPassengers,
        classCode: classCode ? classCode.trim() : null,
      },
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: totalCount,
        totalPages,
      },
      trains: formattedTrains,
    };
  },

  getScheduleById: async (id) => {
    const sched = await TrainModel.findScheduleById(id);
    if (!sched) {
      const error = new Error("Train schedule not found");
      error.statusCode = 404;
      throw error;
    }
    return { schedule: sched };
  },

  getTrainDetails: async (scheduleId) => {
    const sched = await TrainModel.findScheduleById(scheduleId);
    if (!sched) {
      const error = new Error("Train schedule not found");
      error.statusCode = 404;
      throw error;
    }

    const classes = sched.train.classes || [];
    const minFare = classes.length > 0 ? Math.min(...classes.map((c) => c.fare)) : 0;

    return {
      train: {
        scheduleId: sched.id,
        status: sched.status,
        timing: {
          travelDate: sched.travelDate.toISOString().split("T")[0],
          departureTime: sched.departureTime,
          arrivalTime: sched.arrivalTime,
        },
        train: {
          id: sched.train.id,
          number: sched.train.trainNumber,
          name: sched.train.trainName,
        },
        operator: sched.train.operator,
        source: sched.route.sourceStation,
        destination: sched.route.destinationStation,
        duration: sched.route.duration,
        distance: sched.route.distance,
        classes: classes.map((c) => ({
          id: c.id,
          classCode: c.classCode,
          className: c.className,
          fare: c.fare,
          availableSeats: "AVAILABLE",
        })),
        minFare,
      },
    };
  },

  getTrainClasses: async (scheduleId) => {
    const sched = await TrainModel.findScheduleById(scheduleId);
    if (!sched) {
      const error = new Error("Train schedule not found");
      error.statusCode = 404;
      throw error;
    }

    const classes = sched.train.classes || [];
    return {
      scheduleId: sched.id,
      trainNumber: sched.train.trainNumber,
      trainName: sched.train.trainName,
      classes: classes.map((c) => ({
        id: c.id,
        classCode: c.classCode,
        className: c.className,
        fare: c.fare,
        availableSeats: "AVAILABLE",
      })),
    };
  },

  getTrainSeats: async (scheduleId, classCode) => {
    const sched = await TrainModel.findScheduleById(scheduleId);
    if (!sched) {
      const error = new Error("Train schedule not found");
      error.statusCode = 404;
      throw error;
    }

    const seats = await TrainModel.findSeatsByTrainIdAndClass(sched.train.id, classCode);
    const formattedSeats = seats.map((seat) => ({
      id: seat.id,
      coachNumber: seat.coachNumber,
      seatNumber: seat.seatNumber,
      berthType: seat.berthType,
      classCode: seat.classCode,
      status: "AVAILABLE",
    }));

    return {
      scheduleId: sched.id,
      trainNumber: sched.train.trainNumber,
      classCode: classCode || "ALL",
      seats: formattedSeats,
    };
  },
};

module.exports = trainService;
