const offerModel = require("../models/offerModel");

const VALID_SORT_FIELDS = ["createdAt", "validUntil", "discountValue"];
const VALID_SORT_ORDERS = ["asc", "desc"];

const offerService = {
  // -------------------------------------------------------
  // GET ACTIVE OFFERS (public)
  // -------------------------------------------------------
  getActiveOffers: async (query) => {
    const { page = 1, limit = 20, sortBy = "createdAt", sortOrder = "desc" } = query;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const normSortBy = VALID_SORT_FIELDS.includes(sortBy) ? sortBy : "createdAt";
    const normSortOrder = VALID_SORT_ORDERS.includes(sortOrder) ? sortOrder : "desc";
    const orderBy = [{ [normSortBy]: normSortOrder }];

    const [offers, totalCount] = await Promise.all([
      offerModel.findActiveOffers({ orderBy, skip, take: limitNum }),
      offerModel.countActiveOffers({}),
    ]);

    const totalPages = Math.ceil(totalCount / limitNum) || (totalCount > 0 ? 1 : 0);

    return {
      pagination: { page: pageNum, limit: limitNum, total: totalCount, totalPages },
      offers: offers.map(formatOffer),
    };
  },

  // -------------------------------------------------------
  // GET OFFER BY ID (public)
  // -------------------------------------------------------
  getOfferById: async (id) => {
    const offer = await offerModel.findById(id);

    if (!offer) {
      const err = new Error("Offer not found");
      err.statusCode = 404;
      throw err;
    }

    const now = new Date();
    if (!offer.isActive || offer.validFrom > now || offer.validUntil < now) {
      const err = new Error("Offer not found");
      err.statusCode = 404;
      throw err;
    }

    return { offer: formatOffer(offer) };
  },
};

// Format offer for public response
function formatOffer(offer) {
  return {
    id: offer.id,
    title: offer.title,
    description: offer.description,
    code: offer.code,
    discountType: offer.discountType,
    discountValue: offer.discountValue,
    maxDiscount: offer.maxDiscount,
    minBookingAmount: offer.minBookingAmount,
    validFrom: offer.validFrom,
    validUntil: offer.validUntil,
  };
}

module.exports = offerService;
