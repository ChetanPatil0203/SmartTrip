const calculateRefundAmount = (bookingType, travelDate, totalAmount) => {
  const now = new Date();
  const travel = new Date(travelDate);
  const diffMs = travel.getTime() - now.getTime();
  const diffHours = Math.max(0, diffMs / (1000 * 60 * 60));

  let refundPercentage = 0.5; // default 50% refund

  const type = (bookingType || "BUS").toUpperCase();

  if (type === "FLIGHT") {
    if (diffHours > 72) {
      refundPercentage = 0.8; // 80% refund (20% fee)
    } else if (diffHours >= 24) {
      refundPercentage = 0.6; // 60% refund (40% fee)
    } else {
      refundPercentage = 0.25; // 25% refund (75% fee)
    }
  } else {
    // BUS, TRAIN, HOTEL
    if (diffHours > 48) {
      refundPercentage = 0.9; // 90% refund (10% fee)
    } else if (diffHours >= 24) {
      refundPercentage = 0.75; // 75% refund (25% fee)
    } else {
      refundPercentage = 0.5; // 50% refund (50% fee)
    }
  }

  const refundAmount = Math.round(totalAmount * refundPercentage * 100) / 100;
  const cancellationFee = Math.round((totalAmount - refundAmount) * 100) / 100;

  return {
    refundPercentage,
    refundAmount,
    cancellationFee,
    diffHours,
  };
};

module.exports = {
  calculateRefundAmount,
};
