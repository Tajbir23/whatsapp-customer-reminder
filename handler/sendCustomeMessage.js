const setResponseToDatabase = require("./setResponseToDatabase")

const sendCustomMessage = async (client, customerNumber, message, admin = "") => {
    try {
        // Extract number without @c.us suffix for validation
        const numberOnly = customerNumber.replace('@c.us', '')

        // Check if number is registered on WhatsApp
        const isRegistered = await client.getNumberId(numberOnly)
        if (!isRegistered) {
            console.log(`⚠️ Number ${numberOnly} is not registered on WhatsApp`)
            return false
        }

        await client.sendMessage(customerNumber, message, { sendSeen: false })
        setResponseToDatabase(admin, `Message sent successfully to ${customerNumber}`)
        return true
    } catch (error) {
        console.error(`Failed to send message to ${customerNumber}:`, error.message)
        setResponseToDatabase(admin, `Failed to send message to ${customerNumber}: ${error.message}`)
        return false
    }
}

module.exports = sendCustomMessage
