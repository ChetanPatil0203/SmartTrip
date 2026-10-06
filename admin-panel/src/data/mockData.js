/**
 * SmartTrip Super Admin Mock Data Repository
 * Realistic production-grade sample dataset matching SmartTrip database schema
 */

export const mockKpis = {
  totalUsers: { value: '42,850', change: '+12.4%', period: 'vs last month', trend: 'up' },
  totalBookings: { value: '18,420', change: '+18.2%', period: 'vs last month', trend: 'up' },
  revenue: { value: '₹1.84 Cr', change: '+23.5%', period: 'vs last month', trend: 'up' },
  successfulPayments: { value: '17,890', change: '+19.1%', period: 'vs last month', trend: 'up' },
  cancellations: { value: '380', change: '-4.2%', period: 'vs last month', trend: 'down' },
  refunds: { value: '₹2.45 L', change: '-8.1%', period: 'vs last month', trend: 'down' },
};

export const mockRevenueTrends = [
  { month: 'Apr', revenue: 112, bookings: 9800, bus: 42, train: 28, flight: 26, hotel: 12, cab: 3, auto: 1 },
  { month: 'May', revenue: 128, bookings: 11200, bus: 48, train: 32, flight: 30, hotel: 14, cab: 3, auto: 1 },
  { month: 'Jun', revenue: 145, bookings: 12900, bus: 54, train: 36, flight: 35, hotel: 16, cab: 3, auto: 1 },
  { month: 'Jul', revenue: 139, bookings: 12300, bus: 51, train: 35, flight: 33, hotel: 15, cab: 4, auto: 1 },
  { month: 'Aug', revenue: 168, bookings: 15400, bus: 64, train: 42, flight: 40, hotel: 17, cab: 4, auto: 1 },
  { month: 'Sep', revenue: 184, bookings: 18420, bus: 72, train: 46, flight: 44, hotel: 18, cab: 3, auto: 1 },
];

export const mockTravelDistribution = [
  { type: 'Bus', count: 7850, percentage: 42.6, color: '#D13239', revenue: '₹48.2 L' },
  { type: 'Train', count: 4620, percentage: 25.1, color: '#2563EB', revenue: '₹41.5 L' },
  { type: 'Flight', count: 2980, percentage: 16.2, color: '#0284C7', revenue: '₹68.9 L' },
  { type: 'Hotel', count: 1850, percentage: 10.0, color: '#059669', revenue: '₹21.4 L' },
  { type: 'Cab', count: 740, percentage: 4.0, color: '#475569', revenue: '₹3.2 L' },
  { type: 'Auto', count: 380, percentage: 2.1, color: '#D97706', revenue: '₹0.8 L' },
];

export const mockBookingStatusOverview = [
  { label: 'Confirmed', count: 15210, percentage: 82.5, color: '#059669' },
  { label: 'Completed', count: 2420, percentage: 13.1, color: '#2563EB' },
  { label: 'Pending', count: 410, percentage: 2.2, color: '#D97706' },
  { label: 'Cancelled', count: 260, percentage: 1.4, color: '#DC2626' },
  { label: 'Refunded', count: 120, percentage: 0.8, color: '#7C3AED' },
];

export const mockRecentActivity = [
  {
    id: 'ACT-901',
    type: 'booking',
    description: 'Booking ST-BUS-8492 confirmed for Pune to Goa',
    user: 'Pooja Kulkarni',
    time: '4 mins ago',
    badge: 'ST-BUS-8492',
    badgeColor: 'bus',
  },
  {
    id: 'ACT-902',
    type: 'payment',
    description: 'Mock payment ₹1,450 verified via UPI (Ref: MP-78912)',
    user: 'Rohan Sharma',
    time: '12 mins ago',
    badge: 'MOCK-PAID',
    badgeColor: 'success',
  },
  {
    id: 'ACT-903',
    type: 'delay',
    description: 'Delay alert generated for Train 12127 Mumbai-Pune Intercity (+25m)',
    user: 'System Bot',
    time: '28 mins ago',
    badge: 'DELAY-25M',
    badgeColor: 'warning',
  },
  {
    id: 'ACT-904',
    type: 'refund',
    description: 'Mock refund of ₹850 processed to user wallet for cancelled ticket',
    user: 'Super Admin',
    time: '45 mins ago',
    badge: 'REF-4921',
    badgeColor: 'refunded',
  },
  {
    id: 'ACT-905',
    type: 'user',
    description: 'New user registered via mobile app (+91 98231 44521)',
    user: 'Amit Deshmukh',
    time: '1 hour ago',
    badge: 'NEW-USER',
    badgeColor: 'info',
  },
  {
    id: 'ACT-906',
    type: 'safety',
    description: 'Safety alert resolved: Driver route deviation reported by passenger',
    user: 'Super Admin',
    time: '2 hours ago',
    badge: 'SAFE-302',
    badgeColor: 'success',
  },
];

