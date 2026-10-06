const { prisma } = require("../config/db");
const crypto = require("crypto");

// Default initial data for seeding & offline resilience
const DEFAULT_DRIVERS = [
  {
    id: "driver-ramesh",
    name: "Ramesh Pawar",
    phone: "+91 98234 56789",
    rating: 4.9,
    totalTrips: 1840,
    avatar: "👨🏽‍✈️",
    isAvailable: true,
    currentLat: 18.9401,
    currentLng: 72.8347,
  },
  {
    id: "driver-amit",
    name: "Amit Shinde",
    phone: "+91 98234 12345",
    rating: 4.9,
    totalTrips: 920,
    avatar: "👨🏽‍✈️",
    isAvailable: true,
    currentLat: 18.9415,
    currentLng: 72.8360,
  },
  {
    id: "driver-sanjay",
    name: "Sanjay Gaikwad",
    phone: "+91 98198 76543",
    rating: 4.8,
    totalTrips: 1420,
    avatar: "👨🏽‍✈️",
    isAvailable: true,
    currentLat: 18.9430,
    currentLng: 72.8355,
  },
  {
    id: "driver-rajesh",
    name: "Rajesh More",
    phone: "+91 98200 11223",
    rating: 4.9,
    totalTrips: 2150,
    avatar: "👨🏽‍✈️",
    isAvailable: true,
    currentLat: 18.9390,
    currentLng: 72.8330,
  },
  {
    id: "driver-vikram",
    name: "Vikram Patil",
    phone: "+91 98211 22334",
    rating: 4.9,
    totalTrips: 3400,
    avatar: "👨🏽‍✈️",
    isAvailable: true,
    currentLat: 18.9445,
    currentLng: 72.8375,
  },
];

const DEFAULT_VEHICLES = [
  {
    id: "auto-std",
    driverId: "driver-ramesh",
    name: "Smart Auto",
    tagline: "Affordable, quick city commute",
    category: "AUTO",
    vehicleModel: "Bajaj RE / TVS King",
    plateNumber: "MH 01 AB 4321",
    seats: 3,
    isEv: false,
    emoji: "🛺",
    popularBadge: "MOST POPULAR",
    features: ["No bargaining", "Pocket friendly", "Direct pickup"],
    baseFare: 95,
    perKmRate: 15.0,
    discountFare: 80,
    etaMin: 2,
    city: "Mumbai",
  },
  {
    id: "auto-ev",
    driverId: "driver-amit",
    name: "Smart Auto EV",
    tagline: "100% Electric, silent & eco-friendly",
    category: "AUTO",
    vehicleModel: "Mahindra Treo / Piaggio Ape E",
    plateNumber: "MH 03 EV 1209",
    seats: 3,
    isEv: true,
    emoji: "⚡🛺",
    popularBadge: "GREEN RIDE",
    features: ["Zero emissions", "Quiet ride", "Clean vehicle"],
    baseFare: 105,
    perKmRate: 14.0,
    discountFare: 90,
    etaMin: 3,
    city: "Mumbai",
  },
  {
    id: "cab-mini",
    driverId: "driver-sanjay",
    name: "Smart Cab Mini",
    tagline: "Everyday pocket-friendly AC rides",
    category: "CAB",
    vehicleModel: "Maruti WagonR / Tata Tiago",
    plateNumber: "MH 02 CE 8976",
    seats: 4,
    isEv: false,
    emoji: "🚗",
    popularBadge: null,
    features: ["Compact AC", "Trained driver", "Boot space for 2 bags"],
    baseFare: 195,
    perKmRate: 18.0,
    discountFare: 175,
    etaMin: 4,
    city: "Mumbai",
  },
  {
    id: "cab-sedan",
    driverId: "driver-rajesh",
    name: "Prime Sedan",
    tagline: "Comfortable spacious sedans & top drivers",
    category: "SEDAN",
    vehicleModel: "Maruti Dzire / Honda Amaze",
    plateNumber: "MH 02 CD 4589",
    seats: 4,
    isEv: false,
    emoji: "🚘",
    popularBadge: "TOP RATED",
    features: ["Extra legroom", "Top 5★ drivers", "Large boot space"],
    baseFare: 265,
    perKmRate: 22.0,
    discountFare: 240,
    etaMin: 3,
    city: "Mumbai",
  },
  {
    id: "cab-suv",
    driverId: "driver-vikram",
    name: "Prime SUV / XL",
    tagline: "Spacious 6-seater for group & heavy luggage",
    category: "SUV",
    vehicleModel: "Maruti Ertiga / Toyota Innova",
    plateNumber: "MH 04 DX 5432",
    seats: 6,
    isEv: false,
    emoji: "🚙",
    popularBadge: "6 SEATER",
    features: ["6 Passenger seats", "Maximum luggage", "AC in all rows"],
    baseFare: 420,
    perKmRate: 28.0,
    discountFare: 385,
    etaMin: 6,
    city: "Mumbai",
  },
];

// Fallback in-memory booking store
const inMemoryBookings = new Map();

const parseFeatures = (features) => {
  if (!features) return [];
  if (Array.isArray(features)) return features;
  try {
    return JSON.parse(features);
  } catch (e) {
    return features.split(",").map((s) => s.trim());
  }
};

