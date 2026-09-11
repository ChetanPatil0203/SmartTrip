const crypto = require("crypto");
const tripShareModel = require("../models/tripShareModel");
const { prisma } = require("../config/db");

// Token expiry: 7 days by default
const DEFAULT_EXPIRY_HOURS = 7 * 24;

// Generate cryptographically secure token
function generateShareToken() {
  return crypto.randomBytes(32).toString("hex"); // 64-char hex token
}

// -------------------------------------------------------
// SAFE PUBLIC SERIALIZER — never expose PII/payment
// -------------------------------------------------------
function serializeForPublic(booking) {
  const base = {
    bookingReference: booking.bookingReference,
    bookingType: booking.bookingType,
    status: booking.status,
    travelDate: booking.travelDate,
  };

  switch (booking.bookingType) {
    case "BUS": {
      const bb = booking.busBooking;
      const sched = bb?.schedule;
      const route = sched?.route;
      const bus = sched?.bus;
      return {
        ...base,
        operator: bus?.operator?.name || null,
        busNumber: bus?.busNumber || null,
        busType: bus?.busType || null,
        source: route?.source || null,
        destination: route?.destination || null,
        departureTime: sched?.departureTime || null,
        arrivalTime: sched?.arrivalTime || null,
        boardingPoint: bb?.boardingStop?.name || null,
        droppingPoint: bb?.droppingStop?.name || null,
      };
    }
    case "TRAIN": {
      const tb = booking.trainBooking;
      const sched = tb?.schedule;
      const train = sched?.train;
      const route = sched?.route;
      return {
        ...base,
        operator: train?.operator?.name || null,
        trainName: train?.trainName || null,
        trainNumber: train?.trainNumber || null,
        source: route?.source || null,
        destination: route?.destination || null,
        departureTime: sched?.departureTime || null,
        arrivalTime: sched?.arrivalTime || null,
        classCode: tb?.classCode || null,
      };
    }
    case "FLIGHT": {
      const fb = booking.flightBooking;
      const sched = fb?.schedule;
      const flight = sched?.flight;
      return {
        ...base,
        airline: flight?.airline?.name || null,
        flightNumber: flight?.flightNumber || null,
        departure: sched?.sourceAirport?.city || null,
        arrival: sched?.destinationAirport?.city || null,
        departureTime: sched?.departureTime || null,
        arrivalTime: sched?.arrivalTime || null,
      };
    }
    case "HOTEL": {
      const hb = booking.hotelBooking;
      return {
        ...base,
        hotelName: hb?.hotel?.name || null,
        hotelCity: hb?.hotel?.city || null,
        roomType: hb?.room?.roomType || null,
        checkIn: hb?.checkInDate || null,
        checkOut: hb?.checkOutDate || null,
      };
    }
    default:
      return base;
  }
}

const tripShareService = {
  // POST /api/trips/:bookingId/share
  createShare: async (bookingId, userId) => {
    // Verify booking ownership
    const booking = await prisma.booking.findFirst({
      where: { id: bookingId, userId },
    });
    if (!booking) {
      const err = new Error("Booking not found");
      err.statusCode = 404;
      throw err;
    }

    if (!["CONFIRMED", "PENDING", "COMPLETED"].includes(booking.status)) {
      const err = new Error("Only confirmed, pending, or completed bookings can be shared");
      err.statusCode = 400;
      err.errorCode = "BOOKING_NOT_SHAREABLE";
      throw err;
    }

    const shareToken = generateShareToken();
    const expiresAt = new Date(Date.now() + DEFAULT_EXPIRY_HOURS * 3600 * 1000);

    const share = await tripShareModel.create({ bookingId, userId, shareToken, expiresAt });

    return {
      shareId: share.id,
      token: share.shareToken,
      expiresAt: share.expiresAt,
      shareUrl: `/api/shared-trips/${share.shareToken}`,
    };
  },

  // GET /api/trips/:bookingId/shares
  getSharesByBooking: async (bookingId, userId) => {
    // Verify booking ownership first
    const booking = await prisma.booking.findFirst({ where: { id: bookingId, userId } });
    if (!booking) {
      const err = new Error("Booking not found");
      err.statusCode = 404;
      throw err;
    }

    const shares = await tripShareModel.findByBookingAndUser(bookingId, userId);
    const now = new Date();

    return {
      shares: shares.map((s) => ({
        shareId: s.id,
        token: s.shareToken,
        expiresAt: s.expiresAt,
        isExpired: s.expiresAt < now,
        createdAt: s.createdAt,
        shareUrl: `/api/shared-trips/${s.shareToken}`,
      })),
    };
  },

  // DELETE /api/trips/shares/:shareId
  revokeShare: async (shareId, userId) => {
    const share = await tripShareModel.findByIdAndUser(shareId, userId);
    if (!share) {
      const err = new Error("Share not found");
      err.statusCode = 404;
      throw err;
    }
    await tripShareModel.deleteById(shareId);
    return { revoked: true, shareId };
  },

  // GET /api/shared-trips/:token  — PUBLIC
  getPublicShare: async (token) => {
    if (!token || token.trim().length < 10) {
      const err = new Error("Invalid share token");
      err.statusCode = 404;
      throw err;
    }

    const share = await tripShareModel.findByToken(token.trim());

    if (!share) {
      const err = new Error("Share not found or has been revoked");
      err.statusCode = 404;
      throw err;
    }

    if (share.expiresAt < new Date()) {
      const err = new Error("This share link has expired");
      err.statusCode = 410;
      err.errorCode = "SHARE_EXPIRED";
      throw err;
    }

    const publicData = serializeForPublic(share.booking);
    return { trip: publicData };
  },
};

module.exports = tripShareService;
