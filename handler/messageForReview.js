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

        console.log("for loop start")
        for (const customer of customers) {
            console.log("reorganize number")
            const number = await reorganizeNumber('Nothing')
            if(!number){
                console.log(`Customer number is not valid. Skipping message.`)
                await sendInvalidCustomerToAdmin(currentClient, '8801763123739@c.us', `Customer number ${customer.waOrFbId} is not valid. And his email is ${customer.email}`)
                continue
            }
            await sendCustomMessage(currentClient, number, message)
            console.log(`Message sent successfully to ${number}`)
            const delayMs = await randomTImeGenerate()
            await new Promise(resolve => setTimeout(resolve, delayMs))
        }
    } catch (error) {
        console.log(error.message)
        
    }
}

module.exports = messageForReview