const CabModel = {
  findVehicles: async ({ category, isEv, city } = {}) => {
    try {
      const where = { isActive: true };
      if (category && category !== "all") {
        where.category = category.toUpperCase();
      }
      if (isEv !== undefined) {
        where.isEv = isEv === true || isEv === "true";
      }
      if (city) {
        where.city = { contains: city };
      }

      const vehicles = await prisma.cabVehicle.findMany({
        where,
        include: { driver: true },
        orderBy: [{ etaMin: "asc" }, { baseFare: "asc" }],
      });

      if (vehicles && vehicles.length > 0) {
        return vehicles.map((v) => ({
          ...v,
          features: parseFeatures(v.features),
        }));
      }
    } catch (e) {
      // Graceful fallback to default in-memory vehicles
    }

    // Filter from default list
    return DEFAULT_VEHICLES.filter((v) => {
      if (category && category !== "all") {
        const cat = category.toUpperCase();
        if (cat === "AUTO" && v.category !== "AUTO") return false;
        if (cat === "CAB" && v.category !== "CAB" && v.category !== "SEDAN" && v.category !== "SUV") return false;
        if (cat !== "AUTO" && cat !== "CAB" && v.category !== cat) return false;
      }
      if (isEv !== undefined) {
        const wantEv = isEv === true || isEv === "true";
        if (v.isEv !== wantEv) return false;
      }
      return true;
    }).map((v) => {
      const driver = DEFAULT_DRIVERS.find((d) => d.id === v.driverId) || DEFAULT_DRIVERS[0];
      return {
        ...v,
        driver,
        features: parseFeatures(v.features),
      };
    });
  },

  findVehicleById: async (id) => {
    try {
      const vehicle = await prisma.cabVehicle.findUnique({
        where: { id },
        include: { driver: true },
      });
      if (vehicle) {
        return {
          ...vehicle,
          features: parseFeatures(vehicle.features),
        };
      }
    } catch (e) {
      // Fallback
    }

    const fallback = DEFAULT_VEHICLES.find((v) => v.id === id);
    if (!fallback) return null;
    const driver = DEFAULT_DRIVERS.find((d) => d.id === fallback.driverId) || DEFAULT_DRIVERS[0];
    return {
      ...fallback,
      driver,
      features: parseFeatures(fallback.features),
    };
  },

  findDrivers: async () => {
    try {
      const drivers = await prisma.cabDriver.findMany({
        where: { isAvailable: true },
        include: { vehicles: true },
      });
      if (drivers && drivers.length > 0) return drivers;
    } catch (e) {
      // Fallback
    }
    return DEFAULT_DRIVERS;
  },

  findDriverById: async (id) => {
    try {
      const driver = await prisma.cabDriver.findUnique({
        where: { id },
        include: { vehicles: true },
      });
      if (driver) return driver;
    } catch (e) {
      // Fallback
    }
    return DEFAULT_DRIVERS.find((d) => d.id === id) || null;
  },

  createCabBooking: async (bookingData) => {
    try {
      // Try DB insertion if prisma and tables are available
      const created = await prisma.cabBooking.create({
        data: {
          bookingId: bookingData.bookingId,
          vehicleId: bookingData.vehicleId,
          driverId: bookingData.driverId,
          pickupAddress: bookingData.pickupAddress,
          pickupLat: bookingData.pickupLat || null,
          pickupLng: bookingData.pickupLng || null,
          dropAddress: bookingData.dropAddress,
          dropLat: bookingData.dropLat || null,
          dropLng: bookingData.dropLng || null,
          distance: bookingData.distance,
          duration: bookingData.duration,
          otp: bookingData.otp,
          rideStatus: bookingData.rideStatus || "ARRIVING",
          estimatedFare: bookingData.estimatedFare,
          finalFare: bookingData.finalFare || bookingData.estimatedFare,
        },
        include: {
          booking: true,
          vehicle: true,
          driver: true,
        },
      });
      return created;
    } catch (e) {
      // In-memory fallback
      const inMemRecord = {
        id: `cab-bk-${Date.now()}`,
        ...bookingData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      inMemoryBookings.set(bookingData.bookingId, inMemRecord);
      inMemoryBookings.set(inMemRecord.id, inMemRecord);
      return inMemRecord;
    }
  },

  findCabBookingByBookingId: async (bookingId) => {
    try {
      const record = await prisma.cabBooking.findFirst({
        where: {
          OR: [{ bookingId }, { id: bookingId }],
        },
        include: {
          booking: {
            include: { user: true },
          },
          vehicle: true,
          driver: true,
        },
      });
      if (record) return record;
    } catch (e) {
      // Fallback
    }
    return inMemoryBookings.get(bookingId) || null;
  },

  updateRideStatus: async (bookingIdOrCabId, rideStatus, extra = {}) => {
    try {
      const record = await prisma.cabBooking.findFirst({
        where: {
          OR: [{ bookingId: bookingIdOrCabId }, { id: bookingIdOrCabId }],
        },
      });
      if (record) {
        return await prisma.cabBooking.update({
          where: { id: record.id },
          data: {
            rideStatus,
            ...(extra.finalFare ? { finalFare: extra.finalFare } : {}),
          },
          include: {
            booking: true,
            vehicle: true,
            driver: true,
          },
        });
      }
    } catch (e) {
      // Fallback
    }

    const mem = inMemoryBookings.get(bookingIdOrCabId);
    if (mem) {
      mem.rideStatus = rideStatus;
      if (extra.finalFare) mem.finalFare = extra.finalFare;
      mem.updatedAt = new Date();
      return mem;
    }
    return null;
  },
};

module.exports = CabModel;
