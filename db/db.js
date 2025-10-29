const { default: mongoose } = require("mongoose")

const connectDatabase = async() => {
    try {
        // Check if already connected
        if (mongoose.connection.readyState === 1) {
            console.log('Already connected to MongoDB')
            return
        }
        
        console.log('Connecting to database...')
        await mongoose.connect(process.env.MONGO_URI)
        console.log('Connected to MongoDB')
    } catch (error) {
        console.error('Database connection error:', error)
        throw error
    }
}

module.exports = connectDatabase