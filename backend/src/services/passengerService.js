const PassengerModel = require("../models/passengerModel");
const { validateEmail, validatePhone } = require("../utils/validation");

const passengerService = {
  getSavedPassengers: async (userId) => {
    return await PassengerModel.findByUserId(userId);
  },

  addSavedPassenger: async (userId, { name, age, gender, phone, email }) => {
    if (!name || !name.trim()) {
      const error = new Error("Passenger name is required");
      error.statusCode = 400;
      throw error;
    }

    if (age === undefined || age === null || isNaN(parseInt(age, 10)) || parseInt(age, 10) <= 0) {
      const error = new Error("Please provide a valid age greater than 0");
      error.statusCode = 400;
      throw error;
    }

    if (!gender || !gender.trim()) {
      const error = new Error("Gender is required");
      error.statusCode = 400;
      throw error;
    }

    if (email && !validateEmail(email)) {
      const error = new Error("Please provide a valid email address for passenger");
      error.statusCode = 400;
      throw error;
    }

    if (phone && !validatePhone(phone)) {
      const error = new Error("Please provide a valid phone number for passenger");
      error.statusCode = 400;
      throw error;
    }

    return await PassengerModel.create({
      userId,
      name,
      age: parseInt(age, 10),
      gender,
      phone,
      email,
    });
  },

  updateSavedPassenger: async (userId, passengerId, { name, age, gender, phone, email }) => {
    const existingPassenger = await PassengerModel.findById(passengerId);

    if (!existingPassenger || existingPassenger.userId !== userId) {
      const error = new Error("Saved passenger not found");
      error.statusCode = 404;
      throw error;
    }

    if (name !== undefined && (!name || !name.trim())) {
      const error = new Error("Passenger name cannot be empty");
      error.statusCode = 400;
      throw error;
    }

    if (age !== undefined && (isNaN(parseInt(age, 10)) || parseInt(age, 10) <= 0)) {
      const error = new Error("Please provide a valid age greater than 0");
      error.statusCode = 400;
      throw error;
    }

    if (gender !== undefined && (!gender || !gender.trim())) {
      const error = new Error("Gender cannot be empty");
      error.statusCode = 400;
      throw error;
    }

    if (email && !validateEmail(email)) {
      const error = new Error("Please provide a valid email address for passenger");
      error.statusCode = 400;
      throw error;
    }

    if (phone && !validatePhone(phone)) {
      const error = new Error("Please provide a valid phone number for passenger");
      error.statusCode = 400;
      throw error;
    }

    return await PassengerModel.update(passengerId, { name, age, gender, phone, email });
  },

  deleteSavedPassenger: async (userId, passengerId) => {
    const existingPassenger = await PassengerModel.findById(passengerId);

    if (!existingPassenger || existingPassenger.userId !== userId) {
      const error = new Error("Saved passenger not found");
      error.statusCode = 404;
      throw error;
    }

    await PassengerModel.delete(passengerId);
    return { message: "Saved passenger deleted successfully" };
  },
};

module.exports = passengerService;
