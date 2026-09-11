const { prisma } = require("../config/db");

const reviewModel = {
  create: async ({ userId, bookingId, rating, title, comment }) => {
    return await prisma.review.create({
      data: {
        userId,
        bookingId: bookingId || null,
        rating,
        title: title ? title.trim() : null,
        comment: comment ? comment.trim() : null,
      },
    });
  },

  // Check if user already reviewed a specific booking
  findByUserAndBooking: async (userId, bookingId) => {
    return await prisma.review.findFirst({
      where: { userId, bookingId },
    });
  },

  findAll: async ({ skip = 0, take = 20, orderBy = [{ createdAt: "desc" }], where = {} }) => {
    return await prisma.review.findMany({
      where,
      orderBy,
      skip,
      take,
      select: {
        id: true,
        bookingId: true,
        rating: true,
        title: true,
        comment: true,
        createdAt: true,
        updatedAt: true,
        // Only expose safe user info
        user: { select: { name: true } },
      },
    });
  },

  countAll: async (where = {}) => {
    return await prisma.review.count({ where });
  },

  findById: async (id) => {
    return await prisma.review.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
        bookingId: true,
        rating: true,
        title: true,
        comment: true,
        createdAt: true,
        updatedAt: true,
        user: { select: { name: true } },
      },
    });
  },

  update: async (id, { rating, title, comment }) => {
    const data = {};
    if (rating !== undefined) data.rating = parseInt(rating, 10);
    if (title !== undefined) data.title = title ? title.trim() : null;
    if (comment !== undefined) data.comment = comment ? comment.trim() : null;

    return await prisma.review.update({
      where: { id },
      data,
      select: {
        id: true,
        rating: true,
        title: true,
        comment: true,
        updatedAt: true,
      },
    });
  },

  deleteById: async (id) => {
    return await prisma.review.delete({ where: { id } });
  },
};

module.exports = reviewModel;
