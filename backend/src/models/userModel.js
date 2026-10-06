const { prisma } = require("../config/db");

const UserModel = {
  findByEmail: async (email) => {
    return await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });
  },

  findByPhone: async (phone) => {
    if (!phone) return null;
    const trimmed = phone.trim();
    const clean10 = trimmed.replace(/[^0-9]/g, "").slice(-10);
    return await prisma.user.findFirst({
      where: {
        OR: [
          { phone: trimmed },
          { phone: clean10 },
          { phone: `+91${clean10}` },
          { phone: `+91 ${clean10}` },
          { phone: `0${clean10}` },
        ],
      },
    });
  },

  findById: async (id) => {
    return await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        profileImage: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  findByIdWithPassword: async (id) => {
    return await prisma.user.findUnique({
      where: { id },
    });
  },

  create: async (userData) => {
    return await prisma.user.create({
      data: {
        name: userData.name ? userData.name.trim() : null,
        email: userData.email.toLowerCase().trim(),
        phone: userData.phone ? userData.phone.trim() : null,
        password: userData.password,
        role: userData.role || "USER",
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        profileImage: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  update: async (id, data) => {
    const updateData = {};
    if (data.name !== undefined) updateData.name = data.name ? data.name.trim() : null;
    if (data.phone !== undefined) updateData.phone = data.phone ? data.phone.trim() : null;
    if (data.profileImage !== undefined) updateData.profileImage = data.profileImage;

    return await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        profileImage: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  updatePassword: async (id, hashedPassword) => {
    return await prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });
  },

  findAll: async () => {
    return await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        profileImage: true,
        role: true,
        createdAt: true,
      },
    });
  },
};

module.exports = UserModel;
