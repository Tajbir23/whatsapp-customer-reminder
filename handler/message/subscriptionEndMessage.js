const subscriptionEndMessage = async (email) => {
    const text =`আপনার ${email} এর ChatGPT Plus subscription এর মেয়াদ শেষ হয়েছে।\n
    আপনি কি renew করতে চাচ্ছেন?
    
    _*Renew অথবা Payment করে থাকলে ignore করুন*_
    `
    
    return text
}

module.exports = subscriptionEndMessage