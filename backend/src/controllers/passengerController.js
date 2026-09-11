const passengerService = require("../services/passengerService");
const { sendSuccess } = require("../utils/response");

const getPassengers = async (req, res, next) => {
  try {
    const userId = req.user.id || req.user.userId;
    const passengers = await passengerService.getSavedPassengers(userId);
    return sendSuccess(res, "Saved passengers retrieved successfully", { passengers });
  } catch (error) {
    next(error);
  }
};

const addPassenger = async (req, res, next) => {
  try {
    const userId = req.user.id || req.user.userId;
    const { name, age, gender, phone, email } = req.body;
    const passenger = await passengerService.addSavedPassenger(userId, { name, age, gender, phone, email });
    return sendSuccess(res, "Saved passenger added successfully", { passenger }, 201);
  } catch (error) {
    next(error);
  }
};

const updatePassenger = async (req, res, next) => {
  try {
    const userId = req.user.id || req.user.userId;
    const passengerId = req.params.id;
    const { name, age, gender, phone, email } = req.body;
    const passenger = await passengerService.updateSavedPassenger(userId, passengerId, { name, age, gender, phone, email });
    return sendSuccess(res, "Saved passenger updated successfully", { passenger });
  } catch (error) {
    next(error);
  }
};

const deletePassenger = async (req, res, next) => {
  try {
    const userId = req.user.id || req.user.userId;
    const passengerId = req.params.id;
    const result = await passengerService.deleteSavedPassenger(userId, passengerId);
    return sendSuccess(res, result.message);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPassengers,
  addPassenger,
  updatePassenger,
  deletePassenger,
};
