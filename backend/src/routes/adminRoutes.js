const express = require("express");
const {
  getOverview,
  getLiveFleet,
  broadcastDelay,
  getSafetyReports,
  triggerSos,
  updateSafetyIncident,
  getSupportTickets,
  replySupportTicket,
} = require("../controllers/adminController");

const router = express.Router();

// GET /api/admin/overview
router.get("/overview", getOverview);

// Live Fleet Tracking
router.get("/tracking/live", getLiveFleet);

// Delays
router.post("/tracking/delay", broadcastDelay);

// Safety & SOS
router.get("/safety/reports", getSafetyReports);
router.post("/safety/sos", triggerSos);
router.put("/safety/reports/:id", updateSafetyIncident);

// Support Tickets
router.get("/support/tickets", getSupportTickets);
router.post("/support/tickets/:id/reply", replySupportTicket);

module.exports = router;
