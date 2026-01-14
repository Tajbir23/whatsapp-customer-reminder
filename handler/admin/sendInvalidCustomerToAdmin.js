const sendInvalidCustomerToAdmin = async (client, customerNumber, message) => {
    try {
        // Extract number without @c.us suffix for validation
        const numberOnly = customerNumber.replace('@c.us', '')

        // Check if number is registered on WhatsApp
        const isRegistered = await client.getNumberId(numberOnly)
        if (!isRegistered) {
            console.log(`⚠️ Admin number ${numberOnly} is not registered on WhatsApp`)
            return false
        }

        await client.sendMessage(customerNumber, message, { sendSeen: false })
        console.log(`Message sent successfully to ${customerNumber}`)
        return true
    } catch (error) {
        console.error(`Failed to send message to ${customerNumber}:`, error.message)
        return false
    }
}

module.exports = sendInvalidCustomerToAdmin
