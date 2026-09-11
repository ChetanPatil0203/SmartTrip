const supportModel = require("../models/supportModel");
const { prisma } = require("../config/db");
const { createSystemNotification } = require("./notificationService");

const VALID_PRIORITIES = ["LOW", "MEDIUM", "HIGH"];

const supportService = {
  // POST /api/support/tickets
  createTicket: async ({ userId, bookingId, subject, description, priority }) => {
    // Normalize priority
    const normPriority = priority ? priority.trim().toUpperCase() : "MEDIUM";

    // If bookingId provided, verify ownership
    if (bookingId) {
      const booking = await prisma.booking.findFirst({ where: { id: bookingId, userId } });
      if (!booking) {
        const err = new Error("Booking not found or does not belong to you");
        err.statusCode = 404;
        err.errorCode = "BOOKING_NOT_FOUND";
        throw err;
      }
    }

    const ticket = await supportModel.create({
      userId,
      bookingId: bookingId || null,
      subject: subject.trim(),
      description: description.trim(),
      priority: normPriority,
    });

    // Non-blocking notification
    createSystemNotification(
      userId,
      "Support Ticket Created",
      `Your support ticket "${ticket.subject}" has been submitted. Our team will respond shortly.`
    ).catch(() => {});

    return { ticket };
  },

  // GET /api/support/tickets
  getUserTickets: async (userId, query) => {
    const pageNum = Math.max(1, parseInt(query.page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(query.limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const [tickets, totalCount] = await Promise.all([
      supportModel.findUserTickets({ userId, skip, take: limitNum }),
      supportModel.countUserTickets(userId),
    ]);

    const totalPages = Math.ceil(totalCount / limitNum) || 0;

    return {
      pagination: { page: pageNum, limit: limitNum, total: totalCount, totalPages },
      tickets,
    };
  },

  // GET /api/support/tickets/:id
  getTicketById: async (id, userId) => {
    const ticket = await supportModel.findByIdAndUser(id, userId);
    if (!ticket) {
      const err = new Error("Support ticket not found");
      err.statusCode = 404;
      throw err;
    }
    return { ticket };
  },

  // PATCH /api/support/tickets/:id  — user can only close/reopen their own ticket
  // Admin status changes (IN_PROGRESS/RESOLVED) are not exposed without admin role
  updateTicketStatus: async (id, userId, status) => {
    const ticket = await supportModel.findByIdAndUser(id, userId);
    if (!ticket) {
      const err = new Error("Support ticket not found");
      err.statusCode = 404;
      throw err;
    }

    // Users can only set CLOSED (withdraw) or OPEN (reopen) on their own tickets
    const norm = status.trim().toUpperCase();
    if (!["OPEN", "CLOSED"].includes(norm)) {
      const err = new Error("Users can only set status to OPEN or CLOSED");
      err.statusCode = 403;
      err.errorCode = "FORBIDDEN_STATUS_CHANGE";
      throw err;
    }

    if (ticket.status === norm) {
      return { ticket }; // Idempotent
    }

    const updated = await supportModel.updateStatus(id, norm);
    return { ticket: updated };
  },
};

module.exports = supportService;
