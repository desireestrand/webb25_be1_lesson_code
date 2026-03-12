import Artist from "../models/Artist.js";
import { getFullTextSearch } from "../utils/fullTextSearch.js";

export async function getAllArtists(q) {
  let filter = { }
  if (q) {
    filter = {
      ...filter,
      ...getFullTextSearch(q, true, "name"),
    }
  }
  console.log(filter)
  try {
    return await Artist.find(filter);
  } catch (err) {
    console.error("Unable to read from 'Artists'", err)
    return []
  } 
}

export async function getArtistByid(id) {
  try {
    return await Artist.findById(id);
  } catch (err) {
    console.error("Unable to read from 'Artist'", err)
    return null
  }
}

export async function createArtist(data) {
  try {
    const newArtist = new Artist(data)
    await newArtist.save()
    return newArtist
  } catch (err) {
    console.error("Unable to create 'Artist'", err)
    return null
  } 
}

export async function updateArtist(id, data) {
  try {
    const updatedArtist = await Artist.findById(id)
    if (!updatedArtist) return null;
    updatedArtist.name = data.name ?? updatedArtist.name
    await updatedArtist.save()
    return updatedArtist;
  } catch (err) {
    console.error("Unable to update 'Artist'", err)
    return null
  }
}

export async function deleteArtist(id) {
  try {
    const artist = await Artist.findById(id)
    if (!artist) return null
    await Artist.deleteOne({_id: artist._id})
    return true
  } catch (err) {
    console.error("Unable to delete 'Artist'", err)
    return false
  }
}
