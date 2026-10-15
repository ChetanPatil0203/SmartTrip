const fs = require('fs');
const path = require('path');
const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getMessaging } = require('firebase-admin/messaging');
const logger = require('../utils/logger');

let initialized = false;
let messagingInstance = null;
let firebaseApp = null;
let configuredProjectId = null;

function initFirebase() {
  if (initialized && messagingInstance) {
    return { app: firebaseApp, messaging: messagingInstance, isConfigured: true, projectId: configuredProjectId };
  }

  try {
    let credential = null;
    let serviceAccountData = null;

    // Check possible filenames in backend root
    const possibleFiles = [
      process.env.FIREBASE_SERVICE_ACCOUNT_PATH,
      process.env.GOOGLE_APPLICATION_CREDENTIALS,
      'serviceAccountKey.json',
      'serviceAccountKey (2).json',
      'serviceAccountKey (1).json',
      'firebase-service-account.json',
    ].filter(Boolean);

    for (const relPath of possibleFiles) {
      const resolvedPath = path.isAbsolute(relPath)
        ? relPath
        : path.resolve(__dirname, '../../', relPath);

      if (fs.existsSync(resolvedPath)) {
        try {
          serviceAccountData = JSON.parse(fs.readFileSync(resolvedPath, 'utf8'));
          credential = cert(serviceAccountData);
          configuredProjectId = serviceAccountData.project_id;
          logger.info(`[FCM] Loaded Firebase credentials from: ${path.basename(resolvedPath)} (Project ID: ${configuredProjectId})`);
          break;
        } catch (err) {
          logger.warn(`[FCM] Could not parse JSON from ${resolvedPath}: ${err.message}`);
        }
      }
    }

    // Option 2: JSON string in FIREBASE_SERVICE_ACCOUNT env
    if (!credential && process.env.FIREBASE_SERVICE_ACCOUNT) {
      try {
        serviceAccountData = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        credential = cert(serviceAccountData);
        configuredProjectId = serviceAccountData.project_id;
        logger.info(`[FCM] Loaded Firebase credentials from FIREBASE_SERVICE_ACCOUNT env`);
      } catch {
        if (fs.existsSync(process.env.FIREBASE_SERVICE_ACCOUNT)) {
          serviceAccountData = JSON.parse(fs.readFileSync(process.env.FIREBASE_SERVICE_ACCOUNT, 'utf8'));
          credential = cert(serviceAccountData);
          configuredProjectId = serviceAccountData.project_id;
          logger.info(`[FCM] Loaded Firebase credentials from path in FIREBASE_SERVICE_ACCOUNT`);
        }
      }
    }

    // Option 3: Individual environment variables
    if (!credential && process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
      serviceAccountData = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      };
      credential = cert(serviceAccountData);
      configuredProjectId = process.env.FIREBASE_PROJECT_ID;
      logger.info(`[FCM] Loaded Firebase credentials from individual ENV variables (Project ID: ${configuredProjectId})`);
    }

    if (credential) {
      const existingApps = getApps();
      if (!existingApps.length) {
        firebaseApp = initializeApp({
          credential,
          projectId: configuredProjectId,
        });
      } else {
        firebaseApp = existingApps[0];
      }

      messagingInstance = getMessaging(firebaseApp);
      initialized = true;
      logger.info(`[FCM] 🚀 Firebase Admin SDK successfully connected to Project: "${configuredProjectId}"`);
      return { app: firebaseApp, messaging: messagingInstance, isConfigured: true, projectId: configuredProjectId };
    } else {
      logger.info('[FCM] Firebase credentials not configured. Running in safe simulated mode.');
      return { app: null, messaging: null, isConfigured: false, projectId: null };
    }
  } catch (error) {
    logger.error(`[FCM] Failed to initialize Firebase Admin SDK: ${error.message}`);
    return { app: null, messaging: null, isConfigured: false, error: error.message };
  }
}

// Initial attempt
initFirebase();

module.exports = {
  initFirebase,
  getMessaging: () => messagingInstance,
  isFirebaseConfigured: () => initialized && !!messagingInstance,
  getProjectId: () => configuredProjectId,
};
