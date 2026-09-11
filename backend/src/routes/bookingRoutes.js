const express = require("express");
const {
  createBooking,
  getUserBookings,
  getBookingById,
  getBookingByReference,
} = require("../controllers/bookingController");
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

module.exports = router;
