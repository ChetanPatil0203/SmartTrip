const userService = require("../services/userService");
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

module.exports = { register, login };
