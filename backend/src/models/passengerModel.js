const { prisma } = require("../config/db");

const PassengerModel = {
  findByUserId: async (userId) => {
    return await prisma.savedPassenger.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  },

  findById: async (id) => {
    return await prisma.savedPassenger.findUnique({
      where: { id },
    });
  },

  create: async (passengerData) => {
    return await prisma.savedPassenger.create({
      data: {
        userId: passengerData.userId,
        name: passengerData.name.trim(),
        age: parseInt(passengerData.age, 10),
        gender: passengerData.gender.toUpperCase().trim(),
        phone: passengerData.phone ? passengerData.phone.trim() : null,
        email: passengerData.email ? passengerData.email.toLowerCase().trim() : null,
      },
    });
  },

  update: async (id, passengerData) => {
    const updateData = {};
    if (passengerData.name !== undefined) updateData.name = passengerData.name.trim();
    if (passengerData.age !== undefined) updateData.age = parseInt(passengerData.age, 10);
    if (passengerData.gender !== undefined) updateData.gender = passengerData.gender.toUpperCase().trim();
    if (passengerData.phone !== undefined) updateData.phone = passengerData.phone ? passengerData.phone.trim() : null;
    if (passengerData.email !== undefined) updateData.email = passengerData.email ? passengerData.email.toLowerCase().trim() : null;

    return await prisma.savedPassenger.update({
      where: { id },
      data: updateData,
    });
  },

  delete: async (id) => {
    return await prisma.savedPassenger.delete({
      where: { id },
    });
  },
};

module.exports = PassengerModel;
