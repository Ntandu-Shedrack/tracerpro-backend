const cron = require("node-cron");
const cleanupExpiredCodes = require("../services/cleanupExpiredCodes.service");

// Run every 5 minutes
cron.schedule("*/5 * * * *", () => {
  console.log("Running cleanup for expired reset codes...");
  cleanupExpiredCodes();
});
