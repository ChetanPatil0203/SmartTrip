const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Jalgaon & Khandesh routes...');

  // Clean any incomplete routes created in previous attempt
  await prisma.busSchedule.deleteMany({
    where: {
      route: {
        OR: [
          { source: 'Jalgaon' },
          { destination: 'Jalgaon' },
        ],
      },
    },
  });
  await prisma.busStop.deleteMany({
    where: {
      route: {
        OR: [
          { source: 'Jalgaon' },
          { destination: 'Jalgaon' },
        ],
      },
    },
  });
  await prisma.busRoute.deleteMany({
    where: {
      OR: [
        { source: 'Jalgaon' },
        { destination: 'Jalgaon' },
      ],
    },
  });

  const routesData = [
    {
      source: 'Jalgaon',
      destination: 'Pune',
      distance: 385.0,
      duration: '8h 30m',
      boardingStops: [
        { name: 'Akashwani Chowk, Jalgaon', stopType: 'BOARDING', address: 'Near Akashwani Tower, NH-6' },
        { name: 'Old B.J. Market, Jalgaon', stopType: 'BOARDING', address: 'Near City Post Office' },
        { name: 'Icchadevi Chowk, Jalgaon', stopType: 'BOARDING', address: 'Icchadevi Temple Bypass' },
      ],
      droppingStops: [
        { name: 'Wakad Bridge, Pune', stopType: 'DROPPING', address: 'Hinjewadi Bypass' },
        { name: 'Shivajinagar, Pune', stopType: 'DROPPING', address: 'Near Railway Station' },
        { name: 'Swargate, Pune', stopType: 'DROPPING', address: 'Jedhe Chowk' },
      ],
      buses: [
        { busId: 'bus-shivneri-1', dep: '09:30 PM', arr: '06:00 AM', fare: 580 },
        { busId: 'bus-purple-1', dep: '10:15 PM', arr: '06:45 AM', fare: 650 },
        { busId: 'bus-neeta-1', dep: '11:00 PM', arr: '07:15 AM', fare: 750 },
        { busId: 'bus-vrl-1', dep: '08:45 PM', arr: '05:30 AM', fare: 720 },
      ],
    },
    {
      source: 'Jalgaon',
      destination: 'Nashik',
      distance: 245.0,
      duration: '4h 30m',
      boardingStops: [
        { name: 'Akashwani Chowk, Jalgaon', stopType: 'BOARDING', address: 'Near Akashwani Tower' },
        { name: 'Icchadevi Chowk, Jalgaon', stopType: 'BOARDING', address: 'NH-6 Highway' },
      ],
      droppingStops: [
        { name: 'Dwarka Circle, Nashik', stopType: 'DROPPING', address: 'Dwarka Circle Highway Flyover' },
        { name: 'CBS Old Bus Stand, Nashik', stopType: 'DROPPING', address: 'Central Bus Stand' },
        { name: 'Mumbai Naka, Nashik', stopType: 'DROPPING', address: 'Near Trax Stand' },
      ],
      buses: [
        { busId: 'bus-shivneri-1', dep: '07:00 AM', arr: '11:30 AM', fare: 350 },
        { busId: 'bus-zing-1', dep: '02:00 PM', arr: '06:30 PM', fare: 420 },
        { busId: 'bus-purple-1', dep: '11:30 PM', arr: '04:00 AM', fare: 450 },
      ],
    },
    {
      source: 'Jalgaon',
      destination: 'Mumbai',
      distance: 415.0,
      duration: '9h 00m',
      boardingStops: [
        { name: 'Old B.J. Market, Jalgaon', stopType: 'BOARDING', address: 'City Center' },
        { name: 'Akashwani Chowk, Jalgaon', stopType: 'BOARDING', address: 'Near Circle' },
      ],
      droppingStops: [
        { name: 'Thane Teen Hath Naka', stopType: 'DROPPING', address: 'Eastern Express Highway' },
        { name: 'Vashi Plaza, Navi Mumbai', stopType: 'DROPPING', address: 'Near Sion-Panvel Highway' },
        { name: 'Dadar Asiad Stand, Mumbai', stopType: 'DROPPING', address: 'Near Flower Market' },
      ],
      buses: [
        { busId: 'bus-shivneri-1', dep: '08:30 PM', arr: '05:30 AM', fare: 680 },
        { busId: 'bus-vrl-1', dep: '09:45 PM', arr: '06:30 AM', fare: 850 },
        { busId: 'bus-neeta-1', dep: '10:30 PM', arr: '07:15 AM', fare: 820 },
      ],
    },
    {
      source: 'Nashik',
      destination: 'Jalgaon',
      distance: 245.0,
      duration: '4h 30m',
      boardingStops: [
        { name: 'Dwarka Circle, Nashik', stopType: 'BOARDING', address: 'Highway Flyover' },
        { name: 'CBS, Nashik', stopType: 'BOARDING', address: 'Central Bus Stand' },
      ],
      droppingStops: [
        { name: 'Akashwani Chowk, Jalgaon', stopType: 'DROPPING', address: 'NH-6' },
        { name: 'Old B.J. Market, Jalgaon', stopType: 'DROPPING', address: 'City Center' },
      ],
      buses: [
        { busId: 'bus-shivneri-1', dep: '08:00 AM', arr: '12:30 PM', fare: 350 },
        { busId: 'bus-purple-1', dep: '04:30 PM', arr: '09:00 PM', fare: 450 },
      ],
    },
    {
      source: 'Pune',
      destination: 'Jalgaon',
      distance: 385.0,
      duration: '8h 30m',
      boardingStops: [
        { name: 'Swargate, Pune', stopType: 'BOARDING', address: 'Jedhe Chowk' },
        { name: 'Shivajinagar, Pune', stopType: 'BOARDING', address: 'Near Metro' },
        { name: 'Wakad Bridge, Pune', stopType: 'BOARDING', address: 'Hinjewadi Bypass' },
      ],
      droppingStops: [
        { name: 'Icchadevi Chowk, Jalgaon', stopType: 'DROPPING', address: 'NH-6' },
        { name: 'Akashwani Chowk, Jalgaon', stopType: 'DROPPING', address: 'Near Tower' },
      ],
      buses: [
        { busId: 'bus-shivneri-1', dep: '09:30 PM', arr: '06:00 AM', fare: 580 },
        { busId: 'bus-neeta-1', dep: '10:30 PM', arr: '07:00 AM', fare: 750 },
      ],
    },
  ];

  const now = new Date();

  for (const rd of routesData) {
    const route = await prisma.busRoute.create({
      data: {
        source: rd.source,
        destination: rd.destination,
        distance: rd.distance,
        duration: rd.duration,
        stops: {
          create: [...rd.boardingStops, ...rd.droppingStops],
        },
      },
    });

    console.log(`Created route: ${rd.source} -> ${rd.destination}`);

    // Generate schedules for next 30 days
    for (let d = 0; d < 30; d++) {
      const travelDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + d);

      for (const b of rd.buses) {
        await prisma.busSchedule.create({
          data: {
            busId: b.busId,
            routeId: route.id,
            travelDate,
            departureTime: b.dep,
            arrivalTime: b.arr,
            fare: b.fare,
            status: 'SCHEDULED',
          },
        });
      }
    }
  }

  console.log('✅ Jalgaon routes & schedules seeded successfully!');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
