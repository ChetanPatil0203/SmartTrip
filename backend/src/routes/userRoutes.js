const express = require("express");
const { getProfile, updateProfile, changePassword, getUsers } = require("../controllers/userController");
const { getPassengers, addPassenger, updatePassenger, deletePassenger } = require("../controllers/passengerController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Current User Profile & Password
router.get("/me", authMiddleware, getProfile);
router.put("/me", authMiddleware, updateProfile);
router.put("/me/password", authMiddleware, changePassword);

// Saved Passengers CRUD
router.get("/me/saved-passengers", authMiddleware, getPassengers);
router.post("/me/saved-passengers", authMiddleware, addPassenger);
router.put("/me/saved-passengers/:id", authMiddleware, updatePassenger);
router.delete("/me/saved-passengers/:id", authMiddleware, deletePassenger);

// User List (Admin/Internal)
router.get("/", authMiddleware, getUsers);

module.exports = router;
