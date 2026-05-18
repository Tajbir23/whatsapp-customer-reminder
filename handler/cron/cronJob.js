const cron = require("node-cron");
const { processSubscriptionReminders } = require("./processSubscriptionReminders");

// Setup cron job for a session
const setupCronJob = (session, clients, admin) => {
  // Cron schedule: '0 1 * * *' means every day at 1:00 AM
  // Timezone: Asia/Dhaka (UTC+6)
  cron.schedule(
    "0 0 * * *",
    () => processSubscriptionReminders(session, clients, admin),
    {
      scheduled: true,
      timezone: "Asia/Dhaka",
    }
  );

  console.log(
    `✅ Cron job scheduled for session: ${session} (Every day at 12:00 AM Dhaka Time)`
  );
};

module.exports = { setupCronJob };
