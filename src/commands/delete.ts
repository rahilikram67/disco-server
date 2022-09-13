import { Message } from "discord.js"
export async function deleteAll(message: Message) {
    const messages = await message.channel.messages.fetch({ after: "1" })
    message.channel.delete(messages as any)
} 