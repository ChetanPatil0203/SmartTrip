const express = require("express");
const {
  createOrder,
  verifyPayment,
  getPaymentById,
  getPaymentByBooking,
} = require("../controllers/paymentController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// ----------------------------------------------------
// PROTECTED PAYMENT ROUTES (JWT AUTH REQUIRED)
// ----------------------------------------------------

// Create Payment Order (POST /api/payments/create-order)
router.post("/create-order", authMiddleware, createOrder);

// Verify Payment (POST /api/payments/verify)
router.post("/verify", authMiddleware, verifyPayment);

// Get Payment by Booking ID (GET /api/payments/booking/:bookingId)
// MUST COME BEFORE GET /:id TO PREVENT ROUTE AMBIGUITY
router.get("/booking/:bookingId", authMiddleware, getPaymentByBooking);

// Get Payment by ID (GET /api/payments/:id)
router.get("/:id", authMiddleware, getPaymentById);

module.exports = router;
