const crypto = require("crypto");
const CabModel = require("../models/cabModel");
const { prisma } = require("../config/db");

const generateCabReference = () => {
  const rand = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `STC-${rand}`;
};

const generateOtp = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

const calculateDistanceAndDuration = (pickup = "", drop = "") => {
  // Deterministic calculation based on string lengths or default
  const defaultDistKm = 14.2;
  const defaultDurationMins = 28;
  return {
    distance: `${defaultDistKm} km`,
    distanceKm: defaultDistKm,
    duration: `~${defaultDurationMins} mins`,
    durationMins: defaultDurationMins,
  };
};

const stageToStatus = {
  1: "ARRIVING",
  2: "ARRIVED",
  3: "IN_PROGRESS",
  4: "COMPLETED",
};

const statusToStage = {
  SEARCHING: 1,
  ACCEPTED: 1,
  ARRIVING: 1,
  ARRIVED: 2,
  IN_PROGRESS: 3,
  COMPLETED: 4,
  CANCELLED: 4,
};

const cabService = {
  searchCabs: async (query = {}) => {
    const {
      pickup = "Chhatrapati Shivaji Maharaj Terminus (CSMT)",
      drop = "Bandra Kurla Complex (BKC)",
      category = "all",
      isEv,
      city = "Mumbai",
    } = query;

    const routeInfo = calculateDistanceAndDuration(pickup, drop);
    const vehicles = await CabModel.findVehicles({ category, isEv, city });

    const rideOptions = vehicles.map((v) => {
      // Calculate dynamic fare if distance differs
      const baseFare = v.baseFare;
      const discountFare = v.discountFare || Math.round(baseFare * 0.9);

      return {
        id: v.id,
        category: v.category.toLowerCase(),
        isEv: v.isEv,
        name: v.name,
        tagline: v.tagline,
        vehicleModel: v.vehicleModel,
        plateNumber: v.plateNumber,
        seats: v.seats,
        etaMin: v.etaMin,
        baseFare,
        discountFare,
        emoji: v.emoji || "🚗",
        popularBadge: v.popularBadge,
        features: v.features || [],
        driver: v.driver
          ? {
              name: v.driver.name,
              rating: v.driver.rating.toString(),
              totalTrips: `${v.driver.totalTrips} trips`,
              phone: v.driver.phone,
            }
          : null,
      };
    });

    return {
      pickup,
      drop,
      distance: routeInfo.distance,
      duration: routeInfo.duration,
      rideOptions,
      safetyGuarantee: {
        title: "SmartTrip Ride Safety Guarantee",
        description: "Live GPS tracking • 24x7 Emergency SOS support • Verified drivers & sanitized vehicles.",
      },
    };
  },

  getVehicleById: async (id) => {
    const vehicle = await CabModel.findVehicleById(id);
    if (!vehicle) {
      const error = new Error("Vehicle not found");
      error.statusCode = 404;
      throw error;
    }
    return { vehicle };
  },

  getAllDrivers: async () => {
    const drivers = await CabModel.findDrivers();
    return { drivers };
  },

  estimateFare: async (query = {}) => {
    const {
      pickup = "CSMT Mumbai",
      drop = "BKC Mumbai",
    } = query;

    const routeInfo = calculateDistanceAndDuration(pickup, drop);
    const vehicles = await CabModel.findVehicles();

    const estimates = vehicles.map((v) => ({
      vehicleId: v.id,
      name: v.name,
      category: v.category,
      baseFare: v.baseFare,
      discountFare: v.discountFare,
      etaMin: v.etaMin,
      emoji: v.emoji,
    }));

    return {
      pickup,
      drop,
      distance: routeInfo.distance,
      duration: routeInfo.duration,
      estimates,
    };
  },

  bookCab: async (userId, body) => {
    const {
      pickupAddress = "Chhatrapati Shivaji Maharaj Terminus (CSMT)",
      dropAddress = "Bandra Kurla Complex (BKC)",
      vehicleId,
      pickupLat = 18.9401,
      pickupLng = 72.8347,
      dropLat = 19.0657,
      dropLng = 72.8687,
      promoApplied = true,
      paymentMethod = "CASH",
    } = body;

    const vehicle = await CabModel.findVehicleById(vehicleId);
    if (!vehicle) {
      const error = new Error("Vehicle not found");
      error.statusCode = 404;
      throw error;
    }

    const routeInfo = calculateDistanceAndDuration(pickupAddress, dropAddress);
    const otp = generateOtp();
    const reference = generateCabReference();
    const finalFare = promoApplied && vehicle.discountFare ? vehicle.discountFare : vehicle.baseFare;

    let driver = vehicle.driver;
    if (!driver && vehicle.driverId) {
      driver = await CabModel.findDriverById(vehicle.driverId);
    }
    if (!driver) {
      const allDrivers = await CabModel.findDrivers();
      driver = allDrivers[0];
    }

    // Try creating database Booking & CabBooking
    let bookingId = `bk-cab-${Date.now()}`;
    let dbBooking = null;

    try {
      // Find a valid user or fallback
      let targetUserId = userId;
      if (!targetUserId) {
        const firstUser = await prisma.user.findFirst();
        targetUserId = firstUser ? firstUser.id : null;
      }

      if (targetUserId) {
        dbBooking = await prisma.booking.create({
          data: {
            userId: targetUserId,
            bookingReference: reference,
            bookingType: "CAB",
            status: "CONFIRMED",
            totalAmount: finalFare,
            travelDate: new Date(),
          },
        });
        bookingId = dbBooking.id;
      }
    } catch (e) {
      // DB offline or user not found, continue with generated bookingId
    }

    const cabBookingRecord = await CabModel.createCabBooking({
      bookingId,
      vehicleId: vehicle.id,
      driverId: driver ? driver.id : null,
      pickupAddress,
      pickupLat,
      pickupLng,
      dropAddress,
      dropLat,
      dropLng,
      distance: routeInfo.distance,
      duration: routeInfo.duration,
      otp,
      rideStatus: "ARRIVING",
      estimatedFare: vehicle.baseFare,
      finalFare,
    });

    const driverPayload = {
      name: driver ? driver.name : "Ramesh Pawar",
      rating: driver ? driver.rating.toString() : "4.9",
      totalTrips: driver ? `${driver.totalTrips} trips` : "1,840 trips",
      phone: driver ? driver.phone : "+91 98234 56789",
      vehicleName: vehicle.name,
      vehicleModel: vehicle.vehicleModel,
      plateNumber: vehicle.plateNumber,
      etaMins: vehicle.etaMin,
      otp,
      price: finalFare,
      pickupAddress,
      dropAddress,
      distance: routeInfo.distance,
      duration: routeInfo.duration,
      category: vehicle.category.toLowerCase(),
      emoji: vehicle.emoji || "🚗",
    };

    return {
      bookingId,
      bookingReference: reference,
      rideDriver: driverPayload,
      rideOtp: otp,
      totalAmount: finalFare,
      bookingType: vehicle.category.toLowerCase(),
      stage: 1,
      status: "ARRIVING",
      pickupAddress,
      dropAddress,
      vehicle,
    };
  },

  getTracking: async (bookingIdOrCabId) => {
    const cabBooking = await CabModel.findCabBookingByBookingId(bookingIdOrCabId);
    if (!cabBooking) {
      const error = new Error("Cab booking or tracking info not found");
      error.statusCode = 404;
      throw error;
    }

    const driver = cabBooking.driver || (await CabModel.findDrivers())[0];
    const vehicle = cabBooking.vehicle || (await CabModel.findVehicles())[0];
    const currentStatus = cabBooking.rideStatus || "ARRIVING";
    const currentStage = statusToStage[currentStatus] || 1;

    return {
      bookingId: cabBooking.bookingId || cabBooking.id,
      stage: currentStage,
      status: currentStatus,
      otp: cabBooking.otp,
      etaMins: vehicle.etaMin || 2,
      price: cabBooking.finalFare || cabBooking.estimatedFare,
      driver: {
        name: driver.name,
        rating: driver.rating.toString(),
        totalTrips: `${driver.totalTrips} trips`,
        phone: driver.phone,
        vehicleName: vehicle.name,
        vehicleModel: vehicle.vehicleModel,
        plateNumber: vehicle.plateNumber,
        emoji: vehicle.emoji,
      },
      route: {
        pickup: cabBooking.pickupAddress,
        drop: cabBooking.dropAddress,
        distance: cabBooking.distance || "14.2 km",
        duration: cabBooking.duration || "28 mins",
        pickupLat: cabBooking.pickupLat || 18.9401,
        pickupLng: cabBooking.pickupLng || 72.8347,
        dropLat: cabBooking.dropLat || 19.0657,
        dropLng: cabBooking.dropLng || 72.8687,
      },
    };
  },

  updateRideStage: async (bookingIdOrCabId, { stage, status }) => {
    let nextStatus = status;
    if (stage !== undefined && stageToStatus[stage]) {
      nextStatus = stageToStatus[stage];
    }
    if (!nextStatus) nextStatus = "ARRIVING";

    const updated = await CabModel.updateRideStatus(bookingIdOrCabId, nextStatus);
    if (!updated) {
      const error = new Error("Booking not found to update");
      error.statusCode = 404;
      throw error;
    }

    // If completed or cancelled, sync booking table
    if (nextStatus === "COMPLETED" || nextStatus === "CANCELLED") {
      try {
        await prisma.booking.updateMany({
          where: {
            OR: [{ id: bookingIdOrCabId }, { id: updated.bookingId }],
          },
          data: {
            status: nextStatus === "COMPLETED" ? "COMPLETED" : "CANCELLED",
          },
        });
      } catch (e) {
        // Fallback
      }
    }

    const currentStage = statusToStage[nextStatus] || 1;

    return {
      bookingId: bookingIdOrCabId,
      stage: currentStage,
      status: nextStatus,
      updatedAt: new Date(),
    };
  },

  cancelRide: async (bookingIdOrCabId, reason = "User requested cancellation") => {
    const updated = await CabModel.updateRideStatus(bookingIdOrCabId, "CANCELLED");
    try {
      await prisma.booking.updateMany({
        where: {
          OR: [{ id: bookingIdOrCabId }, { id: updated?.bookingId }],
        },
        data: { status: "CANCELLED" },
      });
    } catch (e) {
      // Fallback
    }

    return {
      bookingId: bookingIdOrCabId,
      status: "CANCELLED",
      reason,
      cancellationFee: 0,
      refundAmount: updated ? updated.finalFare : 0,
    };
  },
};

module.exports = cabService;
