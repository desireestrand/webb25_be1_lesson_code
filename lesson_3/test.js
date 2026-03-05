import { connectToDb } from "./connect.js"
import mongoose from "mongoose"
import Artist from "./models/Artist.js"

async function main() {
    try {
        await connectToDb('test')

        await Artist.deleteMany({})

        const artistData = [
            {name: "Charli XCX"},
            {name: "Ethel Cain"},
            {name: "Bad Bunny"},
            {name: "The Weeknd"},
            {name: "Haim"},
            {name: "Harry Styles"}
        ]

        await Artist.insertMany(artistData)

        console.log("Created artists", artistData)

        const getAllArtists = await Artist.find()
        console.log("Artists", getAllArtists)

        const updateArtist = await Artist.findOneAndUpdate({ name: "Charli XCX"}, { name: "Charlotte Perelli"}, {new: true})
        console.log("Updated artist", updateArtist)

        const deleteArtist = await Artist.deleteOne({ name: "Bad Bunny"});
        console.log("Deleted artist", deleteArtist);

        const filterArtist = await Artist.find({ name: /we/i })
        console.log("Filtered artists", filterArtist)


    } catch(error) {
        console.warn("Unable to connect to mongo.db ", error)
    }

    await mongoose.disconnect()
}

main()
