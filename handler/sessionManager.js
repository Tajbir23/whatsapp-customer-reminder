const { Client, LocalAuth } = require('whatsapp-web.js')
const whatsappConfig = require('../config/whatsappConfig')
const { setupWhatsappEvents } = require('./whatsappEvents')

// Initialize a single WhatsApp session
const initializeSession = async (session, cilents, admin) => {
    const client = new Client({
        authStrategy: new LocalAuth({clientId: session}),
        puppeteer: whatsappConfig.puppeteer
    })

    // Setup all event handlers
    setupWhatsappEvents(client, session, cilents, admin)

    // Initialize the client
    client.initialize()
    cilents[session] = client
}

module.exports = { initializeSession }

