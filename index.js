require('dotenv').config();
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const cron = require('node-cron');
const connectDatabase = require('./db/db');
const { userModel } = require('./model/userSchema');
const { subscriptionEndCustomer } = require('./handler/subscriptionEndCustomer');
const { extractNumbers } = require('./handler/extractNumbers');
const { reorganizeNumber } = require('./handler/reorganizeNumber');
const { sendMessageToCustomer } = require('./handler/sendMessageToCustomer');
const messageGenerate = require('./handler/messageGenerate');

const sessions = ['6879125299b0bed604926bfd', '687911f899b0bed604926bfc']

const cilents = {}

connectDatabase()

for (const session of sessions) {
    const client = new Client({
        authStrategy: new LocalAuth({clientId: session})
    });

    client.on('qr', async(qr)=> {
        qrcode.generate(qr, {small: true})
        await userModel.findByIdAndUpdate(session, {whatsappQr: qr})
    })
    
    client.on('ready', async() => {
        console.log('client is ready')
        const user = await userModel.findByIdAndUpdate(session, {isWhatsappLoggedIn: true, whatsappQr: null})
        // const number = '8801763123739@c.us'
        const confirmMessage = 'Whatsapp login successful'
        await client.sendMessage(`${user.phone}@c.us`, confirmMessage)
        
        // client.sendMessage(number, message)
        // client.sendMessage(number, message)

        cron.schedule('0 0 * * *', async() => {
            const customers = await subscriptionEndCustomer(session)
            const customerNumbers = await extractNumbers(customers)
            for (const customerNumber of customerNumbers) {
                const client = cilents[session]
                if (client) {
                    const number = await reorganizeNumber(customerNumber.whatsapp)
                    const customerMessage = await messageGenerate(customerNumber.email)
                    await sendMessageToCustomer(client, number, customerMessage)
                    
                    // randomly 1-3 মিনিট delay (60000ms = 1 minute)
                    const randomMinutes = Math.floor(Math.random() * 3) + 1; // 1 থেকে 3 এর মধ্যে
                    const delayMs = randomMinutes * 60000;
                    console.log(`Waiting ${randomMinutes} minute(s) before next message...`);
                    await new Promise(resolve => setTimeout(resolve, delayMs));
                }
            }
        })
        // const startTime = new Date(); // Current time or schedule for later
        // const callLink = await client.createCallLink(startTime, 'voice');
        // console.log('Call link created:', callLink);
        
        console.log(`Cron job scheduled for session: ${session}`);
    })

    client.initialize()
    cilents[session] = client
}


