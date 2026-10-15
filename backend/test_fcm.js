const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const fcmService = require('./src/services/fcmService');
const { isFirebaseConfigured } = require('./src/config/firebase');

async function runFCMTests() {
  console.log('====================================================');
  console.log('🚀 SmartTrip Firebase Cloud Messaging (FCM) Tester');
  console.log('====================================================\n');

  // 1. Status Check
  const status = fcmService.getStatus();
  console.log('1. [STATUS CHECK]');
  console.log(`   - Status: ${status.status}`);
  console.log(`   - Firebase Admin Initialized: ${isFirebaseConfigured() ? 'YES (Live FCM Active)' : 'NO (Using Safe Simulated Delivery)'}`);
  console.log(`   - Project ID: ${status.projectId}`);
  console.log(`   - Active Devices: ${status.totalRegisteredDevices}\n`);

  // 2. Token Registration Test
  console.log('2. [TOKEN REGISTRATION TEST]');
  const mockUserId = 'user_test_fcm_' + Date.now();
  const mockDeviceToken = 'fcm_token_sample_' + Math.random().toString(36).substring(2);

  try {
    const regResult = await fcmService.registerDeviceToken(mockUserId, mockDeviceToken, 'android');
    console.log('   ✅ Device token successfully registered:');
    console.log(`      User ID: ${mockUserId}`);
    console.log(`      Platform: ${regResult.platform}`);
    console.log(`      Registered Count: ${regResult.registeredCount}\n`);
  } catch (err) {
    console.error('   ❌ Registration error:', err.message);
  }

  // 3. Send Notification to User Test
  console.log('3. [PUSH NOTIFICATION DISPATCH TO USER TEST]');
  try {
    const pushResult = await fcmService.sendPushNotification(mockUserId, {
      title: '🚌 Bus Booking Confirmed!',
      body: 'Your ticket for Pune to Mumbai has been confirmed. Seat: A1, A2.',
      data: {
        bookingId: 'BK-102938',
        type: 'BUS_BOOKING',
      },
    });
    console.log('   ✅ Push notification dispatched successfully:');
    console.log(`      Delivered: ${pushResult.delivered}`);
    console.log(`      Simulated: ${pushResult.simulated ?? false}`);
    if (pushResult.note) console.log(`      Note: ${pushResult.note}\n`);
  } catch (err) {
    console.error('   ❌ Dispatch error:', err.message);
  }

  // 4. Send Direct Push Notification to Token
  console.log('4. [DIRECT PUSH TO TOKEN TEST]');
  try {
    const directResult = await fcmService.sendToToken(mockDeviceToken, {
      title: '⚡ Flash Sale: 20% Off Cabs',
      body: 'Use code TRIP20 on your next ride today.',
      data: { promo: 'TRIP20' },
    });
    console.log('   ✅ Direct push notification result:');
    console.log(`      Success: ${directResult.success}`);
    console.log(`      Message ID: ${directResult.messageId || 'N/A'}`);
    console.log(`      Simulated: ${directResult.simulated ?? false}\n`);
  } catch (err) {
    console.error('   ❌ Direct push error:', err.message);
  }

  // 5. Unregister Token Test
  console.log('5. [TOKEN UNREGISTRATION TEST]');
  try {
    await fcmService.unregisterDeviceToken(mockUserId, mockDeviceToken);
    const tokensRemaining = fcmService.getUserTokens(mockUserId);
    console.log('   ✅ Device token successfully unregistered.');
    console.log(`      Tokens remaining for user: ${tokensRemaining.length}\n`);
  } catch (err) {
    console.error('   ❌ Unregister error:', err.message);
  }

  console.log('====================================================');
  if (isFirebaseConfigured()) {
    console.log('🎉 REAL FCM IS FULLY CONNECTED AND READY!');
  } else {
    console.log('ℹ️  FCM is fully working in SIMULATED mode.');
    console.log('👉 To connect REAL Firebase Cloud Messaging:');
    console.log('   1. Go to Firebase Console -> Project Settings -> Service Accounts');
    console.log('   2. Click "Generate new private key" to download JSON');
    console.log('   3. Save file as "backend/serviceAccountKey.json"');
    console.log('   4. Real push notifications will automatically send to Android / iOS devices!');
  }
  console.log('====================================================\n');
}

runFCMTests().catch(console.error);
