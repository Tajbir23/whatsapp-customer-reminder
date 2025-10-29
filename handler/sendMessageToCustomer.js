const sendMessageToCustomer = async(client, customerNumber, message) => {
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
        
        await client.sendMessage(customerNumber, message)
        console.log(`Message sent successfully to ${customerNumber}`)
        return true
    } catch (error) {
        console.error(`Failed to send message to ${customerNumber}:`, error.message)
        return false
    }
}

module.exports = { sendMessageToCustomer }