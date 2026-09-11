const paymentModel = require("../models/paymentModel");
const { getPaymentProvider } = require("./paymentProviders/paymentProvider");
const {
  createBookingNotification,
  createPaymentSuccessNotification,
  createPaymentFailedNotification,
} = require("./notificationService");

const paymentService = {
  createOrder: async (userId, body) => {
    const { bookingId, bookingReference, method } = body;
    const target = (bookingId || bookingReference).trim();

    const booking = await paymentModel.findBookingForUser(target, userId);
    if (!booking) {
      const error = new Error("Booking not found");
      error.statusCode = 404;
      throw error;
    }

    if (booking.status === "CONFIRMED" || booking.status === "COMPLETED" || booking.status === "REFUNDED") {
      const error = new Error("Booking is already paid and confirmed");
      error.statusCode = 409;
      error.errorCode = "BOOKING_ALREADY_PAID";
      throw error;
    }

    if (booking.status === "CANCELLED") {
      const error = new Error("Cannot create payment for a cancelled booking");
      error.statusCode = 409;
      error.errorCode = "BOOKING_CANCELLED";
      throw error;
    }

    const hasSuccessPayment = booking.payments && booking.payments.some((p) => p.status === "SUCCESS");
    if (hasSuccessPayment) {
      const error = new Error("Payment has already been completed for this booking");
      error.statusCode = 409;
      error.errorCode = "PAYMENT_ALREADY_COMPLETED";
      throw error;
    }

    // Authoritative amount check from database
    const amount = booking.totalAmount;
    const currency = "INR";

    const provider = getPaymentProvider();
    const providerOrder = await provider.createOrder({
      bookingId: booking.id,
      bookingReference: booking.bookingReference,
      amount,
      currency,
    });

    const paymentRecord = await paymentModel.upsertPaymentOrder({
      bookingId: booking.id,
      paymentReference: providerOrder.orderId,
      amount,
      method: method ? method.trim().toUpperCase() : "UPI",
      status: "PENDING",
    });

    return {
      paymentReference: providerOrder.orderId,
      orderId: providerOrder.orderId,
      payment: {
        id: paymentRecord.id,
        orderId: providerOrder.orderId,
        paymentReference: providerOrder.orderId,
        bookingId: booking.id,
        bookingReference: booking.bookingReference,
        amount,
        currency,
        status: "PENDING",
        provider: providerOrder.provider,
      },
    };
  },

  verifyPayment: async (userId, body) => {
    const { bookingId, bookingReference, paymentId, orderId, paymentOrderReference, paymentReference, signature, providerSignature, method } = body;
    const targetBooking = (bookingId || bookingReference).trim();
    const targetPaymentRef = (paymentId || orderId || paymentOrderReference || paymentReference || "").trim();
    const targetSig = (signature || providerSignature || "mock_signature").trim();

    const booking = await paymentModel.findBookingForUser(targetBooking, userId);
    if (!booking) {
      const error = new Error("Booking not found");
      error.statusCode = 404;
      throw error;
    }

    // Find corresponding payment record
    let paymentRecord = null;
    if (booking.payments && booking.payments.length > 0) {
      paymentRecord = booking.payments.find(
        (p) => p.id === targetPaymentRef || p.paymentReference === targetPaymentRef
      );
      if (!paymentRecord) {
        paymentRecord = booking.payments[0];
      }
    }

    if (!paymentRecord) {
      const dbPayment = await paymentModel.findPaymentByReference(targetPaymentRef);
      if (dbPayment && dbPayment.booking.userId === userId) {
        paymentRecord = dbPayment;
      }
    }

    if (!paymentRecord) {
      const error = new Error("Payment record not found for this booking");
      error.statusCode = 404;
      throw error;
    }

    // IDEMPOTENCY CHECK
    if (paymentRecord.status === "SUCCESS" && booking.status === "CONFIRMED") {
      return {
        message: "Payment already verified successfully",
        payment: {
          id: paymentRecord.id,
          paymentReference: paymentRecord.paymentReference,
          amount: paymentRecord.amount,
          currency: "INR",
          status: "SUCCESS",
          paidAt: paymentRecord.paidAt,
        },
        booking: {
          id: booking.id,
          bookingReference: booking.bookingReference,
          status: "CONFIRMED",
        },
      };
    }

    // Authoritative amount check
    const amount = booking.totalAmount;
    const currency = "INR";

    const provider = getPaymentProvider();
    const verification = await provider.verifyPayment({
      orderId: paymentRecord.paymentReference,
      paymentId: targetPaymentRef,
      signature: targetSig,
      amount,
      currency,
    });

    if (!verification.success) {
      await paymentModel.updatePaymentAndBookingStatus({
        paymentId: paymentRecord.id,
        paymentStatus: "FAILED",
        bookingId: booking.id,
        bookingStatus: booking.status,
      });

      // Fire payment failed notification (non-blocking)
      createPaymentFailedNotification(booking.userId, booking).catch(() => {});

      const error = new Error(verification.error || "Payment verification failed");
      error.statusCode = 422;
      error.errorCode = "PAYMENT_VERIFICATION_FAILED";
      throw error;
    }

    // ATOMIC TRANSACTION: Payment SUCCESS + Booking CONFIRMED
    const updatedResult = await paymentModel.updatePaymentAndBookingStatus({
      paymentId: paymentRecord.id,
      paymentStatus: "SUCCESS",
      bookingId: booking.id,
      bookingStatus: "CONFIRMED",
      paidAt: new Date(),
      method: method ? method.trim().toUpperCase() : paymentRecord.method,
    });

    // Fire payment success + booking confirmed notifications (non-blocking)
    createPaymentSuccessNotification(booking.userId, updatedResult.booking, updatedResult.payment.amount).catch(() => {});
    createBookingNotification(booking.userId, updatedResult.booking).catch(() => {});

    return {
      message: "Payment verified and booking confirmed successfully",
      payment: {
        id: updatedResult.payment.id,
        paymentReference: updatedResult.payment.paymentReference,
        amount: updatedResult.payment.amount,
        currency: "INR",
        status: updatedResult.payment.status,
        paidAt: updatedResult.payment.paidAt,
      },
      booking: {
        id: updatedResult.booking.id,
        bookingReference: updatedResult.booking.bookingReference,
        status: updatedResult.booking.status,
      },
    };
  },

  getPaymentById: async (paymentId, userId) => {
    const payment = await paymentModel.findPaymentById(paymentId);
    if (!payment || payment.booking.userId !== userId) {
      const error = new Error("Payment not found");
      error.statusCode = 404;
      throw error;
    }

    return {
      payment: {
        id: payment.id,
        bookingId: payment.bookingId,
        bookingReference: payment.booking.bookingReference,
        paymentReference: payment.paymentReference,
        amount: payment.amount,
        currency: "INR",
        method: payment.method,
        status: payment.status,
        paidAt: payment.paidAt,
        createdAt: payment.createdAt,
        updatedAt: payment.updatedAt,
      },
    };
  },

  getPaymentByBookingId: async (bookingIdOrRef, userId) => {
    const booking = await paymentModel.findBookingForUser(bookingIdOrRef, userId);
    if (!booking) {
      const error = new Error("Booking not found");
      error.statusCode = 404;
      throw error;
    }

    const payment = await paymentModel.findPaymentByBookingId(booking.id);
    if (!payment) {
      const error = new Error("Payment record not found for this booking");
      error.statusCode = 404;
      throw error;
    }

    return {
      payment: {
        id: payment.id,
        bookingId: payment.bookingId,
        bookingReference: booking.bookingReference,
        paymentReference: payment.paymentReference,
        amount: payment.amount,
        currency: "INR",
        method: payment.method,
        status: payment.status,
        paidAt: payment.paidAt,
        createdAt: payment.createdAt,
        updatedAt: payment.updatedAt,
      },
    };
  },
};

module.exports = paymentService;
