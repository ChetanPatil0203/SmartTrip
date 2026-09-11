const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const routes = require("./routes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

// Global Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check API
app.get("/health", async (req, res) => {
  res.status(200).json({
    success: true,
    message: "SmartTrip API is running",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api", routes);

// Global Error Handler Middleware
app.use(errorHandler);

module.exports = app;
