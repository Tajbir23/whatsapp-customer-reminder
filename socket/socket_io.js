const { io } = require('socket.io-client')
const baseUrl = require('../config/baseUrl')
const remindOldCustomers = require('../handler/selectedCustomers/remindOldCustomers')
const messageForReview = require('../handler/messageForReview')
const sendSubscriptionEndMessage = require('../handler/subscription/sendSubscriptionEndMessage')
const { reorganizeNumber } = require('../handler/reorganizeNumber')
const sendCustomMessageToSelectedUser = require('../handler/customMessage/sendCustomMessageToSelectedUser')
const setResponseToDatabase = require('../handler/setResponseToDatabase')
const sendAmessagWithEmail = require('../handler/customMessage/sendAmessageWithEmail')

// Create socket connection with better configuration
const socket = io(process.env.BASE_URL || baseUrl, {
    reconnection: true,
    reconnectionDelay: 2000,
    reconnectionDelayMax: 10000,
    reconnectionAttempts: Infinity,
    timeout: 20000,
    transports: ['websocket', 'polling']
})

// Connection events
socket.on('connect', () => {
    console.log('✅ Connected to Socket.IO server:', baseUrl)
})

socket.on('disconnect', () => {
    console.log('❌ Disconnected from Socket.IO server')
})



socket.on('remindOldCustomers', (adminId) => {
    remindOldCustomers(adminId)
})

socket.on('messageForReview', (adminId) => {
    console.log('messageForReview', adminId)
    if(!adminId ){
        console.log('Invalid payload')
        return
    }
    messageForReview(adminId)
})

socket.on('sendCustomMessage', async(payload) => {
    const {admin, phones, message} = payload
    await setResponseToDatabase(admin, `Sending custom message to ${phones.length} customers`)
    await sendCustomMessageToSelectedUser(admin, phones, message)
})

socket.on('subscriptionEndMessage', async(data) => {
    const {adminId, customerNumber, email, plan, isCustom} = data
    await setResponseToDatabase(adminId, `Sending subscription end message to ${customerNumber}`)
    console.log("sending subscription end message to", adminId, customerNumber, email)
    const number = await reorganizeNumber(customerNumber)
    await sendSubscriptionEndMessage(adminId, number, email, plan)
    if(isCustom){
        await sendAmessagWithEmail(adminId, customerNumber, email, "আপনার ChatGPT সাবস্ক্রিপশনটি রিনিউ না করার কারণ জানতে পারি?\n আমাদের থেকে সাবস্ক্রিপশন নিয়ে কোনোপ্রকার ইস্যু ফেইস করেছিলেন কি?")
    }
})

// Export socket for use in other modules
module.exports = socket