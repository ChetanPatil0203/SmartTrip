const { busTrackingModel, delayAlertModel } = require("../models/busTrackingModel");
const { prisma } = require("../config/db");
const { createDelayNotification } = require("./notificationService");

// -------------------------------------------------------
// HELPERS
// -------------------------------------------------------

// Derive tracking status from schedule + tracking data
function deriveTrackingStatus(schedule, tracking) {
  if (!tracking) return "UNAVAILABLE";
  if (schedule.status === "COMPLETED") return "COMPLETED";
  if (schedule.status === "CANCELLED") return "CANCELLED";
  if (schedule.status === "DELAYED") return "DELAYED";
  return "IN_TRANSIT";
}

// Format a tracking record for the response
function formatTracking(tracking, schedule) {
  if (!tracking) {
    return { available: false, message: "Live tracking is currently unavailable" };
  }
  return {
    available: true,
    status: deriveTrackingStatus(schedule, tracking),
    latitude: tracking.latitude,
    longitude: tracking.longitude,
    speed: tracking.speed,
    currentLocation: tracking.currentLocation,
    estimatedArrival: tracking.estimatedArrival || null,
    lastUpdatedAt: tracking.updatedAt,
  };
}

// Format a delay alert for response
function formatDelay(delay) {
  if (!delay) return { available: false, message: "No delay reported" };
  return {
    available: true,
    delayMinutes: delay.delayMinutes,
    message: delay.message,
    reportedAt: delay.createdAt,
  };
}

// Resolve BusBooking → schedule, then validate ownership
async function resolveBookingForTracking(bookingId, userId) {
  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, userId },
    include: {
      busBooking: { include: { schedule: true } },
    },
  });

  if (!booking) {
    const err = new Error("Booking not found");
    err.statusCode = 404;
    throw err;
  }

  if (booking.bookingType !== "BUS") {
    const err = new Error("This endpoint is only available for bus bookings");
    err.statusCode = 400;
    err.errorCode = "NOT_BUS_BOOKING";
    throw err;
  }

  if (!booking.busBooking) {
    const err = new Error("Bus booking details not found");
    err.statusCode = 404;
    throw err;
  }

  return booking;
}

// -------------------------------------------------------
// TRACKING SERVICE
// -------------------------------------------------------

