const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");
const config = require("../config/env");
const { validateEmail, validatePassword, validatePhone } = require("../utils/validation");

const userService = {
  registerUser: async ({ name, email, phone, password }) => {
    // 1. Validate Email
    if (!validateEmail(email)) {
      const error = new Error("Please provide a valid email address");
      error.statusCode = 400;
      throw error;
    }

    // 2. Validate Password
    if (!validatePassword(password)) {
      const error = new Error("Password must be at least 8 characters long");
      error.statusCode = 400;
      throw error;
    }

    // 3. Validate Phone if provided
    if (phone && !validatePhone(phone)) {
      const error = new Error("Please provide a valid phone number");
      error.statusCode = 400;
      throw error;
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 4. Check Duplicate Email
    const existingUser = await UserModel.findByEmail(normalizedEmail);
    if (existingUser) {
      const error = new Error("User with this email already exists");
      error.statusCode = 409;
      throw error;
    }

    // 5. Check Duplicate Phone if provided
    if (phone) {
      const existingPhone = await UserModel.findByPhone(phone);
      if (existingPhone) {
        const error = new Error("User with this phone number already exists");
        error.statusCode = 409;
        throw error;
      }
    }

    // 6. Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 7. Create User
    const newUser = await UserModel.create({
      name,
      email: normalizedEmail,
      phone,
      password: hashedPassword,
      role: "USER",
    });

    // 8. Generate JWT
    const token = jwt.sign(
      { id: newUser.id, userId: newUser.id, role: newUser.role },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    return {
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        profileImage: newUser.profileImage,
        role: newUser.role,
        createdAt: newUser.createdAt,
      },
      token,
    };
  },

  loginUser: async ({ email, password }) => {
    if (!email || !password) {
      const error = new Error("Email and password are required");
      error.statusCode = 400;
      throw error;
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await UserModel.findByEmail(normalizedEmail);
    if (!user) {
      const error = new Error("Invalid email or password");
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error = new Error("Invalid email or password");
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      { id: user.id, userId: user.id, role: user.role },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        profileImage: user.profileImage,
        role: user.role,
        createdAt: user.createdAt,
      },
      token,
    };
  },

  getUserProfile: async (userId) => {
    const user = await UserModel.findById(userId);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }
    return user;
  },

  updateUserProfile: async (userId, { name, phone, profileImage }) => {
    const user = await UserModel.findById(userId);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    if (phone && phone.trim() !== user.phone) {
      if (!validatePhone(phone)) {
        const error = new Error("Please provide a valid phone number");
        error.statusCode = 400;
        throw error;
      }
      const existingPhone = await UserModel.findByPhone(phone);
      if (existingPhone && existingPhone.id !== userId) {
        const error = new Error("Phone number is already in use by another account");
        error.statusCode = 409;
        throw error;
      }
    }

    const updatedUser = await UserModel.update(userId, { name, phone, profileImage });
    return updatedUser;
  },

  changeUserPassword: async (userId, { currentPassword, newPassword }) => {
    if (!currentPassword || !newPassword) {
      const error = new Error("Current password and new password are required");
      error.statusCode = 400;
      throw error;
    }

    if (!validatePassword(newPassword)) {
      const error = new Error("New password must be at least 8 characters long");
      error.statusCode = 400;
      throw error;
    }

    const user = await UserModel.findByIdWithPassword(userId);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      const error = new Error("Current password is incorrect");
      error.statusCode = 400;
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await UserModel.updatePassword(userId, hashedPassword);

    return { message: "Password updated successfully" };
  },

  getAllUsers: async () => {
    return await UserModel.findAll();
  },
};

module.exports = userService;
