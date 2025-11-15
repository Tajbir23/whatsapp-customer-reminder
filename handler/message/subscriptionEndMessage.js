const subscriptionEndMessage = async (email) => {
    const text =`আপনার ${email} এর ChatGPT Plus subscription এর মেয়াদ শেষ হয়েছে।\n
    আপনি কি renew করতে চাচ্ছেন?
    `
    
    return text
}

module.exports = subscriptionEndMessage