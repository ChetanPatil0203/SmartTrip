const config = require("../../config/env");
const mockPaymentProvider = require("./mockPaymentProvider");

class PaymentProviderInterface {
  createOrder(options) {
    throw new Error("createOrder() must be implemented by payment provider");
  }

  verifyPayment(options) {
    throw new Error("verifyPayment() must be implemented by payment provider");
  }

  getPaymentStatus(options) {
    throw new Error("getPaymentStatus() must be implemented by payment provider");
  }
}

const getPaymentProvider = () => {
  const provider = config.paymentProvider.toLowerCase();

  if (provider === "mock" || config.nodeEnv === "development" || config.nodeEnv === "test") {
    return mockPaymentProvider;
  }

  // Future real gateway integration (e.g. Razorpay / Stripe) can be added here cleanly:
  // if (provider === "razorpay") return razorpayPaymentProvider;

  return mockPaymentProvider;
};

module.exports = {
  PaymentProviderInterface,
  getPaymentProvider,
};
