const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding SmartTrip comprehensive database...');

  // ==========================================
  // 1. BUS SYSTEM SEEDING
  // ==========================================
  console.log('1. Seeding Bus System...');

  // Operators
  const purple = await prisma.busOperator.upsert({
    where: { id: 'op-purple' },
    update: {},
    create: {
      id: 'op-purple',
      name: 'Purple Travels',
      phone: '+91 9822011223',
      email: 'support@purpletags.com',
      rating: 4.6,
    },
  });

  const neeta = await prisma.busOperator.upsert({
    where: { id: 'op-neeta' },
    update: {},
    create: {
      id: 'op-neeta',
      name: 'Neeta Tours and Travels',
      phone: '+91 9822044556',
      email: 'info@neetabus.in',
      rating: 4.4,
    },
  });

  const vrl = await prisma.busOperator.upsert({
    where: { id: 'op-vrl' },
    update: {},
    create: {
      id: 'op-vrl',
      name: 'VRL Travels',
      phone: '+91 9822077889',
      email: 'customercare@vrllogistics.com',
      rating: 4.8,
    },
  });

  const zing = await prisma.busOperator.upsert({
    where: { id: 'op-zing' },
    update: {},
    create: {
      id: 'op-zing',
      name: 'Zingbus Plus',
      phone: '+91 9822099001',
      email: 'care@zingbus.com',
      rating: 4.7,
    },
  });

  // Buses
  const bus1 = await prisma.bus.upsert({
    where: { busNumber: 'MH-12-RN-1001' },
    update: {},
    create: {
      busNumber: 'MH-12-RN-1001',
      operatorId: purple.id,
      busType: 'AC Sleeper 2+1 Bharat Benz',
      totalSeats: 36,
      amenities: JSON.stringify(['Wi-Fi', 'Charging Point', 'Blanket', 'Water Bottle', 'Reading Light']),
    },
  });

  const bus2 = await prisma.bus.upsert({
    where: { busNumber: 'MH-14-BT-2002' },
    update: {},
    create: {
      busNumber: 'MH-14-BT-2002',
      operatorId: neeta.id,
      busType: 'Volvo Multi-Axle Semi-Sleeper',
      totalSeats: 40,
      amenities: JSON.stringify(['AC', 'Reclining Seats', 'Charging Point', 'Emergency Exit']),
    },
  });

  const bus3 = await prisma.bus.upsert({
    where: { busNumber: 'KA-25-AB-3003' },
    update: {},
    create: {
      busNumber: 'KA-25-AB-3003',
      operatorId: vrl.id,
      busType: 'I-Shift Multi-Axle Premium Sleeper',
      totalSeats: 32,
      amenities: JSON.stringify(['Wi-Fi', 'Snacks', 'Pillow', 'GPS Tracking', 'CCTV']),
    },
  });

  // Bus Routes
  const routeMumPune = await prisma.busRoute.create({
    data: {
      source: 'Mumbai',
      destination: 'Pune',
      distance: 152.0,
      duration: '3h 30m',
      stops: {
        create: [
          { name: 'Dadar West', stopType: 'BOARDING', address: 'Near Asiad Stand' },
          { name: 'Vashi Plaza', stopType: 'BOARDING', address: 'Highway Junction' },
          { name: 'Wakad Bridge', stopType: 'DROPPING', address: 'Hinjewadi Bypass' },
          { name: 'Swargate', stopType: 'DROPPING', address: 'Jedhe Chowk' },
        ],
      },
    },
  });

  const routePuneGoa = await prisma.busRoute.create({
    data: {
      source: 'Pune',
      destination: 'Goa',
      distance: 440.0,
      duration: '9h 00m',
      stops: {
        create: [
          { name: 'Swargate Stand', stopType: 'BOARDING', address: 'Neeta Office' },
          { name: 'Katraj Wonder City', stopType: 'BOARDING', address: 'Highway Gate' },
          { name: 'Mapusa Court', stopType: 'DROPPING', address: 'Near Circle' },
          { name: 'Panjim Bus Stand', stopType: 'DROPPING', address: 'Patto Center' },
        ],
      },
    },
  });

  // Bus Schedules (Generate for next 30 days)
  const now = new Date();
  for (let d = 0; d < 30; d++) {
    const travelDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + d);

    await prisma.busSchedule.create({
      data: {
        busId: bus1.id,
        routeId: routeMumPune.id,
        travelDate: travelDate,
        departureTime: '07:00 AM',
        arrivalTime: '10:30 AM',
        fare: 550,
        status: 'SCHEDULED',
      },
    });

    await prisma.busSchedule.create({
      data: {
        busId: bus2.id,
        routeId: routeMumPune.id,
        travelDate: travelDate,
        departureTime: '04:30 PM',
        arrivalTime: '08:00 PM',
        fare: 620,
        status: 'SCHEDULED',
      },
    });

    await prisma.busSchedule.create({
      data: {
        busId: bus3.id,
        routeId: routePuneGoa.id,
        travelDate: travelDate,
        departureTime: '09:00 PM',
        arrivalTime: '06:00 AM',
        fare: 1250,
        status: 'SCHEDULED',
      },
    });
  }

  // ==========================================
  // 2. TRAIN SYSTEM SEEDING
  // ==========================================
  console.log('2. Seeding Train System...');

  const irctc = await prisma.trainOperator.create({
    data: {
      name: 'Indian Railways (IRCTC)',
      code: 'IRCTC',
    },
  });

  // Stations
  const stnMumbai = await prisma.trainStation.upsert({
    where: { code: 'CSMT' },
    update: {},
    create: { name: 'Chhatrapati Shivaji Maharaj Terminus', code: 'CSMT', city: 'Mumbai', state: 'Maharashtra' },
  });

  const stnMMCT = await prisma.trainStation.upsert({
    where: { code: 'MMCT' },
    update: {},
    create: { name: 'Mumbai Central', code: 'MMCT', city: 'Mumbai', state: 'Maharashtra' },
  });

  const stnPune = await prisma.trainStation.upsert({
    where: { code: 'PUNE' },
    update: {},
    create: { name: 'Pune Junction', code: 'PUNE', city: 'Pune', state: 'Maharashtra' },
  });

  const stnAdi = await prisma.trainStation.upsert({
    where: { code: 'ADI' },
    update: {},
    create: { name: 'Ahmedabad Junction', code: 'ADI', city: 'Ahmedabad', state: 'Gujarat' },
  });

  const stnDel = await prisma.trainStation.upsert({
    where: { code: 'NDLS' },
    update: {},
    create: { name: 'New Delhi Railway Station', code: 'NDLS', city: 'Delhi', state: 'Delhi' },
  });

  // Trains
  const shatabdi = await prisma.train.upsert({
    where: { trainNumber: '12009' },
    update: {},
    create: {
      trainNumber: '12009',
      trainName: 'Mumbai - Ahmedabad Shatabdi Express',
      operatorId: irctc.id,
      classes: {
        create: [
          { classCode: 'EC', className: 'Executive Chair Car', fare: 1650 },
          { classCode: 'CC', className: 'AC Chair Car', fare: 920 },
        ],
      },
    },
  });

  const rajdhani = await prisma.train.upsert({
    where: { trainNumber: '12951' },
    update: {},
    create: {
      trainNumber: '12951',
      trainName: 'Mumbai Rajdhani Express',
      operatorId: irctc.id,
      classes: {
        create: [
          { classCode: '1A', className: 'AC First Class', fare: 2850 },
          { classCode: '2A', className: 'AC 2-Tier', fare: 1850 },
          { classCode: '3A', className: 'AC 3-Tier', fare: 1280 },
        ],
      },
    },
  });

  const vandeBharat = await prisma.train.upsert({
    where: { trainNumber: '22221' },
    update: {},
    create: {
      trainNumber: '22221',
      trainName: 'CSMT - Solapur Vande Bharat Express',
      operatorId: irctc.id,
      classes: {
        create: [
          { classCode: 'EC', className: 'Executive Class', fare: 1980 },
          { classCode: 'CC', className: 'Chair Car', fare: 1150 },
        ],
      },
    },
  });

  // Train Routes & Schedules
  const trainRoute1 = await prisma.trainRoute.create({
    data: {
      sourceStationId: stnMMCT.id,
      destinationStationId: stnAdi.id,
      distance: 492.0,
      duration: '6h 20m',
    },
  });

  for (let d = 0; d < 30; d++) {
    const travelDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + d);

    await prisma.trainSchedule.create({
      data: {
        trainId: shatabdi.id,
        routeId: trainRoute1.id,
        travelDate: travelDate,
        departureTime: '06:20 AM',
        arrivalTime: '12:40 PM',
        status: 'SCHEDULED',
      },
    });

    await prisma.trainSchedule.create({
      data: {
        trainId: rajdhani.id,
        routeId: trainRoute1.id,
        travelDate: travelDate,
        departureTime: '05:00 PM',
        arrivalTime: '10:55 PM',
        status: 'SCHEDULED',
      },
    });
  }

  // ==========================================
  // 3. FLIGHT SYSTEM SEEDING
  // ==========================================
  console.log('3. Seeding Flight System...');

  const indigo = await prisma.airline.upsert({
    where: { code: '6E' },
    update: {},
    create: { name: 'IndiGo Airlines', code: '6E' },
  });

  const airIndia = await prisma.airline.upsert({
    where: { code: 'AI' },
    update: {},
    create: { name: 'Air India', code: 'AI' },
  });

  const vistara = await prisma.airline.upsert({
    where: { code: 'UK' },
    update: {},
    create: { name: 'Vistara', code: 'UK' },
  });

  const apBom = await prisma.airport.upsert({
    where: { code: 'BOM' },
    update: {},
    create: { name: 'Chhatrapati Shivaji Maharaj International Airport', code: 'BOM', city: 'Mumbai', country: 'India' },
  });

  const apDel = await prisma.airport.upsert({
    where: { code: 'DEL' },
    update: {},
    create: { name: 'Indira Gandhi International Airport', code: 'DEL', city: 'Delhi', country: 'India' },
  });

  const apGoa = await prisma.airport.upsert({
    where: { code: 'GOI' },
    update: {},
    create: { name: 'Dabolim Airport', code: 'GOI', city: 'Goa', country: 'India' },
  });

  const flight1 = await prisma.flight.upsert({
    where: { flightNumber: '6E-5021' },
    update: {},
    create: { flightNumber: '6E-5021', airlineId: indigo.id, aircraft: 'Airbus A321neo' },
  });

  const flight2 = await prisma.flight.upsert({
    where: { flightNumber: 'UK-854' },
    update: {},
    create: { flightNumber: 'UK-854', airlineId: vistara.id, aircraft: 'Boeing 737-800' },
  });

  for (let d = 0; d < 30; d++) {
    const travelDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + d);

    await prisma.flightSchedule.create({
      data: {
        flightId: flight1.id,
        sourceAirportId: apBom.id,
        destinationAirportId: apDel.id,
        departureDate: travelDate,
        departureTime: '08:15 AM',
        arrivalTime: '10:30 AM',
        duration: '2h 15m',
        fare: 4890,
        status: 'SCHEDULED',
      },
    });

    await prisma.flightSchedule.create({
      data: {
        flightId: flight2.id,
        sourceAirportId: apBom.id,
        destinationAirportId: apDel.id,
        departureDate: travelDate,
        departureTime: '04:00 PM',
        arrivalTime: '06:15 PM',
        duration: '2h 15m',
        fare: 6250,
        status: 'SCHEDULED',
      },
    });
  }

  // ==========================================
  // 4. HOTEL SYSTEM SEEDING
  // ==========================================
  console.log('4. Seeding Hotel System...');

  const hotelTaj = await prisma.hotel.create({
    data: {
      name: 'Taj Holiday Village Resort & Spa',
      description: 'Luxury beachside resort with private cottages, beachfront dining, and Ayurvedic spa.',
      address: 'Dando, Candolim, Sinquerim',
      city: 'Goa',
      state: 'Goa',
      country: 'India',
      rating: 4.9,
      phone: '+91 832 664 5858',
      email: 'holidayvillage.goa@tajhotels.com',
      checkInTime: '02:00 PM',
      checkOutTime: '12:00 PM',
      amenities: {
        create: [
          { name: 'Beach Access' },
          { name: 'Swimming Pool' },
          { name: 'Free High-Speed Wi-Fi' },
          { name: 'Luxury Spa' },
          { name: 'Breakfast Included' },
        ],
      },
      rooms: {
        create: [
          { roomType: 'DELUXE', capacity: 2, pricePerNight: 4800, totalRooms: 20, availableRooms: 15 },
          { roomType: 'SUITE', capacity: 4, pricePerNight: 8500, totalRooms: 8, availableRooms: 6 },
        ],
      },
    },
  });

  const hotelGrand = await prisma.hotel.create({
    data: {
      name: 'Grand Hyatt Beach Resort',
      description: 'Contemporary luxury overlooking Bambolim Bay with lush gardens and multiple dining choices.',
      address: 'P.O. Goa University, Bambolim',
      city: 'Goa',
      state: 'Goa',
      country: 'India',
      rating: 4.8,
      phone: '+91 832 710 1234',
      email: 'goa.grand@hyatt.com',
      checkInTime: '03:00 PM',
      checkOutTime: '12:00 PM',
      amenities: {
        create: [
          { name: 'Bay View' },
          { name: 'Infinity Pool' },
          { name: 'Fitness Gym' },
          { name: 'Cocktail Lounge' },
        ],
      },
      rooms: {
        create: [
          { roomType: 'DOUBLE', capacity: 2, pricePerNight: 3900, totalRooms: 25, availableRooms: 20 },
          { roomType: 'DELUXE', capacity: 3, pricePerNight: 5800, totalRooms: 15, availableRooms: 12 },
        ],
      },
    },
  });

  // ==========================================
  // 5. OFFERS & COUPONS SEEDING
  // ==========================================
  console.log('5. Seeding Offers & Coupons...');

  const validFrom = new Date();
  const validUntil = new Date(now.getFullYear(), now.getMonth() + 3, now.getDate());

  await prisma.offer.createMany({
    data: [
      {
        title: 'Flat 20% OFF on Bus Bookings',
        description: 'Get 20% discount on all Volvo and AC Sleeper intercity bus tickets.',
        code: 'SMARTBUS20',
        discountType: 'PERCENTAGE',
        discountValue: 20,
        maxDiscount: 250,
        minBookingAmount: 500,
        validFrom,
        validUntil,
        isActive: true,
      },
      {
        title: 'Flat ₹100 Cashback on Train Tickets',
        description: 'Book confirmed train berths and receive ₹100 instant cashback.',
        code: 'RAIL100',
        discountType: 'FLAT',
        discountValue: 100,
        maxDiscount: 100,
        minBookingAmount: 800,
        validFrom,
        validUntil,
        isActive: true,
      },
      {
        title: 'Save Up to ₹1,500 on Flights',
        description: 'Exclusive airfare discounts on IndiGo, Air India, and Vistara flights.',
        code: 'FLYTRIP1500',
        discountType: 'PERCENTAGE',
        discountValue: 12,
        maxDiscount: 1500,
        minBookingAmount: 3500,
        validFrom,
        validUntil,
        isActive: true,
      },
      {
        title: 'Extra 15% OFF on Luxury Resort Stays',
        description: 'Applicable on 4-star and 5-star beachfront properties and villas.',
        code: 'STAYGOA15',
        discountType: 'PERCENTAGE',
        discountValue: 15,
        maxDiscount: 1200,
        minBookingAmount: 2500,
        validFrom,
        validUntil,
        isActive: true,
      },
    ],
  });

  await prisma.coupon.createMany({
    data: [
      {
        code: 'WELCOME50',
        description: 'Welcome discount for all new SmartTrip travelers',
        discountType: 'PERCENTAGE',
        discountValue: 50,
        maxDiscount: 300,
        minBookingAmount: 400,
        usageLimit: 10000,
        validFrom,
        validUntil,
        isActive: true,
      },
      {
        code: 'SMARTBUS20',
        description: '20% discount for bus bookings',
        discountType: 'PERCENTAGE',
        discountValue: 20,
        maxDiscount: 250,
        minBookingAmount: 500,
        usageLimit: 5000,
        validFrom,
        validUntil,
        isActive: true,
      },
    ],
  });

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
