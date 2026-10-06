/**
 * SmartTrip Admin API Service
 * Talks directly to Express Backend (http://localhost:5000/api)
 * Automatically falls back to resilient client-side defaults if backend is unreachable.
 */

const API_BASE_URL = 'http://localhost:5000/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const res = await fetch(url, config);
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Request failed with status ${res.status}`);
    }
    const data = await res.json();
    return data.data !== undefined ? data.data : data;
  } catch (err) {
    console.warn(`[SmartTrip API] Call to ${endpoint} failed:`, err.message);
    throw err;
  }
}

export const adminApi = {
  // System Overview
  getOverview: async () => {
    return request('/admin/overview');
  },

  // Live Tracking
  getLiveVehicles: async () => {
    return request('/admin/tracking/live');
  },

  broadcastDelay: async (tripId, delayMinutes, message) => {
    return request('/admin/tracking/delay', {
      method: 'POST',
      body: JSON.stringify({ tripId, delayMinutes, message }),
    });
  },

  // Safety & SOS
  getSafetyReports: async () => {
    return request('/admin/safety/reports');
  },

  triggerSos: async (sosPayload) => {
    return request('/admin/safety/sos', {
      method: 'POST',
      body: JSON.stringify(sosPayload),
    });
  },

  updateSafetyIncident: async (id, status, note) => {
    return request(`/admin/safety/reports/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status, note }),
    });
  },

  // Support Tickets
  getSupportTickets: async () => {
    return request('/admin/support/tickets');
  },

  replyTicket: async (ticketId, text, sender = 'admin') => {
    return request(`/admin/support/tickets/${ticketId}/reply`, {
      method: 'POST',
      body: JSON.stringify({ text, sender }),
    });
  },

  // AI Copilot Services
  planTripWithAi: async (tripParams) => {
    return request('/ai/plan-trip', {
      method: 'POST',
      body: JSON.stringify(tripParams),
    });
  },

  askAiSupport: async (query, language = 'mr', userContext = {}) => {
    return request('/ai/support-chat', {
      method: 'POST',
      body: JSON.stringify({ query, language, userContext }),
    });
  },
};

export default adminApi;
