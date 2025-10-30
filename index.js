require('dotenv').config()
const connectDatabase = require('./db/db')
const { setupErrorHandlers } = require('./handler/errorHandler')
const { initializeSession } = require('./handler/sessionManager')

// Setup Socket.IO client (this will automatically connect and listen)
require('./socket/socket_io')

// Setup global error handlers
setupErrorHandlers()

// Sessions to initialize
const sessions = ['6879125299b0bed604926bfd', '687911f899b0bed604926bfc']

// Store all WhatsApp clients
const cilents = {}

// Initialize all WhatsApp clients
const initializeClients = async () => {
    // First connect to database
    await connectDatabase()

    // Then initialize WhatsApp clients one by one
    for (const session of sessions) {
        await initializeSession(session, cilents)
        // Wait a bit between sessions to avoid overwhelming the system
        await new Promise(resolve => setTimeout(resolve, 5000))
    }
}

// setTimeout(async () => {
//     const currentClient = cilents['6879125299b0bed604926bfd']
//     try {
//         await currentClient.sendMessage('8801763123739@c.us', "hi")
//         console.log("message sent")
//     } catch (error) {
//         console.error('Failed to send message:', error)
//     }
// }, 10000);

// Start the application
initializeClients().catch(error => {
    console.error('Failed to initialize clients:', error)
    process.exit(1)
})

// Export clients for external use
module.exports = { cilents }
