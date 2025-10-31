const remindOldCustomerMessage = async (customer) => {
    return `আসসালামুলাইকুম\n
    আপনার ${customer} মেইল এর subscription এখনো renew করেন নাই ।\n
    আপনি কি renew করতে চাচ্ছেন ?`
}

module.exports = remindOldCustomerMessage