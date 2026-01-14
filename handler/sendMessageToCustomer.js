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

        // Extract number without @c.us suffix for validation
        const numberOnly = customerNumber.replace('@c.us', '')

        // Check if number is registered on WhatsApp
        const isRegistered = await client.getNumberId(numberOnly)
        if (!isRegistered) {
            console.log(`⚠️ Number ${numberOnly} is not registered on WhatsApp`)
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

module.exports = { sendMessageToCustomer }
