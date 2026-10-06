const config = require("./config/env");
const http = require("http");
const app = require("./app");
const { connectDB } = require("./config/db");
const logger = require("./utils/logger");
const { initSocket } = require("./socket");

const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    const server = http.createServer(app);

    // Initialize Socket.io real-time engine
    initSocket(server);

    server.listen(config.port, () => {
      logger.info(`Server running in ${config.nodeEnv} mode on port ${config.port} (HTTP & Socket.IO enabled)`);
    });
  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();

