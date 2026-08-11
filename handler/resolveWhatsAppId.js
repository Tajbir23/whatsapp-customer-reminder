/**
 * WhatsApp এখন LID (Linked ID) দিয়ে চ্যাট আইডেন্টিফাই করে, ফোন নম্বর (@c.us) দিয়ে না।
 * যে নম্বরের সাথে আগে কখনো চ্যাট হয়নি তার LID লোকাল chat table এ থাকে না, তাই
 * সরাসরি "88017xxxxxxxx@c.us" এ পাঠাতে গেলে "Lid is missing in chat table" error আসে।
 *
 * পাঠানোর আগে এই হেল্পার দিয়ে LID resolve করে নিলে ম্যাপিংটা WhatsApp এর store এ চলে আসে
 * এবং নতুন নম্বরেও চ্যাট তৈরি হতে পারে।
 *
 * @returns {Promise<{id: string|null, reason?: string}>} id = পাঠানোর জন্য ব্যবহার্য WhatsApp ID
 */
const resolveWhatsAppId = async (client, number) => {
    const numberOnly = String(number || '').replace(/@(c\.us|lid|s\.whatsapp\.net)$/, '')

    if (!numberOnly) {
        return { id: null, reason: 'Invalid number' }
    }

    try {
        const [contact] = await client.getContactLidAndPhone([`${numberOnly}@c.us`])

        // LID পাওয়া গেছে - এটা দিয়েই পাঠানো সবচেয়ে নিরাপদ
        if (contact && contact.lid) {
            return { id: contact.lid }
        }

        // নম্বরটা WhatsApp এ আছে কিন্তু LID পাওয়া যায়নি - @c.us দিয়ে চেষ্টা করা হবে
        if (contact && contact.pn) {
            console.log(`⚠️ LID resolve হয়নি ${numberOnly} এর জন্য, @c.us দিয়ে চেষ্টা করা হচ্ছে`)
            return { id: contact.pn }
        }

        // দুটোই ফাঁকা মানে নম্বরটা WhatsApp এ রেজিস্টার্ড না
        return { id: null, reason: 'Not registered on WhatsApp' }
    } catch (error) {
        console.log(`⚠️ getContactLidAndPhone ব্যর্থ (${numberOnly}): ${error.message}`)

        // পুরোনো পদ্ধতিতে fallback
        try {
            const wid = await client.getNumberId(numberOnly)
            if (!wid) {
                return { id: null, reason: 'Not registered on WhatsApp' }
            }
            return { id: wid._serialized || `${numberOnly}@c.us` }
        } catch (fallbackError) {
            return { id: null, reason: fallbackError.message || 'Number lookup failed' }
        }
    }
}

module.exports = { resolveWhatsAppId }
