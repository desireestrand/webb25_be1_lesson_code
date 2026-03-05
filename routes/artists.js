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
<<<<<<< HEAD
  const artists = await getAllArtists();
  return res.json(artists);
=======
  const { q } = req.query
  const artists = await getAllArtists(q)
  return res.json(artists)
>>>>>>> e90afd6424b75417b5a0ba96ae0820fc44e8756b
})

artistRouter.get("/:id", async (req, res) => {
  const id = req.params.id
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

artistRouter.put("/:id", async (req, res) => {
  const id = req.params.id
  const { name } = req.body
  if (!name || typeof name !== "string") {
    return res.status(400).json({
      message: "New artist name is required",
    })
  }
  const updatedArtist = await updateArtist(id, { name })
  if (!updatedArtist) {
    return res.status(404).json({
      message: "Artist does not exist",
    })
  }

  return res.status(200).json(updatedArtist)
})

artistRouter.delete("/:id", async (req, res) => {
  const id = req.params.id

  const deleted = await deleteArtist(id)

  if (!deleted) {
    return res.status(404).json({
      message: "Artist was not deleted or found",
    })
  }

  return res.status(204).json()
})

export default artistRouter
