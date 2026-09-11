const express = require("express");
const { createTicket, getUserTickets, getTicketById, updateTicket } = require("../controllers/supportController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// ALL SUPPORT ROUTES — JWT REQUIRED

// POST /api/support/tickets
router.post("/tickets", authMiddleware, createTicket);

// GET /api/support/tickets — MUST COME BEFORE /:id
router.get("/tickets", authMiddleware, getUserTickets);

// PATCH /api/support/tickets/:id — user-scoped status update
router.patch("/tickets/:id", authMiddleware, updateTicket);

// GET /api/support/tickets/:id
router.get("/tickets/:id", authMiddleware, getTicketById);

module.exports = router;