export const initialBookings = [
  {
    id: 'ST-BUS-8492',
    user: { name: 'Pooja Kulkarni', email: 'pooja.k@gmail.com', phone: '+91 98231 44521' },
    travelType: 'bus',
    route: 'Pune (Swargate) → Goa (Panaji)',
    travelDate: '2026-10-02 21:00',
    amount: 1450,
    paymentStatus: 'success',
    paymentMethod: 'UPI (Mock)',
    mockPaymentId: 'MP-UPI-849201',
    bookingStatus: 'confirmed',
    operator: 'IntrCity SmartBus AC Multi-Axle Sleeper',
    seats: ['L4', 'L5'],
    passengers: [
      { name: 'Pooja Kulkarni', age: 26, gender: 'Female', seat: 'L4' },
      { name: 'Kavita Joshi', age: 28, gender: 'Female', seat: 'L5' },
    ],
    fareBreakdown: { baseFare: 1300, platformFee: 40, gst: 110, discount: 0, total: 1450 },
    timeline: [
      { time: '2026-09-29 08:45', event: 'Search initiated from Mobile App' },
      { time: '2026-09-29 08:48', event: 'Seats L4, L5 locked' },
      { time: '2026-09-29 08:49', event: 'Mock Payment processed successfully (₹1,450)' },
      { time: '2026-09-29 08:49', event: 'Ticket confirmed & SMS notification sent' },
    ],
  },
  {
    id: 'ST-TRN-3291',
    user: { name: 'Rahul Varma', email: 'rahul.v@outlook.com', phone: '+91 98765 21098' },
    travelType: 'train',
    route: 'Mumbai CSMT (CSMT) → Pune Jn (PUNE)',
    travelDate: '2026-10-01 06:45',
    amount: 780,
    paymentStatus: 'success',
    paymentMethod: 'Net Banking (Mock)',
    mockPaymentId: 'MP-NB-329105',
    bookingStatus: 'confirmed',
    operator: '12127 Mumbai-Pune Intercity SF Express',
    seats: ['C1-24', 'C1-25'],
    passengers: [
      { name: 'Rahul Varma', age: 31, gender: 'Male', seat: 'C1-24' },
      { name: 'Neha Varma', age: 29, gender: 'Female', seat: 'C1-25' },
    ],
    fareBreakdown: { baseFare: 720, platformFee: 20, gst: 40, discount: 0, total: 780 },
    timeline: [
      { time: '2026-09-29 07:12', event: 'Train searched on SmartTrip' },
      { time: '2026-09-29 07:15', event: 'Mock Payment completed' },
      { time: '2026-09-29 07:15', event: 'IRCTC PNR 8492019482 allocated' },
    ],
  },
  {
    id: 'ST-FLT-7104',
    user: { name: 'Aditya Singhania', email: 'aditya.s@corp.com', phone: '+91 99112 34567' },
    travelType: 'flight',
    route: 'Mumbai (BOM) → Delhi (DEL)',
    travelDate: '2026-10-05 14:20',
    amount: 5420,
    paymentStatus: 'success',
    paymentMethod: 'Card (Mock)',
    mockPaymentId: 'MP-CRD-710492',
    bookingStatus: 'confirmed',
    operator: 'IndiGo 6E-2041 (Airbus A321neo)',
    seats: ['12A'],
    passengers: [
      { name: 'Aditya Singhania', age: 34, gender: 'Male', seat: '12A' },
    ],
    fareBreakdown: { baseFare: 4800, platformFee: 120, gst: 500, discount: 0, total: 5420 },
    timeline: [
      { time: '2026-09-28 19:30', event: 'Flight selected with Baggage Addon' },
      { time: '2026-09-28 19:33', event: 'Mock Card authentication verified' },
      { time: '2026-09-28 19:34', event: 'E-ticket issued with PNR 6EQ9K2' },
    ],
  },
  {
    id: 'ST-HTL-1829',
    user: { name: 'Sneha Deshpande', email: 'sneha.d@gmail.com', phone: '+91 94220 89123' },
    travelType: 'hotel',
    route: 'Taj Fort Aguada Resort & Spa, North Goa',
    travelDate: '2026-10-03 to 2026-10-06 (3 Nights)',
    amount: 18900,
    paymentStatus: 'success',
    paymentMethod: 'UPI (Mock)',
    mockPaymentId: 'MP-UPI-182934',
    bookingStatus: 'confirmed',
    operator: 'Sea View Luxury Suite',
    seats: ['Room 304'],
    passengers: [
      { name: 'Sneha Deshpande', age: 32, gender: 'Female', seat: 'Guest 1' },
      { name: 'Aniket Deshpande', age: 35, gender: 'Male', seat: 'Guest 2' },
    ],
    fareBreakdown: { baseFare: 16500, platformFee: 300, gst: 2100, discount: 0, total: 18900 },
    timeline: [
      { time: '2026-09-28 14:10', event: 'Property booked for 3 nights' },
      { time: '2026-09-28 14:12', event: 'Mock Payment successful' },
      { time: '2026-09-28 14:15', event: 'Voucher issued to guest' },
    ],
  },
  {
    id: 'ST-CAB-6281',
    user: { name: 'Karan Mehra', email: 'karan.m@gmail.com', phone: '+91 97654 32109' },
    travelType: 'cab',
    route: 'Mumbai Airport T2 → Thane Viviana Mall',
    travelDate: '2026-09-29 09:30',
    amount: 850,
    paymentStatus: 'pending',
    paymentMethod: 'Wallet (Mock)',
    mockPaymentId: 'MP-WLT-628109',
    bookingStatus: 'pending',
    operator: 'SmartCab Prime Sedan (Maruti Dzire)',
    seats: ['MH-04-AZ-4920'],
    passengers: [
      { name: 'Karan Mehra', age: 28, gender: 'Male', seat: 'Passenger' },
    ],
    fareBreakdown: { baseFare: 750, platformFee: 30, gst: 70, discount: 0, total: 850 },
    timeline: [
      { time: '2026-09-29 09:10', event: 'Cab ride requested' },
      { time: '2026-09-29 09:12', event: 'Driver Ramesh assigned' },
      { time: '2026-09-29 09:15', event: 'Mock Payment authorization pending' },
    ],
  },
  {
    id: 'ST-AUT-9402',
    user: { name: 'Vikram Joshi', email: 'vikram.j@gmail.com', phone: '+91 98901 23456' },
    travelType: 'auto',
    route: 'Pune Station → Kothrud Vanaz',
    travelDate: '2026-09-29 08:15',
    amount: 140,
    paymentStatus: 'success',
    paymentMethod: 'UPI (Mock)',
    mockPaymentId: 'MP-UPI-940211',
    bookingStatus: 'completed',
    operator: 'SmartAuto Express (Bajaj Compact)',
    seats: ['MH-12-QU-8819'],
    passengers: [
      { name: 'Vikram Joshi', age: 24, gender: 'Male', seat: 'Rider' },
    ],
    fareBreakdown: { baseFare: 125, platformFee: 5, gst: 10, discount: 0, total: 140 },
    timeline: [
      { time: '2026-09-29 08:10', event: 'Auto ride accepted by driver Deepak' },
      { time: '2026-09-29 08:15', event: 'Ride started with OTP' },
      { time: '2026-09-29 08:35', event: 'Ride ended successfully & mock payment deducted' },
    ],
  },
  {
    id: 'ST-BUS-7319',
    user: { name: 'Manish Patil', email: 'manish.p@gmail.com', phone: '+91 98220 11994' },
    travelType: 'bus',
    route: 'Nashik CBS → Pune Wakad',
    travelDate: '2026-09-28 16:30',
    amount: 620,
    paymentStatus: 'refunded',
    paymentMethod: 'UPI (Mock)',
    mockPaymentId: 'MP-UPI-731940',
    bookingStatus: 'refunded',
    operator: 'MSRTC Shivshahi AC Seater',
    seats: ['14'],
    passengers: [
      { name: 'Manish Patil', age: 38, gender: 'Male', seat: '14' },
    ],
    fareBreakdown: { baseFare: 550, platformFee: 20, gst: 50, discount: 0, total: 620 },
    timeline: [
      { time: '2026-09-27 11:00', event: 'Ticket booked' },
      { time: '2026-09-28 09:00', event: 'Cancellation requested by user' },
      { time: '2026-09-28 09:05', event: 'Mock refund of ₹620 credited to user UPI account' },
    ],
  },
  {
    id: 'ST-FLT-6120',
    user: { name: 'Ayesha Khan', email: 'ayesha.k@gmail.com', phone: '+91 91234 56789' },
    travelType: 'flight',
    route: 'Bangalore (BLR) → Goa (GOI)',
    travelDate: '2026-10-10 11:15',
    amount: 3850,
    paymentStatus: 'cancelled',
    paymentMethod: 'Card (Mock)',
    mockPaymentId: 'MP-CRD-612099',
    bookingStatus: 'cancelled',
    operator: 'Air India Express IX-142',
    seats: ['8F'],
    passengers: [
      { name: 'Ayesha Khan', age: 27, gender: 'Female', seat: '8F' },
    ],
    fareBreakdown: { baseFare: 3400, platformFee: 100, gst: 350, discount: 0, total: 3850 },
    timeline: [
      { time: '2026-09-26 15:40', event: 'Flight booked' },
      { time: '2026-09-27 10:20', event: 'Booking cancelled by passenger' },
      { time: '2026-09-27 10:25', event: 'Mock refund requested' },
    ],
  },
];

