const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../../.env") });

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET || "default_secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  paymentProvider: process.env.PAYMENT_PROVIDER || "mock",
  paymentKeyId: process.env.PAYMENT_KEY_ID || "",
  paymentKeySecret: process.env.PAYMENT_KEY_SECRET || "",
  paymentWebhookSecret: process.env.PAYMENT_WEBHOOK_SECRET || "",
};
