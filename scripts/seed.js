import { readFile } from "fs/promises";
import Artist from "../models/Artist.js";
import Song from "../models/Song.js";
import Album from "../models/Album.js";
import Playlist from "../models/Playlist.js";
import { connectToDb, disconnectFromDb } from "../config/db.js";

const ARTISTS_PATH = new URL("../data/artists.json", import.meta.url);
const ALBUMS_PATH = new URL("../data/albums.json", import.meta.url);
const SONGS_PATH = new URL("../data/songs.json", import.meta.url);
const PLAYLISTS_PATH = new URL("../data/playlists.json", import.meta.url);

async function seedArtists() {
    if ((await Artist.countDocuments()) > 0) return;
    const artistsFromFile = JSON.parse(await readFile(ARTISTS_PATH, "utf8"));
    // Use _id from file to keep ids stable across teardown/reseed
    const toInsert = artistsFromFile.map(a => ({ _id: a._id, name: a.name, slug: a.slug }));
    await Artist.insertMany(toInsert);
    console.info("Artists seeded");
}

async function seedAlbums() {
    if ((await Album.countDocuments()) > 0) return;
    const albumsFromFile = JSON.parse(await readFile(ALBUMS_PATH, "utf8"));
    const toInsert = albumsFromFile.map(a => ({ _id: a._id, title: a.title, artist: a.artist, releaseDate: a.releaseDate }));
    await Album.insertMany(toInsert);
    console.info("Albums seeded");
}

async function seedSongs() {
    if ((await Song.countDocuments()) > 0) return;
    const songsFromFile = JSON.parse(await readFile(SONGS_PATH, "utf8"));
    const toInsert = songsFromFile.map(s => ({ _id: s._id, title: s.title, artist: s.artist, album: s.album || null, length: s.length ?? 120 }));
    await Song.insertMany(toInsert);
    console.info("Songs seeded");
}

async function seedPlaylists() {
    if ((await Playlist.countDocuments()) > 0) return;
    const playlistsFromFile = JSON.parse(await readFile(PLAYLISTS_PATH, "utf8"));
    const toInsert = playlistsFromFile.map(p => ({ _id: p._id, name: p.name, description: p.description || "", songs: p.songs || [] }));
    await Playlist.insertMany(toInsert);
    console.info("Playlists seeded");
}

async function seedIfEmpty() {
    await seedArtists();  // Artists first (songs reference by name)
    await seedAlbums();
    await seedSongs();
    await seedPlaylists();  // Playlists last (reference songs)
}

// Standalone script: connect, seed, disconnect so process exits
connectToDb("sqotifyv2")
    .then(() => seedIfEmpty())
    .then(() => disconnectFromDb())
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
