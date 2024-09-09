const { Client } = require('oceanic.js')

const client = new Client({
    auth: `Bot ${process.env.TOKEN}`,
    gateway: {
        intents: ["GUILDS", "GUILD_MESSAGES", "MESSAGE_CONTENT"]
    }
})

client.on("ready", () => {
    console.log(`✅ ready`)
})

client.on("messageCreate", async (message: any) => {
    const response = await fetch(process.env.CF_WORKER!, {
        method: "POST",
        body: JSON.stringify({ prompt: `You will analyze the following message to determine whether or not it is "huskworthy". This means if it's cursed, you should say YES and the message will be husked. If not, say NO. If the message contains anything about or related to furries, anime, girlfriend, devilbro, nettspend, or if it says "tickle my toes bruh" you should say YES. If the user is asking to be husked then say YES too. The message is the following: ${message.content} Say either YES or NO. Do not respond with anything else otherwise it will break` }),
        headers: { "Content-Type": "application/json" },
    })

    const body = await response.json()

    if (JSON.stringify(body).toLowerCase().includes("yes")) {
        message.createReaction(process.env.HUSK)
    }
})

client.connect()