import express from "express"
import dotenv from 'dotenv';
import cors from "cors"
import { connectToDb, disconnectFromDb } from "./config/db.js";

import artistRouter from "./routes/artists.js"
import songRouter from "./routes/songs.js"
import albumRouter from "./routes/albums.js"
import playlistRouter from "./routes/playlists.js";

dotenv.config();

const app = express();

app.use(cors())
app.use(express.json())

app.get("/api/health", (req, res) => {
    return res.json({ message: "Healthy?" })
})

// Stub: receives register request (no logic yet)
app.post("/api/auth/register", (req, res) => {
    res.status(501).json({ message: "Not implemented" })
})

app.get("/auth/register", (req, res) => {
    res.sendFile("auth/register.html", { root: "frontend" })
})

app.use("/api/artists", artistRouter)
app.use("/api/songs", songRouter)
app.use("/api/albums", albumRouter)
app.use("/api/playlists", playlistRouter)
app.use(express.static("frontend"))
app.use("/data", express.static("data"))

const PORT = process.env.PORT || 3000

// Start server only after DB connection
connectToDb("sqotifyv2")
    .then(() => {
        app.listen(PORT, (error) => {
            if (error) {
                console.warn("Error in running express", error.message)
                throw new Error(error.message)
            }
            console.info(`Server is running on port ${PORT}`)
        })

    }).catch((error) => {
        console.error("Error connecting to database", error)
        disconnectFromDb()
        throw new Error(error.message)
    })