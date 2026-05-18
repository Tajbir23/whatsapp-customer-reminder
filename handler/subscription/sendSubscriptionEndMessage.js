const { clients } = require("../..")
const { whatsapp } = require("../../libs/clasess")
const saveLogsToDatabase = require("../../libs/saveLogsToDatabase")
const subscriptionEndMessage = require("../message/subscriptionEndMessage")
const { sendMessageToCustomer } = require("../sendMessageToCustomer")


const sendSubscriptionEndMessage = async (adminId, customerNumber, email, plan) => {
    const message = await subscriptionEndMessage(email, plan)

    const client = clients[adminId]
    if(!client){
        console.log(`Client ${adminId} is not available. Skipping message.`)
        return
    }
    await sendMessageToCustomer(client, customerNumber, message)
    await saveLogsToDatabase(whatsapp, `Message sent successfully to ${customerNumber}`)
}

module.exports = sendSubscriptionEndMessage