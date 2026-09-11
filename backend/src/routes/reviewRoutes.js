const express = require("express");
const { createReview, getReviews, getReviewById, updateReview, deleteReview } = require("../controllers/reviewController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// POST /api/reviews — JWT required
router.post("/", authMiddleware, createReview);

// GET /api/reviews — PUBLIC
router.get("/", getReviews);

// PATCH /api/reviews/:id — JWT required (owner only)
router.patch("/:id", authMiddleware, updateReview);

// DELETE /api/reviews/:id — JWT required (owner only)
router.delete("/:id", authMiddleware, deleteReview);

// GET /api/reviews/:id — PUBLIC (must come after specific method routes)
router.get("/:id", getReviewById);

module.exports = router;
