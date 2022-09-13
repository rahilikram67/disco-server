"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.discordServer = void 0;
const discord_js_1 = __importDefault(require("discord.js"));
const delete_1 = require("./commands/delete");
const sales_1 = require("./commands/sales");
const discordServer = (blocklist) => {
    const client = new discord_js_1.default.Client({
        intents: [
            discord_js_1.default.GatewayIntentBits.Guilds,
            discord_js_1.default.GatewayIntentBits.GuildMessages,
            discord_js_1.default.GatewayIntentBits.MessageContent
        ],
    });
    client.on("messageCreate", (message) => __awaiter(void 0, void 0, void 0, function* () {
        if (blocklist.includes(message.channelId))
            return;
        switch (message.content.split(" ")[0]) {
            case "!deleteAll":
                (0, delete_1.deleteAll)(message);
                break;
            case "!Sales":
                (0, sales_1.sales)(message);
                break;
        }
    }));
    client.on("ready", () => console.log("Bot is ready!"));
    client.login(process.env.TOKEN);
};
exports.discordServer = discordServer;