export const initialUsers = [
  {
    id: 'USR-1001',
    name: 'Pooja Kulkarni',
    email: 'pooja.k@gmail.com',
    phone: '+91 98231 44521',
    role: 'USER',
    status: 'ACTIVE',
    joined: '2026-02-14',
    bookingsCount: 14,
    totalSpent: 18450,
    savedPassengers: [
      { name: 'Pooja Kulkarni', age: 26, gender: 'Female', relation: 'Self' },
      { name: 'Kavita Joshi', age: 28, gender: 'Female', relation: 'Friend' },
      { name: 'Sunil Kulkarni', age: 58, gender: 'Male', relation: 'Father' },
    ],
  },
  {
    id: 'USR-1002',
    name: 'Rahul Varma',
    email: 'rahul.v@outlook.com',
    phone: '+91 98765 21098',
    role: 'USER',
    status: 'ACTIVE',
    joined: '2026-03-01',
    bookingsCount: 8,
    totalSpent: 9240,
    savedPassengers: [
      { name: 'Rahul Varma', age: 31, gender: 'Male', relation: 'Self' },
      { name: 'Neha Varma', age: 29, gender: 'Female', relation: 'Spouse' },
    ],
  },
  {
    id: 'USR-1003',
    name: 'Aditya Singhania',
    email: 'aditya.s@corp.com',
    phone: '+91 99112 34567',
    role: 'USER',
    status: 'ACTIVE',
    joined: '2026-01-20',
    bookingsCount: 22,
    totalSpent: 86400,
    savedPassengers: [
      { name: 'Aditya Singhania', age: 34, gender: 'Male', relation: 'Self' },
    ],
  },
  {
    id: 'USR-1004',
    name: 'Chetan Patil',
    email: 'chetan.admin@smarttrip.com',
    phone: '+91 99999 00001',
    role: 'ADMIN',
    status: 'ACTIVE',
    joined: '2025-11-10',
    bookingsCount: 3,
    totalSpent: 4200,
    savedPassengers: [
      { name: 'Chetan Patil', age: 25, gender: 'Male', relation: 'Self' },
    ],
  },
  {
    id: 'USR-1005',
    name: 'Rajesh Shinde',
    email: 'rajesh.s@yahoo.com',
    phone: '+91 98123 45678',
    role: 'USER',
    status: 'SUSPENDED',
    joined: '2026-04-12',
    bookingsCount: 1,
    totalSpent: 450,
    savedPassengers: [],
  },
  {
    id: 'USR-1006',
    name: 'Sneha Deshpande',
    email: 'sneha.d@gmail.com',
    phone: '+91 94220 89123',
    role: 'USER',
    status: 'ACTIVE',
    joined: '2026-05-18',
    bookingsCount: 5,
    totalSpent: 31200,
    savedPassengers: [
      { name: 'Sneha Deshpande', age: 32, gender: 'Female', relation: 'Self' },
      { name: 'Aniket Deshpande', age: 35, gender: 'Male', relation: 'Spouse' },
    ],
  },
];

