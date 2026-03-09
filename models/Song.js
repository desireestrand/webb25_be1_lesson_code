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
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Add text index for title and artist fields for full-text search
songSchema.index({ title: "text" });

const Song = mongoose.model("Song", songSchema);

export default Song;
