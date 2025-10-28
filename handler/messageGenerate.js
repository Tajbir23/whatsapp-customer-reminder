const messageGenerate = async(email) => {
    const text = `আসসালামু আলাইকুম\n
    আপনার ${email} এর ChatGPT Plus subscription এর মেয়াদ আর মাত্র ২ দিন বাকি আছে।\n
     আপনি কি renew করতে চাচ্ছেন ?\n
    ধন্যবাদ`
    return text
}

module.exports = messageGenerate