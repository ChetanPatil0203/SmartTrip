const express = require("express");
const { validateCoupon } = require("../controllers/couponController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// POST /api/coupons/validate — JWT REQUIRED
router.post("/validate", authMiddleware, validateCoupon);

module.exports = router;
