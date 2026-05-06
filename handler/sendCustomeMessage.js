const setResponseToDatabase = require("./setResponseToDatabase")

const sendCustomMessage = async (client, customerNumber, message, admin = "") => {
    try {
        const numberOnly = customerNumber.replace('@c.us', '')

        const isRegistered = await client.getNumberId(numberOnly)
        if (!isRegistered) {
            console.log(`⚠️ Number ${numberOnly} is not registered on WhatsApp`)
            return { success: false, reason: 'Not registered on WhatsApp' }
        }

        await client.sendMessage(customerNumber, message, { sendSeen: false })
        setResponseToDatabase(admin, `Message sent successfully to ${customerNumber}`)
        return { success: true }
    } catch (error) {
        console.error(`Failed to send message to ${customerNumber}:`, error.message)
        setResponseToDatabase(admin, `Failed to send message to ${customerNumber}: ${error.message}`)
        return { success: false, reason: error.message || 'Send failed' }
    }
}

module.exports = sendCustomMessage
