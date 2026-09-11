const express = require("express");
const { getPublicShare } = require("../controllers/tripShareController");

const router = express.Router();

// PUBLIC — No JWT required
// GET /api/shared-trips/:token
router.get("/:token", getPublicShare);

module.exports = router;
