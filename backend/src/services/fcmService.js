const logger = require('../utils/logger');

// In-memory token store: Map<userId, Set<{ token, platform, updatedAt }>>
const userDeviceTokens = new Map();

const fcmService = {
  /**
   * Register or update a user's FCM device token
   */
  registerDeviceToken: async (userId, token, platform = 'android') => {
    if (!userId || !token) {
      throw new Error('userId and token are required to register device token');
    }

    if (!userDeviceTokens.has(userId)) {
      userDeviceTokens.set(userId, new Map());
    }

    const tokensMap = userDeviceTokens.get(userId);
    tokensMap.set(token, {
      token,
      platform: platform.toLowerCase(),
      updatedAt: new Date().toISOString(),
    });

    logger.info(`[FCM] Device token registered for user: ${userId} (${platform})`);
    return { success: true, registeredCount: tokensMap.size };
  },

  /**
   * Unregister / remove a device token (e.g. on user logout)
   */
  unregisterDeviceToken: async (userId, token) => {
    if (userDeviceTokens.has(userId)) {
      const tokensMap = userDeviceTokens.get(userId);
      tokensMap.delete(token);
      if (tokensMap.size === 0) {
        userDeviceTokens.delete(userId);
      }
    }
    logger.info(`[FCM] Device token removed for user: ${userId}`);
    return { success: true };
  },

  /**
   * Get all registered tokens for a user
   */
  getUserTokens: (userId) => {
    if (!userDeviceTokens.has(userId)) return [];
    return Array.from(userDeviceTokens.get(userId).values());
  },

  /**
   * Send push notification to a user's registered devices
   */
  sendPushNotification: async (userId, { title, body, data = {} }) => {
    if (!userId || !title) return { delivered: 0 };

    const tokens = fcmService.getUserTokens(userId);

    // If no devices registered or in dev mode:
    if (tokens.length === 0) {
      logger.info(`[FCM] No active device tokens for user ${userId}. In-app notification available.`);
      return { delivered: 0, reason: 'NO_ACTIVE_TOKENS' };
    }

    // Check if Firebase service account is configured
    const hasFirebaseAdmin = Boolean(process.env.FIREBASE_SERVICE_ACCOUNT || process.env.FIREBASE_PROJECT_ID);

    if (hasFirebaseAdmin) {
      // In production with Firebase Admin SDK configured
      try {
        // Dynamic import if firebase-admin is available
        const admin = require('firebase-admin');
        const message = {
          notification: { title, body },
          data: Object.fromEntries(Object.entries(data).map(([k, v]) => [k, String(v)])),
          tokens: tokens.map((t) => t.token),
        };
        const response = await admin.messaging().sendEachForMulticast(message);
        logger.info(`[FCM] Real push notification dispatched: ${response.successCount} succeeded, ${response.failureCount} failed.`);
        return { delivered: response.successCount, failed: response.failureCount };
      } catch (err) {
        logger.warn(`[FCM] Firebase dispatch fallback: ${err.message}`);
      }
    }

    // Default simulated / dev delivery mode
    logger.info(`[FCM] 🔔 Simulated push delivered to ${tokens.length} device(s) for user ${userId}: "${title}" - "${body}"`);
    return { delivered: tokens.length, simulated: true };
  },

  /**
   * Send notification to multiple users simultaneously
   */
  sendMulticastNotification: async (userIds, { title, body, data = {} }) => {
    const results = await Promise.all(
      userIds.map((uid) => fcmService.sendPushNotification(uid, { title, body, data }))
    );
    return results;
  },
};

module.exports = fcmService;
