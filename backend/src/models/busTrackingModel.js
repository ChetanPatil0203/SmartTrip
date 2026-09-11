const { prisma } = require("../config/db");

const busTrackingModel = {
  // Get the most recent tracking record for a schedule
  findLatest: async (scheduleId) => {
    return await prisma.busTracking.findFirst({
      where: { scheduleId },
      orderBy: { updatedAt: "desc" },
    });
  },

  // Get all tracking records for a schedule (history), paginated
  findHistory: async ({ scheduleId, skip = 0, take = 20 }) => {
    return await prisma.busTracking.findMany({
      where: { scheduleId },
      orderBy: { updatedAt: "desc" },
      skip,
      take,
    });
  },

  // Count tracking history records
  countHistory: async (scheduleId) => {
    return await prisma.busTracking.count({ where: { scheduleId } });
  },
};

const delayAlertModel = {
  // Get most recent delay alert for a schedule
  findLatest: async (scheduleId) => {
    return await prisma.delayAlert.findFirst({
      where: { scheduleId },
      orderBy: { createdAt: "desc" },
    });
  },

  // Get all delay alerts for a schedule (history), paginated
  findHistory: async ({ scheduleId, skip = 0, take = 20 }) => {
    return await prisma.delayAlert.findMany({
      where: { scheduleId },
      orderBy: { createdAt: "desc" },
      skip,
      take,
    });
  },

  // Count delay history records
  countHistory: async (scheduleId) => {
    return await prisma.delayAlert.count({ where: { scheduleId } });
  },

  // Create a new delay alert (internal/service-level use only)
  create: async ({ scheduleId, delayMinutes, message }) => {
    return await prisma.delayAlert.create({
      data: {
        scheduleId,
        delayMinutes,
        message: message || null,
      },
    });
  },
};

module.exports = { busTrackingModel, delayAlertModel };
