"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_1 = require("./discord");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
const blocklist = [];
(0, discord_1.discordServer)(blocklist);
app.get("/", (req, res) => {
    res.render("index", {
        blocklist
    });
});
app.post("/", (req, res) => {
    blocklist.push(req.body.item);
    res.redirect("/");
});
app.post("/del", (req, res) => {
    blocklist.splice(blocklist.indexOf(req.body.del), 1);
    res.redirect("/");
});
const port = process.env.PORT;
app.listen(port, () => console.log("listening on " + port));
