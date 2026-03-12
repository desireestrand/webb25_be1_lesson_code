import Playlist from "../models/Playlist.js";
import { getFullTextSearch } from "../utils/fullTextSearch.js";

export async function getAllPlaylists(q) {
  let filter = { }
  if (q) {
    filter = {
      ...filter,
      ...getFullTextSearch(q),
    }
  }
  try {
    return await Playlist.find(filter)
  } catch (err) {
    console.error("Unable to read from 'Playlists'", err)
      return []
  }
}

export async function getPlaylistByid(id) {
  try {
    return await Playlist.findById(id).populate({ path: "songs", populate: [
    { path: "artist", select: "name" },
    { path: "album", select: "title" }
  ] });
  } catch (err) {
    console.error("Unable to read from 'Playlist'", err)
    return null
  }
}

export async function createPlaylist(data) {
  try {
    return await Playlist.create(data);
  } catch (err) {
    console.error("Unable to create 'Playlist'", err)
    return null
  }
}

export async function addSongToPlaylist(id, song) {
  try {
    const updatedPlaylist = await Playlist.findByIdAndUpdate(id, {
      $addToSet: {
        songs: song
      }
    }, {
      returnDocument: "after"
    }).populate({ path: "songs", populate: [
    { path: "artist", select: "name" },
    { path: "album", select: "title" }
  ] })
    if(!updatedPlaylist) {
      return null
    }
    return updatedPlaylist
  } catch (err) {
    console.error("Unable to add song to 'Playlist'", err)
    return null
  }
}

export async function removeSongFromPlaylist(id, song) {
  try {
    const updatedPlaylist = await Playlist.findByIdAndUpdate(id, {
      $pull: {
        songs: song
      }
    }, {
      returnDocument: "after"
    }).populate({ path: "songs", populate: [
    { path: "artist", select: "name" },
    { path: "album", select: "title" }
  ] })
    if(!updatedPlaylist) {
      return null
    }
    return updatedPlaylist
  } catch (err) {
    console.error("Unable to remove song from 'Playlist'", err)
    return null
  }
}

export async function deletePlaylist(id) {
  try {
    const playlist = await Playlist.findById(id)
    if (!playlist) return null
    await playlist.deleteOne()
    return true
  } catch (err) {
    console.error("Unable to delete 'Playlist'", err)
    return false
  }
}