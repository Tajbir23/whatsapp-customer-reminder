const { cilents } = require("..")
const sendInvalidCustomerToAdmin = require("./admin/sendInvalidCustomerToAdmin")
const requestReviewMessage = require("./message/requestReviewMessage")
const randomTImeGenerate = require("./randomTimeGenerate")
const { reorganizeNumber } = require("./reorganizeNumber")
const getCustomers = require("./selectedCustomers/getCustomers")
const sendCustomMessage = require("./sendCustomeMessage")

const messageForReview = async(adminId) => {
    console.log('messageForReview', adminId)
    try {

        console.log("cilents", cilents)
        const currentClient = cilents[adminId]

        const state = await currentClient.getState()

        console.log("check state connected or not")
        if (state !== 'CONNECTED') {
            console.log(`Client ${adminId} is not connected (${state}). Skipping message.`)
            return
        }
        console.log("check client available or not")
        if (!currentClient) {
            console.log(`Client ${adminId} is not available. Skipping message.`)
            return
        }

        console.log("get message")
        const message = await requestReviewMessage()

        console.log("get customers")
        const customers = await getCustomers(adminId)

        console.log(`📋 Starting to send messages to ${customers.length} customers`)
        
        for (const customer of customers) {
            // Check if customer has valid waOrFbId
            if (!customer.waOrFbId) {
                console.log(`⚠️ Skipping ${customer.email} - No WhatsApp number`)
                continue
            }
            
            console.log(`📞 Processing customer: ${customer.email}`)
            const number = await reorganizeNumber(customer.waOrFbId)
            
            if (!number) {
                console.log(`❌ Invalid number for ${customer.email}: ${customer.waOrFbId}`)
                await sendInvalidCustomerToAdmin(currentClient, '8801763123739@c.us', `Customer number ${customer.waOrFbId} is not valid. Email: ${customer.email}`)
                continue
            }
            
            await sendCustomMessage(currentClient, number, message)
            console.log(`✅ Message sent successfully to ${customer.email} (${number})`)
            
            const delayMs = await randomTImeGenerate()
            console.log(`⏳ Waiting ${Math.floor(delayMs/1000)}s before next message...`)
            await new Promise(resolve => setTimeout(resolve, delayMs))
        }
        
        console.log(`✅ Completed sending messages to all customers`)
    } catch (error) {
        console.log(error.message)
        
    }
}

module.exports = messageForReview