// Travel Management Data
export const mockTravelData = {
  bus: {
    operators: [
      { id: 'BOP-01', name: 'IntrCity SmartBus', fleetSize: 45, rating: 4.8, status: 'Active', contact: '+91 22 4001 8000' },
      { id: 'BOP-02', name: 'Zingbus Electric Express', fleetSize: 28, rating: 4.7, status: 'Active', contact: '+91 22 4002 9000' },
      { id: 'BOP-03', name: 'Neeta Travels Luxury', fleetSize: 62, rating: 4.5, status: 'Active', contact: '+91 22 4003 7000' },
      { id: 'BOP-04', name: 'MSRTC Shivshahi AC', fleetSize: 120, rating: 4.4, status: 'Active', contact: '1800 22 1250' },
    ],
    buses: [
      { id: 'BUS-101', regNo: 'MH-12-RN-4820', operator: 'IntrCity SmartBus', type: 'AC Multi-Axle Sleeper (2+1)', capacity: 36, status: 'Active' },
      { id: 'BUS-102', regNo: 'MH-04-EF-9102', operator: 'Zingbus Electric Express', type: 'Electric AC Seater (2+2)', capacity: 45, status: 'Active' },
      { id: 'BUS-103', regNo: 'MH-14-BT-3312', operator: 'Neeta Travels Luxury', type: 'Volvo B11R Multi-Axle Sleeper', capacity: 32, status: 'Maintenance' },
      { id: 'BUS-104', regNo: 'MH-20-AQ-7744', operator: 'MSRTC Shivshahi AC', type: 'AC Push-Back Seater', capacity: 43, status: 'Active' },
    ],
    routes: [
      { id: 'BRT-01', from: 'Pune', to: 'Goa', distance: '450 km', duration: '9h 30m', stopsCount: 6, baseFare: 1200 },
      { id: 'BRT-02', from: 'Mumbai', to: 'Pune', distance: '160 km', duration: '3h 45m', stopsCount: 4, baseFare: 450 },
      { id: 'BRT-03', from: 'Pune', to: 'Nagpur', distance: '710 km', duration: '13h 00m', stopsCount: 8, baseFare: 1600 },
      { id: 'BRT-04', from: 'Nashik', to: 'Pune', distance: '210 km', duration: '5h 00m', stopsCount: 5, baseFare: 550 },
    ],
    schedules: [
      { id: 'BSC-01', route: 'Pune → Goa', bus: 'MH-12-RN-4820', depTime: '21:00', arrTime: '06:30', fare: 1450, status: 'SCHEDULED' },
      { id: 'BSC-02', route: 'Mumbai → Pune', bus: 'MH-04-EF-9102', depTime: '07:30', arrTime: '11:15', fare: 480, status: 'SCHEDULED' },
      { id: 'BSC-03', route: 'Pune → Nagpur', bus: 'MH-14-BT-3312', depTime: '18:00', arrTime: '07:00', fare: 1650, status: 'DELAYED' },
    ],
    stops: [
      { id: 'BST-01', name: 'Swargate Bus Station, Pune', city: 'Pune', type: 'BOARDING' },
      { id: 'BST-02', name: 'Wakad Bridge Hinjawadi', city: 'Pune', type: 'BOARDING' },
      { id: 'BST-03', name: 'Mapusa Bus Stand', city: 'Goa', type: 'DROPPING' },
      { id: 'BST-04', name: 'Panaji KTC Bus Stand', city: 'Goa', type: 'BOTH' },
    ],
    seats: [
      { number: 'L1', type: 'SLEEPER', deck: 'LOWER', basePrice: 1450, status: 'AVAILABLE' },
      { number: 'L2', type: 'SLEEPER', deck: 'LOWER', basePrice: 1450, status: 'BOOKED' },
      { number: 'U1', type: 'SLEEPER', deck: 'UPPER', basePrice: 1350, status: 'AVAILABLE' },
      { number: 'U2', type: 'SLEEPER', deck: 'UPPER', basePrice: 1350, status: 'BOOKED' },
    ],
  },
  train: {
    operators: [
      { id: 'TOP-01', name: 'Indian Railways (CR - Central Railway)', code: 'CR', status: 'Active' },
      { id: 'TOP-02', name: 'Indian Railways (WR - Western Railway)', code: 'WR', status: 'Active' },
      { id: 'TOP-03', name: 'Indian Railways (KR - Konkan Railway)', code: 'KR', status: 'Active' },
    ],
    trains: [
      { id: 'TRN-12127', number: '12127', name: 'Mumbai-Pune Intercity SF Express', type: 'Superfast', zones: 'CR', status: 'Active' },
      { id: 'TRN-22221', number: '22221', name: 'Mumbai CSMT - Hazrat Nizamuddin Rajdhani', type: 'Rajdhani', zones: 'CR', status: 'Active' },
      { id: 'TRN-20705', number: '20705', name: 'Mumbai CSMT - Jalna Vande Bharat Express', type: 'Vande Bharat', zones: 'CR', status: 'Active' },
      { id: 'TRN-10103', number: '10103', name: 'Mandovi Express (Mumbai to Madgaon)', type: 'Express', zones: 'KR', status: 'Active' },
    ],
    stations: [
      { id: 'STN-CSMT', code: 'CSMT', name: 'Chhatrapati Shivaji Maharaj Terminus', city: 'Mumbai', platforms: 18 },
      { id: 'STN-PUNE', code: 'PUNE', name: 'Pune Junction', city: 'Pune', platforms: 6 },
      { id: 'STN-DR', code: 'DR', name: 'Dadar Central', city: 'Mumbai', platforms: 8 },
      { id: 'STN-MAO', code: 'MAO', name: 'Madgaon Junction', city: 'Goa', platforms: 4 },
    ],
    routes: [
      { id: 'TRT-01', train: '12127 Intercity', from: 'CSMT', to: 'PUNE', distance: '192 km', duration: '3h 10m' },
      { id: 'TRT-02', train: '22221 Rajdhani', from: 'CSMT', to: 'NDLS', distance: '1540 km', duration: '18h 45m' },
    ],
    schedules: [
      { id: 'TSC-01', train: '12127 Intercity', depTime: '06:45 CSMT', arrTime: '09:57 PUNE', days: 'Mon, Tue, Wed, Thu, Fri, Sat, Sun', status: 'ON_TIME' },
      { id: 'TSC-02', train: '20705 Vande Bharat', depTime: '13:10 CSMT', arrTime: '20:30 JALNA', days: 'Except Wed', status: 'DELAYED (15m)' },
    ],
    classes: [
      { id: 'CLS-1A', code: '1A', name: 'First AC', fareMultiplier: 3.5 },
      { id: 'CLS-2A', code: '2A', name: 'Second AC', fareMultiplier: 2.2 },
      { id: 'CLS-3A', code: '3A', name: 'Third AC', fareMultiplier: 1.5 },
      { id: 'CLS-CC', code: 'CC', name: 'AC Chair Car', fareMultiplier: 1.2 },
      { id: 'CLS-SL', code: 'SL', name: 'Sleeper Class', fareMultiplier: 1.0 },
    ],
    seats: [
      { berth: 'C1-24', class: 'CC', type: 'SEAT', status: 'CONFIRMED' },
      { berth: 'C1-25', class: 'CC', type: 'SEAT', status: 'CONFIRMED' },
      { berth: 'B1-12', class: '3A', type: 'LOWER', status: 'AVAILABLE' },
    ],
  },
  flight: {
    airlines: [
      { id: 'AIR-6E', code: '6E', name: 'IndiGo Airlines', fleet: 340, status: 'Active' },
      { id: 'AIR-AI', code: 'AI', name: 'Air India', fleet: 145, status: 'Active' },
      { id: 'AIR-IX', code: 'IX', name: 'Air India Express', fleet: 65, status: 'Active' },
      { id: 'AIR-QP', code: 'QP', name: 'Akasa Air', fleet: 24, status: 'Active' },
    ],
    airports: [
      { id: 'APT-BOM', code: 'BOM', name: 'Chhatrapati Shivaji Maharaj Intl Airport', city: 'Mumbai', terminal: 'T1 / T2' },
      { id: 'APT-DEL', code: 'DEL', name: 'Indira Gandhi International Airport', city: 'New Delhi', terminal: 'T1 / T2 / T3' },
      { id: 'APT-BLR', code: 'BLR', name: 'Kempegowda International Airport', city: 'Bangalore', terminal: 'T1 / T2' },
      { id: 'APT-GOI', code: 'GOI', name: 'Dabolim Airport / Mopa (GOX)', city: 'Goa', terminal: 'T1' },
    ],
    flights: [
      { id: 'FL-6E2041', number: '6E-2041', airline: 'IndiGo', from: 'BOM', to: 'DEL', aircraft: 'Airbus A321neo', status: 'Active' },
      { id: 'FL-AI805', number: 'AI-805', airline: 'Air India', from: 'BOM', to: 'BLR', aircraft: 'Boeing 787-8', status: 'Active' },
      { id: 'FL-IX142', number: 'IX-142', airline: 'Air India Express', from: 'BLR', to: 'GOI', aircraft: 'Boeing 737 MAX 8', status: 'Active' },
    ],
    schedules: [
      { id: 'FSC-01', flight: '6E-2041', dep: '14:20 BOM', arr: '16:35 DEL', duration: '2h 15m', fare: 5420, status: 'ON_TIME' },
      { id: 'FSC-02', flight: 'AI-805', dep: '09:00 BOM', arr: '10:45 BLR', duration: '1h 45m', fare: 4200, status: 'ON_TIME' },
    ],
    seats: [
      { seat: '12A', class: 'ECONOMY', window: true, extraLegroom: true, status: 'BOOKED' },
      { seat: '12B', class: 'ECONOMY', middle: true, status: 'AVAILABLE' },
      { seat: '2A', class: 'BUSINESS', window: true, status: 'AVAILABLE' },
    ],
    addons: [
      { id: 'ADD-01', name: 'Extra 5kg Check-in Baggage', price: 1800, type: 'Baggage' },
      { id: 'ADD-02', name: 'Gourmet Hot Meal (Veg/Non-Veg)', price: 450, type: 'Meal' },
      { id: 'ADD-03', name: 'Priority Boarding & Baggage', price: 600, type: 'Priority' },
    ],
  },
  hotel: {
    hotels: [
      { id: 'HTL-01', name: 'Taj Fort Aguada Resort & Spa', city: 'Goa', rating: 4.9, roomsTotal: 145, priceFrom: 12500, status: 'Active' },
      { id: 'HTL-02', name: 'The Leela Palace Bengaluru', city: 'Bangalore', rating: 4.8, roomsTotal: 220, priceFrom: 14000, status: 'Active' },
      { id: 'HTL-03', name: 'JW Marriott Hotel Pune', city: 'Pune', rating: 4.7, roomsTotal: 180, priceFrom: 9500, status: 'Active' },
      { id: 'HTL-04', name: 'Ginger Hotel Mumbai Airport', city: 'Mumbai', rating: 4.3, roomsTotal: 95, priceFrom: 3800, status: 'Active' },
    ],
    rooms: [
      { id: 'RM-101', hotel: 'Taj Fort Aguada', name: 'Sea View Luxury Suite', type: 'SUITE', pricePerNight: 16500, capacity: '2 Adults, 1 Child' },
      { id: 'RM-102', hotel: 'Taj Fort Aguada', name: 'Garden Deluxe Cottage', type: 'DELUXE', pricePerNight: 11000, capacity: '2 Adults' },
      { id: 'RM-201', hotel: 'JW Marriott Hotel Pune', name: 'Executive King Room', type: 'DOUBLE', pricePerNight: 9500, capacity: '2 Adults' },
    ],
    amenities: [
      { id: 'AMN-01', name: 'Infinity Pool', category: 'Recreation' },
      { id: 'AMN-02', name: 'Complimentary High-Speed WiFi', category: 'Connectivity' },
      { id: 'AMN-03', name: 'Buffet Breakfast Included', category: 'Dining' },
      { id: 'AMN-04', name: 'Airport Pickup & Drop Service', category: 'Transport' },
    ],
    availability: [
      { date: '2026-10-02', hotel: 'Taj Fort Aguada', availableRooms: 12, occupancyRate: '91.7%' },
      { date: '2026-10-03', hotel: 'Taj Fort Aguada', availableRooms: 6, occupancyRate: '95.8%' },
      { date: '2026-10-02', hotel: 'JW Marriott Pune', availableRooms: 28, occupancyRate: '84.4%' },
    ],
  },
  cab: {
    providers: [
      { id: 'CPR-01', name: 'SmartTrip Prime Fleet', vehiclesCount: 180, rating: 4.7, status: 'Active' },
      { id: 'CPR-02', name: 'CityCabs Maharashtra', vehiclesCount: 95, rating: 4.5, status: 'Active' },
    ],
    types: [
      { id: 'CTP-01', name: 'Prime Sedan', seats: 4, baseFare: 50, perKm: 14, popularCar: 'Maruti Suzuki Dzire / Honda Amaze' },
      { id: 'CTP-02', name: 'Prime SUV', seats: 6, baseFare: 90, perKm: 19, popularCar: 'Maruti Ertiga / Toyota Innova' },
      { id: 'CTP-03', name: 'Smart EV', seats: 4, baseFare: 55, perKm: 13, popularCar: 'Tata Nexon EV / Tigor EV' },
    ],
    cabs: [
      { id: 'CAB-01', regNo: 'MH-04-AZ-4920', model: 'Maruti Dzire', type: 'Prime Sedan', driver: 'Ramesh Patil', status: 'En Route' },
      { id: 'CAB-02', regNo: 'MH-12-PQ-8104', model: 'Tata Nexon EV', type: 'Smart EV', driver: 'Sanjay More', status: 'Available' },
      { id: 'CAB-03', regNo: 'MH-01-BK-3391', model: 'Toyota Innova Crysta', type: 'Prime SUV', driver: 'Ganesh Naik', status: 'Available' },
    ],
    drivers: [
      { id: 'DRV-101', name: 'Ramesh Patil', phone: '+91 98210 99421', rating: 4.85, trips: 1420, verified: true },
      { id: 'DRV-102', name: 'Sanjay More', phone: '+91 98220 88312', rating: 4.90, trips: 890, verified: true },
      { id: 'DRV-103', name: 'Ganesh Naik', phone: '+91 98230 77104', rating: 4.75, trips: 2150, verified: true },
    ],
    locations: [
      { name: 'CSMT Railway Station, Mumbai', activeCabs: 18, demand: 'High' },
      { name: 'Mumbai Airport Terminal 2 (BOM)', activeCabs: 34, demand: 'Very High' },
      { name: 'Pune Station / Swargate', activeCabs: 14, demand: 'Medium' },
    ],
    availability: [
      { area: 'South Mumbai', activeDrivers: 42, idleDrivers: 12, avgWaitTime: '4 mins' },
      { area: 'Navi Mumbai & Thane', activeDrivers: 38, idleDrivers: 9, avgWaitTime: '6 mins' },
      { area: 'Pune Central & Hinjawadi', activeDrivers: 55, idleDrivers: 15, avgWaitTime: '5 mins' },
    ],
  },
  auto: {
    providers: [
      { id: 'APR-01', name: 'SmartAuto Metro Union', fleet: 320, rating: 4.6, status: 'Active' },
      { id: 'APR-02', name: 'Green Auto EV Association', fleet: 85, rating: 4.8, status: 'Active' },
    ],
    types: [
      { id: 'ATP-01', name: 'Standard Auto', seats: 3, baseFare: 25, perKm: 12, fuel: 'CNG' },
      { id: 'ATP-02', name: 'Smart EV Auto', seats: 3, baseFare: 22, perKm: 10, fuel: 'Electric (Eco)' },
    ],
    autos: [
      { id: 'AUT-01', regNo: 'MH-12-QU-8819', model: 'Bajaj Compact RE', type: 'Standard Auto', driver: 'Deepak Sawant', status: 'Available' },
      { id: 'AUT-02', regNo: 'MH-14-EA-1940', model: 'Mahindra Treo EV', type: 'Smart EV Auto', driver: 'Vijay Gaikwad', status: 'En Route' },
      { id: 'AUT-03', regNo: 'MH-04-CA-7712', model: 'Piaggio Ape City', type: 'Standard Auto', driver: 'Sunil Jadhav', status: 'Available' },
    ],
    drivers: [
      { id: 'ADR-201', name: 'Deepak Sawant', phone: '+91 97660 12345', rating: 4.8, trips: 2840, verified: true },
      { id: 'ADR-202', name: 'Vijay Gaikwad', phone: '+91 97661 54321', rating: 4.9, trips: 1430, verified: true },
    ],
    serviceAreas: [
      { name: 'Pune City (Swargate, Kothrud, Shivajinagar, Camp)', coverage: 'Full', activeAutos: 84 },
      { name: 'PCMC (Pimpri, Chinchwad, Wakad, Nigdi)', coverage: 'Full', activeAutos: 62 },
      { name: 'Thane & Mulund Metro Perimeter', coverage: 'Full', activeAutos: 95 },
    ],
    availability: [
      { zone: 'Pune West (Kothrud/Baner)', count: 48, status: 'High Availability' },
      { zone: 'Pune East (Viman Nagar/Hadapsar)', count: 36, status: 'Moderate Availability' },
    ],
  },
};

