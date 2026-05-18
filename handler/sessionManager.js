const { Client, LocalAuth } = require("whatsapp-web.js");
const whatsappConfig = require("../config/whatsappConfig");
const { setupWhatsappEvents } = require("./whatsappEvents");

// Initialize a single WhatsApp session
const initializeSession = async (session, clients, admin) => {
  const client = new Client({
    authStrategy: new LocalAuth({ clientId: session }),
    puppeteer: whatsappConfig.puppeteer,
    webVersionCache: whatsappConfig.webVersionCache,
    restartOnAuthFail: true,
  });

  // Setup all event handlers
  setupWhatsappEvents(client, session, clients, admin);

  // Initialize the client
  client.initialize();
  clients[session] = client;
};

module.exports = { initializeSession };
