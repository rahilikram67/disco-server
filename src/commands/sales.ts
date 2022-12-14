import axios from "axios"
import { EmbedBuilder, Message } from "discord.js"
import * as cheerio from 'cheerio';
import { compact, mean, max, min, sum } from "lodash"
import * as blue from "bluebird"
export async function sales(message: Message) {
    const matches = message.content.match(/\w+/g) || []

    if (!matches?.length) return message.reply({
        content: "Commands are incorrect"
    }).then(res => setTimeout(() => res.delete(), 2000))

    else message.reply({
        content: "please be patient this will take some time"
    }).then(res => setTimeout(() => res.delete(), 2000))

    const command = matches.shift(),
        _page_len = Number(matches.slice(-1)[0]) ? matches.pop() : "",
        _search = matches.join(" ")

    const search = _search?.replace(/\'|\"/g, "")
    const page_len = Number(_page_len)

    let res = await axios.get(getURi(search, 1), { headers: { "Content-Type": "text/html" } })
    let $ = cheerio.load(res.data)
    const pages = $(".pagination__item").toArray().map(el => Number($(el).text()))

    const all_pages_len = pages.length
    console.log("total pages:", pages.join(" "))
    console.log("at page ", 1)
    !all_pages_len && console.log("stopping at page ", 1)

    pages.shift() // we already fetched from first page
    const _prices = $(".s-item__price").toArray().map(el => getPrice(el, $))

    const array_of_https = []
    for (let v = 0; v < all_pages_len - 1; v++) {
        if (page_len && (page_len - 2) < v) {
            console.log("stopping at page ", pages[v] - 1)
            break
        }
        console.log("at page ", pages[v])
        array_of_https.push(
            axios.get(getURi(search, pages[v]), { headers: { "Content-Type": "text/html" } }).catch(e => { })
        )
    }

    let http_res = await blue.Promise.all(array_of_https)

    for (const v of http_res) {
        if (!v?.data) continue
        $ = cheerio.load(v.data)
        let arr = $(".s-item__price").toArray().map(el => getPrice(el, $))
        _prices.push(...arr)
    }

    const prices = compact(_prices)
    const low = min(prices)
    const high = max(prices)
    const arr_len = prices.length
    const obj: Prices = {
        low: low ? low : 0,
        high: high ? high : 0,
        average: Number(mean(prices).toFixed(2)),
        profit: 0,
        sum: 0,
        total_prices: arr_len,
        total_pages: all_pages_len ? all_pages_len : 1
    }

    obj.sum = obj.average * arr_len


    obj.profit = Number(getProfit(obj.average).toFixed(2))

    message.channel.send({
        embeds: [embedder(obj, { command, search, _page_len })]
    })
    console.log("replied")
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

function embedder(obj: Prices, args: Args) {
    const { average, high, low, profit, sum, total_prices, total_pages } = obj
    return new EmbedBuilder()
        .setColor(0x0099FF)
        .setAuthor({ name: "Sales Bot", iconURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-zMtEgd5Lava93Sl4SEEiST2GB-L5DdElsg&usqp=CAU" })
        .setColor(0x0099FF)
        .setTitle('Sales Price Analytics')
        .setImage("https://png.pngitem.com/pimgs/s/71-710469_graph-png-download-image-business-growth-graph-transparent.png")
        .setTimestamp()
        .setDescription(`Bots calculations on prices `)
        .addFields([
            { name: "Command", value: format(args.command), inline: true },
            { name: "Search", value: format(args.search), inline: true },
            { name: "Average", value: format(`$${average}`), inline: true },
            { name: "Low", value: format(`$${low}`), inline: true },
            { name: "High", value: format(`$${high}`), inline: true },
            { name: "Estimated Profit", value: format(`$${profit}`), inline: true },
            { name: "Search info:", value: "\u200b" },
            { name: "Number of results", value: format(total_prices), inline: true },
            { name: "Total Sales", value: format(`$${sum}`), inline: true },
            { name: "Page Limit", value: format(Number(args._page_len) || 0), inline: true },
            { name: "Pages Indexed", value: format(total_pages), inline: true },
        ])
}

function format(s: string | number | undefined) {
    return `\`\`\`${s}\`\`\``
}