export const initialPayments = [
  { id: 'PAY-8921', bookingId: 'ST-BUS-8492', user: 'Pooja Kulkarni', amount: 1450, method: 'UPI (Mock)', status: 'SUCCESS', date: '2026-09-29 08:49:12', mockRef: 'MP-UPI-849201' },
  { id: 'PAY-8922', bookingId: 'ST-TRN-3291', user: 'Rahul Varma', amount: 780, method: 'Net Banking (Mock)', status: 'SUCCESS', date: '2026-09-29 07:15:33', mockRef: 'MP-NB-329105' },
  { id: 'PAY-8923', bookingId: 'ST-FLT-7104', user: 'Aditya Singhania', amount: 5420, method: 'Card (Mock)', status: 'SUCCESS', date: '2026-09-28 19:33:04', mockRef: 'MP-CRD-710492' },
  { id: 'PAY-8924', bookingId: 'ST-HTL-1829', user: 'Sneha Deshpande', amount: 18900, method: 'UPI (Mock)', status: 'SUCCESS', date: '2026-09-28 14:12:45', mockRef: 'MP-UPI-182934' },
  { id: 'PAY-8925', bookingId: 'ST-CAB-6281', user: 'Karan Mehra', amount: 850, method: 'Wallet (Mock)', status: 'PENDING', date: '2026-09-29 09:12:00', mockRef: 'MP-WLT-628109' },
  { id: 'PAY-8926', bookingId: 'ST-AUT-9402', user: 'Vikram Joshi', amount: 140, method: 'UPI (Mock)', status: 'SUCCESS', date: '2026-09-29 08:35:10', mockRef: 'MP-UPI-940211' },
  { id: 'PAY-8927', bookingId: 'ST-BUS-7319', user: 'Manish Patil', amount: 620, method: 'UPI (Mock)', status: 'REFUNDED', date: '2026-09-27 11:00:22', mockRef: 'MP-UPI-731940' },
];

