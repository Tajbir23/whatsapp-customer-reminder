const { customerModel } = require("../../model/customerSchema")
const mongoose = require('mongoose')

const getCustomers = async(adminId) => {
    try {
        // Convert string to ObjectId if needed
        const adminObjectId = mongoose.Types.ObjectId.isValid(adminId) 
            ? new mongoose.Types.ObjectId(adminId) 
            : adminId
        
        console.log('Searching for customers with adminId:', adminObjectId)
        
        const customers = await customerModel.aggregate([
            {
                $match: {
                    $or: [
                        { user: adminObjectId },
                        { reference: adminObjectId }
                    ],
                    orderFrom: 'whatsapp'
                }
            },
            {
                $group: {
                    _id: '$waOrFbId',
                    customer: { $first: '$$ROOT' }
                }
            },
            {
                $replaceRoot: { newRoot: '$customer' }
            }
        ])
        
        console.log(`Found ${customers.length} unique customers`)
        return customers
    } catch (error) {
        console.error('Error in getCustomers:', error.message)
        return []
    }
}

module.exports = getCustomers