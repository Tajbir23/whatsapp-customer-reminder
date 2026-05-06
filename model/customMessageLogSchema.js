const { Schema, model } = require("mongoose")

const customMessageLogSchema = new Schema({
    admin: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    successNumbers: [{
        type: String
    }],
    failedNumbers: [{
        number: { type: String },
        reason: { type: String }
    }],
    totalCount: {
        type: Number,
        default: 0
    },
    successCount: {
        type: Number,
        default: 0
    },
    failedCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
})

const customMessageLogModel = model('CustomMessageLog', customMessageLogSchema)

module.exports = customMessageLogModel
