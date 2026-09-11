# SmartTrip 🚌🚆✈️🏨

A full-stack travel booking app built with **React Native (Expo)** frontend and **Express + Prisma + MySQL** backend.

## 📱 Features

- **Bus Booking** — Search, seat selection, boarding/dropping points
- **Train Booking** — Search, class selection, passenger details
- **Flight Booking** — Search, seat selection, add-ons
- **Hotel Booking** — Search, room selection, guest details
- **Universal Booking** — Single booking flow for all travel types
- **Payment Integration** — Razorpay payment gateway
- **Cancellation & Refund** — Smart refund policy based on travel time
- **Live Tracking** — Bus/train live location tracking
- **My Trips** — Booking history and ticket management
- **Authentication** — JWT-based auth with register/login

## 🗂️ Project Structure

```
SmartTrip/
├── frontend/          # React Native (Expo) App
│   ├── screens/       # 49 screens
│   ├── components/    # Reusable components
│   ├── constants/     # Booking constants
│   └── assets/        # Images
├── backend/           # Express.js REST API
│   ├── src/
│   │   ├── controllers/   # Request handlers
│   │   ├── services/      # Business logic
│   │   ├── models/        # Prisma DB models
│   │   ├── routes/        # API routes
│   │   ├── middlewares/   # Auth, error handling
│   │   ├── validators/    # Input validation
│   │   └── utils/         # Helpers
│   └── prisma/
│       └── schema.prisma  # 42 DB models
├── App.js             # React Native entry point
└── package.json
```

## 🚀 Getting Started

### Backend Setup

```bash
cd backend
npm install

# Copy env file and fill in your values
cp .env.example .env

# Run database migration
npx prisma migrate dev

# Start backend server
npm run dev
```

### Frontend Setup

```bash
# From project root
npm install

# Start Expo dev server
npx expo start
```

## 🔌 API Endpoints

| Module | Base URL |
|--------|----------|
| Auth | `/api/auth` |
| Users | `/api/users` |
| Buses | `/api/buses` |
| Trains | `/api/trains` |
| Flights | `/api/flights` |
| Hotels | `/api/hotels` |
| Bookings | `/api/bookings` |
| Payments | `/api/payments` |
| Cancellations | `/api/cancellations` |

## 🛠️ Tech Stack

### Frontend
- React Native + Expo
- Lucide React Native (icons)
- Custom navigation (screen-state based)

### Backend
- Node.js + Express.js
- Prisma ORM
- MySQL database
- JWT authentication
- Razorpay payment gateway

## 📄 License

MIT
