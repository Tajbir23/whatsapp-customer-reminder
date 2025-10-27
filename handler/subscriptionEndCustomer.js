const { customerModel } = require("../model/customerSchema")


const subscriptionEndCustomer = async(adminId) => {
    try {
        // আজকের তারিখ থেকে 2 দিন পর শুরু এবং শেষ সময়
        const today = new Date();
        today.setHours(0, 0, 0, 0); // আজকের শুরু
        
        const twoDaysLater = new Date(today);
        twoDaysLater.setDate(today.getDate() + 2); // 2 দিন পর শুরু
        
        const twoDaysLaterEnd = new Date(twoDaysLater);
        twoDaysLaterEnd.setHours(23, 59, 59, 999); // 2 দিন পর শেষ
        
        // যাদের subscription 2 দিন পর end হবে
        const customers = await customerModel.find({
            user: adminId,
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