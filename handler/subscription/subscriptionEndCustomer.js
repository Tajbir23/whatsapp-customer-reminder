const { customerModel } = require("../model/customerSchema")


const subscriptionEndCustomer = async(adminId) => {
    try {
        // Dhaka timezone (UTC+6) এ current date এবং time
        const dhakaTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka' })
        const today = new Date(dhakaTime)
        today.setHours(0, 0, 0, 0) // আজকের শুরু (Dhaka time)
        
        console.log(`📅 Today in Dhaka: ${today.toLocaleString('en-US', { timeZone: 'Asia/Dhaka' })}`)
        
        const twoDaysLater = new Date(today)
        twoDaysLater.setDate(today.getDate() + 2) // 2 দিন পর শুরু
        
        const twoDaysLaterEnd = new Date(twoDaysLater)
        twoDaysLaterEnd.setHours(23, 59, 59, 999) // 2 দিন পর শেষ
        
        console.log(`📅 Searching for subscriptions ending on: ${twoDaysLater.toLocaleDateString('en-US', { timeZone: 'Asia/Dhaka' })}`)
        
        // যাদের subscription 2 দিন পর end হবে
        // user অথবা reference field এ adminId থাকলে খুঁজবে
        const customers = await customerModel.find({
            $or: [
                { user: adminId },
                { reference: adminId }
            ],
            orderFrom: 'whatsapp',
            subscriptionEnd: {
                $gte: twoDaysLater, // 2 দিন পর বা তার পরে
                $lte: twoDaysLaterEnd // 2 দিন পরের শেষে
            }
        });
        
        return customers;
    } catch (error) {
        console.log(error)
        return [];
    }
}

module.exports = { subscriptionEndCustomer }