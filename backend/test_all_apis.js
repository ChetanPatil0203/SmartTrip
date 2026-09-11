const BASE_URL = 'http://localhost:5000/api';

const results = [];

async function test(name, fn) {
  try {
    const res = await fn();
    results.push({ name, status: 'PASS', details: res });
    console.log(`[PASS] ${name}`);
  } catch (err) {
    results.push({ name, status: 'FAIL', error: err.message });
    console.error(`[FAIL] ${name} -> ${err.message}`);
  }
}

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${data.message || JSON.stringify(data)}`);
  }
  return data;
}

async function runAllTests() {
  console.log('============================================');
  console.log('SmartTrip Full End-to-End System Test');
  console.log('============================================\n');

  let authToken = null;
  let userId = null;
  let testBookingId = null;

  // 1. Health Check
  await test('Health Check API', async () => {
    const data = await request('/health');
    if (!data.success || data.database !== 'connected') {
      throw new Error('Database not connected');
    }
    return data.message;
  });

  // 2. Auth - Register & Login
  const testPhone = '9' + Math.floor(100000000 + Math.random() * 900000000);
  const testEmail = `test_${Date.now()}@example.com`;

  await test('Auth: Register User', async () => {
    const data = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Chetan Patil',
        phone: testPhone,
        email: testEmail,
        password: 'Password@123',
      }),
    });
    authToken = data.data.token;
    userId = data.data.user.id;
    return `User created: ID ${userId}`;
  });

  await test('Auth: Login User', async () => {
    const data = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        phone: testPhone,
        password: 'Password@123',
      }),
    });
    authToken = data.data.token;
    return 'Token received successfully';
  });

  await test('Auth: Get User Profile', async () => {
    const data = await request('/users/me', {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    return `Profile retrieved for ${data.data.user.name}`;
  });

  // 3. Discovery APIs
  const today = new Date().toISOString().split('T')[0];

  await test('Buses: Search Buses', async () => {
    const data = await request(`/buses/search?source=Mumbai&destination=Pune&date=${today}`);
    return `Found ${data.data?.schedules?.length || 0} buses`;
  });

  await test('Buses: Operators List', async () => {
    const data = await request('/buses/operators');
    return `Found ${data.data?.operators?.length || 0} operators`;
  });

  await test('Trains: Search Trains', async () => {
    const data = await request(`/trains/search?source=Mumbai&destination=Ahmedabad&date=${today}`);
    return `Found ${data.data?.schedules?.length || 0} trains`;
  });

  await test('Flights: Search Flights', async () => {
    const data = await request(`/flights/search?source=Mumbai&destination=Delhi&date=${today}`);
    return `Found ${data.data?.schedules?.length || 0} flights`;
  });

  await test('Hotels: Search Hotels', async () => {
    const data = await request('/hotels/search?city=Goa');
    return `Found ${data.data?.hotels?.length || 0} hotels`;
  });

  // 4. Offers & Coupons
  await test('Offers: Public Offer Listing', async () => {
    const data = await request('/offers');
    return `Active offers count: ${data.data?.offers?.length || 0}`;
  });

  // 5. Notifications
  await test('Notifications: Get User Notifications', async () => {
    const data = await request('/notifications', {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    return `Notifications count: ${data.data?.notifications?.length || 0}`;
  });

  await test('Notifications: Get Unread Count', async () => {
    const data = await request('/notifications/unread-count', {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    return `Unread count: ${data.data?.unreadCount || 0}`;
  });

  await test('FCM: Register Device Push Token', async () => {
    const data = await request('/notifications/fcm-token', {
      method: 'POST',
      headers: { Authorization: `Bearer ${authToken}` },
      body: JSON.stringify({
        token: 'fcm_mock_device_token_' + Date.now(),
        platform: 'android',
      }),
    });
    return `Device registered for push alerts (Active devices: ${data.data?.registeredCount || 1})`;
  });

  // 6. Support Tickets
  await test('Support: Create Ticket', async () => {
    const data = await request('/support/tickets', {
      method: 'POST',
      headers: { Authorization: `Bearer ${authToken}` },
      body: JSON.stringify({
        subject: 'Need help with seat allocation',
        description: 'I would like to know if window seat is available on my route.',
        priority: 'MEDIUM',
      }),
    });
    return `Ticket Created: #${data.data?.ticket?.id}`;
  });

  await test('Support: List My Tickets', async () => {
    const data = await request('/support/tickets', {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    return `Tickets found: ${data.data?.tickets?.length || 0}`;
  });

  // 7. Travel Safety Reports
  await test('Safety: Create Emergency/Safety Report', async () => {
    const data = await request('/safety/reports', {
      method: 'POST',
      headers: { Authorization: `Bearer ${authToken}` },
      body: JSON.stringify({
        type: 'SOS_EMERGENCY',
        description: 'Passenger triggered SOS from safety center.',
      }),
    });
    return `Report filed: #${data.data?.report?.id}`;
  });

  // 8. Reviews
  await test('Reviews: Create Travel Review', async () => {
    const data = await request('/reviews', {
      method: 'POST',
      headers: { Authorization: `Bearer ${authToken}` },
      body: JSON.stringify({
        rating: 5,
        title: 'Smooth & Comfortable Journey',
        comment: 'Great clean bus and reached on time!',
      }),
    });
    return `Review created: #${data.data?.review?.id}`;
  });

  await test('Reviews: Public Reviews List', async () => {
    const data = await request('/reviews');
    return `Reviews count: ${data.data?.reviews?.length || 0}`;
  });

  // 9. Universal Booking Lifecycle
  let createdBookingId = null;

  await test('Bookings: Create Bus Booking', async () => {
    // Pick an operator or schedule if available
    const data = await request('/bookings', {
      method: 'POST',
      headers: { Authorization: `Bearer ${authToken}` },
      body: JSON.stringify({
        bookingType: 'BUS',
        scheduleId: '30dab9e9-bd47-43b3-a306-402022f6e27d',
        totalAmount: 1250,
        travelDate: '2026-10-01',
        passengers: [
          { name: 'Chetan Patil', age: 24, gender: 'MALE', seatNumber: 'A1' }
        ],
      }),
    });
    createdBookingId = data.data?.booking?.id;
    return `Booking Created: #${createdBookingId} (Ref: ${data.data?.booking?.bookingReference})`;
  });

  await test('Bookings: Get My Bookings', async () => {
    const data = await request('/bookings', {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    return `Bookings count: ${data.data?.bookings?.length || 0}`;
  });

  // 10. Payment Lifecycle
  let paymentRef = null;
  await test('Payments: Initiate Payment', async () => {
    const data = await request('/payments/initiate', {
      method: 'POST',
      headers: { Authorization: `Bearer ${authToken}` },
      body: JSON.stringify({
        bookingId: createdBookingId,
        amount: 1250,
        method: 'UPI',
        currency: 'INR',
      }),
    });
    paymentRef = data.data?.paymentReference;
    return `Payment Initiated: Ref ${paymentRef}`;
  });

  await test('Payments: Verify Payment', async () => {
    const data = await request('/payments/verify', {
      method: 'POST',
      headers: { Authorization: `Bearer ${authToken}` },
      body: JSON.stringify({
        bookingId: createdBookingId,
        paymentReference: paymentRef,
        status: 'SUCCESS',
      }),
    });
    return `Payment Verified: Status ${data.data?.payment?.status || 'SUCCESS'}`;
  });

  // 11. Trip Sharing
  await test('Trip Sharing: Generate Share Link', async () => {
    const data = await request(`/trips/${createdBookingId}/share`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authToken}` },
    });
    return `Share Token: ${data.data?.shareToken || data.data?.token || 'OK'}`;
  });

  // 12. Cancellation & Refund
  await test('Cancellations: Request Booking Cancellation', async () => {
    const data = await request('/cancellations', {
      method: 'POST',
      headers: { Authorization: `Bearer ${authToken}` },
      body: JSON.stringify({
        bookingId: createdBookingId,
        reason: 'Change of schedule plans',
      }),
    });
    return `Cancellation Requested: Status ${data.data?.cancellation?.status || 'PENDING'}`;
  });

  // Summary
  console.log('\n============================================');
  console.log('TEST SUMMARY');
  console.log('============================================');
  const total = results.length;
  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  console.log(`Total Tests : ${total}`);
  console.log(`Passed      : ${passed}`);
  console.log(`Failed      : ${failed}`);
  if (failed === 0) {
    console.log('ALL TESTS PASSED PERFECTLY! 🚀');
  } else {
    console.log('SOME TESTS FAILED');
  }
}

runAllTests().catch(console.error);
