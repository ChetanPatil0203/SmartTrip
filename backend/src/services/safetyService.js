const safetyModel = require("../models/safetyModel");
const { prisma } = require("../config/db");
const { createSystemNotification } = require("./notificationService");

// Valid safety report types (since schema uses String, define allowed values)
const VALID_SAFETY_TYPES = [
  "SOS_EMERGENCY",
  "ACCIDENT",
  "HARASSMENT",
  "THEFT",
  "VEHICLE_ISSUE",
  "DRIVER_BEHAVIOR",
  "ROAD_CONDITION",
  "MEDICAL_EMERGENCY",
  "OTHER",
];

const safetyService = {
  // POST /api/safety/reports
  createReport: async ({ userId, bookingId, type, description }) => {
    // Validate type
    const normType = (type || "").trim().toUpperCase();
    if (!VALID_SAFETY_TYPES.includes(normType)) {
      const err = new Error(`Invalid report type. Allowed: ${VALID_SAFETY_TYPES.join(", ")}`);
      err.statusCode = 400;
      err.errorCode = "INVALID_REPORT_TYPE";
      throw err;
    }

    // Validate description
    let trimDesc = (description || "").trim();
    if (!trimDesc && normType === "SOS_EMERGENCY") {
      trimDesc = "Emergency SOS triggered by passenger";
    }
    if (!trimDesc || trimDesc.length < 5) {
      const err = new Error("Description must be at least 5 characters");
      err.statusCode = 400;
      err.errorCode = "DESCRIPTION_TOO_SHORT";
      throw err;
    }
    if (trimDesc.length > 2000) {
      const err = new Error("Description must not exceed 2000 characters");
      err.statusCode = 400;
      err.errorCode = "DESCRIPTION_TOO_LONG";
      throw err;
    }

    // If bookingId provided, validate ownership
    if (bookingId) {
      const booking = await prisma.booking.findFirst({ where: { id: bookingId, userId } });
      if (!booking) {
        const err = new Error("Booking not found or does not belong to you");
        err.statusCode = 404;
        err.errorCode = "BOOKING_NOT_FOUND";
        throw err;
      }
    }

    const report = await safetyModel.create({
      userId,
      bookingId: bookingId || null,
      type: normType,
      description: trimDesc,
    });

    // Non-blocking notification
    createSystemNotification(
      userId,
      "Safety Report Submitted",
      "Your safety report has been submitted successfully. Our team will review it shortly."
    ).catch(() => {});

    return {
      report: {
        id: report.id,
        type: report.type,
        description: report.description,
        status: report.status,
        bookingId: report.bookingId,
        createdAt: report.createdAt,
      },
    };
  },

  // GET /api/safety/reports
  getUserReports: async (userId, query) => {
    const pageNum = Math.max(1, parseInt(query.page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(query.limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const [reports, totalCount] = await Promise.all([
      safetyModel.findUserReports({ userId, skip, take: limitNum }),
      safetyModel.countUserReports(userId),
    ]);

    const totalPages = Math.ceil(totalCount / limitNum) || 0;

    return {
      pagination: { page: pageNum, limit: limitNum, total: totalCount, totalPages },
      reports,
    };
  },

  // GET /api/safety/reports/:id
  getReportById: async (id, userId) => {
    const report = await safetyModel.findByIdAndUser(id, userId);
    if (!report) {
      const err = new Error("Safety report not found");
      err.statusCode = 404;
      throw err;
    }
    return { report };
  },

  VALID_SAFETY_TYPES,
};

module.exports = safetyService;
