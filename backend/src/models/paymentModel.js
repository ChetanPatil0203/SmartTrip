const { prisma } = require("../config/db");

const paymentModel = {
  findBookingForUser: async (bookingIdOrRef, userId) => {
    return await prisma.booking.findFirst({
      where: {
        userId,
        OR: [
          { id: bookingIdOrRef },
          { bookingReference: bookingIdOrRef },
        ],
      },
      include: {
        payments: {
          orderBy: { createdAt: "desc" },
        },
      },
    });
  },

  findPaymentById: async (paymentId) => {
    return await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        booking: true,
      },
    });
  },

  findPaymentByBookingId: async (bookingId) => {
    return await prisma.payment.findFirst({
      where: { bookingId },
      orderBy: { createdAt: "desc" },
      include: {
        booking: true,
      },
    });
  },

  findPaymentByReference: async (paymentReference) => {
    return await prisma.payment.findUnique({
      where: { paymentReference },
      include: {
        booking: true,
      },
    });
  },

  upsertPaymentOrder: async ({ bookingId, paymentReference, amount, method = "UPI", status = "PENDING" }) => {
    const existingPayment = await prisma.payment.findFirst({
      where: { bookingId },
    });

    if (existingPayment) {
      return await prisma.payment.update({
        where: { id: existingPayment.id },
        data: {
          paymentReference,
          amount,
          method,
          status,
        },
      });
    }

    return await prisma.payment.create({
      data: {
        bookingId,
        paymentReference,
        amount,
        method,
        status,
      },
    });
  },

  updatePaymentAndBookingStatus: async ({ paymentId, paymentStatus, bookingId, bookingStatus, paidAt, method }) => {
    return await prisma.$transaction(async (tx) => {
      const paymentUpdateData = {
        status: paymentStatus,
      };
      if (paidAt) paymentUpdateData.paidAt = paidAt;
      if (method) paymentUpdateData.method = method;

      const updatedPayment = await tx.payment.update({
        where: { id: paymentId },
        data: paymentUpdateData,
      });

      const updatedBooking = await tx.booking.update({
        where: { id: bookingId },
        data: {
          status: bookingStatus,
        },
      });

      return { payment: updatedPayment, booking: updatedBooking };
    });
  },
};

module.exports = paymentModel;
