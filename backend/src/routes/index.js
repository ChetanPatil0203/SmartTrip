const express = require("express");
const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const busRoutes = require("./busRoutes");
const trainRoutes = require("./trainRoutes");
const flightRoutes = require("./flightRoutes");
const hotelRoutes = require("./hotelRoutes");
const bookingRoutes = require("./bookingRoutes");
const paymentRoutes = require("./paymentRoutes");
const cancellationRoutes = require("./cancellationRoutes");
const notificationRoutes = require("./notificationRoutes");
const offerRoutes = require("./offerRoutes");
const couponRoutes = require("./couponRoutes");
const tripShareRoutes = require("./tripShareRoutes");
const sharedTripRoutes = require("./sharedTripRoutes");
const safetyRoutes = require("./safetyRoutes");
const supportRoutes = require("./supportRoutes");
const reviewRoutes = require("./reviewRoutes");
const { prisma } = require("../config/db");

const router = express.Router();

// GET /api/health
router.get("/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return res.status(200).json({
      success: true,
      message: "SmartTrip API is running",
      database: "connected",
    });
  } catch (error) {
    return res.status(200).json({
      success: true,
      message: "SmartTrip API is running",
      database: "disconnected",
    });
  }
});

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/buses", busRoutes);
router.use("/trains", trainRoutes);
router.use("/flights", flightRoutes);
router.use("/hotels", hotelRoutes);
router.use("/bookings", bookingRoutes);
router.use("/payments", paymentRoutes);
router.use("/cancellations", cancellationRoutes);
router.use("/notifications", notificationRoutes);
router.use("/offers", offerRoutes);
router.use("/coupons", couponRoutes);
router.use("/trips", tripShareRoutes);
router.use("/shared-trips", sharedTripRoutes);
router.use("/safety", safetyRoutes);
router.use("/support", supportRoutes);
router.use("/reviews", reviewRoutes);

module.exports = router;
