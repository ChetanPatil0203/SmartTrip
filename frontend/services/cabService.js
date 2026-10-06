import api from './api';

const cabService = {
  // GET /api/cabs/search?pickup=&drop=&category=&isEv=
  searchCabs: async ({ pickup, drop, category = 'all', isEv } = {}) => {
    const params = new URLSearchParams({
      ...(pickup ? { pickup } : {}),
      ...(drop ? { drop } : {}),
      ...(category ? { category } : {}),
      ...(isEv !== undefined ? { isEv } : {}),
    });
    return await api.get(`/cabs/search?${params.toString()}`);
  },

  // GET /api/cabs/estimate?pickup=&drop=
  getEstimate: async ({ pickup, drop } = {}) => {
    const params = new URLSearchParams({
      ...(pickup ? { pickup } : {}),
      ...(drop ? { drop } : {}),
    });
    return await api.get(`/cabs/estimate?${params.toString()}`);
  },

  // GET /api/cabs/drivers
  getDrivers: async () => {
    return await api.get('/cabs/drivers');
  },

  // GET /api/cabs/vehicles/:id
  getVehicleById: async (id) => {
    return await api.get(`/cabs/vehicles/${id}`);
  },

  // POST /api/cabs/book
  bookCab: async (bookingData) => {
    return await api.post('/cabs/book', bookingData);
  },

  // GET /api/cabs/tracking/:bookingId
  getLiveTracking: async (bookingId) => {
    return await api.get(`/cabs/tracking/${bookingId}`);
  },

  // PATCH /api/cabs/tracking/:bookingId/status
  updateRideStatus: async (bookingId, { stage, status }) => {
    return await api.patch(`/cabs/tracking/${bookingId}/status`, { stage, status });
  },

  // POST /api/cabs/tracking/:bookingId/cancel
  cancelCab: async (bookingId, reason = 'User cancelled ride') => {
    return await api.post(`/cabs/tracking/${bookingId}/cancel`, { reason });
  },
};

export default cabService;
