import axios from "axios"
import { EmbedBuilder, Message } from "discord.js"
import * as cheerio from 'cheerio';
import { compact } from "lodash"
export async function sales(message: Message) {
    const [command, _search, _page_len] = message.content.match(/\w+|".*"|'.*'/g) || []

    console.log(command, _search, _page_len)

    if (!command && !_search) return message.reply({
        content: "Commands are incorrect"
    }).then(res => setTimeout(() => res.delete(), 2000))

    else message.reply({
        content: "please be patient this will take some time"
    }).then(res => setTimeout(() => res.delete(), 2000))

    const search = _search?.replace(/\'|\"/g, "")
    const page_len = Number(_page_len) - 2

    let res = await axios.get(getURi(search, 1), { headers: { "Content-Type": "text/html" } })
    let $ = cheerio.load(res.data)
    const pages = $(".pagination__item").toArray().map(el => Number($(el).text()))

    console.log("total pages:", pages.join(" "))
    console.log("at page ", 1)

    pages.shift() // we already fetched from first page
    const _prices = $(".s-item__price").toArray().map(el => getPrice(el, $))

    const all_pages_len = pages.length
    for (let v = 0; v < all_pages_len; v++) {
        if (page_len < v) {
            console.log("stopping at page ", pages[v] - 1)
            break
        }
        console.log("at page ", pages[v])
        try {
            res = await axios.get(getURi(search, pages[v]), { headers: { "Content-Type": "text/html" } })
        } catch (error) {
            continue
        }

        $ = cheerio.load(res.data)
        let arr = $(".s-item__price").toArray().map(el => getPrice(el, $))
        _prices.push(...arr)

    }

    _prices.sort()
    const prices = compact(_prices)

    const low = prices[0],
        high = prices.slice(-1)[0],
        average = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
        profit = getProfit(average).toFixed(2)

    message.channel.send({
        embeds: [embedder(low, average, high, Number(profit), [command, search, _page_len])]
    })
}


function getURi(text: string, page: number) {
    return `https://www.ebay.com/sch/i.html?_nkw=${text}&LH_Sold=1&LH_Complete=1&_pgn=${page}`
}

function getPrice(el: cheerio.Element, $: cheerio.CheerioAPI) {
    const text = $(el).text()
    const num = text.includes("to") ? text.split(" to ").pop() : text
    return Number(num?.slice(1)) || 0
}

function getProfit(n: number) {
    return n - n * 12.9 / 100 - 0.3
}

function embedder(low: number, average: number, high: number, profit: number, args: any) {
    return new EmbedBuilder()
        .setColor(0x0099FF)
        .setAuthor({ name: "Chandi", iconURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-zMtEgd5Lava93Sl4SEEiST2GB-L5DdElsg&usqp=CAU" })
        .setColor(0x0099FF)
        .setTitle('Chandi Replying')
        .setImage("https://png.pngitem.com/pimgs/s/71-710469_graph-png-download-image-business-growth-graph-transparent.png")
        .setTimestamp()
        .setDescription(`Bots calculations on prices `)
        .addFields([
            { name: "Command", value: `${args[0]}`, inline: true },
            { name: "Search", value: `${args[1]}`, inline: true },
            { name: "Page Limit", value: `${Number(args[2]) || 0}`, inline: true }
        ])
        .addFields([
            { name: "Low", value: `$${low}`, inline: true },
            { name: "Average", value: `$${average}`, inline: true },
            { name: "High", value: `$${high}`, inline: true },
            { name: "Profit", value: `$${profit}`, inline: true },
        ])
}