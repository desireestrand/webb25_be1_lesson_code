import { Router } from "express"

import {
  getAllSongs,
  getSongByid,
  createSong,
  updateSong,
  deleteSong,
} from "../db/songs.js"
import { getAllArtists } from "../db/artists.js"
const songRouter = Router()

songRouter.get("/", async (req, res) => {
  const { q } = req.query
  const songs = await getAllSongs(q)
  return res.json(songs)
})

songRouter.get("/:id", async (req, res) => {
  const id = req.params.id
  const song = await getSongByid(id)
  if (!song) {
    return res.status(404).json({
      message: "Song does not exist",
    })
  }  
  return res.json(song)
})

songRouter.post("/", async (req, res) => {
  const { title, artist } = req.body
  const artists = await getAllArtists();

  if (
    !title ||
    typeof title !== "string" ||
    !artist ||
    typeof artist !== "string"
  ) {
    return res.status(400).json({
      message: "Title and artist are required",
    })
  }
  const song = await createSong({ title, artist })

  return res.status(201).json(song)
})

songRouter.put("/:id", async (req, res) => {
  const id = req.params.id

  const { title, artist } = req.body
  if (!title || typeof title !== "string" || !artist || typeof artist !== "string") {
    return res.status(400).json({
      message: "New song title and artist are required",
    })
  }

  const song = await updateSong(id, { title, artist })
  if (!song) {
    return res.status(404).json({
      message: "Song does not exist",
    });
  }
  return res.status(200).json(song)
})

songRouter.delete("/:id", async (req, res) => {
  const id = req.params.id

  const deleted = await deleteSong(id)
  if (!deleted) {
    return res.status(404).json({
      message: "Song does not exist",
    });
  }

  return res.status(204).json()
})

export default songRouter
