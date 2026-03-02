import { connectToDb } from './connect.js'
import Artist from './models/Artist.js';

async function main() {
    console.log("Hello World!");
    try {
        await connectToDb("lesson_3");
    } catch (error) {
        console.warn("Unable to connect to mongo.db ", error)
    }

    try {
        const artists = await Artist.find()
        console.log("Artists", artists)

        const newArtist = await Artist.create({
            name: "Bad Bunny"
        })
        console.log("New artist", newArtist)

        await Artist.deleteMany()
    } catch (error) {
        console.log("RESPONSE", error.response)
        if(error.code === 11000) {
            console.log(`Artist with name "Bad Bunny" already exists`)
        }
        console.warn("Unable to interact with 'Artist' collection", error)
    }
}

main();