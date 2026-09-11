import api from './api';

const trainService = {
  // GET /api/trains/search
  searchTrains: async ({ source, destination, date, passengers = 1, classCode, page = 1, limit = 20 }) => {
    const params = new URLSearchParams({
      source, destination, date, passengers, page, limit,
      ...(classCode ? { classCode } : {}),
    });
    return await api.get(`/trains/search?${params.toString()}`);
  },

  // GET /api/trains/operators
  getOperators: async () => api.get('/trains/operators'),

  // GET /api/trains/:scheduleId
  getScheduleById: async (scheduleId) => api.get(`/trains/${scheduleId}`),

  // GET /api/trains/:scheduleId/seats
  getSeats: async (scheduleId, classCode) => {
    const params = classCode ? `?classCode=${classCode}` : '';
    return api.get(`/trains/${scheduleId}/seats${params}`);
  },

  // GET /api/trains/:scheduleId/live-status
  getLiveStatus: async (scheduleId) => api.get(`/trains/${scheduleId}/live-status`),
};

const flightService = {
  // GET /api/flights/search
  searchFlights: async ({ source, destination, date, passengers = 1, flightClass, page = 1, limit = 20 }) => {
    const params = new URLSearchParams({
      source, destination, date, passengers, page, limit,
      ...(flightClass ? { class: flightClass } : {}),
    });
    return await api.get(`/flights/search?${params.toString()}`);
  },

  // GET /api/flights/airlines
  getAirlines: async () => api.get('/flights/airlines'),

  // GET /api/flights/:scheduleId
  getScheduleById: async (scheduleId) => api.get(`/flights/${scheduleId}`),

  // GET /api/flights/:scheduleId/seats
  getSeats: async (scheduleId) => api.get(`/flights/${scheduleId}/seats`),

  // GET /api/flights/:scheduleId/addons
  getAddons: async (scheduleId) => api.get(`/flights/${scheduleId}/addons`),
};

const hotelService = {
  // GET /api/hotels/search
  searchHotels: async ({ city, checkIn, checkOut, rooms = 1, guests = 2, page = 1, limit = 20 }) => {
    const params = new URLSearchParams({ city, checkIn, checkOut, rooms, guests, page, limit });
    return await api.get(`/hotels/search?${params.toString()}`);
  },

  // GET /api/hotels
  getAllHotels: async (city) => {
    const params = city ? `?city=${city}` : '';
    return api.get(`/hotels${params}`);
  },

  // GET /api/hotels/:id
  getHotelById: async (id) => api.get(`/hotels/${id}`),

  // GET /api/hotels/:id/rooms
  getRooms: async (hotelId, { checkIn, checkOut, rooms = 1 } = {}) => {
    const params = new URLSearchParams({ ...(checkIn ? { checkIn } : {}), ...(checkOut ? { checkOut } : {}), rooms });
    return api.get(`/hotels/${hotelId}/rooms?${params.toString()}`);
  },
};

export { trainService, flightService, hotelService };