export const initialRefunds = [
  { id: 'REF-4921', bookingId: 'ST-BUS-7319', user: 'Manish Patil', amount: 620, status: 'PROCESSED', requestedDate: '2026-09-28 09:00', processedDate: '2026-09-28 09:05', reason: 'Passenger cancellation before 24h', mockRef: 'MOCK-RF-4921' },
  { id: 'REF-4922', bookingId: 'ST-FLT-6120', user: 'Ayesha Khan', amount: 3850, status: 'PENDING', requestedDate: '2026-09-27 10:20', processedDate: '—', reason: 'Flight reschedule mismatch', mockRef: 'MOCK-RF-4922' },
  { id: 'REF-4923', bookingId: 'ST-TRN-1904', user: 'Amit Deshmukh', amount: 450, status: 'PROCESSED', requestedDate: '2026-09-25 18:30', processedDate: '2026-09-25 18:40', reason: 'Train cancelled by Indian Railways', mockRef: 'MOCK-RF-4923' },
  { id: 'REF-4924', bookingId: 'ST-CAB-5512', user: 'Pooja Kulkarni', amount: 320, status: 'PROCESSED', requestedDate: '2026-09-24 12:15', processedDate: '2026-09-24 12:20', reason: 'Driver vehicle breakdown midway', mockRef: 'MOCK-RF-4924' },
];

