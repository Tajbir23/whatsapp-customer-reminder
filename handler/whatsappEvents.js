const qrcode = require('qrcode-terminal')
const { userModel } = require('../model/userSchema')
const { reorganizeNumber } = require('./reorganizeNumber')
const { setupCronJob } = require('./cronJob')

// Setup all WhatsApp client events
const setupWhatsappEvents = (client, session, cilents, admin) => {
    
    // QR Code event
    client.on('qr', async(qr) => {
        try {
            console.log(`QR code generated for ${admin}`)
            qrcode.generate(qr, {small: true})
            await userModel.findByIdAndUpdate(session, {whatsappQr: qr, isWhatsappLoggedIn: false})
        } catch (error) {
            console.error(`Error handling QR for ${session}:`, error.message)
        }
    })
    
    // Ready event
    client.on('ready', async() => {
        console.log(`${session} client is ready`)
        
        // Update database first
        try {
            await userModel.findByIdAndUpdate(session, {isWhatsappLoggedIn: true, whatsappQr: null})
        } catch (error) {
            console.error(`Error updating database for ${session}:`, error.message)
        }
        
        // Wait a bit for client to fully initialize before sending messages
        await new Promise(resolve => setTimeout(resolve, 3000))
        
        // Send confirmation message
        try {
            const user = await userModel.findById(session)
            if (user && user.phone) {
                const phoneNumber = await reorganizeNumber(user.phone)
                const confirmMessage = 'Whatsapp login successful'
                await client.sendMessage(phoneNumber, confirmMessage)
                console.log(`Confirmation message sent to ${user.phone}`)
            }
        } catch (error) {
            console.error(`Error sending confirmation message for ${session}:`, error.message)
        }

        console.log("setup done whatsapp event")
        // Setup cron job
        setupCronJob(session, cilents, admin)
    })

    // Authenticated event
    client.on('authenticated', async() => {
        console.log(`${session} authenticated successfully`)
        try {
            await userModel.findByIdAndUpdate(session, {isWhatsappLoggedIn: true})
        } catch (error) {
            console.error(`Error updating auth status for ${session}:`, error.message)
        }
    })

    // Auth failure event
    client.on('auth_failure', async(msg) => {
        console.error(`${session} authentication failed:`, msg)
        try {
            await userModel.findByIdAndUpdate(session, {isWhatsappLoggedIn: false, whatsappQr: null})
        } catch (error) {
            console.error(`Error updating auth failure for ${session}:`, error.message)
        }
    })

    // Disconnected event
    client.on('disconnected', async(reason) => {
        console.log(`${session} disconnected:`, reason)
        
        // Immediately mark client as null to prevent any operations
        cilents[session] = null
        
        try {
            await userModel.findByIdAndUpdate(session, {isWhatsappLoggedIn: false, whatsappQr: null})
        } catch (error) {
            console.error(`Error handling disconnection for ${session}:`, error.message)
        }
        
        // If logged out manually, don't try to reconnect
        if (reason === 'LOGOUT') {
            console.log(`${session} was logged out manually. Not attempting to reconnect.`)
            return
        }
    })

    // Loading screen event
    client.on('loading_screen', (percent, message) => {
        console.log(`${session} loading:`, percent, message)
    })

    // Remote session saved event
    client.on('remote_session_saved', () => {
        console.log(`${session} remote session saved`)
    })
}

module.exports = { setupWhatsappEvents }

