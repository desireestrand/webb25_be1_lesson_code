import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/"

export async function connectToDb(dbname = "test") {
    await mongoose.connect(`${MONGODB_URI}${dbname}`)
    console.log("Connected to mongo.db ", `${MONGODB_URI}${dbname}`)
}