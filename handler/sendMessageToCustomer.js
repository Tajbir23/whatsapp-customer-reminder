const { whatsapp } = require("../libs/clasess")
const saveLogsToDatabase = require("../libs/saveLogsToDatabase")
const { resolveWhatsAppId } = require("./resolveWhatsAppId")

const sendMessageToCustomer = async (client, customerNumber, message) => {
    try {
        // Check if client exists and is connected
        if (!client) {
            throw new Error('Client is not available')
        }

        // Check client state before sending
        const state = await client.getState()
        if (state !== 'CONNECTED') {
            throw new Error(`Client is not connected. Current state: ${state}`)
        }

        // LID resolve করে নেওয়া, নইলে নতুন নম্বরে "Lid is missing in chat table" error আসে
        const { id, reason } = await resolveWhatsAppId(client, customerNumber)
        if (!id) {
            console.log(`⚠️ ${customerNumber}: ${reason}`)
            return false
        }

        await client.sendMessage(id, message, { sendSeen: false })
        console.log(`Message sent successfully to ${customerNumber}`)
        await saveLogsToDatabase(whatsapp, `Message sent successfully to ${customerNumber}`)
        return true
    } catch (error) {
        console.error(`Failed to send message to ${customerNumber}:`, error.message)
        await saveLogsToDatabase(whatsapp, `Failed to send message to ${customerNumber}: ${error.message}`)
        return false
    }
}

module.exports = { sendMessageToCustomer }
