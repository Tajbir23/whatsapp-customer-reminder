const { Schema, model } = require("mongoose");


const customerSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    customerName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    reference: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    orderFrom: {
        type: String,
        enum: ['facebook', 'whatsapp', 'other'],
        required: true
    },
    waOrFbId: {
        type: String,
        required: true
    },
    subscriptionEnd: {
        type: Date
    },
    gptAccount: {
        type: String,
        required: true
    },
    orderDate: {
        type: Date,
        required: true
    },
    note: {
        type: String
    },
    reminderDate: {
        type: Date
    },
    reminderNote: {
        type: String
    },
    paymentStatus: {
        type: String,
        enum: ['paid', 'pending'],
    },
    paidAmount: {
        type: Number
    },
    paymentDate: {
        type: Date
    },
    paymentMethod: {
        type: String,
    }
},{
    timestamps: true
})

// Use mainConnection instead of default mongoose connection
const customerModel = model('Customer', customerSchema)

module.exports = { customerModel }