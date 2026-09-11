# Backend Service (Node.js + Express + MySQL + Prisma)

Clean, scalable Node.js Express backend using Prisma ORM with MySQL database.

## 📁 Directory Structure

```
backend/
├── src/
│   ├── config/          # Environment & Database setup (db.js, env.js)
│   ├── controllers/     # Controller layer (authController, userController)
│   ├── middlewares/     # Middleware layer (authMiddleware, errorHandler)
│   ├── models/          # Data Access Layer / Database queries
│   ├── routes/          # API Route endpoints (authRoutes, userRoutes)
│   ├── services/        # Business logic layer (userService)
│   ├── utils/           # Helper functions (logger, response)
│   ├── app.js           # Express app configuration & middleware
│   └── server.js        # Server listener and database initialization
├── prisma/              # Prisma ORM schema & migrations
│   └── schema.prisma
├── .env                 # Environment variables configuration (ignored in git)
├── .env.example         # Template environment variables
└── package.json         # Node.js dependencies & scripts
```

## 🚀 Setup & Verification Instructions

1. **Install Dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Create MySQL Database**:
   Create a MySQL database named `smarttrip_db` in your local or remote MySQL server:
   ```sql
   CREATE DATABASE smarttrip_db;
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env` and set your MySQL credentials:
   ```env
   PORT=5000
   NODE_ENV=development
   DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/smarttrip_db"
   JWT_SECRET="your_jwt_secret_key_here"
   JWT_EXPIRES_IN=7d
   ```

4. **Run Prisma Client Generator**:
   ```bash
   npx prisma generate
   ```

5. **Start Development Server**:
   ```bash
   npm run dev
   ```

6. **Test Health Check & MySQL Status**:
   Visit `http://localhost:5000/api/health` in your browser or run:
   ```bash
   curl http://localhost:5000/api/health
   ```

   **Expected Output**:
   ```json
   {
     "success": true,
     "message": "SmartTrip API is running",
     "database": "connected"
   }
   ```
