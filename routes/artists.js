import { Router } from "express"
import {
  getAllArtists,
  getArtistByid,
  createArtist,
  updateArtist,
  deleteArtist,
} from "../db/artists.js"
const artistRouter = Router()

artistRouter.get("/", async (req, res) => {
  const artists = await getAllArtists();
  return res.json(artists);
})

artistRouter.get("/:id", async (req, res) => {
  const id = Number(req.params.id)
  if (isNaN(id)) {
    return res.status(400).json({
      message: "Id has to be a valid number",
    })
  }
  const artist = await getArtistByid(id)
  if (!artist) {
    return res.status(404).json({
      message: "Artist does not exist",
    })
  }
  return res.json(artist)
})

artistRouter.post("/", async (req, res) => {
  const { name } = req.body
  if (!name || typeof name !== "string") {
    return res.status(400).json({
      message: "Name is required",
    })
  }
  const artist = await createArtist({ name })

  return res.status(201).json(artist)
})

// Uppgift 1
artistRouter.put("/:id", (req, res) => {
  const id = Number(req.params.id)
  const { name } = req.body
  if (!name || typeof name !== "string") {
    return res.status(400).json({
      message: "New artist name is required",
    })
  }
  const updatedArtist = updateArtist(id, { name })
  if (!updatedArtist) {
    return res.status(404).json({
      message: "Artist does not exist",
    })
  }

  return res.status(200).json(updatedArtist)
})

// UPPGIFT 2
artistRouter.delete("/:id", (req, res) => {
  const id = Number(req.params.id)

  const deleted = deleteArtist(id)

  if (!deleted) {
    return res.status(404).json({
      message: "Artist was not deleted or found",
    })
  }

  return res.status(204).json()
})

export default artistRouter
