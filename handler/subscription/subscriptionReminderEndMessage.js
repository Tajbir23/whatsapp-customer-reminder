const subscriptionReminderEndMessage = async (email) => {
    const text = `আসসালামু আলাইকুম

আপনার ${email} এর ChatGPT Plus subscription এর মেয়াদ আর মাত্র ২ দিন বাকি আছে।

আপনি কি renew করতে চাচ্ছেন?
`
    
    return text
}

module.exports = subscriptionReminderEndMessage