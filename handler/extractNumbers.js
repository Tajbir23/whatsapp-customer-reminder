const extractNumbers = async(numbers) => {
    try {
        const customerNumbers = numbers.map((number) => {
            return {
                whatsapp: number.waOrFbId,
                email: number.email,
                plan: number.plan
            }
        })
        return customerNumbers
    } catch (error) {
        console.log(error)
        return []
    }
}

module.exports = { extractNumbers }