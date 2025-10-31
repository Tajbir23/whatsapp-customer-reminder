const { cilents } = require("../..")
const { customerModel } = require("../../model/customerSchema")
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
            
            // randomly 1-3 মিনিট + random milliseconds delay
            const randomMinutes = Math.floor(Math.random() * 3) + 1 // 1 থেকে 3
            const randomSeconds = Math.floor(Math.random() * 60) // 0 থেকে 59 seconds
            const randomMilliseconds = Math.floor(Math.random() * 1000) // 0 থেকে 999 ms
            const delayMs = (randomMinutes * 60000) + (randomSeconds * 1000) + randomMilliseconds
            
            const totalSeconds = Math.floor(delayMs / 1000)
            console.log(`⏳ Waiting ${randomMinutes}m ${randomSeconds}s ${randomMilliseconds}ms (${totalSeconds}s total) before next message...`)
            await new Promise(resolve => setTimeout(resolve, delayMs))
        }
        
        console.log(`✅ Reminder completed for ${oldCustomers.length} old customers`)
    } catch (error) {
        console.log(error)
    }
}

module.exports = remindOldCustomers