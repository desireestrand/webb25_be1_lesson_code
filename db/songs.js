import fs from "fs/promises";

const DATA_PATH = new URL('../data/songs.json', import.meta.url);

async function readSongs() {
    try {
        const file = await fs.readFile(DATA_PATH, 'utf8');
        const songsJSON = file.toString();
        const songs = JSON.parse(songsJSON);
        if (!Array.isArray(songs)) {
            throw new Error("Songs is not in an array");
        }
        return songs;
    } catch (err) {
        console.log("Unable to read from 'data/songs.json'", err);
        return [];
    }
}

async function writeSongs(songs = []) {
    const songsJSON = JSON.stringify(songs, null, 2);
    try {
        await fs.writeFile(DATA_PATH, songsJSON);
    } catch (err) {
        console.log("Unable to write to 'data/songs.json'", err);
    } 
}

export async function getAllSongs() {
    const _songs = await readSongs();
    return _songs;
}

export async function getSongByid(id) {
    const _songs = await readSongs();
    return _songs.find(song => song.id === id) || null;
}

export async function createSong(data) {
    const _songs = await readSongs();
    const lastId = Math.max(..._songs.map(s => s.id)) || 0;

    const newSong = {
        ...data,
        id: lastId + 1
    };
    _songs.push(newSong);
    
    await writeSongs(_songs);
    return newSong;
}

export async function updateSong(id, data) {
    let _songs = await readSongs();
    let song = await getSongByid(id);
    if(!song) return null;

    const updatedSong = {
        ...song,
        ...data
    };

    _songs = _songs.map(s => {
        if(s.id === id) {
            return updatedSong;
        }
        return s;
    });

    await writeSongs(_songs);
    return updatedSong;
}

export async function deleteSong(id) {
    const songs = await readSongs();
    const index = songs.findIndex(song => song.id === id);

    if (!index || index === -1 || songs[index].deleted === true) {
        return null;
    }

    songs[index].deleted = true;
    await writeSongs(songs);

    return songs[index];
}