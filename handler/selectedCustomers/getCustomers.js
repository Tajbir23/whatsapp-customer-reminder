const { customerModel } = require("../../model/customerSchema")

const getCustomers = async(adminId) => {
    try {
        const customers = await customerModel.aggregate([
            {
                $match: {
                    user: adminId,
                    orderFrom: 'whatsapp',
                    waOrFbId: { $ne: null }
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
        return customers
    } catch (error) {
        console.log(error)
        return []
    }
}

module.exports = getCustomers