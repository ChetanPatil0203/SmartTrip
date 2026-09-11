const express = require("express");
const { getOffers, getOfferById } = require("../controllers/offerController");

const router = express.Router();

// PUBLIC ROUTES — No JWT required for browsing offers
// GET /api/offers
router.get("/", getOffers);

// GET /api/offers/:id
router.get("/:id", getOfferById);

module.exports = router;