export const initialOffers = [
  { id: 'OFF-101', name: 'Monsoon Getaway Special', travelType: 'bus', discount: '15% OFF', validity: '2026-10-31', usageCount: 1420, status: 'ACTIVE' },
  { id: 'OFF-102', name: 'First Flight Companion Offer', travelType: 'flight', discount: 'Flat ₹600 OFF', validity: '2026-11-15', usageCount: 890, status: 'ACTIVE' },
  { id: 'OFF-103', name: 'Diwali Festive Train Booking', travelType: 'train', discount: 'Zero Convenience Fee', validity: '2026-11-10', usageCount: 3410, status: 'ACTIVE' },
  { id: 'OFF-104', name: 'Goa Coastal Hotel Escape', travelType: 'hotel', discount: '20% OFF on 2+ Nights', validity: '2026-10-15', usageCount: 420, status: 'ACTIVE' },
  { id: 'OFF-105', name: 'SmartAuto Weekend Ride Pass', travelType: 'auto', discount: 'Flat ₹20 OFF', validity: '2026-09-30', usageCount: 650, status: 'EXPIRED' },
];

export const initialCoupons = [
  { id: 'CPN-01', code: 'SMARTTRIP50', discount: '₹50 OFF on first bus booking', usageLimit: 5000, usedCount: 3840, validity: '2026-12-31', status: 'ACTIVE' },
  { id: 'CPN-02', code: 'FLYSMART', discount: '10% OFF up to ₹1,000 on flights', usageLimit: 2000, usedCount: 1450, validity: '2026-11-30', status: 'ACTIVE' },
  { id: 'CPN-03', code: 'GOAHOTEL25', discount: '25% OFF on select Goa luxury properties', usageLimit: 500, usedCount: 320, validity: '2026-10-25', status: 'ACTIVE' },
  { id: 'CPN-04', code: 'RAILPASS', discount: '₹30 instant cashback on train tickets', usageLimit: 10000, usedCount: 8910, validity: '2026-12-31', status: 'ACTIVE' },
  { id: 'CPN-05', code: 'WELCOMEAUTO', discount: 'First auto ride free up to ₹60', usageLimit: 1500, usedCount: 1500, validity: '2026-08-31', status: 'EXHAUSTED' },
];

export const initialNotifications = [
  { id: 'NTF-01', type: 'Booking', title: 'New Bus Booking Confirmed', message: 'User Pooja Kulkarni confirmed booking ST-BUS-8492 (Pune → Goa).', date: '5 mins ago', read: false },
  { id: 'NTF-02', type: 'Payment', title: 'Mock Payment Verified', message: 'Mock payment MP-UPI-849201 of ₹1,450 cleared with 100% simulated guarantee.', date: '12 mins ago', read: false },
  { id: 'NTF-03', type: 'Delay', title: 'Train 12127 Delay Advisory', message: 'Delay of 25 mins reported at Kalyan junction. Broadcast alert sent to 38 passengers.', date: '35 mins ago', read: false },
  { id: 'NTF-04', type: 'Cancellation', title: 'Ticket Cancellation Request', message: 'User Manish Patil requested cancellation for ticket ST-BUS-7319.', date: '2 hours ago', read: true },
  { id: 'NTF-05', type: 'Refund', title: 'Refund Dispatched to Wallet', message: 'Mock refund REF-4921 of ₹620 successfully processed.', date: '3 hours ago', read: true },
  { id: 'NTF-06', type: 'Offer', title: 'Monsoon Special Reached 1,000 Redemptions', message: 'Offer code SMARTTRIP50 hit 76% quota utilization.', date: '6 hours ago', read: true },
  { id: 'NTF-07', type: 'General', title: 'Nightly Platform Backup Completed', message: 'Database state verified intact. All mock payment journals balanced.', date: '12 hours ago', read: true },
];

export const initialTickets = [
  {
    id: 'TCK-201',
    user: 'Pooja Kulkarni',
    email: 'pooja.k@gmail.com',
    subject: 'Seat change request for Goa SmartBus',
    category: 'Booking Amendment',
    priority: 'High',
    status: 'In Progress',
    created: '2026-09-29 08:52',
    bookingRef: 'ST-BUS-8492',
    messages: [
      { sender: 'user', time: '08:52', text: 'Hi team, I booked L4 and L5 on the IntrCity bus to Goa, but my friend wants a lower deck window seat. Can we switch to L1 and L2 if available?' },
      { sender: 'admin', time: '09:05', text: 'Hello Pooja, looking into the seat inventory right now. Seat L1 is available. Let me verify with the operator system.' },
    ],
  },
  {
    id: 'TCK-202',
    user: 'Rahul Varma',
    email: 'rahul.v@outlook.com',
    subject: 'IRCTC PNR status sync delay in mobile app',
    category: 'Technical',
    priority: 'Medium',
    status: 'Open',
    created: '2026-09-29 07:30',
    bookingRef: 'ST-TRN-3291',
    messages: [
      { sender: 'user', time: '07:30', text: 'My train booking ST-TRN-3291 shows confirmed in SmartTrip, but PNR status chart shows preparation in progress. Is seat guaranteed?' },
    ],
  },
  {
    id: 'TCK-203',
    user: 'Ayesha Khan',
    email: 'ayesha.k@gmail.com',
    subject: 'Refund timeline for cancelled Indigo flight',
    category: 'Refunds',
    priority: 'High',
    status: 'Resolved',
    created: '2026-09-27 11:00',
    bookingRef: 'ST-FLT-6120',
    messages: [
      { sender: 'user', time: '11:00', text: 'When will my mock refund of ₹3,850 be processed for flight ST-FLT-6120?' },
      { sender: 'admin', time: '11:20', text: 'Hello Ayesha, refund request REF-4922 has been queued in our mock environment. You will receive an instant credit simulation shortly.' },
    ],
  },
  {
    id: 'TCK-204',
    user: 'Karan Mehra',
    email: 'karan.m@gmail.com',
    subject: 'Cab driver reached different pickup gate at BOM Airport',
    category: 'Cab Service',
    priority: 'Urgent',
    status: 'In Progress',
    created: '2026-09-29 09:20',
    bookingRef: 'ST-CAB-6281',
    messages: [
      { sender: 'user', time: '09:20', text: 'I am at Terminal 2 Gate P4, but driver app shows he is waiting at P7. Please coordinate.' },
    ],
  },
];

