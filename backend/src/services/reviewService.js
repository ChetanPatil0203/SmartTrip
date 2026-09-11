const reviewModel = require("../models/reviewModel");
const { prisma } = require("../config/db");

const reviewService = {
  // POST /api/reviews
  createReview: async ({ userId, bookingId, rating, title, comment }) => {
    // If bookingId provided, verify ownership
    if (bookingId) {
      const booking = await prisma.booking.findFirst({ where: { id: bookingId, userId } });
      if (!booking) {
        const err = new Error("Booking not found or does not belong to you");
        err.statusCode = 404;
        err.errorCode = "BOOKING_NOT_FOUND";
        throw err;
      }

      // Check for duplicate review on same booking
      const existing = await reviewModel.findByUserAndBooking(userId, bookingId);
      if (existing) {
        const err = new Error("You have already submitted a review for this booking");
        err.statusCode = 409;
        err.errorCode = "DUPLICATE_REVIEW";
        throw err;
      }
    }

    const review = await reviewModel.create({
      userId,
      bookingId: bookingId || null,
      rating: parseInt(rating, 10),
      title,
      comment,
    });

    return {
      review: {
        id: review.id,
        rating: review.rating,
        title: review.title,
        comment: review.comment,
        bookingId: review.bookingId,
        createdAt: review.createdAt,
      },
    };
  },

  // GET /api/reviews
  getReviews: async (query) => {
    const pageNum = Math.max(1, parseInt(query.page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(query.limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const where = {};
    if (query.rating) {
      const r = parseInt(query.rating, 10);
      if (!isNaN(r) && r >= 1 && r <= 5) where.rating = r;
    }

    const [reviews, totalCount] = await Promise.all([
      reviewModel.findAll({ skip, take: limitNum, where }),
      reviewModel.countAll(where),
    ]);

    const totalPages = Math.ceil(totalCount / limitNum) || 0;

    return {
      pagination: { page: pageNum, limit: limitNum, total: totalCount, totalPages },
      reviews,
    };
  },

  // GET /api/reviews/:id
  getReviewById: async (id) => {
    const review = await reviewModel.findById(id);
    if (!review) {
      const err = new Error("Review not found");
      err.statusCode = 404;
      throw err;
    }
    // Return without exposing userId
    const { userId, ...safe } = review;
    return { review: safe };
  },

  // PATCH /api/reviews/:id — owner only
  updateReview: async (id, userId, updates) => {
    const review = await reviewModel.findById(id);
    if (!review) {
      const err = new Error("Review not found");
      err.statusCode = 404;
      throw err;
    }
    if (review.userId !== userId) {
      const err = new Error("Review not found");
      err.statusCode = 404;
      throw err;
    }

    const updated = await reviewModel.update(id, updates);
    return { review: updated };
  },

  // DELETE /api/reviews/:id — owner only
  deleteReview: async (id, userId) => {
    const review = await reviewModel.findById(id);
    if (!review) {
      const err = new Error("Review not found");
      err.statusCode = 404;
      throw err;
    }
    if (review.userId !== userId) {
      const err = new Error("Review not found");
      err.statusCode = 404;
      throw err;
    }

    await reviewModel.deleteById(id);
    return { deleted: true, reviewId: id };
  },
};

module.exports = reviewService;
