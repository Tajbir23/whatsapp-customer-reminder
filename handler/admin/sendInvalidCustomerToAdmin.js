const sendInvalidCustomerToAdmin = async(client, customerNumber, message) => {
    try {
        await client.sendMessage(customerNumber, message)
        console.log(`Message sent successfully to ${customerNumber}`)
        return true
    } catch (error) {
        console.error(`Failed to send message to ${customerNumber}:`, error.message)
        return false
    }
}

module.exports = sendInvalidCustomerToAdmin