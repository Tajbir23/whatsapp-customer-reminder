const { io } = require('socket.io-client')
const baseUrl = require('../config/baseUrl')
const remindOldCustomers = require('../handler/selectedCustomers/remindOldCustomers')

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

socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error.message)
})

socket.on('reconnect', (attemptNumber) => {
    console.log(`🔄 Reconnected to server after ${attemptNumber} attempts`)
})

socket.on('reconnect_attempt', (attemptNumber) => {
    console.log(`⏳ Attempting to reconnect... (${attemptNumber})`)
})

socket.on('reconnect_failed', () => {
    console.error('❌ Failed to reconnect to server')
})

// Custom message events
socket.on('message', (message) => {
    console.log('📨 Message from server:', message)
})


socket.on('remindOldCustomers', (adminId) => {
    remindOldCustomers(adminId)
})
// Export socket for use in other modules
module.exports = socket