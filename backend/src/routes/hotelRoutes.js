const express = require("express");
const {
  searchHotels,
  getHotelById,
  getHotelRooms,
  getHotelAmenities,
  getHotelImages,
  getHotelAvailability,
} = require("../controllers/hotelController");

const router = express.Router();

// ----------------------------------------------------
// 1. HOTEL SEARCH / LISTING (GET /api/hotels)
// ----------------------------------------------------
router.get("/", searchHotels);

// ----------------------------------------------------
// 2. HOTEL SUB-RESOURCES (MUST COME BEFORE GET /:id)
// ----------------------------------------------------
router.get("/:id/rooms", getHotelRooms);
router.get("/:id/amenities", getHotelAmenities);
router.get("/:id/images", getHotelImages);
router.get("/:id/availability", getHotelAvailability);

// ----------------------------------------------------
// 3. HOTEL DETAILS (GET /api/hotels/:id)
// ----------------------------------------------------
router.get("/:id", getHotelById);

module.exports = router;
