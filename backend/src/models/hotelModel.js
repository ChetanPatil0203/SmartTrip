const { prisma } = require("../config/db");

const hotelModel = {
  findHotels: async ({ where = {}, orderBy = [{ name: "asc" }], skip = 0, take = 10 }) => {
    return await prisma.hotel.findMany({
      where,
      orderBy,
      skip,
      take,
      select: {
        id: true,
        name: true,
        description: true,
        address: true,
        city: true,
        state: true,
        country: true,
        latitude: true,
        longitude: true,
        rating: true,
        phone: true,
        email: true,
        checkInTime: true,
        checkOutTime: true,
        images: {
          select: {
            id: true,
            imageUrl: true,
          },
          take: 1,
        },
        amenities: {
          select: {
            id: true,
            name: true,
          },
        },
        rooms: {
          select: {
            id: true,
            roomType: true,
            capacity: true,
            pricePerNight: true,
            availableRooms: true,
          },
        },
      },
    });
  },

  countHotels: async ({ where = {} }) => {
    return await prisma.hotel.count({ where });
  },

  findHotelById: async (id) => {
    return await prisma.hotel.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        address: true,
        city: true,
        state: true,
        country: true,
        latitude: true,
        longitude: true,
        rating: true,
        phone: true,
        email: true,
        checkInTime: true,
        checkOutTime: true,
        images: {
          select: {
            id: true,
            imageUrl: true,
          },
        },
        amenities: {
          select: {
            id: true,
            name: true,
          },
        },
        rooms: {
          select: {
            id: true,
            roomNumber: true,
            roomType: true,
            capacity: true,
            pricePerNight: true,
            totalRooms: true,
            availableRooms: true,
          },
        },
      },
    });
  },

  findRoomsByHotelId: async (hotelId, where = {}) => {
    return await prisma.hotelRoom.findMany({
      where: {
        hotelId,
        ...where,
      },
      select: {
        id: true,
        hotelId: true,
        roomNumber: true,
        roomType: true,
        capacity: true,
        pricePerNight: true,
        totalRooms: true,
        availableRooms: true,
      },
    });
  },

  findAmenitiesByHotelId: async (hotelId) => {
    return await prisma.hotelAmenity.findMany({
      where: { hotelId },
      select: {
        id: true,
        hotelId: true,
        name: true,
      },
    });
  },

  findImagesByHotelId: async (hotelId) => {
    return await prisma.hotelImage.findMany({
      where: { hotelId },
      select: {
        id: true,
        hotelId: true,
        imageUrl: true,
      },
    });
  },

  findAvailabilitiesByHotelId: async (hotelId, startDate, endDate) => {
    const where = { hotelId };
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = startDate;
      if (endDate) where.date.lte = endDate;
    }

    return await prisma.hotelAvailability.findMany({
      where,
      orderBy: { date: "asc" },
      select: {
        id: true,
        hotelId: true,
        roomId: true,
        date: true,
        availableRooms: true,
        price: true,
        room: {
          select: {
            id: true,
            roomNumber: true,
            roomType: true,
            capacity: true,
          },
        },
      },
    });
  },
};

module.exports = hotelModel;
