const { prisma } = require("../config/db");

const couponModel = {
  // Find coupon by code (case-insensitive via normalization)
  findByCode: async (code) => {
    return await prisma.coupon.findUnique({
      where: { code: code.trim().toUpperCase() },
    });
  },

  // Find coupon by ID
  findById: async (id) => {
    return await prisma.coupon.findUnique({ where: { id } });
  },

  // Increment usedCount atomically inside transaction
  incrementUsage: async (id, tx = null) => {
    const client = tx || prisma;
    return await client.coupon.update({
      where: { id },
      data: { usedCount: { increment: 1 } },
    });
  },

  // Decrement usedCount (for rollback on payment failure)
  decrementUsage: async (id, tx = null) => {
    const client = tx || prisma;
    return await client.coupon.update({
      where: { id },
      data: { usedCount: { decrement: 1 } },
    });
  },
};

module.exports = couponModel;
