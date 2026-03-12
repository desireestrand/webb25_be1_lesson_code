import mongoose from "mongoose";

const songSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    artist: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Artist",
      required: true,
    },
    album: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Album",
      required: false,
    },
    length: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Add text index for title and artist fields for full-text search
songSchema.index({ title: "text" });

songSchema.pre("save", async function (next) {
  console.log("Saving song checking album", this.album)
  if (!this.isModified("album") || !this.album) return next

  const Album = mongoose.model("Album")
  const album = await Album.findById(this.album)

  console.log("Checking if album is has the same artist", album)

  if (!album) {
    throw new Error("Album does not exist")
  }

  console.log(this.artist, album.artist, this.artist.equals(album.artist))

  if (!this.artist.equals(album.artist)) {
    throw new Error("Album does not match the artists")
  }

  return next
})

const Song = mongoose.model("Song", songSchema);

export default Song;
