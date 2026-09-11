import api from './api';

const bookingService = {
  // POST /api/bookings
  createBooking: async (bookingData) => {
    return await api.post('/bookings', bookingData, true);
  },

  // GET /api/bookings
  getMyBookings: async ({ page = 1, limit = 20, status, bookingType } = {}) => {
    const params = new URLSearchParams({ page, limit });
    if (status) params.append('status', status);
    if (bookingType) params.append('bookingType', bookingType);
    return await api.get(`/bookings?${params.toString()}`, true);
  },

  // GET /api/bookings/:id
  getBookingById: async (id) => {
    return await api.get(`/bookings/${id}`, true);
  },

  // GET /api/bookings/reference/:reference
  getBookingByReference: async (reference) => {
    return await api.get(`/bookings/reference/${reference}`, true);
  },

  // GET /api/bookings/:bookingId/tracking
  getBookingTracking: async (bookingId) => {
    return await api.get(`/bookings/${bookingId}/tracking`, true);
  },

  // GET /api/bookings/:bookingId/delay
  getBookingDelay: async (bookingId) => {
    return await api.get(`/bookings/${bookingId}/delay`, true);
  },

  // POST /api/payments/initiate
  initiatePayment: async ({ bookingId, amount, method, currency = 'INR' }) => {
    return await api.post('/payments/initiate', { bookingId, amount, method, currency }, true);
  },

  // POST /api/payments/verify
  verifyPayment: async ({ bookingId, paymentReference, status }) => {
    return await api.post('/payments/verify', { bookingId, paymentReference, status }, true);
  },

  // GET /api/payments/:bookingId
  getPaymentStatus: async (bookingId) => {
    return await api.get(`/payments/${bookingId}`, true);
  },

  // POST /api/cancellations
  requestCancellation: async ({ bookingId, reason }) => {
    return await api.post('/cancellations', { bookingId, reason }, true);
  },

  // GET /api/cancellations
  getCancellations: async ({ page = 1, limit = 20 } = {}) => {
    return await api.get(`/cancellations?page=${page}&limit=${limit}`, true);
  },

  // GET /api/cancellations/:id
  getCancellationById: async (id) => {
    return await api.get(`/cancellations/${id}`, true);
  },

  // POST /api/trips/:bookingId/share
  shareTrip: async (bookingId) => {
    return await api.post(`/trips/${bookingId}/share`, {}, true);
  },

  // GET /api/trips/:bookingId/shares
  getTripShares: async (bookingId) => {
    return await api.get(`/trips/${bookingId}/shares`, true);
  },

  // DELETE /api/trips/shares/:shareId
  revokeShare: async (shareId) => {
    return await api.delete(`/trips/shares/${shareId}`, true);
  },
};

export default bookingService;
