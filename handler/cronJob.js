const cron = require('node-cron')
const { subscriptionEndCustomer } = require('./subscriptionEndCustomer')
const { extractNumbers } = require('./extractNumbers')
const { reorganizeNumber } = require('./reorganizeNumber')
const { sendMessageToCustomer } = require('./sendMessageToCustomer')
const messageGenerate = require('./messageGenerate')

// Setup cron job for a session
const setupCronJob = (session, cilents) => {
    cron.schedule('0 0 * * *', async() => {
        console.log('cron schedule is running')
        try {
            const customers = await subscriptionEndCustomer(session)
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
                    const customerMessage = await messageGenerate(customerNumber.email)
                    await sendMessageToCustomer(currentClient, number, customerMessage)
                    
                    // randomly 1-3 মিনিট delay (60000ms = 1 minute)
                    const randomMinutes = Math.floor(Math.random() * 3) + 1
                    const delayMs = randomMinutes * 60000
                    console.log(`Waiting ${randomMinutes} minute(s) before next message...`)
                    await new Promise(resolve => setTimeout(resolve, delayMs))
                } catch (err) {
                    console.error(`Error sending message for ${session}:`, err.message)
                    break
                }
            }
        } catch (error) {
            console.error(`Cron job error for ${session}:`, error.message)
        }
    })
    
    console.log(`Cron job scheduled for session: ${session}`)
}

module.exports = { setupCronJob }

