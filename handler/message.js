const message = async(email) => {
    const text = `প্রিয় গ্রাহক\n
    আপনার ${email} এর chat gpt এর subscription এর মেয়াদ আর মাত্র ২ দিন বাকি আছে।\n
    renew করতে আমাদের সাথে যোগাযোগ করুন ।`
    return text
}

module.exports = { message }