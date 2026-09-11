const FlightModel = require("../models/flightModel");

const flightService = {
  getAllAirlines: async ({ search, page = 1, limit = 20 }) => {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const [airlines, totalCount] = await Promise.all([
      FlightModel.findAirlines({ search, skip, take: limitNum }),
      FlightModel.countAirlines({ search }),
    ]);

    const totalPages = Math.ceil(totalCount / limitNum) || (airlines.length > 0 ? 1 : 0);

    return {
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: totalCount,
        totalPages,
      },
      airlines,
    };
  },

  getAirlineById: async (id) => {
    const airline = await FlightModel.findAirlineById(id);
    if (!airline) {
      const error = new Error("Airline not found");
      error.statusCode = 404;
      throw error;
    }
    return { airline };
  },

  getAllAirports: async ({ search, city, country, code, page = 1, limit = 20 }) => {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const [airports, totalCount] = await Promise.all([
      FlightModel.findAirports({ search, city, country, code, skip, take: limitNum }),
      FlightModel.countAirports({ search, city, country, code }),
    ]);

    const totalPages = Math.ceil(totalCount / limitNum) || (airports.length > 0 ? 1 : 0);

    return {
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: totalCount,
        totalPages,
      },
      airports,
    };
  },

  getAirportById: async (id) => {
    const airport = await FlightModel.findAirportById(id);
    if (!airport) {
      const error = new Error("Airport not found");
      error.statusCode = 404;
      throw error;
    }
    return { airport };
  },

  searchFlights: async (query) => {
    const {
      source,
      destination,
      date,
      returnDate,
      tripType = "one_way",
      passengers = 1,
      cabinClass,
      minPrice,
      maxPrice,
      airlineId,
      sortBy = "departure_early",
      page = 1,
      limit = 10,
    } = query;

    const reqPassengers = parseInt(passengers, 10) || 1;
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;
    const parsedTripType = tripType.trim().toLowerCase();

    // Validate airlineId if provided
    if (airlineId && airlineId.trim()) {
      const airline = await FlightModel.findAirlineById(airlineId.trim());
      if (!airline) {
        const error = new Error("Airline not found");
        error.statusCode = 404;
        throw error;
      }
    }

    // Resolve source & destination airport IDs
    const [sourceAirports, destAirports] = await Promise.all([
      FlightModel.findAirportsByTerm(source),
      FlightModel.findAirportsByTerm(destination),
    ]);

    const sourceAirportIds = sourceAirports.map((a) => a.id);
    const destinationAirportIds = destAirports.map((a) => a.id);

    // If source or destination string was provided but matches 0 airports in DB
    if ((source && sourceAirportIds.length === 0) || (destination && destinationAirportIds.length === 0)) {
      return {
        search: {
          source: source.trim(),
          destination: destination.trim(),
          date: date.trim(),
          returnDate: returnDate ? returnDate.trim() : null,
          tripType: parsedTripType,
          passengers: reqPassengers,
          cabinClass: cabinClass ? cabinClass.trim().toUpperCase() : null,
        },
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: 0,
          totalPages: 0,
        },
        flights: [],
      };
    }

    // Build departureDate range
    const travelDateObj = new Date(date.trim());
    const startDate = new Date(travelDateObj);
    startDate.setUTCHours(0, 0, 0, 0);

    const endDate = new Date(travelDateObj);
    endDate.setUTCHours(23, 59, 59, 999);

    const where = FlightModel.buildSearchWhereClause({
      sourceAirportIds,
      destinationAirportIds,
      startDate,
      endDate,
      airlineId,
      minPrice,
      maxPrice,
    });

    let orderBy = [{ departureTime: "asc" }];
    if (sortBy === "price_low") {
      orderBy = [{ fare: "asc" }];
    } else if (sortBy === "price_high") {
      orderBy = [{ fare: "desc" }];
    } else if (sortBy === "departure_late") {
      orderBy = [{ departureTime: "desc" }];
    } else if (sortBy === "duration_short") {
      orderBy = [{ duration: "asc" }];
    } else if (sortBy === "duration_long") {
      orderBy = [{ duration: "desc" }];
    }

    const [rawSchedules, totalCount] = await Promise.all([
      FlightModel.searchSchedules(where, orderBy, skip, limitNum),
      FlightModel.countSchedules(where),
    ]);

    const formattedFlights = rawSchedules.map((sched) => ({
      scheduleId: sched.id,
      flight: {
        id: sched.flight.id,
        number: sched.flight.flightNumber,
        aircraft: sched.flight.aircraft,
      },
      airline: sched.flight.airline,
      source: sched.sourceAirport,
      destination: sched.destinationAirport,
      departure: sched.departureTime,
      arrival: sched.arrivalTime,
      duration: sched.duration,
      stops: 0,
      status: sched.status,
      price: sched.fare,
      fare: sched.fare,
      cabinClass: cabinClass ? cabinClass.trim().toUpperCase() : "ECONOMY",
      availableSeats: "AVAILABLE",
      departureDate: sched.departureDate.toISOString().split("T")[0],
    }));

    const totalPages = Math.ceil(totalCount / limitNum) || (totalCount > 0 ? 1 : 0);

    return {
      search: {
        source: source.trim(),
        destination: destination.trim(),
        date: date.trim(),
        returnDate: returnDate ? returnDate.trim() : null,
        tripType: parsedTripType,
        passengers: reqPassengers,
        cabinClass: cabinClass ? cabinClass.trim().toUpperCase() : null,
      },
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: totalCount,
        totalPages,
      },
      flights: formattedFlights,
    };
  },

  getScheduleById: async (id) => {
    const sched = await FlightModel.findScheduleById(id);
    if (!sched) {
      const error = new Error("Flight schedule not found");
      error.statusCode = 404;
      throw error;
    }
    return { schedule: sched };
  },

  getFlightDetails: async (scheduleId) => {
    const sched = await FlightModel.findScheduleById(scheduleId);
    if (!sched) {
      const error = new Error("Flight schedule not found");
      error.statusCode = 404;
      throw error;
    }

    return {
      flight: {
        scheduleId: sched.id,
        status: sched.status,
        fare: sched.fare,
        price: sched.fare,
        duration: sched.duration,
        stops: 0,
        timing: {
          departureDate: sched.departureDate.toISOString().split("T")[0],
          departureTime: sched.departureTime,
          arrivalTime: sched.arrivalTime,
        },
        flight: {
          id: sched.flight.id,
          number: sched.flight.flightNumber,
          aircraft: sched.flight.aircraft,
        },
        airline: sched.flight.airline,
        source: sched.sourceAirport,
        destination: sched.destinationAirport,
        availableSeats: "AVAILABLE",
        addons: sched.flight.addons || [],
      },
    };
  },

  getFlightSeats: async (scheduleId, cabinClass) => {
    const sched = await FlightModel.findScheduleById(scheduleId);
    if (!sched) {
      const error = new Error("Flight schedule not found");
      error.statusCode = 404;
      throw error;
    }

    const seats = await FlightModel.findSeatsByFlightIdAndClass(sched.flight.id, cabinClass);
    const formattedSeats = seats.map((seat) => ({
      id: seat.id,
      seatNumber: seat.seatNumber,
      seatClass: seat.seatClass,
      isAvailable: seat.isAvailable,
      status: seat.isAvailable ? "AVAILABLE" : "BOOKED",
      fare: sched.fare,
    }));

    return {
      scheduleId: sched.id,
      flightNumber: sched.flight.flightNumber,
      cabinClass: cabinClass ? cabinClass.toUpperCase() : "ALL",
      seats: formattedSeats,
    };
  },

  getFlightAddons: async (scheduleId) => {
    const sched = await FlightModel.findScheduleById(scheduleId);
    if (!sched) {
      const error = new Error("Flight schedule not found");
      error.statusCode = 404;
      throw error;
    }

    const addons = await FlightModel.findAddonsByFlightId(sched.flight.id);
    return {
      scheduleId: sched.id,
      flightNumber: sched.flight.flightNumber,
      addons,
    };
  },
};

module.exports = flightService;
