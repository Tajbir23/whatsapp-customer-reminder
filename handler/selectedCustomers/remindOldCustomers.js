const { cilents } = require("../..")
const { customerModel } = require("../../model/customerSchema")
const randomTImeGenerate = require("../randomTimeGenerate")
const { reorganizeNumber } = require("../reorganizeNumber")
const { sendMessageToCustomer } = require("../sendMessageToCustomer")
const remindOldCustomerMessage = require("./remindOldCustomerMessage")

const remindOldCustomers = async (adminId) => {
    try {
        const currentClient = cilents[adminId]
        const state = await currentClient.getState()
        if (state !== 'CONNECTED') {
            console.log(`Client ${adminId} is not connected (${state}). Skipping message.`)
            return
        }
        if (!currentClient) {
            console.log(`Client ${adminId} is not available. Skipping message.`)
            return
        }
        const oldCustomers = await customerModel.find({
            $or: [
                { user: adminId },
                { reference: adminId }
            ],
            subscriptionEnd: { $lt: new Date(Date.now()) },
            orderFrom: 'whatsapp'
        })

        console.log(`📋 Found ${oldCustomers.length} old customers to remind`)
        
        for (const customer of oldCustomers) {
            // Check if waOrFbId exists
            if (!customer.waOrFbId) {
                console.log(`⚠️ Skipping ${customer.customerName} - No WhatsApp number found`)
                continue
            }
            
            const number = await reorganizeNumber(customer.waOrFbId)
            const customerMessage = await remindOldCustomerMessage(customer.email)
            await sendMessageToCustomer(currentClient, number, customerMessage)
            console.log(`✅ Message sent successfully to ${customer.customerName} (${number})`)
            
            const delayMs = await randomTImeGenerate()
            await new Promise(resolve => setTimeout(resolve, delayMs))
        }
        
        console.log(`✅ Reminder completed for ${oldCustomers.length} old customers`)
    } catch (error) {
        console.log(error)
    }
}

module.exports = remindOldCustomers