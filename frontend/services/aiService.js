import api from './api';

const aiService = {
  // POST /api/ai/plan-trip
  planTrip: async ({
    query,
    origin,
    destination,
    destinations,
    days,
    budget,
    travelType,
    travelStyle,
    passengersCount,
    preferredTransport,
    language = 'mr',
  }) => {
    return await api.post('/ai/plan-trip', {
      query,
      origin,
      destination,
      destinations,
      days,
      budget,
      travelType,
      travelStyle,
      passengersCount,
      preferredTransport,
      language,
    });
  },

  // POST /api/ai/support-chat
  askSupportChat: async ({ query, language = 'mr', userContext = {} }) => {
    return await api.post('/ai/support-chat', {
      query,
      language,
      userContext,
    });
  },
};

export default aiService;
