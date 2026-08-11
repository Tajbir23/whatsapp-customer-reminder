const { Client, LocalAuth } = require("whatsapp-web.js");
const whatsappConfig = require("../config/whatsappConfig");
const { setupWhatsappEvents } = require("./whatsappEvents");

// "Execution context was destroyed" জাতীয় error গুলো transient - whatsapp-web.js
// যখন WhatsApp Web পেজে স্ক্রিপ্ট inject করছে, ঠিক তখন পেজটা reload হলে এটা হয়।
// এ ক্ষেত্রে ব্রাউজার বন্ধ করে আবার চেষ্টা করলেই সাধারণত কাজ হয়।
const MAX_INIT_RETRIES = 3;
const RETRY_DELAY_MS = 10000;

// Initialize a single WhatsApp session
const initializeSession = async (session, clients, admin) => {
  for (let attempt = 1; attempt <= MAX_INIT_RETRIES; attempt++) {
    const client = new Client({
      authStrategy: new LocalAuth({ clientId: session }),
      puppeteer: whatsappConfig.puppeteer,
      webVersionCache: whatsappConfig.webVersionCache,
      restartOnAuthFail: true,
    });

    // Setup all event handlers
    setupWhatsappEvents(client, session, clients, admin);
    clients[session] = client;

    try {
      // await না করলে initialize() এর reject কেউ ধরে না -> Unhandled Rejection
      await client.initialize();
      console.log(`${session} client initialized`);
      return client;
    } catch (error) {
      const message = error && error.message ? error.message : String(error);
      console.error(
        `Init failed for ${session} (attempt ${attempt}/${MAX_INIT_RETRIES}): ${message}`
      );

      // ব্যর্থ ক্লায়েন্টের ব্রাউজারটা বন্ধ করা, নইলে orphan Chrome process জমতে থাকবে
      try {
        await client.destroy();
      } catch (destroyError) {
        console.error(
          `Failed to destroy client for ${session}: ${destroyError.message}`
        );
      }
      delete clients[session];

      if (attempt < MAX_INIT_RETRIES) {
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      }
    }
  }

  console.error(`❌ ${session}: initialize করা গেল না, সেশনটা skip করা হলো`);
  return null;
};

module.exports = { initializeSession };
