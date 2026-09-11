const hotelModel = require("../models/hotelModel");

const hotelService = {
  searchHotels: async (query) => {
    const {
      search,
      location,
      city,
      country,
      checkIn,
      checkOut,
      guests,
      rooms,
      minPrice,
      maxPrice,
      minRating,
      maxRating,
      amenities,
      sortBy = "name_asc",
      page = 1,
      limit = 10,
    } = query;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const where = {};
    const andConditions = [];

    // Search query (matches name, city, address, country)
    if (search && search.trim()) {
      const term = search.trim();
      andConditions.push({
        OR: [
          { name: { contains: term } },
          { city: { contains: term } },
          { address: { contains: term } },
          { country: { contains: term } },
        ],
      });
    }

    // Location query (matches city, address, country, name)
    if (location && location.trim()) {
      const locTerm = location.trim();
      andConditions.push({
        OR: [
          { city: { contains: locTerm } },
          { address: { contains: locTerm } },
          { country: { contains: locTerm } },
          { name: { contains: locTerm } },
        ],
      });
    }

    // City filter
    if (city && city.trim()) {
      andConditions.push({ city: { contains: city.trim() } });
    }

    // Country filter
    if (country && country.trim()) {
      andConditions.push({ country: { contains: country.trim() } });
    }

    // Rating filter
    if ((minRating !== undefined && minRating !== "") || (maxRating !== undefined && maxRating !== "")) {
      const ratingFilter = {};
      if (minRating !== undefined && minRating !== "") ratingFilter.gte = parseFloat(minRating);
      if (maxRating !== undefined && maxRating !== "") ratingFilter.lte = parseFloat(maxRating);
      andConditions.push({ rating: ratingFilter });
    }

    // Amenities filter
    if (amenities && amenities.trim()) {
      const amenityList = amenities.split(",").map((a) => a.trim()).filter(Boolean);
      amenityList.forEach((amenityName) => {
        andConditions.push({
          amenities: {
            some: {
              name: { contains: amenityName },
            },
          },
        });
      });
    }

    // Price filter (filters via room pricePerNight)
    if ((minPrice !== undefined && minPrice !== "") || (maxPrice !== undefined && maxPrice !== "")) {
      const roomPriceFilter = {};
      if (minPrice !== undefined && minPrice !== "") roomPriceFilter.gte = parseFloat(minPrice);
      if (maxPrice !== undefined && maxPrice !== "") roomPriceFilter.lte = parseFloat(maxPrice);
      andConditions.push({
        rooms: {
          some: {
            pricePerNight: roomPriceFilter,
          },
        },
      });
    }

    // Guests & Rooms capacity filter
    if ((guests !== undefined && guests !== "") || (rooms !== undefined && rooms !== "")) {
      const reqGuests = parseInt(guests, 10) || 1;
      const reqRooms = parseInt(rooms, 10) || 1;
      const minCapacityPerRoom = Math.ceil(reqGuests / reqRooms);
      andConditions.push({
        rooms: {
          some: {
            capacity: { gte: minCapacityPerRoom },
            availableRooms: { gte: reqRooms },
          },
        },
      });
    }

    if (andConditions.length > 0) {
      where.AND = andConditions;
    }

    // Determine Prisma orderBy
    let orderBy = [{ name: "asc" }];
    if (sortBy === "name_desc") {
      orderBy = [{ name: "desc" }];
    } else if (sortBy === "rating_high") {
      orderBy = [{ rating: "desc" }];
    } else if (sortBy === "rating_low") {
      orderBy = [{ rating: "asc" }];
    }

    const [rawHotels, totalCount] = await Promise.all([
      hotelModel.findHotels({ where, orderBy, skip, take: limitNum }),
      hotelModel.countHotels({ where }),
    ]);

    let formattedHotels = rawHotels.map((h) => {
      const startingPrice = h.rooms.length > 0
        ? Math.min(...h.rooms.map((r) => r.pricePerNight))
        : 0;
      const mainImage = h.images.length > 0 ? h.images[0].imageUrl : null;
      const amenityNames = h.amenities.map((a) => a.name);

      return {
        id: h.id,
        name: h.name,
        description: h.description,
        location: {
          address: h.address,
          city: h.city,
          state: h.state,
          country: h.country,
          latitude: h.latitude,
          longitude: h.longitude,
        },
        rating: h.rating || 0,
        phone: h.phone,
        email: h.email,
        checkInTime: h.checkInTime,
        checkOutTime: h.checkOutTime,
        startingPrice,
        currency: "INR",
        image: mainImage,
        amenities: amenityNames,
      };
    });

    // In-memory price sorting if requested (since startingPrice is dynamic)
    if (sortBy === "price_low") {
      formattedHotels.sort((a, b) => a.startingPrice - b.startingPrice);
    } else if (sortBy === "price_high") {
      formattedHotels.sort((a, b) => b.startingPrice - a.startingPrice);
    }

    const totalPages = Math.ceil(totalCount / limitNum) || (totalCount > 0 ? 1 : 0);

    return {
      search: {
        search: search ? search.trim() : null,
        location: location ? location.trim() : null,
        city: city ? city.trim() : null,
        country: country ? country.trim() : null,
        checkIn: checkIn ? checkIn.trim() : null,
        checkOut: checkOut ? checkOut.trim() : null,
        guests: guests ? parseInt(guests, 10) : 1,
        rooms: rooms ? parseInt(rooms, 10) : 1,
      },
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: totalCount,
        totalPages,
      },
      hotels: formattedHotels,
    };
  },

  getHotelById: async (id) => {
    const hotel = await hotelModel.findHotelById(id);
    if (!hotel) {
      const error = new Error("Hotel not found");
      error.statusCode = 404;
      throw error;
    }

    const startingPrice = hotel.rooms.length > 0
      ? Math.min(...hotel.rooms.map((r) => r.pricePerNight))
      : 0;

    return {
      hotel: {
        id: hotel.id,
        name: hotel.name,
        description: hotel.description,
        location: {
          address: hotel.address,
          city: hotel.city,
          state: hotel.state,
          country: hotel.country,
          latitude: hotel.latitude,
          longitude: hotel.longitude,
        },
        rating: hotel.rating || 0,
        phone: hotel.phone,
        email: hotel.email,
        checkInTime: hotel.checkInTime,
        checkOutTime: hotel.checkOutTime,
        startingPrice,
        currency: "INR",
        images: hotel.images,
        amenities: hotel.amenities,
        rooms: hotel.rooms.map((r) => ({
          id: r.id,
          roomNumber: r.roomNumber,
          roomType: r.roomType,
          capacity: r.capacity,
          pricePerNight: r.pricePerNight,
          totalRooms: r.totalRooms,
          availableRooms: r.availableRooms,
          status: r.availableRooms > 0 ? "AVAILABLE" : "UNAVAILABLE",
        })),
      },
    };
  },

  getHotelRooms: async (hotelId, query = {}) => {
    const hotel = await hotelModel.findHotelById(hotelId);
    if (!hotel) {
      const error = new Error("Hotel not found");
      error.statusCode = 404;
      throw error;
    }

    const rooms = await hotelModel.findRoomsByHotelId(hotelId);
    const formattedRooms = rooms.map((r) => ({
      id: r.id,
      hotelId: r.hotelId,
      roomNumber: r.roomNumber,
      roomType: r.roomType,
      capacity: r.capacity,
      pricePerNight: r.pricePerNight,
      currency: "INR",
      totalRooms: r.totalRooms,
      availableRooms: r.availableRooms,
      status: r.availableRooms > 0 ? "AVAILABLE" : "UNAVAILABLE",
    }));

    return {
      hotelId,
      hotelName: hotel.name,
      rooms: formattedRooms,
    };
  },

  getHotelAmenities: async (hotelId) => {
    const hotel = await hotelModel.findHotelById(hotelId);
    if (!hotel) {
      const error = new Error("Hotel not found");
      error.statusCode = 404;
      throw error;
    }

    const amenities = await hotelModel.findAmenitiesByHotelId(hotelId);
    return {
      hotelId,
      hotelName: hotel.name,
      amenities,
    };
  },

  getHotelImages: async (hotelId) => {
    const hotel = await hotelModel.findHotelById(hotelId);
    if (!hotel) {
      const error = new Error("Hotel not found");
      error.statusCode = 404;
      throw error;
    }

    const images = await hotelModel.findImagesByHotelId(hotelId);
    return {
      hotelId,
      hotelName: hotel.name,
      images,
    };
  },

  getHotelAvailability: async (hotelId, query = {}) => {
    const hotel = await hotelModel.findHotelById(hotelId);
    if (!hotel) {
      const error = new Error("Hotel not found");
      error.statusCode = 404;
      throw error;
    }

    const { checkIn, checkOut } = query;
    let startDate = undefined;
    let endDate = undefined;

    if (checkIn) startDate = new Date(checkIn.trim());
    if (checkOut) endDate = new Date(checkOut.trim());

    const availabilities = await hotelModel.findAvailabilitiesByHotelId(hotelId, startDate, endDate);

    if (availabilities.length === 0) {
      return {
        hotelId,
        hotelName: hotel.name,
        availability: [],
        message: "No availability data found",
      };
    }

    const formattedAvailabilities = availabilities.map((a) => ({
      id: a.id,
      hotelId: a.hotelId,
      roomId: a.roomId,
      roomType: a.room?.roomType || "DELUXE",
      date: a.date.toISOString().split("T")[0],
      availableRooms: a.availableRooms,
      price: a.price,
      currency: "INR",
      status: a.availableRooms > 0 ? "AVAILABLE" : "UNAVAILABLE",
    }));

    return {
      hotelId,
      hotelName: hotel.name,
      availability: formattedAvailabilities,
    };
  },
};

module.exports = hotelService;
