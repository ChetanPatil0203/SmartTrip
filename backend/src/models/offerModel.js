const { prisma } = require("../config/db");

const DEFAULT_OFFERS = [
  {
    id: "off-summer-50",
    title: "Flat ₹50 OFF on Bus & Train Bookings",
    description: "Valid across all state transport and private sleeper buses.",
    code: "SUMMER50",
    discountType: "FLAT",
    discountValue: 50,
    maxDiscount: 50,
    minBookingAmount: 300,
    validFrom: new Date(Date.now() - 86400000 * 30),
    validUntil: new Date(Date.now() + 86400000 * 90),
    isActive: true,
  },
  {
    id: "off-flyhigh-500",
    title: "Flat ₹500 OFF on Domestic Flights",
    description: "Get instant discount on Indigo, Air India, SpiceJet flights.",
    code: "FLYHIGH500",
    discountType: "FLAT",
    discountValue: 500,
    maxDiscount: 500,
    minBookingAmount: 3500,
    validFrom: new Date(Date.now() - 86400000 * 30),
    validUntil: new Date(Date.now() + 86400000 * 90),
    isActive: true,
  },
  {
    id: "off-cab-first",
    title: "Instant ₹15 OFF on First Cab or Auto Ride",
    description: "No coupon required! Upfront discount applied on all city rides.",
    code: "SMARTTRIP",
    discountType: "FLAT",
    discountValue: 15,
    maxDiscount: 15,
    minBookingAmount: 50,
    validFrom: new Date(Date.now() - 86400000 * 30),
    validUntil: new Date(Date.now() + 86400000 * 90),
    isActive: true,
  },
  {
    id: "off-staygoa-15",
    title: "Extra 15% OFF on Luxury Resort Stays",
    description: "Applicable on 4-star and 5-star beachfront properties and villas.",
    code: "STAYGOA15",
    discountType: "PERCENTAGE",
    discountValue: 15,
    maxDiscount: 1200,
    minBookingAmount: 2500,
    validFrom: new Date(Date.now() - 86400000 * 30),
    validUntil: new Date(Date.now() + 86400000 * 90),
    isActive: true,
  },
];

const offerModel = {
  // Get active + valid offers with pagination
  findActiveOffers: async ({ where = {}, orderBy = [{ createdAt: "desc" }], skip = 0, take = 20 }) => {
    try {
      const now = new Date();
      const fullWhere = {
        isActive: true,
        validFrom: { lte: now },
        validUntil: { gte: now },
        ...where,
      };
      const res = await prisma.offer.findMany({ where: fullWhere, orderBy, skip, take });
      if (res && res.length > 0) return res;
    } catch (e) {
      // Fallback if MySQL offline
    }
    return DEFAULT_OFFERS.slice(skip, skip + take);
  },

  countActiveOffers: async ({ where = {} }) => {
    try {
      const now = new Date();
      const fullWhere = {
        isActive: true,
        validFrom: { lte: now },
        validUntil: { gte: now },
        ...where,
      };
      return await prisma.offer.count({ where: fullWhere });
    } catch (e) {
      // Fallback
      return DEFAULT_OFFERS.length;
    }
  },

  findById: async (id) => {
    try {
      const res = await prisma.offer.findUnique({ where: { id } });
      if (res) return res;
    } catch (e) {
      // Fallback
    }
    return DEFAULT_OFFERS.find((o) => o.id === id) || null;
  },
};

module.exports = offerModel;
