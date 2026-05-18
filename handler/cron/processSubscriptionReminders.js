const { extractNumbers } = require("../extractNumbers");
const { reorganizeNumber } = require("../reorganizeNumber");
const { sendMessageToCustomer } = require("../sendMessageToCustomer");
const subscriptionReminderEndMessage = require("../subscription/subscriptionReminderEndMessage");
const randomTImeGenerate = require("../randomTimeGenerate");
const sendInvalidCustomerToAdmin = require("../admin/sendInvalidCustomerToAdmin");
const { subscriptionEndCustomer } = require("../subscription/subscriptionEndCustomer");

const processSubscriptionReminders = async (session, clients, admin) => {
  const dhakaTime = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Dhaka",
  });
  console.log(
    `🕐 Cron job started at ${dhakaTime} (Dhaka Time) for admin: ${admin}`
  );

  try {
    const customers = await subscriptionEndCustomer(session);
    console.log(
      `📋 Found ${customers.length} customers with subscription ending in 2 days`
    );
    const customerNumbers = await extractNumbers(customers);

    for (const customerNumber of customerNumbers) {
      const currentClient = clients[session];

      // WhatsApp client connected আছে কিনা check
      if (!currentClient) {
        console.log(`⚠️ WhatsApp client is not connected for session: ${session}. Stopping cron job.`);
        break;
      }

      // check number valid or not
      if (!customerNumber.whatsapp) {
        console.log(`Customer number is not valid. Skipping message.`);
        continue;
      }

      try {
        const number = await reorganizeNumber(customerNumber.whatsapp);

        if (!number) {
          await sendInvalidCustomerToAdmin(
            currentClient,
            admin,
            `Customer number ${customerNumber.whatsapp} is not valid. And his email is ${customerNumber.email}`
          );
          continue;
        }
        
        const customerMessage = await subscriptionReminderEndMessage(
          customerNumber.email
        );
        await sendMessageToCustomer(currentClient, number, customerMessage);

        // randomly 1-3 মিনিট delay (60000ms = 1 minute)
        const delayMs = await randomTImeGenerate();
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      } catch (err) {
        console.error(`Error sending message for ${session}:`, err.message);
        continue;
      }
    }
  } catch (error) {
    console.error(`Cron job error for ${session}:`, error.message);
  }
};

module.exports = { processSubscriptionReminders };