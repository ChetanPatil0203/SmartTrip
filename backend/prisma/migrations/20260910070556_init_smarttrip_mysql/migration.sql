-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
    `profileImage` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    UNIQUE INDEX `users_phone_key`(`phone`),
    INDEX `users_email_idx`(`email`),
    INDEX `users_phone_idx`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `saved_passengers` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `age` INTEGER NOT NULL,
    `gender` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `saved_passengers_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bus_operators` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `logo` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `rating` DOUBLE NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `buses` (
    `id` VARCHAR(191) NOT NULL,
    `operatorId` VARCHAR(191) NOT NULL,
    `busNumber` VARCHAR(191) NOT NULL,
    `busType` VARCHAR(191) NOT NULL,
    `totalSeats` INTEGER NOT NULL,
    `amenities` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `buses_busNumber_key`(`busNumber`),
    INDEX `buses_operatorId_idx`(`operatorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bus_routes` (
    `id` VARCHAR(191) NOT NULL,
    `source` VARCHAR(191) NOT NULL,
    `destination` VARCHAR(191) NOT NULL,
    `distance` DOUBLE NOT NULL,
    `duration` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bus_stops` (
    `id` VARCHAR(191) NOT NULL,
    `routeId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NULL,
    `latitude` DOUBLE NULL,
    `longitude` DOUBLE NULL,
    `stopType` ENUM('BOARDING', 'DROPPING', 'BOTH') NOT NULL,

    INDEX `bus_stops_routeId_idx`(`routeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bus_schedules` (
    `id` VARCHAR(191) NOT NULL,
    `busId` VARCHAR(191) NOT NULL,
    `routeId` VARCHAR(191) NOT NULL,
    `travelDate` DATETIME(3) NOT NULL,
    `departureTime` VARCHAR(191) NOT NULL,
    `arrivalTime` VARCHAR(191) NOT NULL,
    `fare` DOUBLE NOT NULL,
    `status` ENUM('SCHEDULED', 'DELAYED', 'CANCELLED', 'COMPLETED') NOT NULL DEFAULT 'SCHEDULED',

    INDEX `bus_schedules_travelDate_idx`(`travelDate`),
    INDEX `bus_schedules_routeId_idx`(`routeId`),
    INDEX `bus_schedules_busId_idx`(`busId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bus_seats` (
    `id` VARCHAR(191) NOT NULL,
    `busId` VARCHAR(191) NOT NULL,
    `seatNumber` VARCHAR(191) NOT NULL,
    `seatType` ENUM('SEATER', 'SLEEPER') NOT NULL,
    `rowNumber` INTEGER NULL,
    `columnNumber` INTEGER NULL,

    INDEX `bus_seats_busId_idx`(`busId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `train_operators` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NULL,
    `logo` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `trains` (
    `id` VARCHAR(191) NOT NULL,
    `operatorId` VARCHAR(191) NOT NULL,
    `trainNumber` VARCHAR(191) NOT NULL,
    `trainName` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `trains_trainNumber_key`(`trainNumber`),
    INDEX `trains_operatorId_idx`(`operatorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `train_stations` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NULL,
    `latitude` DOUBLE NULL,
    `longitude` DOUBLE NULL,

    UNIQUE INDEX `train_stations_code_key`(`code`),
    INDEX `train_stations_code_idx`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `train_routes` (
    `id` VARCHAR(191) NOT NULL,
    `sourceStationId` VARCHAR(191) NOT NULL,
    `destinationStationId` VARCHAR(191) NOT NULL,
    `distance` DOUBLE NOT NULL,
    `duration` VARCHAR(191) NOT NULL,

    INDEX `train_routes_sourceStationId_idx`(`sourceStationId`),
    INDEX `train_routes_destinationStationId_idx`(`destinationStationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `train_schedules` (
    `id` VARCHAR(191) NOT NULL,
    `trainId` VARCHAR(191) NOT NULL,
    `routeId` VARCHAR(191) NOT NULL,
    `travelDate` DATETIME(3) NOT NULL,
    `departureTime` VARCHAR(191) NOT NULL,
    `arrivalTime` VARCHAR(191) NOT NULL,
    `status` ENUM('SCHEDULED', 'DELAYED', 'CANCELLED', 'COMPLETED') NOT NULL DEFAULT 'SCHEDULED',

    INDEX `train_schedules_travelDate_idx`(`travelDate`),
    INDEX `train_schedules_routeId_idx`(`routeId`),
    INDEX `train_schedules_trainId_idx`(`trainId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `train_classes` (
    `id` VARCHAR(191) NOT NULL,
    `trainId` VARCHAR(191) NOT NULL,
    `classCode` VARCHAR(191) NOT NULL,
    `className` VARCHAR(191) NOT NULL,
    `fare` DOUBLE NOT NULL,

    INDEX `train_classes_trainId_idx`(`trainId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `train_seats` (
    `id` VARCHAR(191) NOT NULL,
    `trainId` VARCHAR(191) NOT NULL,
    `coachNumber` VARCHAR(191) NOT NULL,
    `seatNumber` VARCHAR(191) NOT NULL,
    `berthType` ENUM('LOWER', 'MIDDLE', 'UPPER', 'SIDE_LOWER', 'SIDE_UPPER', 'SEAT') NOT NULL,
    `classCode` VARCHAR(191) NOT NULL,

    INDEX `train_seats_trainId_idx`(`trainId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `airlines` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `logo` VARCHAR(191) NULL,

    UNIQUE INDEX `airlines_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `airports` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL,
    `latitude` DOUBLE NULL,
    `longitude` DOUBLE NULL,

    UNIQUE INDEX `airports_code_key`(`code`),
    INDEX `airports_code_idx`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `flights` (
    `id` VARCHAR(191) NOT NULL,
    `airlineId` VARCHAR(191) NOT NULL,
    `flightNumber` VARCHAR(191) NOT NULL,
    `aircraft` VARCHAR(191) NULL,

    UNIQUE INDEX `flights_flightNumber_key`(`flightNumber`),
    INDEX `flights_airlineId_idx`(`airlineId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `flight_schedules` (
    `id` VARCHAR(191) NOT NULL,
    `flightId` VARCHAR(191) NOT NULL,
    `sourceAirportId` VARCHAR(191) NOT NULL,
    `destinationAirportId` VARCHAR(191) NOT NULL,
    `departureDate` DATETIME(3) NOT NULL,
    `departureTime` VARCHAR(191) NOT NULL,
    `arrivalTime` VARCHAR(191) NOT NULL,
    `duration` VARCHAR(191) NOT NULL,
    `fare` DOUBLE NOT NULL,
    `status` ENUM('SCHEDULED', 'DELAYED', 'CANCELLED', 'COMPLETED') NOT NULL DEFAULT 'SCHEDULED',

    INDEX `flight_schedules_departureDate_idx`(`departureDate`),
    INDEX `flight_schedules_sourceAirportId_idx`(`sourceAirportId`),
    INDEX `flight_schedules_destinationAirportId_idx`(`destinationAirportId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `flight_seats` (
    `id` VARCHAR(191) NOT NULL,
    `flightId` VARCHAR(191) NOT NULL,
    `seatNumber` VARCHAR(191) NOT NULL,
    `seatClass` ENUM('ECONOMY', 'PREMIUM_ECONOMY', 'BUSINESS', 'FIRST') NOT NULL DEFAULT 'ECONOMY',
    `isAvailable` BOOLEAN NOT NULL DEFAULT true,

    INDEX `flight_seats_flightId_idx`(`flightId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `flight_addons` (
    `id` VARCHAR(191) NOT NULL,
    `flightId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `price` DOUBLE NOT NULL,

    INDEX `flight_addons_flightId_idx`(`flightId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hotels` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `address` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NULL,
    `country` VARCHAR(191) NOT NULL,
    `latitude` DOUBLE NULL,
    `longitude` DOUBLE NULL,
    `rating` DOUBLE NULL DEFAULT 0,
    `phone` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `checkInTime` VARCHAR(191) NULL,
    `checkOutTime` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `hotels_city_idx`(`city`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hotel_rooms` (
    `id` VARCHAR(191) NOT NULL,
    `hotelId` VARCHAR(191) NOT NULL,
    `roomNumber` VARCHAR(191) NULL,
    `roomType` ENUM('SINGLE', 'DOUBLE', 'DELUXE', 'SUITE') NOT NULL DEFAULT 'DELUXE',
    `capacity` INTEGER NOT NULL,
    `pricePerNight` DOUBLE NOT NULL,
    `totalRooms` INTEGER NOT NULL,
    `availableRooms` INTEGER NOT NULL,

    INDEX `hotel_rooms_hotelId_idx`(`hotelId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hotel_amenities` (
    `id` VARCHAR(191) NOT NULL,
    `hotelId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    INDEX `hotel_amenities_hotelId_idx`(`hotelId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hotel_images` (
    `id` VARCHAR(191) NOT NULL,
    `hotelId` VARCHAR(191) NOT NULL,
    `imageUrl` VARCHAR(191) NOT NULL,

    INDEX `hotel_images_hotelId_idx`(`hotelId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hotel_availabilities` (
    `id` VARCHAR(191) NOT NULL,
    `hotelId` VARCHAR(191) NOT NULL,
    `roomId` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `availableRooms` INTEGER NOT NULL,
    `price` DOUBLE NOT NULL,

    INDEX `hotel_availabilities_date_idx`(`date`),
    INDEX `hotel_availabilities_hotelId_idx`(`hotelId`),
    INDEX `hotel_availabilities_roomId_idx`(`roomId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bookings` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `bookingReference` VARCHAR(191) NOT NULL,
    `bookingType` ENUM('BUS', 'TRAIN', 'FLIGHT', 'HOTEL') NOT NULL,
    `status` ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
    `totalAmount` DOUBLE NOT NULL,
    `bookingDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `travelDate` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `bookings_bookingReference_key`(`bookingReference`),
    INDEX `bookings_bookingReference_idx`(`bookingReference`),
    INDEX `bookings_userId_idx`(`userId`),
    INDEX `bookings_travelDate_idx`(`travelDate`),
    INDEX `bookings_bookingType_idx`(`bookingType`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `booking_passengers` (
    `id` VARCHAR(191) NOT NULL,
    `bookingId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `age` INTEGER NOT NULL,
    `gender` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `seatNumber` VARCHAR(191) NULL,
    `berthNumber` VARCHAR(191) NULL,
    `roomNumber` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `booking_passengers_bookingId_idx`(`bookingId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bus_bookings` (
    `id` VARCHAR(191) NOT NULL,
    `bookingId` VARCHAR(191) NOT NULL,
    `scheduleId` VARCHAR(191) NOT NULL,
    `boardingStopId` VARCHAR(191) NULL,
    `droppingStopId` VARCHAR(191) NULL,

    UNIQUE INDEX `bus_bookings_bookingId_key`(`bookingId`),
    INDEX `bus_bookings_scheduleId_idx`(`scheduleId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `train_bookings` (
    `id` VARCHAR(191) NOT NULL,
    `bookingId` VARCHAR(191) NOT NULL,
    `scheduleId` VARCHAR(191) NOT NULL,
    `classCode` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `train_bookings_bookingId_key`(`bookingId`),
    INDEX `train_bookings_scheduleId_idx`(`scheduleId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `flight_bookings` (
    `id` VARCHAR(191) NOT NULL,
    `bookingId` VARCHAR(191) NOT NULL,
    `scheduleId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `flight_bookings_bookingId_key`(`bookingId`),
    INDEX `flight_bookings_scheduleId_idx`(`scheduleId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hotel_bookings` (
    `id` VARCHAR(191) NOT NULL,
    `bookingId` VARCHAR(191) NOT NULL,
    `hotelId` VARCHAR(191) NOT NULL,
    `roomId` VARCHAR(191) NOT NULL,
    `checkInDate` DATETIME(3) NOT NULL,
    `checkOutDate` DATETIME(3) NOT NULL,
    `numberOfRooms` INTEGER NOT NULL,
    `numberOfGuests` INTEGER NOT NULL,

    UNIQUE INDEX `hotel_bookings_bookingId_key`(`bookingId`),
    INDEX `hotel_bookings_hotelId_idx`(`hotelId`),
    INDEX `hotel_bookings_roomId_idx`(`roomId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payments` (
    `id` VARCHAR(191) NOT NULL,
    `bookingId` VARCHAR(191) NOT NULL,
    `paymentReference` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `method` ENUM('UPI', 'CARD', 'NET_BANKING', 'WALLET', 'CASH') NOT NULL,
    `status` ENUM('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
    `paidAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `payments_paymentReference_key`(`paymentReference`),
    INDEX `payments_bookingId_idx`(`bookingId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cancellations` (
    `id` VARCHAR(191) NOT NULL,
    `bookingId` VARCHAR(191) NOT NULL,
    `reason` VARCHAR(191) NULL,
    `cancelledAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `cancellationFee` DOUBLE NOT NULL,
    `refundAmount` DOUBLE NOT NULL,
    `status` ENUM('REQUESTED', 'PROCESSED', 'REJECTED') NOT NULL DEFAULT 'REQUESTED',

    INDEX `cancellations_bookingId_idx`(`bookingId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `refunds` (
    `id` VARCHAR(191) NOT NULL,
    `bookingId` VARCHAR(191) NOT NULL,
    `paymentId` VARCHAR(191) NULL,
    `amount` DOUBLE NOT NULL,
    `status` ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED') NOT NULL DEFAULT 'PENDING',
    `refundReference` VARCHAR(191) NULL,
    `processedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `refunds_refundReference_key`(`refundReference`),
    INDEX `refunds_bookingId_idx`(`bookingId`),
    INDEX `refunds_paymentId_idx`(`paymentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `offers` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `code` VARCHAR(191) NULL,
    `discountType` ENUM('PERCENTAGE', 'FLAT') NOT NULL,
    `discountValue` DOUBLE NOT NULL,
    `maxDiscount` DOUBLE NULL,
    `minBookingAmount` DOUBLE NULL,
    `validFrom` DATETIME(3) NOT NULL,
    `validUntil` DATETIME(3) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `coupons` (
    `id` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `discountType` ENUM('PERCENTAGE', 'FLAT') NOT NULL,
    `discountValue` DOUBLE NOT NULL,
    `maxDiscount` DOUBLE NULL,
    `minBookingAmount` DOUBLE NULL,
    `usageLimit` INTEGER NULL,
    `usedCount` INTEGER NOT NULL DEFAULT 0,
    `validFrom` DATETIME(3) NOT NULL,
    `validUntil` DATETIME(3) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `coupons_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notifications` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `type` ENUM('BOOKING', 'PAYMENT', 'DELAY', 'CANCELLATION', 'REFUND', 'OFFER', 'GENERAL') NOT NULL DEFAULT 'GENERAL',
    `isRead` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `notifications_userId_idx`(`userId`),
    INDEX `notifications_isRead_idx`(`isRead`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bus_trackings` (
    `id` VARCHAR(191) NOT NULL,
    `scheduleId` VARCHAR(191) NOT NULL,
    `latitude` DOUBLE NOT NULL,
    `longitude` DOUBLE NOT NULL,
    `speed` DOUBLE NULL,
    `currentLocation` VARCHAR(191) NULL,
    `estimatedArrival` VARCHAR(191) NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `bus_trackings_scheduleId_idx`(`scheduleId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `delay_alerts` (
    `id` VARCHAR(191) NOT NULL,
    `scheduleId` VARCHAR(191) NOT NULL,
    `delayMinutes` INTEGER NOT NULL,
    `message` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `delay_alerts_scheduleId_idx`(`scheduleId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `trip_shares` (
    `id` VARCHAR(191) NOT NULL,
    `bookingId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `shareToken` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `trip_shares_shareToken_key`(`shareToken`),
    INDEX `trip_shares_bookingId_idx`(`bookingId`),
    INDEX `trip_shares_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reviews` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `bookingId` VARCHAR(191) NULL,
    `rating` INTEGER NOT NULL,
    `title` VARCHAR(191) NULL,
    `comment` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `reviews_userId_idx`(`userId`),
    INDEX `reviews_bookingId_idx`(`bookingId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `support_tickets` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `bookingId` VARCHAR(191) NULL,
    `subject` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `status` ENUM('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED') NOT NULL DEFAULT 'OPEN',
    `priority` ENUM('LOW', 'MEDIUM', 'HIGH') NOT NULL DEFAULT 'MEDIUM',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `support_tickets_userId_idx`(`userId`),
    INDEX `support_tickets_bookingId_idx`(`bookingId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `safety_reports` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `bookingId` VARCHAR(191) NULL,
    `type` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `status` ENUM('OPEN', 'IN_REVIEW', 'RESOLVED', 'CLOSED') NOT NULL DEFAULT 'OPEN',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `safety_reports_userId_idx`(`userId`),
    INDEX `safety_reports_bookingId_idx`(`bookingId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `saved_passengers` ADD CONSTRAINT `saved_passengers_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `buses` ADD CONSTRAINT `buses_operatorId_fkey` FOREIGN KEY (`operatorId`) REFERENCES `bus_operators`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bus_stops` ADD CONSTRAINT `bus_stops_routeId_fkey` FOREIGN KEY (`routeId`) REFERENCES `bus_routes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bus_schedules` ADD CONSTRAINT `bus_schedules_busId_fkey` FOREIGN KEY (`busId`) REFERENCES `buses`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bus_schedules` ADD CONSTRAINT `bus_schedules_routeId_fkey` FOREIGN KEY (`routeId`) REFERENCES `bus_routes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bus_seats` ADD CONSTRAINT `bus_seats_busId_fkey` FOREIGN KEY (`busId`) REFERENCES `buses`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `trains` ADD CONSTRAINT `trains_operatorId_fkey` FOREIGN KEY (`operatorId`) REFERENCES `train_operators`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `train_routes` ADD CONSTRAINT `train_routes_sourceStationId_fkey` FOREIGN KEY (`sourceStationId`) REFERENCES `train_stations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `train_routes` ADD CONSTRAINT `train_routes_destinationStationId_fkey` FOREIGN KEY (`destinationStationId`) REFERENCES `train_stations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `train_schedules` ADD CONSTRAINT `train_schedules_trainId_fkey` FOREIGN KEY (`trainId`) REFERENCES `trains`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `train_schedules` ADD CONSTRAINT `train_schedules_routeId_fkey` FOREIGN KEY (`routeId`) REFERENCES `train_routes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `train_classes` ADD CONSTRAINT `train_classes_trainId_fkey` FOREIGN KEY (`trainId`) REFERENCES `trains`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `train_seats` ADD CONSTRAINT `train_seats_trainId_fkey` FOREIGN KEY (`trainId`) REFERENCES `trains`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `flights` ADD CONSTRAINT `flights_airlineId_fkey` FOREIGN KEY (`airlineId`) REFERENCES `airlines`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `flight_schedules` ADD CONSTRAINT `flight_schedules_flightId_fkey` FOREIGN KEY (`flightId`) REFERENCES `flights`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `flight_schedules` ADD CONSTRAINT `flight_schedules_sourceAirportId_fkey` FOREIGN KEY (`sourceAirportId`) REFERENCES `airports`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `flight_schedules` ADD CONSTRAINT `flight_schedules_destinationAirportId_fkey` FOREIGN KEY (`destinationAirportId`) REFERENCES `airports`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `flight_seats` ADD CONSTRAINT `flight_seats_flightId_fkey` FOREIGN KEY (`flightId`) REFERENCES `flights`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `flight_addons` ADD CONSTRAINT `flight_addons_flightId_fkey` FOREIGN KEY (`flightId`) REFERENCES `flights`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hotel_rooms` ADD CONSTRAINT `hotel_rooms_hotelId_fkey` FOREIGN KEY (`hotelId`) REFERENCES `hotels`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hotel_amenities` ADD CONSTRAINT `hotel_amenities_hotelId_fkey` FOREIGN KEY (`hotelId`) REFERENCES `hotels`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hotel_images` ADD CONSTRAINT `hotel_images_hotelId_fkey` FOREIGN KEY (`hotelId`) REFERENCES `hotels`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hotel_availabilities` ADD CONSTRAINT `hotel_availabilities_hotelId_fkey` FOREIGN KEY (`hotelId`) REFERENCES `hotels`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hotel_availabilities` ADD CONSTRAINT `hotel_availabilities_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `hotel_rooms`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bookings` ADD CONSTRAINT `bookings_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `booking_passengers` ADD CONSTRAINT `booking_passengers_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `bookings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bus_bookings` ADD CONSTRAINT `bus_bookings_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `bookings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bus_bookings` ADD CONSTRAINT `bus_bookings_scheduleId_fkey` FOREIGN KEY (`scheduleId`) REFERENCES `bus_schedules`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bus_bookings` ADD CONSTRAINT `bus_bookings_boardingStopId_fkey` FOREIGN KEY (`boardingStopId`) REFERENCES `bus_stops`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bus_bookings` ADD CONSTRAINT `bus_bookings_droppingStopId_fkey` FOREIGN KEY (`droppingStopId`) REFERENCES `bus_stops`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `train_bookings` ADD CONSTRAINT `train_bookings_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `bookings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `train_bookings` ADD CONSTRAINT `train_bookings_scheduleId_fkey` FOREIGN KEY (`scheduleId`) REFERENCES `train_schedules`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `flight_bookings` ADD CONSTRAINT `flight_bookings_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `bookings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `flight_bookings` ADD CONSTRAINT `flight_bookings_scheduleId_fkey` FOREIGN KEY (`scheduleId`) REFERENCES `flight_schedules`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hotel_bookings` ADD CONSTRAINT `hotel_bookings_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `bookings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hotel_bookings` ADD CONSTRAINT `hotel_bookings_hotelId_fkey` FOREIGN KEY (`hotelId`) REFERENCES `hotels`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hotel_bookings` ADD CONSTRAINT `hotel_bookings_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `hotel_rooms`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payments` ADD CONSTRAINT `payments_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `bookings`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cancellations` ADD CONSTRAINT `cancellations_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `bookings`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `refunds` ADD CONSTRAINT `refunds_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `bookings`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `refunds` ADD CONSTRAINT `refunds_paymentId_fkey` FOREIGN KEY (`paymentId`) REFERENCES `payments`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bus_trackings` ADD CONSTRAINT `bus_trackings_scheduleId_fkey` FOREIGN KEY (`scheduleId`) REFERENCES `bus_schedules`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `delay_alerts` ADD CONSTRAINT `delay_alerts_scheduleId_fkey` FOREIGN KEY (`scheduleId`) REFERENCES `bus_schedules`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `trip_shares` ADD CONSTRAINT `trip_shares_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `bookings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `trip_shares` ADD CONSTRAINT `trip_shares_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `bookings`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `support_tickets` ADD CONSTRAINT `support_tickets_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `support_tickets` ADD CONSTRAINT `support_tickets_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `bookings`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `safety_reports` ADD CONSTRAINT `safety_reports_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `safety_reports` ADD CONSTRAINT `safety_reports_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `bookings`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
