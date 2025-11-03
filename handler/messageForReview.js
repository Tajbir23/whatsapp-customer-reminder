const { cilents } = require("..")
const requestReviewMessage = require("./message/requestReviewMessage")
const randomTImeGenerate = require("./randomTimeGenerate")
const { reorganizeNumber } = require("./reorganizeNumber")
const getCustomers = require("./selectedCustomers/getCustomers")
const sendCustomMessage = require("./sendCustomeMessage")

const messageForReview = async(adminId, pageUrl) => {
    console.log('messageForReview', adminId, pageUrl)
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

        const message = await requestReviewMessage(pageUrl)

        const customers = await getCustomers(adminId)

        for (const customer of customers) {
            const number = await reorganizeNumber(customer.waOrFbId)
            if(!number){
                console.log(`Customer number is not valid. Skipping message.`)
                continue
            }
            await sendCustomMessage(currentClient, '8801763123739@c.us', message)
            console.log(`Message sent successfully to ${number}`)
            const delayMs = await randomTImeGenerate()
            await new Promise(resolve => setTimeout(resolve, delayMs))
        }
    } catch (error) {
        console.log(error)
    }
}

module.exports = messageForReview