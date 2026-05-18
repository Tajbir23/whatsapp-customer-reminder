const { clients } = require("../..")
const customMessageLogModel = require("../../model/customMessageLogSchema")
const { reorganizeNumber } = require("../reorganizeNumber")
const sendCustomMessage = require("../sendCustomeMessage")
const setResponseToDatabase = require("../setResponseToDatabase")

const randomDelay = (minSeconds = 3, maxSeconds = 8) => {
    const delayMs = Math.floor(Math.random() * (maxSeconds - minSeconds + 1) + minSeconds) * 1000
    return new Promise(resolve => setTimeout(resolve, delayMs))
}

const sendCustomMessageToSelectedUser = async (admin, phones, message) => {

    console.log("admin", admin)
    const currentClient = clients[admin]

    const successNumbers = []
    const failedNumbers = []

    const saveLog = async () => {
        try {
            await customMessageLogModel.create({
                admin,
                message,
                successNumbers,
                failedNumbers,
                totalCount: phones.length,
                successCount: successNumbers.length,
                failedCount: failedNumbers.length
            })
        } catch (err) {
            console.error('Failed to save custom message log:', err.message)
        }
    }

    if (!currentClient) {
        setResponseToDatabase(admin, "Client is not connected")
        phones.forEach(phone => failedNumbers.push({ number: phone, reason: 'Client is not connected' }))
        await saveLog()
        return
    }

    let state
    try {
        state = await currentClient.getState()
    } catch (error) {
        await setResponseToDatabase(admin, "WhatsApp client is not ready yet. Please try again in a few seconds")
        phones.forEach(phone => failedNumbers.push({ number: phone, reason: 'WhatsApp client not ready' }))
        await saveLog()
        return
    }

    if (state !== 'CONNECTED') {
        await setResponseToDatabase(admin, `Client is not connected (state: ${state})`)
        phones.forEach(phone => failedNumbers.push({ number: phone, reason: `Client not connected (state: ${state})` }))
        await saveLog()
        return
    }

    for (const phone of phones) {
        const number = await reorganizeNumber(phone)
        if (!number) {
            setResponseToDatabase(admin, "Invalid number")
            failedNumbers.push({ number: phone, reason: 'Invalid number' })
            continue
        }
        const result = await sendCustomMessage(currentClient, number, message, admin)
        if (result && result.success) {
            successNumbers.push(phone)
        } else {
            failedNumbers.push({ number: phone, reason: (result && result.reason) || 'Send failed' })
        }

        await randomDelay(50, 100)
    }

    await saveLog()
}

module.exports = sendCustomMessageToSelectedUser
