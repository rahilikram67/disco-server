import { discordServer } from "./discord"


import express from "express"
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs');

const blocklist: string[] = []
discordServer(blocklist)
app.get("/", (req, res) => {
    res.render("index", {
        blocklist
    })
})

app.post("/", (req, res) => {
    blocklist.push(req.body.item)
    res.redirect("/")
})

app.post("/del", (req, res) => {
    blocklist.splice(blocklist.indexOf(req.body.del), 1)
    res.redirect("/")
})

const port = 80

app.listen(port, () => console.log("listening on "+port))

