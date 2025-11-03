const { io } = require('socket.io-client')
const baseUrl = require('../config/baseUrl')
const remindOldCustomers = require('../handler/selectedCustomers/remindOldCustomers')
const messageForReview = require('../handler/messageForReview')

// Create socket connection
const socket = io(baseUrl, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 10
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

// Export socket for use in other modules
module.exports = socket