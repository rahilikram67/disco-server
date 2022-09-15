import discord from "discord.js"
import { deleteAll } from "./commands/delete"
import { sales } from "./commands/sales"

export const discordServer = (allowlist: string[]) => {
    const client = new discord.Client({
        intents: [
            discord.GatewayIntentBits.Guilds,
            discord.GatewayIntentBits.GuildMessages,
            discord.GatewayIntentBits.MessageContent
        ],
    })


    client.on("messageCreate", async (message) => {
        if (!allowlist.includes(message.channelId)) return
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
    client.login(process.env.TOKEN)
}