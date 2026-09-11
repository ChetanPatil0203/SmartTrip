const app = require("./app");
const config = require("./config/env");
const { connectDB } = require("./config/db");
const logger = require("./utils/logger");

const startServer = async () => {
  try {
    // Connect to PostgreSQL database
    await connectDB();

    app.listen(config.port, () => {
      logger.info(`Server running in ${config.nodeEnv} mode on port ${config.port}`);
    });
  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
