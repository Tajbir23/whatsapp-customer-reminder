const mongoose = require("mongoose");

const responseLogsSchema = mongoose.Schema({
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    message: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400
    }
});

const responseLogsModel = mongoose.model('ResponseLog', responseLogsSchema)

module.exports = responseLogsModel