export const initialSafetyReports = [
  {
    id: 'SAF-301',
    user: 'Neha Varma',
    phone: '+91 98765 21098',
    booking: 'ST-CAB-4410',
    travelType: 'cab',
    issue: 'Cab speeding and aggressive lane changes on Western Express Highway',
    priority: 'High',
    status: 'Investigating',
    date: '2026-09-28 22:15',
    adminNotes: 'Telemetry speed logs pulled. Max recorded speed 88 km/h in 60 zone. Driver Ramesh warned; speed limiter calibration mandated.',
  },
  {
    id: 'SAF-302',
    user: 'Sneha Deshpande',
    phone: '+91 94220 89123',
    booking: 'ST-BUS-6192',
    travelType: 'bus',
    issue: 'Late night unauthorized roadside halt during Pune-Goa transit',
    priority: 'Critical',
    status: 'Resolved',
    date: '2026-09-25 02:40',
    adminNotes: 'Operator IntrCity contacted immediately. Bus crew stopped for tire pressure verification. Passengers reassured and trip concluded safely.',
  },
  {
    id: 'SAF-303',
    user: 'Amit Deshmukh',
    phone: '+91 98231 44521',
    booking: 'ST-AUT-2019',
    travelType: 'auto',
    issue: 'Driver refused to complete trip to exact pin drop in Kothrud',
    priority: 'Medium',
    status: 'Resolved',
    date: '2026-09-24 16:30',
    adminNotes: 'Driver education refresher scheduled. ₹25 wallet credit issued to passenger for inconvenience.',
  },
];

export const initialReviews = [
  { id: 'REV-01', user: 'Pooja Kulkarni', travelType: 'bus', operator: 'IntrCity SmartBus', rating: 5, review: 'Exceptional journey! Clean AC sleeper, on time departure from Swargate, and USB chargers worked smoothly.', date: '2026-09-28', status: 'Published' },
  { id: 'REV-02', user: 'Rahul Varma', travelType: 'train', operator: '12127 Intercity SF', rating: 4, review: 'Chair car AC was cool and punctuality was good, but breakfast cart was crowded at Karjat.', date: '2026-09-27', status: 'Published' },
  { id: 'REV-03', user: 'Aditya Singhania', travelType: 'flight', operator: 'IndiGo Airlines', rating: 5, review: 'Smooth check-in at BOM T2, flight arrived 10 minutes early into Delhi. SmartTrip booking was seamless.', date: '2026-09-26', status: 'Published' },
  { id: 'REV-04', user: 'Vikram Joshi', travelType: 'auto', operator: 'SmartAuto Metro', rating: 4, review: 'Quick pickup within 3 minutes and fair fixed pricing. No haggling!', date: '2026-09-29', status: 'Published' },
  { id: 'REV-05', user: 'Rajesh Shinde', travelType: 'bus', operator: 'Neeta Travels', rating: 2, review: 'Bus departed 40 minutes late from Borivali and driver was argumentative.', date: '2026-09-24', status: 'Hidden' },
];

export const initialTrackingTrips = [
  { id: 'TRK-01', trip: 'ST-BUS-8492', route: 'Pune → Goa', vehicle: 'MH-12-RN-4820 (IntrCity)', status: 'En Route', delay: '+0m', lastUpdated: '1 min ago', speed: '68 km/h', latLng: '16.7050° N, 74.2433° E (Near Kolhapur)', liveGpsActive: true },
  { id: 'TRK-02', trip: 'ST-TRN-3291', route: 'CSMT → Pune Jn', vehicle: 'Train 12127 Intercity', status: 'Delayed', delay: '+25m', lastUpdated: '3 mins ago', speed: '92 km/h', latLng: '18.7500° N, 73.4000° E (Near Lonavala)', liveGpsActive: true },
  { id: 'TRK-03', trip: 'ST-CAB-6281', route: 'BOM T2 → Thane', vehicle: 'MH-04-AZ-4920 (Dzire)', status: 'En Route', delay: '+5m', lastUpdated: 'Just now', speed: '42 km/h', latLng: '19.1176° N, 72.8797° E (JVLR)', liveGpsActive: true },
  { id: 'TRK-04', trip: 'ST-BUS-1049', route: 'Nagpur → Pune', vehicle: 'MH-20-AQ-7744 (Shivshahi)', status: 'Offline / GPS Inactive', delay: '—', lastUpdated: '45 mins ago', speed: '0 km/h', latLng: null, liveGpsActive: false },
];

export const initialAuditLogs = [
  { id: 'LOG-701', timestamp: '2026-09-29 08:50:22', admin: 'Chetan Patil (Super Admin)', action: 'REFUND_PROCESSED', module: 'Payments & Refunds', target: 'REF-4921 (₹620)', ip: '192.168.1.104', status: 'SUCCESS' },
  { id: 'LOG-702', timestamp: '2026-09-29 08:15:10', admin: 'Chetan Patil (Super Admin)', action: 'SCHEDULE_UPDATED', module: 'Travel Management (Bus)', target: 'BSC-03 (Pune → Nagpur)', ip: '192.168.1.104', status: 'SUCCESS' },
  { id: 'LOG-703', timestamp: '2026-09-28 17:45:00', admin: 'Chetan Patil (Super Admin)', action: 'COUPON_CREATED', module: 'Offers & Coupons', target: 'GOAHOTEL25 (25% OFF)', ip: '192.168.1.104', status: 'SUCCESS' },
  { id: 'LOG-704', timestamp: '2026-09-28 14:10:18', admin: 'Chetan Patil (Super Admin)', action: 'USER_STATUS_CHANGE', module: 'Users', target: 'USR-1005 (Suspended)', ip: '192.168.1.104', status: 'SUCCESS' },
  { id: 'LOG-705', timestamp: '2026-09-28 11:20:45', admin: 'Chetan Patil (Super Admin)', action: 'SAFETY_RESOLVED', module: 'Safety', target: 'SAF-302 (Bus roadside halt)', ip: '192.168.1.104', status: 'SUCCESS' },
  { id: 'LOG-706', timestamp: '2026-09-27 20:00:00', admin: 'Chetan Patil (Super Admin)', action: 'SETTINGS_UPDATE', module: 'Settings', target: 'Mock Payment Environment Policy', ip: '192.168.1.104', status: 'SUCCESS' },
];
