const express = require("express");
const { planTrip, supportChat } = require("../controllers/aiController");

const router = express.Router();

// POST /api/ai/plan-trip
router.post("/plan-trip", planTrip);

// POST /api/ai/support-chat
router.post("/support-chat", supportChat);

module.exports = router;
