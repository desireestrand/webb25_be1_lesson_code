import { Router } from "express"
import { getAllPlaylists, getPlaylistByid, createPlaylist, deletePlaylist, addSongToPlaylist, removeSongFromPlaylist } from "../db/playlists.js"
const playlistRouter = Router()

playlistRouter.get("/", async (req, res) => {
  const { q } = req.query
  const playlists = await getAllPlaylists(q)
  return res.json(playlists)
})

playlistRouter.get("/:id", async (req, res) => {   
  const { id } = req.params
  const playlist = await getPlaylistByid(id)
  return res.json(playlist)
})

playlistRouter.post("/", async (req, res) => {
    const { name, songs, description } = req.body
    const hasName = name && typeof name === "string"
    let _songs = songs?.length ? songs : []
    if (!hasName) {
        return res.status(400).json({
            message: "Name is required",
        })
    }
    const playlist = await createPlaylist({
      name,
      description,
      songs: _songs
  })
  return res.json(playlist)
})

playlistRouter.post("/:id/add-song", async (req, res) =>  {
  const {id} = req.params
  const {song} = req.body
   if (!song) {
        return res.status(400).json({
            message: "Song is required",
        })
    }
  const playlist = await addSongToPlaylist(id, song)
  return res.json(playlist)
})

playlistRouter.post("/:id/remove-song", async (req, res) => {
  const {id} = req.params
  const {song} = req.body
   if (!song) {
        return res.status(400).json({
            message: "Song is required",
        })
    }
  await removeSongFromPlaylist(id, song)
  return res.json({
    message: "Song removed"
  })
})

playlistRouter.delete("/:id", async (req, res) => {
  const { id } = req.params
    const playlist = await deletePlaylist(id)
    if (!playlist) {
        return res.status(404).json({
            message: "Playlist does not exist",
        })
    }
    return res.status(204).json()
})


export default playlistRouter;