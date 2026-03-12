const { cilents } = require("../..")
const { reorganizeNumber } = require("../reorganizeNumber")
const sendCustomMessage = require("../sendCustomeMessage")
const setResponseToDatabase = require("../setResponseToDatabase")

// Random delay function to avoid spam (min-max seconds)
const randomDelay = (minSeconds = 3, maxSeconds = 8) => {
    const delayMs = Math.floor(Math.random() * (maxSeconds - minSeconds + 1) + minSeconds) * 1000
    return new Promise(resolve => setTimeout(resolve, delayMs))
}

const sendCustomMessageToSelectedUser = async (admin, phones, message) => {

    console.log("admin", admin)
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

    for (const phone of phones) {
        const number = await reorganizeNumber(phone)
        if (!number) {
            setResponseToDatabase(admin, "Invalid number")
            continue
        }
        await sendCustomMessage(currentClient, number, message, admin)

        // Random wait after each message to avoid spam detection
        await randomDelay(50, 100)
    }
}

module.exports = sendCustomMessageToSelectedUser