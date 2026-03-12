import Artist from "../models/Artist.js";
import Album from "../models/Album.js";
import Song from "../models/Song.js";
import Playlist from "../models/Playlist.js";
import { connectToDb, disconnectFromDb } from "../config/db.js";

async function teardown() {
    await connectToDb("sqotifyv2");
    await Playlist.deleteMany();  // Playlists first (reference songs)
    await Song.deleteMany();
    await Album.deleteMany();
    await Artist.deleteMany();
    console.info("Database cleared");
    await disconnectFromDb();  // Disconnect so process can exit
}

teardown().catch((err) => {
    console.error(err);
    process.exit(1);
});