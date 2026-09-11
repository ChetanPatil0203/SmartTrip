const crypto = require("crypto");
const cancellationModel = require("../models/cancellationModel");
const { calculateRefundAmount } = require("../constants/cancellationPolicy");
const { prisma } = require("../config/db");

const generateRefundReference = () => {
  const randomStr = crypto.randomBytes(5).toString("hex").toUpperCase();
  return `REF-${randomStr}`;
};

const cancellationService = {
  // -------------------------------------------------------
  // REQUEST CANCELLATION
  // POST /api/cancellations
  // -------------------------------------------------------
  cancelBooking: async (userId, body) => {
    const { bookingId, bookingReference, reason } = body;
    const target = (bookingId || bookingReference || "").trim();

    // 1. Find booking and verify ownership
    let booking = null;
    if (target.length > 10 && target.includes("-")) {
      booking = await prisma.booking.findFirst({
        where: { bookingReference: target, userId },
        include: { payments: true, cancellations: true },
      });
    }
    if (!booking) {
      booking = await prisma.booking.findFirst({
        where: { id: target, userId },
        include: { payments: true, cancellations: true },
      });
    }

    if (!booking) {
      const err = new Error("Booking not found");
      err.statusCode = 404;
      throw err;
    }

    // 2. Check booking status — can only cancel PENDING or CONFIRMED
    if (booking.status === "CANCELLED") {
      const err = new Error("Booking is already cancelled");
      err.statusCode = 409;
      err.errorCode = "BOOKING_ALREADY_CANCELLED";
      throw err;
    }

    if (booking.status === "REFUNDED") {
      const err = new Error("Booking has already been refunded");
      err.statusCode = 409;
      err.errorCode = "BOOKING_ALREADY_REFUNDED";
      throw err;
    }

    // 3. Check no existing active cancellation request
    const existingCancellation = booking.cancellations && booking.cancellations.find(
      (c) => c.status === "REQUESTED" || c.status === "PROCESSED"
    );
    if (existingCancellation) {
      const err = new Error("A cancellation request already exists for this booking");
      err.statusCode = 409;
      err.errorCode = "CANCELLATION_ALREADY_EXISTS";
      throw err;
    }

    // 4. Calculate refund amount based on travel date and booking type
    const travelDate = booking.travelDate;
    const { refundPercentage, refundAmount, cancellationFee, diffHours } = calculateRefundAmount(
      booking.bookingType,
      travelDate,
      booking.totalAmount
    );

    // 5. Find payment (if CONFIRMED, refund is applicable; if PENDING, full refund)
    const successPayment = booking.payments && booking.payments.find((p) => p.status === "SUCCESS");
    const finalRefundAmount = successPayment ? refundAmount : booking.totalAmount;
    const finalCancellationFee = successPayment ? cancellationFee : 0;

    // 6. Atomic transaction: create Cancellation + update Booking + create Refund (if paid)
    const result = await cancellationModel.executeCancellationTransaction(async (tx) => {
      // Cancel booking
      const updatedBooking = await tx.booking.update({
        where: { id: booking.id },
        data: { status: "CANCELLED" },
      });

      // Create cancellation record
      const cancellation = await tx.cancellation.create({
        data: {
          bookingId: booking.id,
          reason: reason ? reason.trim() : null,
          cancellationFee: finalCancellationFee,
          refundAmount: finalRefundAmount,
          status: "REQUESTED",
        },
      });

      // Create refund record if payment was successful
      let refund = null;
      if (successPayment) {
        const refundReference = generateRefundReference();
        refund = await tx.refund.create({
          data: {
            bookingId: booking.id,
            paymentId: successPayment.id,
            amount: finalRefundAmount,
            refundReference,
            status: "PENDING",
          },
        });
      }

      return { booking: updatedBooking, cancellation, refund };
    });

    return {
      bookingId: booking.id,
      bookingReference: booking.bookingReference,
      bookingType: booking.bookingType,
      originalAmount: booking.totalAmount,
      cancellationFee: finalCancellationFee,
      refundAmount: finalRefundAmount,
      refundPercentage: successPayment ? refundPercentage : 1.0,
      hoursBeforeTravel: Math.round(diffHours),
      cancellation: {
        id: result.cancellation.id,
        status: result.cancellation.status,
        reason: result.cancellation.reason,
        cancelledAt: result.cancellation.cancelledAt,
      },
      refund: result.refund
        ? {
            id: result.refund.id,
            refundReference: result.refund.refundReference,
            amount: result.refund.amount,
            status: result.refund.status,
          }
        : null,
      message: successPayment
        ? `Booking cancelled. Refund of ₹${finalRefundAmount} will be processed within 5-7 business days.`
        : "Booking cancelled. No payment was made so no refund is applicable.",
    };
  },

  // -------------------------------------------------------
  // GET CANCELLATION BY ID
  // GET /api/cancellations/:id
  // -------------------------------------------------------
  getCancellationById: async (id, userId) => {
    const cancellation = await cancellationModel.findCancellationById(id);
    if (!cancellation) {
      const err = new Error("Cancellation record not found");
      err.statusCode = 404;
      throw err;
    }
    if (cancellation.booking.userId !== userId) {
      const err = new Error("Access denied");
      err.statusCode = 403;
      throw err;
    }
    return { cancellation };
  },

  // -------------------------------------------------------
  // GET CANCELLATION BY BOOKING ID
  // GET /api/cancellations/booking/:bookingId
  // -------------------------------------------------------
  getCancellationByBookingId: async (bookingId, userId) => {
    const cancellation = await cancellationModel.findCancellationByBookingId(bookingId);
    if (!cancellation) {
      const err = new Error("No cancellation found for this booking");
      err.statusCode = 404;
      throw err;
    }
    if (cancellation.booking.userId !== userId) {
      const err = new Error("Access denied");
      err.statusCode = 403;
      throw err;
    }
    return { cancellation };
  },

  // -------------------------------------------------------
  // GET USER CANCELLATIONS (paginated)
  // GET /api/cancellations
  // -------------------------------------------------------
  getUserCancellations: async (userId, query) => {
    const { page = 1, limit = 10, status, bookingType } = query;
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const where = {};
    if (status && status.trim()) {
      where.status = status.trim().toUpperCase();
    }
    if (bookingType && bookingType.trim()) {
      where.booking = { ...(where.booking || {}), bookingType: bookingType.trim().toUpperCase() };
    }

    const [cancellations, totalCount] = await Promise.all([
      cancellationModel.findUserCancellations({ userId, where, skip, take: limitNum }),
      cancellationModel.countUserCancellations({ userId, where }),
    ]);

    const totalPages = Math.ceil(totalCount / limitNum) || (totalCount > 0 ? 1 : 0);

    const formatted = cancellations.map((c) => ({
      id: c.id,
      bookingId: c.bookingId,
      bookingReference: c.booking.bookingReference,
      bookingType: c.booking.bookingType,
      originalAmount: c.booking.totalAmount,
      cancellationFee: c.cancellationFee,
      refundAmount: c.refundAmount,
      status: c.status,
      reason: c.reason,
      cancelledAt: c.cancelledAt,
    }));

    return {
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: totalCount,
        totalPages,
      },
      cancellations: formatted,
    };
  },

  // -------------------------------------------------------
  // GET REFUND STATUS BY BOOKING ID
  // GET /api/cancellations/refund/:bookingId
  // -------------------------------------------------------
  getRefundStatus: async (bookingId, userId) => {
    // Verify booking ownership
    const booking = await prisma.booking.findFirst({
      where: { id: bookingId, userId },
    });
    if (!booking) {
      const err = new Error("Booking not found");
      err.statusCode = 404;
      throw err;
    }

    const refund = await prisma.refund.findFirst({
      where: { bookingId },
      include: { payment: true },
      orderBy: { createdAt: "desc" },
    });

    if (!refund) {
      const err = new Error("No refund record found for this booking");
      err.statusCode = 404;
      throw err;
    }

    return {
      refund: {
        id: refund.id,
        bookingId: refund.bookingId,
        bookingReference: booking.bookingReference,
        refundReference: refund.refundReference,
        amount: refund.amount,
        status: refund.status,
        processedAt: refund.processedAt,
        createdAt: refund.createdAt,
        paymentReference: refund.payment ? refund.payment.paymentReference : null,
      },
    };
  },

  // -------------------------------------------------------
  // PROCESS REFUND (Admin-style internal action)
  // PATCH /api/cancellations/refund/:refundId/process
  // -------------------------------------------------------
  processRefund: async (refundId, userId) => {
    const refund = await prisma.refund.findUnique({
      where: { id: refundId },
      include: { booking: true, payment: true },
    });

    if (!refund) {
      const err = new Error("Refund record not found");
      err.statusCode = 404;
      throw err;
    }

    if (refund.booking.userId !== userId) {
      const err = new Error("Access denied");
      err.statusCode = 403;
      throw err;
    }

    if (refund.status === "COMPLETED") {
      return {
        refund: {
          id: refund.id,
          refundReference: refund.refundReference,
          amount: refund.amount,
          status: refund.status,
          processedAt: refund.processedAt,
        },
        message: "Refund has already been processed",
      };
    }

    if (refund.status === "FAILED") {
      const err = new Error("Cannot process a failed refund");
      err.statusCode = 409;
      err.errorCode = "REFUND_ALREADY_FAILED";
      throw err;
    }

    // Simulate processing — mark as COMPLETED
    const updatedRefund = await prisma.$transaction(async (tx) => {
      const updated = await tx.refund.update({
        where: { id: refundId },
        data: {
          status: "COMPLETED",
          processedAt: new Date(),
        },
      });

      // Update cancellation status to PROCESSED
      await tx.cancellation.updateMany({
        where: { bookingId: refund.bookingId },
        data: { status: "PROCESSED" },
      });

      // Update booking status to REFUNDED
      await tx.booking.update({
        where: { id: refund.bookingId },
        data: { status: "REFUNDED" },
      });

      return updated;
    });

    return {
      refund: {
        id: updatedRefund.id,
        refundReference: updatedRefund.refundReference,
        amount: updatedRefund.amount,
        status: updatedRefund.status,
        processedAt: updatedRefund.processedAt,
      },
      message: `Refund of ₹${updatedRefund.amount} processed successfully`,
    };
  },
};

module.exports = cancellationService;
