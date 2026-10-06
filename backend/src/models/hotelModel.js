const { prisma } = require("../config/db");

const DEFAULT_HOTELS = [
  {
    id: "hotel-1",
    name: "The Taj Mahal Palace & Tower",
    description: "Iconic luxury 5-star hotel facing the Gateway of India and Arabian Sea.",
    address: "Apollo Bunder, Colaba",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    latitude: 18.9217,
    longitude: 72.8332,
    rating: 4.9,
    phone: "+91 22 6665 3366",
    email: "tajpalace.mumbai@ihcltata.com",
    checkInTime: "14:00",
    checkOutTime: "12:00",
    images: [{ id: "img-1", imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800" }],
    amenities: [
      { id: "am-1", name: "Swimming Pool" },
      { id: "am-2", name: "Free Wi-Fi" },
      { id: "am-3", name: "Spa & Wellness" },
      { id: "am-4", name: "Fine Dining" },
    ],
    rooms: [
      { id: "room-1", roomType: "DELUXE", capacity: 2, pricePerNight: 9500, availableRooms: 8 },
      { id: "room-2", roomType: "SUITE", capacity: 4, pricePerNight: 18500, availableRooms: 3 },
    ],
  },
  {
    id: "hotel-2",
    name: "Trident Bandra Kurla",
    description: "Contemporary 5-star business hotel in the heart of BKC financial district.",
    address: "C-56, G Block, Bandra Kurla Complex",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    latitude: 19.0657,
    longitude: 72.8687,
    rating: 4.7,
    phone: "+91 22 6672 7777",
    email: "trident.bkc@oberoigroup.com",
    checkInTime: "14:00",
    checkOutTime: "12:00",
    images: [{ id: "img-2", imageUrl: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800" }],
    amenities: [
      { id: "am-5", name: "Fitness Center" },
      { id: "am-6", name: "Free Wi-Fi" },
      { id: "am-7", name: "Business Center" },
    ],
    rooms: [
      { id: "room-3", roomType: "DELUXE", capacity: 2, pricePerNight: 7200, availableRooms: 12 },
      { id: "room-4", roomType: "SUITE", capacity: 3, pricePerNight: 14000, availableRooms: 4 },
    ],
  },
];

const hotelModel = {
  findHotels: async ({ where = {}, orderBy = [{ name: "asc" }], skip = 0, take = 10 }) => {
    try {
      const res = await prisma.hotel.findMany({
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
      if (res && res.length > 0) return res;
    } catch (e) {
      // Fallback
    }
    return DEFAULT_HOTELS.slice(skip, skip + take);
  },

  countHotels: async ({ where = {} }) => {
    try {
      const cnt = await prisma.hotel.count({ where });
      if (cnt > 0) return cnt;
    } catch (e) {
      // Fallback
    }
    return DEFAULT_HOTELS.length;
  },

  findHotelById: async (id) => {
    try {
      const res = await prisma.hotel.findUnique({
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
          images: { select: { id: true, imageUrl: true } },
          amenities: { select: { id: true, name: true } },
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
      if (res) return res;
    } catch (e) {
      // Fallback
    }
    return DEFAULT_HOTELS.find((h) => h.id === id) || DEFAULT_HOTELS[0];
  },

  findRoomById: async (roomId) => {
    try {
      const res = await prisma.hotelRoom.findUnique({
        where: { id: roomId },
        include: { hotel: true },
      });
      if (res) return res;
    } catch (e) {
      // Fallback
    }
    for (const h of DEFAULT_HOTELS) {
      const r = h.rooms.find((rm) => rm.id === roomId);
      if (r) return { ...r, hotel: h };
    }
    return null;
  },
};

module.exports = hotelModel;
