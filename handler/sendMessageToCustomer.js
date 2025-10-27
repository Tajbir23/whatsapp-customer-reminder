const sendMessageToCustomer = async(client, customerNumber, message) => {
    try {
        await client.sendMessage(customerNumber, message)
    } catch (error) {
        console.log(error)
    }
}

module.exports = { sendMessageToCustomer }