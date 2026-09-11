const express = require("express");
const {
  cancelBooking,
  getUserCancellations,
  getCancellationByBookingId,
  getRefundStatus,
  processRefund,
  getCancellationById,
} = require("../controllers/cancellationController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// ----------------------------------------------------
// ALL CANCELLATION ROUTES REQUIRE JWT AUTH
// ----------------------------------------------------

// Request Cancellation (POST /api/cancellations)
router.post("/", authMiddleware, cancelBooking);

// Get All User Cancellations (GET /api/cancellations)
router.get("/", authMiddleware, getUserCancellations);

// Get Cancellation by Booking ID (GET /api/cancellations/booking/:bookingId)
// MUST COME BEFORE /:id TO AVOID ROUTE CONFLICT
router.get("/booking/:bookingId", authMiddleware, getCancellationByBookingId);

// Get Refund Status by Booking ID (GET /api/cancellations/refund/:bookingId)
// MUST COME BEFORE /:id TO AVOID ROUTE CONFLICT
router.get("/refund/:bookingId", authMiddleware, getRefundStatus);

// Process/Simulate Refund (PATCH /api/cancellations/refund/:refundId/process)
router.patch("/refund/:refundId/process", authMiddleware, processRefund);

// Get Cancellation by ID (GET /api/cancellations/:id)
router.get("/:id", authMiddleware, getCancellationById);

module.exports = router;
