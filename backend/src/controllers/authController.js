const userService = require("../services/userService");
const otpService = require("../services/otpService");
const { sendSuccess } = require("../utils/response");

const register = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;
    const result = await userService.registerUser({ name, email, phone, password });
    return sendSuccess(res, "Registration successful", result, 201);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, phone, password } = req.body;
    const result = await userService.loginUser({ email, phone, password });
    return sendSuccess(res, "Login successful", result, 200);
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res) => {
  return sendSuccess(res, "Logout successful", { message: "User logged out successfully" }, 200);
};

const sendOtp = async (req, res, next) => {
  try {
    const { phone, email, purpose, deviceToken, platform } = req.body;
    const result = await otpService.sendOtp({ phone, email, purpose, deviceToken, platform });
    return sendSuccess(res, result.message, result, 200);
  } catch (error) {
    next(error);
  }
};

const verifyOtp = async (req, res, next) => {
  try {
    const { phone, email, otp, newPassword } = req.body;
    const result = await otpService.verifyOtp({ phone, email, otp, newPassword });
    return sendSuccess(res, result.message, result, 200);
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { phone, email, otp, newPassword, confirmPassword } = req.body;
    const result = await otpService.resetPassword({ phone, email, otp, newPassword, confirmPassword });
    return sendSuccess(res, result.message, result, 200);
  } catch (error) {
    next(error);
  }
};


module.exports = { register, login, logout, sendOtp, verifyOtp, resetPassword };


