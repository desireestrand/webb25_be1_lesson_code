import Album from "../models/Album.js";
import { getFullTextSearch } from "../utils/fullTextSearch.js";

export async function getAllAlbums(q) {
  let filter = { }
  if (q) {
    filter = {
      ...filter,
      ...getFullTextSearch(q),
    }
  }
  try {
    return await Album.find(filter).populate("artist", "name");
  } catch (err) {
    console.error("Unable to read from 'Albums'", err)
      return []
  }
}

export async function getAlbumByid(id) {
  try {
    return await Album.findById(id).populate("artist", "name");
  } catch (err) {
    console.error("Unable to read from 'Album'", err)
    return null
  }
}

export async function createAlbum(data) {
  try {
    return await Album.create(data);
  } catch (err) {
    console.error("Unable to create 'Album'", err)
    return null
  }
}

export async function updateAlbum(id, data) {
  try {
    return await Album.findByIdAndUpdate(id, data, { new: true }).populate("artist", "name");
  } catch (err) {
    console.error("Unable to update 'Album'", err)
    return null
  }
}

export async function deleteAlbum(id) {
  try {
    const album = await Album.findById(id)
    if (!album) return null
    await album.deleteOne()
    return true
  } catch (err) {
    console.error("Unable to delete 'Album'", err)
    return false
  }
}