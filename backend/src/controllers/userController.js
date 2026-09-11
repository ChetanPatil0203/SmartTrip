const userService = require("../services/userService");
const { sendSuccess } = require("../utils/response");

const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id || req.user.userId;
    const user = await userService.getUserProfile(userId);
    return sendSuccess(res, "Profile retrieved successfully", { user });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id || req.user.userId;
    const { name, phone, profileImage } = req.body;
    const updatedUser = await userService.updateUserProfile(userId, { name, phone, profileImage });
    return sendSuccess(res, "Profile updated successfully", { user: updatedUser });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const userId = req.user.id || req.user.userId;
    const { currentPassword, newPassword } = req.body;
    const result = await userService.changeUserPassword(userId, { currentPassword, newPassword });
    return sendSuccess(res, result.message);
  } catch (error) {
    next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    return sendSuccess(res, "User list retrieved", { users });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  getUsers,
};
