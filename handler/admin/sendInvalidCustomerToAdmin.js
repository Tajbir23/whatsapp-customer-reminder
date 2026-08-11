const { resolveWhatsAppId } = require("../resolveWhatsAppId")

const sendInvalidCustomerToAdmin = async (client, customerNumber, message) => {
    try {
        // LID resolve করে নেওয়া, নইলে নতুন নম্বরে "Lid is missing in chat table" error আসে
        const { id, reason } = await resolveWhatsAppId(client, customerNumber)
        if (!id) {
            console.log(`⚠️ Admin number ${customerNumber}: ${reason}`)
            return false
        }

        await client.sendMessage(id, message, { sendSeen: false })
        console.log(`Message sent successfully to ${customerNumber}`)
        return true
    } catch (error) {
        console.error(`Failed to send message to ${customerNumber}:`, error.message)
        return false
    }
}

module.exports = sendInvalidCustomerToAdmin
