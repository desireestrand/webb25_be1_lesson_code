import Song from "../models/Song.js";
import { getFullTextSearch } from "../utils/fullTextSearch.js";

export async function getAllSongs(q) {
  let filter = { }
  if (q) {
    filter = {
      ...filter,
      ...getFullTextSearch(q),
    }
  }
  try {
    return await Song.find(filter);
  } catch (err) {
    console.error("Unable to read from 'Songs'", err)
    return []
  }
}

export async function getSongByid(id) {
  try {
    return await Song.findById(id);
  } catch (err) {
    console.error("Unable to read from 'Song'", err)
    return null
  }
}

export async function createSong(data) {
  try {
    return await Song.create(data);
  } catch (err) {
    console.error("Unable to create 'Song'", err)
    return null
  }
}

export async function updateSong(id, data) {
  try {
    return await Song.findByIdAndUpdate(id, data, { new: true });
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
