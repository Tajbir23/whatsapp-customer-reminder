const cron = require('node-cron')
const { subscriptionEndCustomer } = require('./subscriptionEndCustomer')
const { extractNumbers } = require('./extractNumbers')
const { reorganizeNumber } = require('./reorganizeNumber')
const { sendMessageToCustomer } = require('./sendMessageToCustomer')
const subscriptionEndMessage = require('./subscriptionEndMessage')
const randomTImeGenerate = require('./randomTimeGenerate')

// Setup cron job for a session
const setupCronJob = (session, cilents) => {
    // Cron schedule: '0 0 * * *' means every day at 12:00 AM (midnight)
    // Timezone: Asia/Dhaka (UTC+6)
    cron.schedule('0 0 * * *', async() => {
        const dhakaTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka' })
        console.log(`🕐 Cron job started at ${dhakaTime} (Dhaka Time) for session: ${session}`)
        
        try {
            const customers = await subscriptionEndCustomer(session)
            console.log(`📋 Found ${customers.length} customers with subscription ending in 2 days`)
            const customerNumbers = await extractNumbers(customers)
            
            for (const customerNumber of customerNumbers) {
                const currentClient = cilents[session]
                
                // Check if client exists and is ready
                if (!currentClient) {
                    console.log(`Client ${session} is not available. Skipping message.`)
                    break
                }
                
                try {
                    // Check if client state is valid before sending
                    const state = await currentClient.getState()
                    if (state !== 'CONNECTED') {
                        console.log(`Client ${session} is not connected (${state}). Skipping message.`)
                        break
                    }
                    
                    const number = await reorganizeNumber(customerNumber.whatsapp)
                    // const number = await reorganizeNumber('+8801560031203')
                    const customerMessage = await subscriptionEndMessage(customerNumber.email)
                    await sendMessageToCustomer(currentClient, number, customerMessage)
                    
                    // randomly 1-3 মিনিট delay (60000ms = 1 minute)
                    const delayMs = await randomTImeGenerate()
                    await new Promise(resolve => setTimeout(resolve, delayMs))
                } catch (err) {
                    console.error(`Error sending message for ${session}:`, err.message)
                    break
                }
            }
        } catch (error) {
            console.error(`Cron job error for ${session}:`, error.message)
        }
    }, {
        timezone: 'Asia/Dhaka'
    })
    
    console.log(`✅ Cron job scheduled for session: ${session} (Every day at 12:00 AM Dhaka Time)`)
}

module.exports = { setupCronJob }

