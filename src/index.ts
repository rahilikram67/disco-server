import { discordServer } from "./discord"
import dotenv from "dotenv"
dotenv.config()
import { db } from "./utils/db"
import express from "express"
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs');


discordServer(db.value().allowlist)
app.get("/", (req, res) => {
    const allowlist = db.value().allowlist
    res.render("index", {
        allowlist
    })
})

app.post("/", (req, res) => {
    db.get("allowlist").push(req.body.item)
    db.save()
    res.redirect("/")
})

app.post("/del", (req, res) => {
    const allowlist = db.get("allowlist") as any
    db.get("allowlist").get(allowlist.indexOf(req.body.del)).delete(true)    
    res.redirect("/")
})

const port = process.env.PORT

app.listen(port, () => console.log("listening on " + port))

