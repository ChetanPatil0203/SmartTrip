const today = new Date().toISOString().split('T')[0];
const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

export const initBooking = {
  // Global & Category
  category: 'bus', // 'bus' | 'train' | 'flight' | 'hotel'

  // Bus specific (preserved 100%)
  from: 'Mumbai',
  to: 'Pune',
  date: today,
  passengers: 1,
  selectedBus: null,
  selectedSeats: [],
  boardingPoint: '',
  droppingPoint: '',

  // Train specific
  trainFrom: 'Mumbai Central',
  trainTo: 'Ahmedabad',
  trainDate: today,
  trainClass: 'Executive Chair Car',
  trainTripType: 'one-way',
  selectedTrain: null,
  selectedTrainBerthPref: 'Lower',
  trainPassengerList: [],

  // Flight specific
  flightFrom: 'Mumbai (BOM)',
  flightTo: 'Delhi (DEL)',
  flightDepartureDate: today,
  flightReturnDate: tomorrow,
  flightTripType: 'one-way',
  flightClass: 'Economy',
  selectedFlight: null,
  selectedFlightSeats: [],
  flightAddons: {
    baggage: '15 KG',
    meal: 'None',
    insurance: false,
  },
  flightPassengerList: [],

  // Hotel specific
  hotelDestination: 'Goa',
  checkInDate: today,
  checkOutDate: tomorrow,
  hotelRooms: 1,
  hotelGuests: 2,
  selectedHotel: null,
  selectedRoom: null,
  hotelGuestDetails: {
    fullName: '',
    phone: '',
    email: '',
    specialRequests: [],
  },

  // Payment & Universal
  passengerList: [],
  paymentMethod: 'upi',
  coupon: '',
  discount: 0,
  pnr: 'ST' + Math.floor(10000000 + Math.random() * 90000000),
  bookingId: 'ST-BK-' + Math.floor(100000 + Math.random() * 900000),
  bookingType: 'bus', // 'bus' | 'train' | 'flight' | 'hotel'
  totalAmount: 0,
};

