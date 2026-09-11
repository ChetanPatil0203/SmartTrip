const express = require("express");
const {
  createBooking,
  getUserBookings,
  getBookingById,
  getBookingByReference,
} = require("../controllers/bookingController");
const {
  getTrackingByBooking,
  getDelayByBooking,
} = require("../controllers/busTrackingController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// ----------------------------------------------------
// PROTECTED BOOKING ROUTES (JWT AUTH REQUIRED)
// ----------------------------------------------------

// Create Universal Booking (POST /api/bookings)
router.post("/", authMiddleware, createBooking);

// Get Authenticated User Bookings (GET /api/bookings)
router.get("/", authMiddleware, getUserBookings);

// Get Booking by Reference (GET /api/bookings/reference/:reference)
// MUST COME BEFORE GET /:id TO PREVENT ROUTE AMBIGUITY
router.get("/reference/:reference", authMiddleware, getBookingByReference);

// Get Booking by ID (GET /api/bookings/:id)
router.get("/:id", authMiddleware, getBookingById);

// ----------------------------------------------------
// PHASE 13: BUS TRACKING + DELAY (BOOKING-SPECIFIC)
// ----------------------------------------------------

// GET /api/bookings/:bookingId/tracking — JWT required, BUS bookings only
router.get("/:bookingId/tracking", authMiddleware, getTrackingByBooking);

// GET /api/bookings/:bookingId/delay — JWT required, BUS bookings only
router.get("/:bookingId/delay", authMiddleware, getDelayByBooking);

module.exports = router;
