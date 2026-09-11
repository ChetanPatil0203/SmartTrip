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

// Create Payment Order (POST /api/payments/create-order and /api/payments/initiate)
router.post("/create-order", authMiddleware, createOrder);
router.post("/initiate", authMiddleware, createOrder);

// Verify Payment (POST /api/payments/verify)
router.post("/verify", authMiddleware, verifyPayment);

// Get Payment by Booking ID (GET /api/payments/booking/:bookingId and GET /api/payments/:bookingId)
router.get("/booking/:bookingId", authMiddleware, getPaymentByBooking);
router.get("/:bookingId", authMiddleware, getPaymentByBooking);

module.exports = router;
