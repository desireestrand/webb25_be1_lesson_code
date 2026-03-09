import { Router } from "express"
import { getAllAlbums, getAlbumByid, createAlbum, updateAlbum, deleteAlbum } from "../db/albums.js"
const albumRouter = Router()

albumRouter.get("/", async (req, res) => {
  const { q } = req.query
  const albums = await getAllAlbums(q)
  return res.json(albums)
})

albumRouter.get("/:id", async (req, res) => {   
  const { id } = req.params
  const album = await getAlbumByid(id)
  return res.json(album)
})

albumRouter.post("/", async (req, res) => {
    const { title, artist, releaseDate } = req.body
    const hasTitle = title && typeof title === "string"
    const hasArtist = artist && typeof artist === "string"
    const hasReleaseDate = releaseDate && typeof releaseDate === "string"
    if (!hasTitle || !hasArtist || !hasReleaseDate) {
        return res.status(400).json({
            message: "Title, artist and release date are required",
        })
    }
    const album = await createAlbum({
      title,
      artist,
      releaseDate,
  })
  return res.json(album)
})

albumRouter.put("/:id", async (req, res) => {
  const { id } = req.params
    const { title, artist, releaseDate } = req.body
    const hasTitle = title && typeof title === "string"
    const hasArtist = artist && typeof artist === "string"
    const hasReleaseDate = releaseDate && typeof releaseDate === "string"
    if (!hasTitle || !hasArtist || !hasReleaseDate) {
        return res.status(400).json({
            message: "Either title, artist or release date are required",
        })
    }
  const album = await updateAlbum(id, {
    title,
    artist,
    releaseDate,
  })
  return res.json(album)
})

albumRouter.delete("/:id", async (req, res) => {
  const { id } = req.params
    const album = await deleteAlbum(id)
    if (!album) {
        return res.status(404).json({
            message: "Album does not exist",
        })
    }
    return res.status(204).json()
})


export default albumRouter;