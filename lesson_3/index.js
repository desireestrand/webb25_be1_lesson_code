import { connectToDb } from "./connect.js"
import Artist from "./models/Artist.js"


async function main() {
    try {
        await connectToDb('lesson_3')
    } catch(error) {
        console.warn("Unable to connect to mongo.db ", error)
    }

    try {
        const artists = await Artist.find()
        console.log("Artists", artists)
        // await Artist.deleteMany()
    } catch(error) {
        if(error.code === 11000) {
            console.log(`Artist with name 'Bad bunny' allready exists`)
            return 
        }
        console.log("Unable to interact with 'Artist' collection", error)
    }
}

main()
