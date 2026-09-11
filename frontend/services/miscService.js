import api from './api';

const notificationService = {
  // GET /api/notifications
  getNotifications: async ({ page = 1, limit = 20, isRead } = {}) => {
    const params = new URLSearchParams({ page, limit });
    if (isRead !== undefined) params.append('isRead', isRead);
    return await api.get(`/notifications?${params.toString()}`, true);
  },

  // GET /api/notifications/unread-count
  getUnreadCount: async () => {
    return await api.get('/notifications/unread-count', true);
  },

  // PATCH /api/notifications/:id/read
  markAsRead: async (id) => {
    return await api.patch(`/notifications/${id}/read`, {}, true);
  },

  // PATCH /api/notifications/mark-all-read
  markAllRead: async () => {
    return await api.patch('/notifications/mark-all-read', {}, true);
  },

  // DELETE /api/notifications/:id
  deleteNotification: async (id) => {
    return await api.delete(`/notifications/${id}`, true);
  },

  // POST /api/notifications/fcm-token
  registerFCMToken: async (token, platform = 'android') => {
    return await api.post('/notifications/fcm-token', { token, platform }, true);
  },
};

const offerService = {
  // GET /api/offers
  getOffers: async ({ travelType, page = 1, limit = 20 } = {}) => {
    const params = new URLSearchParams({ page, limit });
    if (travelType) params.append('travelType', travelType);
    return await api.get(`/offers?${params.toString()}`);
  },

  // GET /api/offers/:id
  getOfferById: async (id) => api.get(`/offers/${id}`),

  // POST /api/coupons/validate
  validateCoupon: async ({ code, amount, bookingType }) => {
    return await api.post('/coupons/validate', { code, amount, bookingType }, true);
  },

  // GET /api/coupons/my-coupons
  getMyCoupons: async () => api.get('/coupons/my-coupons', true),
};

const supportService = {
  // POST /api/support/tickets
  createTicket: async ({ subject, description, priority, bookingId }) => {
    return await api.post('/support/tickets', { subject, description, priority, bookingId }, true);
  },

  // GET /api/support/tickets
  getTickets: async ({ page = 1, limit = 20 } = {}) => {
    return await api.get(`/support/tickets?page=${page}&limit=${limit}`, true);
  },

  // GET /api/support/tickets/:id
  getTicketById: async (id) => api.get(`/support/tickets/${id}`, true),

  // PATCH /api/support/tickets/:id
  updateTicket: async (id, status) => api.patch(`/support/tickets/${id}`, { status }, true),
};

const safetyService = {
  // POST /api/safety/reports
  createReport: async ({ type, description, bookingId }) => {
    return await api.post('/safety/reports', { type, description, bookingId }, true);
  },

  // GET /api/safety/reports
  getReports: async ({ page = 1, limit = 20 } = {}) => {
    return await api.get(`/safety/reports?page=${page}&limit=${limit}`, true);
  },
};

const reviewService = {
  // POST /api/reviews
  createReview: async ({ rating, title, comment, bookingId }) => {
    return await api.post('/reviews', { rating, title, comment, bookingId }, true);
  },

  // GET /api/reviews
  getReviews: async ({ page = 1, limit = 20, rating } = {}) => {
    const params = new URLSearchParams({ page, limit });
    if (rating) params.append('rating', rating);
    return await api.get(`/reviews?${params.toString()}`);
  },

  // PATCH /api/reviews/:id
  updateReview: async (id, updates) => api.patch(`/reviews/${id}`, updates, true),

  // DELETE /api/reviews/:id
  deleteReview: async (id) => api.delete(`/reviews/${id}`, true),
};

export { notificationService, offerService, supportService, safetyService, reviewService };
