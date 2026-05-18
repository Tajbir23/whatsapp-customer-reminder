const cron = require("node-cron");
const { processSubscriptionReminders } = require("./processSubscriptionReminders");

// Setup cron job for a session
const setupCronJob = (session, clients, admin) => {
  // Cron schedule: '0 1 * * *' means every day at 1:00 AM
  // Timezone: Asia/Dhaka (UTC+6)
  cron.schedule(
    "0 0 * * *",
    async () => {
      try {
        // একাধিক ফাংশন প্যারালালি (একসাথে) রান করার জন্য Promise.all ব্যবহার করা হয়েছে
        await Promise.all([
          processSubscriptionReminders(session, clients, admin),
          // আপনার নতুন ফাংশনগুলো এখানে কমা দিয়ে যুক্ত করুন, উদাহরণস্বরূপ:
          // newAwesomeFunction(session, clients, admin),
        ]);
        console.log(`✅ All cron tasks completed for session: ${session}`);
      } catch (error) {
        console.error(`❌ Error in cron tasks for session ${session}:`, error);
      }
    },
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
