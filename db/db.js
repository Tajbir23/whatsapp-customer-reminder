const { default: mongoose } = require("mongoose")

const connectDatabase = async() => {
    try {
        console.log('connecting database')
        await mongoose.connect(process.env.MONGO_URI)
        console.log('Connected to MongoDB')
    } catch (error) {
        console.log(error)
    }
}

module.exports = connectDatabase