const express = require("express");
const { createShare, getSharesByBooking, revokeShare } = require("../controllers/tripShareController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// ALL TRIP SHARE ROUTES — JWT REQUIRED
// -------------------------------------------------------

// Static route: DELETE /api/trips/shares/:shareId — BEFORE /:bookingId
router.delete("/shares/:shareId", authMiddleware, revokeShare);

// POST /api/trips/:bookingId/share — Create share for a booking
router.post("/:bookingId/share", authMiddleware, createShare);

// GET /api/trips/:bookingId/shares — List shares for a booking
router.get("/:bookingId/shares", authMiddleware, getSharesByBooking);

module.exports = router;
