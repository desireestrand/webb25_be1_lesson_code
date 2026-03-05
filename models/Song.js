import mongoose from "mongoose";

const songSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    artist: { type: "String", required: true, trim: true },
}, { timestamps: true });

// Add text index for title and artist fields for full-text search
songSchema.index({ title: "text", artist: "text" });

const Song = mongoose.model("Song", songSchema);

export default Song;