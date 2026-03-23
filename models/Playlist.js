import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: false, default: "" },
    songs: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Song",
      },
    ],
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      required: false,
      ref: "User"
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

playlistSchema.virtual("length").get(function() {
    const isPopulated = this.songs.some(song => song.length)
    if(!isPopulated) return 0
    return this.songs.reduce((acc, current = 0) => acc + (current?.length || 0), 0)
});

const Playlist = mongoose.model("Playlist", playlistSchema);

export default Playlist;
