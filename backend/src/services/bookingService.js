const crypto = require("crypto");
const bookingModel = require("../models/bookingModel");

const generateBookingReference = (bookingType) => {
  const prefixes = {
    BUS: "STB",
    TRAIN: "STT",
    FLIGHT: "STF",
    HOTEL: "STH",
  };
  const prefix = prefixes[bookingType.toUpperCase()] || "STB";
  const randomStr = crypto.randomBytes(4).toString("hex").toUpperCase();
  return `${prefix}-${randomStr}`;
};

const bookingService = {
  createBooking: async (userId, body) => {
    const {
      bookingType,
      scheduleId,
      serviceId,
      hotelId,
      roomId,
      checkInDate,
      checkIn,
      checkOutDate,
      checkOut,
      numberOfRooms,
      rooms,
      numberOfGuests,
      guests,
      passengers = [],
      boardingStopId,
      droppingStopId,
      classCode,
      addons = [],
      totalAmount,
    } = body;

    const type = bookingType.trim().toUpperCase();
    const targetScheduleId = scheduleId || serviceId;
    const bookingReference = generateBookingReference(type);

    return await bookingModel.executeTransaction(async (tx) => {
      // ----------------------------------------------------
      // 1. BUS BOOKING
      // ----------------------------------------------------
      if (type === "BUS") {
        const sched = await tx.busSchedule.findUnique({
          where: { id: targetScheduleId },
          include: { bus: true, route: true },
        });
        if (!sched) {
          const error = new Error("Bus schedule not found");
          error.statusCode = 404;
          throw error;
        }

        if (boardingStopId) {
          const bStop = await tx.busStop.findUnique({ where: { id: boardingStopId } });
          if (!bStop) {
            const error = new Error("Boarding stop not found");
            error.statusCode = 404;
            throw error;
          }
        }

        if (droppingStopId) {
          const dStop = await tx.busStop.findUnique({ where: { id: droppingStopId } });
          if (!dStop) {
            const error = new Error("Dropping stop not found");
            error.statusCode = 404;
            throw error;
          }
        }

        // Duplicate Seat Check
        const activeBusBookings = await tx.busBooking.findMany({
          where: {
            scheduleId: targetScheduleId,
            booking: { status: { not: "CANCELLED" } },
          },
          include: {
            booking: { include: { passengers: true } },
          },
        });

        const bookedSeatNumbers = new Set();
        activeBusBookings.forEach((b) => {
          b.booking.passengers.forEach((p) => {
            if (p.seatNumber) bookedSeatNumbers.add(p.seatNumber.trim().toUpperCase());
          });
        });

        for (const p of passengers) {
          if (p.seatNumber) {
            const requestedSeat = p.seatNumber.trim().toUpperCase();
            if (bookedSeatNumbers.has(requestedSeat)) {
              const error = new Error(`Selected seat (${requestedSeat}) is already booked`);
              error.statusCode = 409;
              error.errorCode = "SEAT_UNAVAILABLE";
              throw error;
            }
          }
        }

        const calculatedFare = sched.fare * passengers.length;
        const finalTotalAmount = (totalAmount && parseFloat(totalAmount) > 0) ? parseFloat(totalAmount) : calculatedFare;

        const booking = await tx.booking.create({
          data: {
            userId,
            bookingReference,
            bookingType: "BUS",
            status: "PENDING",
            totalAmount: finalTotalAmount,
            travelDate: sched.travelDate,
          },
        });

        await tx.busBooking.create({
          data: {
            bookingId: booking.id,
            scheduleId: targetScheduleId,
            boardingStopId: boardingStopId || null,
            droppingStopId: droppingStopId || null,
          },
        });

        await tx.bookingPassenger.createMany({
          data: passengers.map((p) => ({
            bookingId: booking.id,
            name: p.name.trim(),
            age: parseInt(p.age, 10) || 18,
            gender: p.gender ? p.gender.trim().toUpperCase() : "MALE",
            phone: p.phone ? p.phone.trim() : null,
            email: p.email ? p.email.trim() : null,
            seatNumber: p.seatNumber ? p.seatNumber.trim().toUpperCase() : null,
          })),
        });

        await tx.payment.create({
          data: {
            bookingId: booking.id,
            paymentReference: `PAY-${bookingReference}`,
            amount: finalTotalAmount,
            method: "UPI",
            status: "PENDING",
          },
        });

        return booking;
      }

      // ----------------------------------------------------
      // 2. TRAIN BOOKING
      // ----------------------------------------------------
      if (type === "TRAIN") {
        const sched = await tx.trainSchedule.findUnique({
          where: { id: targetScheduleId },
          include: { train: true, route: true },
        });
        if (!sched) {
          const error = new Error("Train schedule not found");
          error.statusCode = 404;
          throw error;
        }

        const normClass = classCode.trim().toUpperCase();
        const trainClassObj = await tx.trainClass.findFirst({
          where: { trainId: sched.trainId, classCode: normClass },
        });
        if (!trainClassObj) {
          const error = new Error(`Train class '${normClass}' not found for this train`);
          error.statusCode = 404;
          throw error;
        }

        // Duplicate Seat / Berth Check
        const activeTrainBookings = await tx.trainBooking.findMany({
          where: {
            scheduleId: targetScheduleId,
            classCode: normClass,
            booking: { status: { not: "CANCELLED" } },
          },
          include: {
            booking: { include: { passengers: true } },
          },
        });

        const bookedSeats = new Set();
        activeTrainBookings.forEach((tb) => {
          tb.booking.passengers.forEach((p) => {
            const num = p.seatNumber || p.berthNumber;
            if (num) bookedSeats.add(num.trim().toUpperCase());
          });
        });

        for (const p of passengers) {
          const reqNum = p.seatNumber || p.berthNumber;
          if (reqNum) {
            const normReq = reqNum.trim().toUpperCase();
            if (bookedSeats.has(normReq)) {
              const error = new Error(`Selected seat/berth (${normReq}) is already booked`);
              error.statusCode = 409;
              error.errorCode = "SEAT_UNAVAILABLE";
              throw error;
            }
          }
        }

        const calculatedFare = (trainClassObj.fareMultiplier || 1) * passengers.length * 500;
        const finalTotalAmount = (totalAmount && parseFloat(totalAmount) > 0) ? parseFloat(totalAmount) : calculatedFare;

        const booking = await tx.booking.create({
          data: {
            userId,
            bookingReference,
            bookingType: "TRAIN",
            status: "PENDING",
            totalAmount: finalTotalAmount,
            travelDate: sched.travelDate,
          },
        });

        await tx.trainBooking.create({
          data: {
            bookingId: booking.id,
            scheduleId: targetScheduleId,
            classCode: normClass,
          },
        });

        await tx.bookingPassenger.createMany({
          data: passengers.map((p) => ({
            bookingId: booking.id,
            name: p.name.trim(),
            age: parseInt(p.age, 10) || 18,
            gender: p.gender ? p.gender.trim().toUpperCase() : "MALE",
            phone: p.phone ? p.phone.trim() : null,
            email: p.email ? p.email.trim() : null,
            seatNumber: p.seatNumber ? p.seatNumber.trim().toUpperCase() : null,
            berthNumber: p.berthNumber ? p.berthNumber.trim().toUpperCase() : null,
          })),
        });

        await tx.payment.create({
          data: {
            bookingId: booking.id,
            paymentReference: `PAY-${bookingReference}`,
            amount: finalTotalAmount,
            method: "UPI",
            status: "PENDING",
          },
        });

        return booking;
      }

      // ----------------------------------------------------
      // 3. FLIGHT BOOKING
      // ----------------------------------------------------
      if (type === "FLIGHT") {
        const sched = await tx.flightSchedule.findUnique({
          where: { id: targetScheduleId },
          include: { flight: true, sourceAirport: true, destinationAirport: true },
        });
        if (!sched) {
          const error = new Error("Flight schedule not found");
          error.statusCode = 404;
          throw error;
        }

        // Duplicate Seat Check
        const activeFlightBookings = await tx.flightBooking.findMany({
          where: {
            scheduleId: targetScheduleId,
            booking: { status: { not: "CANCELLED" } },
          },
          include: {
            booking: { include: { passengers: true } },
          },
        });

        const bookedSeats = new Set();
        activeFlightBookings.forEach((fb) => {
          fb.booking.passengers.forEach((p) => {
            if (p.seatNumber) bookedSeats.add(p.seatNumber.trim().toUpperCase());
          });
        });

        for (const p of passengers) {
          if (p.seatNumber) {
            const normReq = p.seatNumber.trim().toUpperCase();
            if (bookedSeats.has(normReq)) {
              const error = new Error(`Selected flight seat (${normReq}) is already booked`);
              error.statusCode = 409;
              error.errorCode = "SEAT_UNAVAILABLE";
              throw error;
            }
          }
        }

        // Addons Validation
        if (Array.isArray(addons) && addons.length > 0) {
          for (const addonId of addons) {
            const addObj = await tx.flightAddon.findUnique({ where: { id: addonId } });
            if (!addObj || addObj.flightId !== sched.flightId) {
              const error = new Error(`Addon '${addonId}' not found for this flight`);
              error.statusCode = 404;
              throw error;
            }
          }
        }

        const calculatedFare = sched.fare * passengers.length;
        const finalTotalAmount = (totalAmount && parseFloat(totalAmount) > 0) ? parseFloat(totalAmount) : calculatedFare;

        const booking = await tx.booking.create({
          data: {
            userId,
            bookingReference,
            bookingType: "FLIGHT",
            status: "PENDING",
            totalAmount: finalTotalAmount,
            travelDate: sched.departureDate,
          },
        });

        await tx.flightBooking.create({
          data: {
            bookingId: booking.id,
            scheduleId: targetScheduleId,
          },
        });

        await tx.bookingPassenger.createMany({
          data: passengers.map((p) => ({
            bookingId: booking.id,
            name: p.name.trim(),
            age: parseInt(p.age, 10) || 18,
            gender: p.gender ? p.gender.trim().toUpperCase() : "MALE",
            phone: p.phone ? p.phone.trim() : null,
            email: p.email ? p.email.trim() : null,
            seatNumber: p.seatNumber ? p.seatNumber.trim().toUpperCase() : null,
          })),
        });

        await tx.payment.create({
          data: {
            bookingId: booking.id,
            paymentReference: `PAY-${bookingReference}`,
            amount: finalTotalAmount,
            method: "UPI",
            status: "PENDING",
          },
        });

        return booking;
      }

      // ----------------------------------------------------
      // 4. HOTEL BOOKING
      // ----------------------------------------------------
      if (type === "HOTEL") {
        const hotel = await tx.hotel.findUnique({ where: { id: hotelId } });
        if (!hotel) {
          const error = new Error("Hotel not found");
          error.statusCode = 404;
          throw error;
        }

        const room = await tx.hotelRoom.findUnique({ where: { id: roomId } });
        if (!room || room.hotelId !== hotelId) {
          const error = new Error("Hotel room not found for selected hotel");
          error.statusCode = 404;
          throw error;
        }

        const inDateStr = (checkInDate || checkIn).trim();
        const outDateStr = (checkOutDate || checkOut).trim();
        const inDate = new Date(inDateStr);
        const outDate = new Date(outDateStr);

        const reqRooms = parseInt(numberOfRooms || rooms || 1, 10);
        const reqGuests = parseInt(numberOfGuests || guests || 1, 10);

        // Overbooking / Inventory Check
        const overlappingBookings = await tx.hotelBooking.findMany({
          where: {
            roomId,
            booking: { status: { not: "CANCELLED" } },
            AND: [
              { checkInDate: { lt: outDate } },
              { checkOutDate: { gt: inDate } },
            ],
          },
        });

        const bookedRoomCount = overlappingBookings.reduce((sum, hb) => sum + hb.numberOfRooms, 0);
        if (bookedRoomCount + reqRooms > room.availableRooms) {
          const error = new Error("Requested rooms are not available for the selected dates");
          error.statusCode = 409;
          error.errorCode = "ROOM_UNAVAILABLE";
          throw error;
        }

        const nightMs = 1000 * 60 * 60 * 24;
        const nights = Math.max(1, Math.ceil((outDate.getTime() - inDate.getTime()) / nightMs));
        const calculatedFare = room.pricePerNight * nights * reqRooms;
        const finalTotalAmount = (totalAmount && parseFloat(totalAmount) > 0) ? parseFloat(totalAmount) : calculatedFare;

        const booking = await tx.booking.create({
          data: {
            userId,
            bookingReference,
            bookingType: "HOTEL",
            status: "PENDING",
            totalAmount: finalTotalAmount,
            travelDate: inDate,
          },
        });

        await tx.hotelBooking.create({
          data: {
            bookingId: booking.id,
            hotelId,
            roomId,
            checkInDate: inDate,
            checkOutDate: outDate,
            numberOfRooms: reqRooms,
            numberOfGuests: reqGuests,
          },
        });

        if (Array.isArray(passengers) && passengers.length > 0) {
          await tx.bookingPassenger.createMany({
            data: passengers.map((p) => ({
              bookingId: booking.id,
              name: p.name.trim(),
              age: parseInt(p.age, 10) || 18,
              gender: p.gender ? p.gender.trim().toUpperCase() : "MALE",
              phone: p.phone ? p.phone.trim() : null,
              email: p.email ? p.email.trim() : null,
              roomNumber: room.roomNumber || "ROOM-1",
            })),
          });
        }

        await tx.payment.create({
          data: {
            bookingId: booking.id,
            paymentReference: `PAY-${bookingReference}`,
            amount: finalTotalAmount,
            method: "UPI",
            status: "PENDING",
          },
        });

        return booking;
      }
    });
  },

  getUserBookings: async (userId, query) => {
    const { bookingType, status, page = 1, limit = 10 } = query;
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const where = {};
    if (bookingType && bookingType.trim()) {
      where.bookingType = bookingType.trim().toUpperCase();
    }
    if (status && status.trim()) {
      where.status = status.trim().toUpperCase();
    }

    const [bookings, totalCount] = await Promise.all([
      bookingModel.findUserBookings({ userId, where, skip, take: limitNum }),
      bookingModel.countUserBookings({ userId, where }),
    ]);

    const totalPages = Math.ceil(totalCount / limitNum) || (totalCount > 0 ? 1 : 0);

    const formattedBookings = bookings.map((b) => ({
      id: b.id,
      bookingReference: b.bookingReference,
      bookingType: b.bookingType,
      status: b.status,
      totalAmount: b.totalAmount,
      travelDate: b.travelDate.toISOString().split("T")[0],
      createdAt: b.createdAt.toISOString(),
      passengerCount: b.passengers.length,
      paymentStatus: b.payments.length > 0 ? b.payments[0].status : "PENDING",
      details: b.busBooking
        ? { bus: b.busBooking.schedule?.bus?.name, route: `${b.busBooking.schedule?.route?.sourceCity} -> ${b.busBooking.schedule?.route?.destinationCity}` }
        : b.trainBooking
        ? { train: b.trainBooking.schedule?.train?.name, classCode: b.trainBooking.classCode }
        : b.flightBooking
        ? { flight: b.flightBooking.schedule?.flight?.flightNumber, airline: b.flightBooking.schedule?.flight?.airline?.name }
        : b.hotelBooking
        ? { hotel: b.hotelBooking.hotel?.name, roomType: b.hotelBooking.room?.roomType, checkIn: b.hotelBooking.checkInDate.toISOString().split("T")[0], checkOut: b.hotelBooking.checkOutDate.toISOString().split("T")[0] }
        : null,
    }));

    return {
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: totalCount,
        totalPages,
      },
      bookings: formattedBookings,
    };
  },

  getBookingById: async (id, userId) => {
    const booking = await bookingModel.findBookingByIdAndUser(id, userId);
    if (!booking) {
      const error = new Error("Booking not found");
      error.statusCode = 404;
      throw error;
    }
    return { booking };
  },

  getBookingByReference: async (reference, userId) => {
    const booking = await bookingModel.findBookingByReferenceAndUser(reference.trim(), userId);
    if (!booking) {
      const error = new Error("Booking not found");
      error.statusCode = 404;
      throw error;
    }
    return { booking };
  },
};

module.exports = bookingService;
