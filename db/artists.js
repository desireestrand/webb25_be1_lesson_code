import slugify from "slugify";
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
    return await Artist.create({
      ...data,
      slug: slugify(data.name)
    });
  } catch (err) {
    console.error("Unable to create 'Artist'", err)
    return null
  } 
}

export async function updateArtist(id, data) {
  try {
    const updatedArtist = await Artist.findByIdAndUpdate(id, {
      ...data,
      slug: slugify(data.name)
    }, { returnDocument: "after" });
    if (!updatedArtist) return null;
    return updatedArtist;
  } catch (err) {
    console.error("Unable to update 'Artist'", err)
    return null
  }
}

export async function deleteArtist(id) {
  try {
    return !!(await Artist.findByIdAndDelete(id));
  } catch (err) {
    console.error("Unable to delete 'Artist'", err)
    return false
  }
}
