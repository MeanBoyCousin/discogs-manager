import Cron from 'croner'
import { Client } from 'disconnect'
import 'dotenv/config'

const roundPrice = (price: number) => Math.round(price * 100) / 100

const Discogs = new Client({
    userToken: process.env.DISCOGS_PAT
}).marketplace()

Cron('0 12 * * 7', async () => {
    const { listings } = await Discogs.getInventory(process.env.DISCOGS_USER)

    for (const listing of listings) {
        const { id, price, status } = listing
        const newPrice = roundPrice(price.value * 0.99)

        if (status !== 'Sold') {
            await Discogs.editListing(id, { price: newPrice })
        }
    }
})
