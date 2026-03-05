import { readFile } from "fs/promises";
import Artist from "../models/Artist.js";
import Song from "../models/Song.js";
import { connectToDb, disconnectFromDb } from "../config/db.js";

const ARTISTS_PATH = new URL("../data/artists.json", import.meta.url);
const SONGS_PATH = new URL("../data/songs.json", import.meta.url);

async function seedArtists() {
    if ((await Artist.countDocuments()) > 0) return;
    const artistsFromFile = JSON.parse(await readFile(ARTISTS_PATH, "utf8"));
    // Use _id from file to keep ids stable across teardown/reseed
    const toInsert = artistsFromFile.map(a => ({ _id: a._id, name: a.name }));
    await Artist.insertMany(toInsert);
    console.info("Artists seeded");
}

async function seedSongs() {
    if ((await Song.countDocuments()) > 0) return;
    const songsFromFile = JSON.parse(await readFile(SONGS_PATH, "utf8"));
    const toInsert = songsFromFile.map(s => ({ _id: s._id, title: s.title, artist: s.artist }));
    await Song.insertMany(toInsert);
    console.info("Songs seeded");
}

async function seedIfEmpty() {
    await seedArtists();  // Artists first (songs reference by name)
    await seedSongs();
}

// Standalone script: connect, seed, disconnect so process exits
connectToDb("sqotifyv2")
    .then(() => seedIfEmpty())
    .then(() => disconnectFromDb())
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
