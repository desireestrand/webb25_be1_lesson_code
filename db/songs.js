import Song from "../models/Song.js";
import { getFullTextSearch } from "../utils/fullTextSearch.js";

export async function getAllSongs(q) {
  let filter = {}
  if (q) {
    filter = {
      ...filter,
      ...getFullTextSearch(q),
    }
  }
  try {
    return await Song.find(filter).populate("artist", "name").populate("album", "title");
  } catch (err) {
    console.error("Unable to read from 'Songs'", err)
    return []
  }
}

export async function getSongByid(id) {
  try {
    return await Song.findById(id).populate("artist").populate("album", "title");
  } catch (err) {
    console.error("Unable to read from 'Song'", err)
    return null
  }
}

export async function createSong(data) {
  try {
    const newSong = new Song(data)
    await newSong.save()
    return await Song.populate(newSong, "artist album")
  } catch (err) {
    console.error("Unable to create 'Song'", err)
    return null
  }
}

export async function updateSong(id, data) {
  try {
    const updatedSong = await Song.findById(id)
    updatedSong.title = data.title ?? updatedSong.title
    updatedSong.artist = data.artist ?? updatedSong.artist
    updatedSong.album = data.album ?? updatedSong.album
    await updatedSong.save()
    return await Song.populate(updatedSong, "artist album")
  } catch (err) {
    console.error("Unable to update 'Song'", err)
    return null
  }
}

export async function deleteSong(id) {
  try {
    return !!(await Song.findByIdAndDelete(id));
  } catch (err) {
    console.error("Unable to delete 'Song'", err)
    return false
  }
}
