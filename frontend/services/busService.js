import api from './api';

const busService = {
  // GET /api/buses/search?source=&destination=&date=&passengers=
  searchBuses: async ({ source, destination, date, passengers = 1, busType, page = 1, limit = 20 }) => {
    const params = new URLSearchParams({
      source,
      destination,
      date,
      passengers,
      page,
      limit,
      ...(busType ? { busType } : {}),
    });
    return await api.get(`/buses/search?${params.toString()}`);
  },

  // GET /api/buses/operators
  getOperators: async () => {
    return await api.get('/buses/operators');
  },

  // GET /api/buses/routes
  getRoutes: async (source, destination) => {
    const params = new URLSearchParams({
      ...(source ? { source } : {}),
      ...(destination ? { destination } : {}),
    });
    return await api.get(`/buses/routes?${params.toString()}`);
  },

  // GET /api/buses/:scheduleId
  getScheduleById: async (scheduleId) => {
    return await api.get(`/buses/${scheduleId}`);
  },

  // GET /api/buses/:scheduleId/seats
  getSeatLayout: async (scheduleId) => {
    return await api.get(`/buses/${scheduleId}/seats`);
  },

  // GET /api/buses/:scheduleId/boarding-points
  getBoardingPoints: async (scheduleId) => {
    return await api.get(`/buses/${scheduleId}/boarding-points`);
  },

  // GET /api/buses/:scheduleId/dropping-points
  getDroppingPoints: async (scheduleId) => {
    return await api.get(`/buses/${scheduleId}/dropping-points`);
  },

  // GET /api/buses/:scheduleId/tracking
  getLiveTracking: async (scheduleId) => {
    return await api.get(`/buses/${scheduleId}/tracking`);
  },

  // GET /api/buses/:scheduleId/delay
  getDelayAlert: async (scheduleId) => {
    return await api.get(`/buses/${scheduleId}/delay`);
  },
};

export default busService;
