const { prisma } = require("../config/db");

const offerModel = {
  // Get active + valid offers with pagination
  findActiveOffers: async ({ where = {}, orderBy = [{ createdAt: "desc" }], skip = 0, take = 20 }) => {
    const now = new Date();
    const fullWhere = {
      isActive: true,
      validFrom: { lte: now },
      validUntil: { gte: now },
      ...where,
    };
    return await prisma.offer.findMany({ where: fullWhere, orderBy, skip, take });
  },

  countActiveOffers: async ({ where = {} }) => {
    const now = new Date();
    const fullWhere = {
      isActive: true,
      validFrom: { lte: now },
      validUntil: { gte: now },
      ...where,
    };
    return await prisma.offer.count({ where: fullWhere });
  },

  findById: async (id) => {
    return await prisma.offer.findUnique({ where: { id } });
  },
};

module.exports = offerModel;
