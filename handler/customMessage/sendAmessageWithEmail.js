const { cilents } = require("../..")
const { reorganizeNumber } = require("../reorganizeNumber")
const sendCustomMessage = require("../sendCustomeMessage")
const setResponseToDatabase = require("../setResponseToDatabase")

const sendAmessagWithEmail = async (admin, customerNumber, email, message) => {
    const currentClient = cilents[admin]
    const state = await currentClient.getState()
    if (state !== 'CONNECTED') {
        setResponseToDatabase(admin, "Client is not connected")
        return
    }

    if (!currentClient) {
        setResponseToDatabase(admin, "Client is not connected")
        return
    }

    const number = await reorganizeNumber(customerNumber)
    await sendCustomMessage(currentClient, number, message, admin)
}

module.exports = sendAmessagWithEmail
