import discord from "discord.js"
import { deleteAll } from "./commands/delete"
import { sales } from "./commands/sales"
import creds from "./credentials.json"
export const discordServer = (blocklist: string[]) => {
    const client = new discord.Client({
        intents: [
            discord.GatewayIntentBits.Guilds,
            discord.GatewayIntentBits.GuildMessages,
            discord.GatewayIntentBits.MessageContent
        ],
    })


    client.on("messageCreate", async (message) => {
        if (blocklist.includes(message.channelId)) return
        switch (message.content.split(" ")[0]) {
            case "!deleteAll":
                deleteAll(message)
                break
            case "!Sales":
                sales(message)
                break
        }
    })
    client.on("ready", () => console.log("Bot is ready!"))
    client.login(creds.token)
}