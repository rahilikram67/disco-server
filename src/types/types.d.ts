interface Prices {
    low: number
    high: number
    average: number
    profit?: number
    sum:number,
    total_prices:number
    total_pages:number
}

interface Args {
    command: string | undefined
    search: string
    _page_len: string | undefined
}