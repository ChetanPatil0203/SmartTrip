const express = require("express");
const {
  getOperators,
  getOperatorById,
  getStations,
  getStationById,
  getRoutes,
  getRouteById,
  searchTrains,
  getScheduleById,
  getTrainDetails,
  getTrainClasses,
  getTrainSeats,
} = require("../controllers/trainController");

const router = express.Router();

// ----------------------------------------------------
// 1. SPECIFIC RESOURCE ROUTES (MUST COME BEFORE /:scheduleId)
// ----------------------------------------------------

// Train Operators
router.get("/operators", getOperators);
router.get("/operators/:id", getOperatorById);

// Train Stations
router.get("/stations", getStations);
router.get("/stations/:id", getStationById);

// Train Routes
router.get("/routes", getRoutes);
router.get("/routes/:id", getRouteById);

// Train Search
router.get("/search", searchTrains);

// Train Schedule Lookup
router.get("/schedules/:id", getScheduleById);

// ----------------------------------------------------
// 2. DYNAMIC SCHEDULE ROUTES (/:scheduleId)
// ----------------------------------------------------

router.get("/:scheduleId/classes", getTrainClasses);
router.get("/:scheduleId/seats", getTrainSeats);

// Train Details (Matches GET /api/trains/:scheduleId)
router.get("/:scheduleId", getTrainDetails);

module.exports = router;
