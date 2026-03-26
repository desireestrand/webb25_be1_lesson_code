import { Router } from "express"

import {
  getAllSongs,
  getSongByid,
  createSong,
  updateSong,
  deleteSong,
} from "../db/songs.js"
import { requireAdmin, requireAuth } from "../middlewares/auth.js"
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

songRouter.post("/", requireAuth, requireAdmin, async (req, res) => {
  const { title, artist, album } = req.body
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
  const data = { title, artist }
  if (album) data.album = album
  const song = await createSong(data)

  return res.status(201).json(song)
})

songRouter.put("/:id", async (req, res) => {
  const id = req.params.id

  const { title, artist, album } = req.body
  if (
    !title ||
    typeof title !== "string" ||
    !artist ||
    typeof artist !== "string"
  ) {
    return res.status(400).json({
      message: "New song title and artist are required",
    })
  }

  const data = { title, artist }
  if (album !== undefined) data.album = album || null
  const song = await updateSong(id, data)
  if (!song) {
    return res.status(404).json({
      message: "Song does not exist",
    });
  }
  return res.status(200).json(song)
})

songRouter.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
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
