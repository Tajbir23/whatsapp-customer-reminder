const { cilents } = require("../..")
const subscriptionEndMessage = require("../message/subscriptionEndMessage")
const { sendMessageToCustomer } = require("../sendMessageToCustomer")


const sendSubscriptionEndMessage = async (adminId, customerNumber, email) => {
    const message = await subscriptionEndMessage(email)

    const client = cilents[adminId]
    if(!client){
        console.log(`Client ${adminId} is not available. Skipping message.`)
        return
    }
    await sendMessageToCustomer(client, customerNumber, message)
}

module.exports = sendSubscriptionEndMessage