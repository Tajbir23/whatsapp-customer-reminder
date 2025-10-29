// Global error handlers to prevent crashes
const setupErrorHandlers = () => {
    process.on('unhandledRejection', (reason, promise) => {
        console.error('Unhandled Rejection at:', promise, 'reason:', reason)
    })

    process.on('uncaughtException', (error) => {
        console.error('Uncaught Exception:', error)
    })
}

module.exports = { setupErrorHandlers }

