const express = require("express");
const {
  getAirlines,
  getAirlineById,
  getAirports,
  getAirportById,
  searchFlights,
  getScheduleById,
  getFlightDetails,
  getFlightSeats,
  getFlightAddons,
} = require("../controllers/flightController");

const router = express.Router();

// ----------------------------------------------------
// 1. SPECIFIC RESOURCE ROUTES (MUST COME BEFORE /:scheduleId)
// ----------------------------------------------------

// Airlines
router.get("/airlines", getAirlines);
router.get("/airlines/:id", getAirlineById);

// Airports
router.get("/airports", getAirports);
router.get("/airports/:id", getAirportById);

// Flight Search (Matches GET /api/flights/search)
router.get("/search", searchFlights);

// Flight Schedule Lookup (Matches GET /api/flights/schedules/:id)
router.get("/schedules/:id", getScheduleById);

// ----------------------------------------------------
// 2. DYNAMIC SCHEDULE ROUTES (/:scheduleId)
// ----------------------------------------------------

router.get("/:scheduleId/seats", getFlightSeats);
router.get("/:scheduleId/addons", getFlightAddons);

// Flight Details (Matches GET /api/flights/:scheduleId)
router.get("/:scheduleId", getFlightDetails);

module.exports = router;
