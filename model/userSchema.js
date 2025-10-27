const { Schema, model } = require("mongoose");


const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        trim: true,
        minlength: 3
    },
    email: {
        type: String,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    whatsappQr: {
        type: String
    },
    isWhatsappLoggedIn: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'admin', 'reseller']
    }
},{
    timestamps: true
})

const userModel = model('User', userSchema)

module.exports = { userModel }