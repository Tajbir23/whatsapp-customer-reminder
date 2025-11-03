const sendCustomMessage = async(client, customerNumber, message) => {
    await client.sendMessage(customerNumber, message)
    console.log(`Message sent successfully to ${customerNumber}`)
    return true
}

module.exports = sendCustomMessage