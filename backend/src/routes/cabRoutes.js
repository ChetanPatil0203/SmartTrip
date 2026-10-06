const express = require("express");
const {
  searchCabs,
  getVehicleById,
  getAllDrivers,
  estimateFare,
  bookCab,
  getTracking,
  updateRideStage,
  cancelRide,
} = require("../controllers/cabController");
const jwt = require("jsonwebtoken");
const config = require("../config/env");

const router = express.Router();

// Optional Auth middleware (populates req.user if Bearer token is provided, without rejecting if not)
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, config.jwtSecret);
      req.user = {
        id: decoded.id || decoded.userId,
        userId: decoded.id || decoded.userId,
        role: decoded.role || "USER",
      };
    } catch (e) {
      // Token invalid or expired; proceed as guest
    }
  }
  next();
};

// ----------------------------------------------------
// CAB & TAXI ROUTES
// ----------------------------------------------------

// Search available cabs/taxis (GET /api/cabs or /api/cabs/search)
router.get("/", searchCabs);
router.get("/search", searchCabs);

// Fare estimate (GET /api/cabs/estimate)
router.get("/estimate", estimateFare);

// Available drivers (GET /api/cabs/drivers)
router.get("/drivers", getAllDrivers);

// Vehicle details by ID (GET /api/cabs/vehicles/:id)
router.get("/vehicles/:id", getVehicleById);

// Book a cab / taxi (POST /api/cabs/book)
router.post("/book", optionalAuth, bookCab);

// Get Live Ride Tracking (GET /api/cabs/tracking/:bookingId)
router.get("/tracking/:bookingId", getTracking);

// Update Ride Status / Stage (PATCH or POST /api/cabs/tracking/:bookingId/status)
router.patch("/tracking/:bookingId/status", updateRideStage);
router.post("/tracking/:bookingId/status", updateRideStage);

// Cancel Cab Ride (POST /api/cabs/tracking/:bookingId/cancel)
router.post("/tracking/:bookingId/cancel", cancelRide);

module.exports = router;