const busTrackingService = {
  // GET /api/buses/:scheduleId/tracking  (existing Phase 4 — now uses model layer)
  getTrackingBySchedule: async (scheduleId) => {
    const schedule = await prisma.busSchedule.findUnique({ where: { id: scheduleId } });
    if (!schedule) {
      const err = new Error("Bus schedule not found");
      err.statusCode = 404;
      throw err;
    }

    const tracking = await busTrackingModel.findLatest(scheduleId);
    return formatTracking(tracking, schedule);
  },

  // GET /api/bookings/:bookingId/tracking  (Phase 13 — JWT + ownership)
  getTrackingByBooking: async (bookingId, userId) => {
    const booking = await resolveBookingForTracking(bookingId, userId);
    const schedule = booking.busBooking.schedule;
    const tracking = await busTrackingModel.findLatest(schedule.id);
    return {
      bookingReference: booking.bookingReference,
      ...formatTracking(tracking, schedule),
    };
  },

  // GET /api/buses/:scheduleId/tracking/history  (Phase 13 — paginated history)
  getTrackingHistory: async (scheduleId, query) => {
    const schedule = await prisma.busSchedule.findUnique({ where: { id: scheduleId } });
    if (!schedule) {
      const err = new Error("Bus schedule not found");
      err.statusCode = 404;
      throw err;
    }

    const pageNum = Math.max(1, parseInt(query.page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(query.limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const [records, totalCount] = await Promise.all([
      busTrackingModel.findHistory({ scheduleId, skip, take: limitNum }),
      busTrackingModel.countHistory(scheduleId),
    ]);

    const totalPages = Math.ceil(totalCount / limitNum) || 0;

    return {
      scheduleId,
      pagination: { page: pageNum, limit: limitNum, total: totalCount, totalPages },
      history: records.map((r) => ({
        id: r.id,
        latitude: r.latitude,
        longitude: r.longitude,
        speed: r.speed,
        currentLocation: r.currentLocation,
        estimatedArrival: r.estimatedArrival,
        updatedAt: r.updatedAt,
      })),
    };
  },
};

// -------------------------------------------------------
// DELAY ALERT SERVICE
// -------------------------------------------------------

const delayAlertService = {
  // GET /api/buses/:scheduleId/delay  (existing Phase 4)
  getDelayBySchedule: async (scheduleId) => {
    const schedule = await prisma.busSchedule.findUnique({ where: { id: scheduleId } });
    if (!schedule) {
      const err = new Error("Bus schedule not found");
      err.statusCode = 404;
      throw err;
    }

    const delay = await delayAlertModel.findLatest(scheduleId);
    return formatDelay(delay);
  },

  // GET /api/bookings/:bookingId/delay  (Phase 13 — JWT + ownership)
  getDelayByBooking: async (bookingId, userId) => {
    const booking = await resolveBookingForTracking(bookingId, userId);
    const scheduleId = booking.busBooking.scheduleId;
    const delay = await delayAlertModel.findLatest(scheduleId);
    return {
      bookingReference: booking.bookingReference,
      ...formatDelay(delay),
    };
  },

  // GET /api/buses/:scheduleId/delay/history  (Phase 13 — paginated history)
  getDelayHistory: async (scheduleId, query) => {
    const schedule = await prisma.busSchedule.findUnique({ where: { id: scheduleId } });
    if (!schedule) {
      const err = new Error("Bus schedule not found");
      err.statusCode = 404;
      throw err;
    }

    const pageNum = Math.max(1, parseInt(query.page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(query.limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const [records, totalCount] = await Promise.all([
      delayAlertModel.findHistory({ scheduleId, skip, take: limitNum }),
      delayAlertModel.countHistory(scheduleId),
    ]);

    const totalPages = Math.ceil(totalCount / limitNum) || 0;

    return {
      scheduleId,
      pagination: { page: pageNum, limit: limitNum, total: totalCount, totalPages },
      history: records.map((r) => ({
        id: r.id,
        delayMinutes: r.delayMinutes,
        message: r.message,
        createdAt: r.createdAt,
      })),
    };
  },

  // INTERNAL: Create delay alert + notify affected passengers
  // NOT exposed as a public endpoint — called internally/admin only
  createDelayAlert: async ({ scheduleId, delayMinutes, message }) => {
    if (!scheduleId) throw new Error("scheduleId is required");
    if (typeof delayMinutes !== "number" || delayMinutes < 0) {
      throw new Error("delayMinutes must be a non-negative number");
    }

    const schedule = await prisma.busSchedule.findUnique({ where: { id: scheduleId } });
    if (!schedule) {
      const err = new Error("Bus schedule not found");
      err.statusCode = 404;
      throw err;
    }

    // Create delay alert
    const alert = await delayAlertModel.create({ scheduleId, delayMinutes, message });

    // Update schedule status to DELAYED
    await prisma.busSchedule.update({
      where: { id: scheduleId },
      data: { status: "DELAYED" },
    });

    // Notify all passengers with confirmed bus bookings on this schedule (non-blocking)
    try {
      const affectedBookings = await prisma.busBooking.findMany({
        where: { scheduleId },
        include: {
          booking: { select: { userId: true, bookingReference: true, status: true } },
        },
      });

      const confirmedBookings = affectedBookings.filter(
        (b) => b.booking.status === "CONFIRMED"
      );

      for (const b of confirmedBookings) {
        createDelayNotification(b.booking.userId, b.booking, delayMinutes).catch(() => {});
      }
    } catch (_) {
      // Notification failure must never break alert creation
    }

    return { alert, affectedPassengersNotified: true };
  },
};

module.exports = { busTrackingService, delayAlertService };
