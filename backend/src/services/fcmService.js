const logger = require('../utils/logger');
const { getMessaging, isFirebaseConfigured, initFirebase, getProjectId } = require('../config/firebase');

// In-memory token store: Map<userId, Map<token, { token, platform, updatedAt }>>
const userDeviceTokens = new Map();

const fcmService = {
  /**
   * Check current FCM operational status
   */
  getStatus: () => {
    // Re-check in case credentials were added at runtime
    initFirebase();
    const isConfigured = isFirebaseConfigured();
    let totalDevices = 0;
    userDeviceTokens.forEach(map => {
      totalDevices += map.size;
    });

    return {
      status: isConfigured ? 'READY' : 'SIMULATED',
      isFirebaseConfigured: isConfigured,
      registeredUsersCount: userDeviceTokens.size,
      totalRegisteredDevices: totalDevices,
      projectId: getProjectId() || process.env.FIREBASE_PROJECT_ID || 'not-set',
    };
  },

  /**
   * Register or update a user's FCM device token
   */
  registerDeviceToken: async (userId, token, platform = 'android') => {
    if (!userId || !token) {
      throw new Error('userId and token are required to register device token');
    }

    const cleanUserId = String(userId);
    const cleanToken = String(token).trim();

    if (!userDeviceTokens.has(cleanUserId)) {
      userDeviceTokens.set(cleanUserId, new Map());
    }

    const tokensMap = userDeviceTokens.get(cleanUserId);
    tokensMap.set(cleanToken, {
      token: cleanToken,
      platform: (platform || 'android').toLowerCase(),
      updatedAt: new Date().toISOString(),
    });

    logger.info(`[FCM] Device token registered for user: ${cleanUserId} (${platform})`);
    return {
      success: true,
      registeredCount: tokensMap.size,
      token: cleanToken,
      platform,
    };
  },

  /**
   * Unregister / remove a device token (e.g. on user logout)
   */
  unregisterDeviceToken: async (userId, token) => {
    const cleanUserId = String(userId);
    const cleanToken = String(token).trim();

    if (userDeviceTokens.has(cleanUserId)) {
      const tokensMap = userDeviceTokens.get(cleanUserId);
      tokensMap.delete(cleanToken);
      if (tokensMap.size === 0) {
        userDeviceTokens.delete(cleanUserId);
      }
    }
    logger.info(`[FCM] Device token removed for user: ${cleanUserId}`);
    return { success: true };
  },

  /**
   * Get all registered tokens for a user
   */
  getUserTokens: (userId) => {
    const cleanUserId = String(userId);
    if (!userDeviceTokens.has(cleanUserId)) return [];
    return Array.from(userDeviceTokens.get(cleanUserId).values());
  },

  /**
   * Send push notification directly to a single device token
   */
  sendToToken: async (token, { title, body, data = {}, imageUrl = null }) => {
    if (!token || !title) {
      throw new Error('token and title are required to send notification');
    }

    const messaging = getMessaging();
    const isConfigured = isFirebaseConfigured();

    const stringData = Object.fromEntries(
      Object.entries(data || {}).map(([k, v]) => [k, String(v ?? '')])
    );

    if (isConfigured && messaging) {
      try {
        const payload = {
          token,
          notification: {
            title,
            body: body || '',
            ...(imageUrl ? { imageUrl } : {}),
          },
          data: stringData,
          android: {
            priority: 'high',
            notification: {
              sound: 'default',
              channelId: 'smarttrip_notifications',
              priority: 'high',
              defaultVibrateTimings: true,
            },
          },
          apns: {
            payload: {
              aps: {
                sound: 'default',
                badge: 1,
              },
            },
          },
        };

        const response = await messaging.send(payload);
        logger.info(`[FCM] Direct push notification delivered to token: ${response}`);
        return { success: true, messageId: response, simulated: false };
      } catch (err) {
        logger.warn(`[FCM] Real dispatch failed: ${err.message}`);
        return { success: false, error: err.message, simulated: false };
      }
    }

    // Simulated fallback
    logger.info(`[FCM] 🔔 [SIMULATED] Direct push sent to ${token.slice(0, 15)}...: "${title}" - "${body}"`);
    return {
      success: true,
      simulated: true,
      messageId: `sim_${Date.now()}`,
      note: 'Simulated mode: Configure Firebase Service Account credentials for real delivery.',
    };
  },

  /**
   * Send push notification to a user's registered devices
   */
  sendPushNotification: async (userId, { title, body, data = {}, imageUrl = null }) => {
    if (!userId || !title) return { delivered: 0, reason: 'MISSING_PARAMS' };

    const cleanUserId = String(userId);
    const tokens = fcmService.getUserTokens(cleanUserId);

    if (tokens.length === 0) {
      logger.info(`[FCM] No active device tokens for user ${cleanUserId}. In-app notification available.`);
      return { delivered: 0, reason: 'NO_ACTIVE_TOKENS' };
    }

    const messaging = getMessaging();
    const isConfigured = isFirebaseConfigured();

    const stringData = Object.fromEntries(
      Object.entries(data || {}).map(([k, v]) => [k, String(v ?? '')])
    );

    if (isConfigured && messaging) {
      try {
        const tokenList = tokens.map((t) => t.token);
        const multicastPayload = {
          tokens: tokenList,
          notification: {
            title,
            body: body || '',
            ...(imageUrl ? { imageUrl } : {}),
          },
          data: stringData,
          android: {
            priority: 'high',
            notification: {
              sound: 'default',
              channelId: 'smarttrip_notifications',
              priority: 'high',
              defaultVibrateTimings: true,
            },
          },
          apns: {
            payload: {
              aps: {
                sound: 'default',
                badge: 1,
              },
            },
          },
        };

        const response = await messaging.sendEachForMulticast(multicastPayload);
        logger.info(`[FCM] Push sent to user ${cleanUserId}: ${response.successCount} succeeded, ${response.failureCount} failed.`);

        // Clean up invalid or expired tokens
        if (response.failureCount > 0) {
          response.responses.forEach((resp, idx) => {
            if (!resp.success) {
              const errCode = resp.error?.code;
              if (
                errCode === 'messaging/registration-token-not-registered' ||
                errCode === 'messaging/invalid-registration-token'
              ) {
                const badToken = tokenList[idx];
                fcmService.unregisterDeviceToken(cleanUserId, badToken);
                logger.info(`[FCM] Removed invalid token for user ${cleanUserId}`);
              }
            }
          });
        }

        return {
          delivered: response.successCount,
          failed: response.failureCount,
          simulated: false,
        };
      } catch (err) {
        logger.warn(`[FCM] Firebase dispatch fallback for user ${cleanUserId}: ${err.message}`);
      }
    }

    // Default simulated / dev delivery mode
    logger.info(`[FCM] 🔔 [SIMULATED] Push delivered to ${tokens.length} device(s) for user ${cleanUserId}: "${title}" - "${body}"`);
    return {
      delivered: tokens.length,
      simulated: true,
      note: 'Simulated delivery active (Provide Firebase service account credentials in backend/.env for real APNs/FCM delivery)',
    };
  },

  /**
   * Send notification to multiple users simultaneously
   */
  sendMulticastNotification: async (userIds, { title, body, data = {} }) => {
    if (!Array.isArray(userIds) || userIds.length === 0) return [];
    return await Promise.all(
      userIds.map((uid) => fcmService.sendPushNotification(uid, { title, body, data }))
    );
  },

  /**
   * Send push notification to a topic (e.g. 'all_users', 'deals', 'delays')
   */
  sendToTopic: async (topic, { title, body, data = {} }) => {
    if (!topic || !title) throw new Error('topic and title are required');

    const messaging = getMessaging();
    const isConfigured = isFirebaseConfigured();

    const stringData = Object.fromEntries(
      Object.entries(data || {}).map(([k, v]) => [k, String(v ?? '')])
    );

    if (isConfigured && messaging) {
      try {
        const payload = {
          topic,
          notification: { title, body: body || '' },
          data: stringData,
        };
        const messageId = await messaging.send(payload);
        logger.info(`[FCM] Sent topic message to "${topic}": ${messageId}`);
        return { success: true, messageId, simulated: false };
      } catch (err) {
        logger.error(`[FCM] Failed to send topic message: ${err.message}`);
        return { success: false, error: err.message };
      }
    }

    logger.info(`[FCM] 🔔 [SIMULATED] Topic push to "${topic}": "${title}" - "${body}"`);
    return { success: true, simulated: true, topic };
  },

  /**
   * Subscribe tokens to a topic
   */
  subscribeToTopic: async (tokens, topic) => {
    const tokenArray = Array.isArray(tokens) ? tokens : [tokens];
    const messaging = getMessaging();
    if (isFirebaseConfigured() && messaging) {
      const res = await messaging.subscribeToTopic(tokenArray, topic);
      return { success: true, ...res };
    }
    return { success: true, simulated: true, subscribedCount: tokenArray.length };
  },

  /**
   * Unsubscribe tokens from a topic
   */
  unsubscribeFromTopic: async (tokens, topic) => {
    const tokenArray = Array.isArray(tokens) ? tokens : [tokens];
    const messaging = getMessaging();
    if (isFirebaseConfigured() && messaging) {
      const res = await messaging.unsubscribeFromTopic(tokenArray, topic);
      return { success: true, ...res };
    }
    return { success: true, simulated: true, unsubscribedCount: tokenArray.length };
  },
};

module.exports = fcmService;
