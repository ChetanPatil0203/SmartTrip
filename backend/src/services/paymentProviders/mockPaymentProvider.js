const mockPaymentProvider = {
  createOrder: async ({ bookingId, bookingReference, amount, currency = "INR" }) => {
    const timestamp = Date.now();
    const orderId = `ORDER_MOCK_${bookingReference}_${timestamp}`;

    return {
      success: true,
      orderId,
      amount,
      currency,
      provider: "mock",
    };
  },

  verifyPayment: async ({ orderId, paymentId, signature, amount, currency = "INR" }) => {
    if (!signature || typeof signature !== "string" || signature.toLowerCase().includes("invalid")) {
      return {
        success: false,
        error: "Invalid payment signature",
      };
    }

    if (amount <= 0 || currency.toUpperCase() !== "INR") {
      return {
        success: false,
        error: "Invalid payment amount or currency",
      };
    }

    const paymentReference = paymentId || `MOCK_PAY_${orderId}`;

    return {
      success: true,
      paymentReference,
      provider: "mock",
    };
  },

  getPaymentStatus: async (paymentReference) => {
    return {
      success: true,
      status: "SUCCESS",
      paymentReference,
    };
  },
};

module.exports = mockPaymentProvider;
