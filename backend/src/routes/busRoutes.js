const express = require("express");
const {
  getOperators,
  getOperatorById,
  getRoutes,
  getRouteById,
  searchBuses,
  getScheduleById,
  getBusDetails,
  getSeatLayout,
  getBoardingPoints,
  getDroppingPoints,
  getLiveTracking,
  getDelayAlert,
} = require("../controllers/busController");
const {
  getTrackingHistory,
  getDelayHistory,
} = require("../controllers/busTrackingController");

const router = express.Router();

// ----------------------------------------------------
// 1. SPECIFIC RESOURCE ROUTES (MUST COME BEFORE /:scheduleId)
// ----------------------------------------------------

// Bus Operators
router.get("/operators", getOperators);
router.get("/operators/:id", getOperatorById);

// Bus Routes
router.get("/routes", getRoutes);
router.get("/routes/:id", getRouteById);

// Bus Search
router.get("/search", searchBuses);

// Bus Schedule Lookup
router.get("/schedules/:id", getScheduleById);

// ----------------------------------------------------
// 2. DYNAMIC SCHEDULE ROUTES (/:scheduleId)
// ----------------------------------------------------

router.get("/:scheduleId/seats", getSeatLayout);
router.get("/:scheduleId/boarding-points", getBoardingPoints);
router.get("/:scheduleId/dropping-points", getDroppingPoints);
// MUST come BEFORE /:scheduleId/tracking to prevent route conflict
router.get("/:scheduleId/tracking/history", getTrackingHistory);
router.get("/:scheduleId/tracking", getLiveTracking);

// MUST come BEFORE /:scheduleId/delay to prevent route conflict
router.get("/:scheduleId/delay/history", getDelayHistory);
router.get("/:scheduleId/delay", getDelayAlert);

// Bus Details (Matches GET /api/buses/:scheduleId)
router.get("/:scheduleId", getBusDetails);

module.exports = router;
