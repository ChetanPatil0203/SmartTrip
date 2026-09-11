const express = require("express");
const { createReport, getUserReports, getReportById } = require("../controllers/safetyController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// ALL SAFETY ROUTES — JWT REQUIRED

// POST /api/safety/reports
router.post("/reports", authMiddleware, createReport);

// GET /api/safety/reports — BEFORE /:id
router.get("/reports", authMiddleware, getUserReports);

// GET /api/safety/reports/:id
router.get("/reports/:id", authMiddleware, getReportById);

module.exports = router;
