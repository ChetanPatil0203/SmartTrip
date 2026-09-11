const validateCreateOrder = (body) => {
  if (!body || typeof body !== "object") {
    return { valid: false, message: "Invalid request payload" };
  }

  const { bookingId, bookingReference } = body;
  const target = bookingId || bookingReference;

  if (!target || typeof target !== "string" || !target.trim()) {
    return { valid: false, message: "bookingId or bookingReference is required" };
  }

  return { valid: true };
};

const validateVerifyPayment = (body) => {
  if (!body || typeof body !== "object") {
    return { valid: false, message: "Invalid request payload" };
  }

  // Security check: reject requests containing sensitive payment credentials
  const sensitiveFields = ["cardNumber", "cvv", "upiPin", "pin", "password", "bankPassword"];
  for (const field of sensitiveFields) {
    if (body[field] !== undefined) {
      return { valid: false, message: `Security error: ${field} must not be transmitted to backend` };
    }
  }

  const { bookingId, bookingReference, paymentId, orderId, paymentOrderReference, paymentReference, signature, providerSignature, status } = body;
  const targetBooking = bookingId || bookingReference;
  const targetPayment = paymentId || orderId || paymentOrderReference || paymentReference;
  const targetSignature = signature || providerSignature || status || "mock_signature";

  if (!targetBooking || typeof targetBooking !== "string" || !targetBooking.trim()) {
    return { valid: false, message: "bookingId or bookingReference is required" };
  }

  if (!targetPayment || typeof targetPayment !== "string" || !targetPayment.trim()) {
    return { valid: false, message: "paymentId, orderId or paymentReference is required" };
  }

  if (!targetSignature || typeof targetSignature !== "string" || !targetSignature.trim()) {
    return { valid: false, message: "payment signature is required for verification" };
  }

  return { valid: true };
};

module.exports = {
  validateCreateOrder,
  validateVerifyPayment,
};
