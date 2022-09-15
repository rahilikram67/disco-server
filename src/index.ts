import { discordServer } from "./discord"
import dotenv from "dotenv"
dotenv.config()

import express from "express"
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs');

const allowlist: string[] = []
discordServer(allowlist)
app.get("/", (req, res) => {
    res.render("index", {
        allowlist
    })
})

app.post("/", (req, res) => {
    allowlist.push(req.body.item)
    res.redirect("/")
})

app.post("/del", (req, res) => {
    allowlist.splice(allowlist.indexOf(req.body.del), 1)
    res.redirect("/")
})

const port = process.env.PORT

app.listen(port, () => console.log("listening on "+port))

