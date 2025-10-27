const extractNumbers = async(numbers) => {
    try {
        const customerNumbers = await numbers.map((number) => {
            return {whatsapp: number.waOrFbId,
                email: number.email
            }
        })
        return customerNumbers
    } catch (error) {
        console.log(error)
        return []
    }
}

module.exports = { extractNumbers }