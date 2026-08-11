const setResponseToDatabase = require("./setResponseToDatabase")
const { resolveWhatsAppId } = require("./resolveWhatsAppId")

const sendCustomMessage = async (client, customerNumber, message, admin = "") => {
    try {
        const { id, reason } = await resolveWhatsAppId(client, customerNumber)
        if (!id) {
            console.log(`⚠️ ${customerNumber}: ${reason}`)
            return { success: false, reason }
        }

        await client.sendMessage(id, message, { sendSeen: false })
        setResponseToDatabase(admin, `Message sent successfully to ${customerNumber}`)
        return { success: true }
    } catch (error) {
        console.error(`Failed to send message to ${customerNumber}:`, error.message)
        setResponseToDatabase(admin, `Failed to send message to ${customerNumber}: ${error.message}`)
        return { success: false, reason: error.message || 'Send failed' }
    }
}

module.exports = sendCustomMessage
