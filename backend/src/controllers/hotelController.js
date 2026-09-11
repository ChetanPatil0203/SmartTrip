const hotelService = require("../services/hotelService");
const { validateHotelSearch } = require("../validators/hotelValidator");
const { sendSuccess, sendError } = require("../utils/response");

const searchHotels = async (req, res, next) => {
  try {
    const validation = validateHotelSearch(req.query);
    if (!validation.valid) {
      return sendError(res, validation.message, 400);
    }
    const result = await hotelService.searchHotels(req.query);
    return sendSuccess(res, "Hotels retrieved successfully", result);
  } catch (error) {
    next(error);
  }
};

const getHotelById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await hotelService.getHotelById(id);
    return sendSuccess(res, "Hotel details retrieved successfully", result);
  } catch (error) {
    next(error);
  }
};

const getHotelRooms = async (req, res, next) => {
  try {
    const validation = validateHotelSearch(req.query);
    if (!validation.valid) {
      return sendError(res, validation.message, 400);
    }
    const { id } = req.params;
    const result = await hotelService.getHotelRooms(id, req.query);
    return sendSuccess(res, "Hotel rooms retrieved successfully", result);
  } catch (error) {
    next(error);
  }
};

const getHotelAmenities = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await hotelService.getHotelAmenities(id);
    return sendSuccess(res, "Hotel amenities retrieved successfully", result);
  } catch (error) {
    next(error);
  }
};

const getHotelImages = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await hotelService.getHotelImages(id);
    return sendSuccess(res, "Hotel images retrieved successfully", result);
  } catch (error) {
    next(error);
  }
};

const getHotelAvailability = async (req, res, next) => {
  try {
    const validation = validateHotelSearch(req.query);
    if (!validation.valid) {
      return sendError(res, validation.message, 400);
    }
    const { id } = req.params;
    const result = await hotelService.getHotelAvailability(id, req.query);
    return sendSuccess(res, "Hotel availability retrieved successfully", result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  searchHotels,
  getHotelById,
  getHotelRooms,
  getHotelAmenities,
  getHotelImages,
  getHotelAvailability,
};
