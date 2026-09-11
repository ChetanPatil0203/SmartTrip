const { PrismaClient } = require("@prisma/client");
const logger = require("../utils/logger");

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});

const connectDB = async () => {
  try {
    await prisma.$connect();
    logger.info("Successfully connected to MySQL Database via Prisma");
  } catch (error) {
    logger.error(`Database Connection Failed: ${error.message}`);
    // Non-fatal during dev if MySQL service is offline, but log error
  }
};

module.exports = { prisma, connectDB };
