import mongoose from "mongoose";

const artistSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, unique: true },
  slug: {type: String, required: false, trim: true, unique: true}
}, { timestamps: true });

// Add text index for name field for full-text search
artistSchema.index({ name: "text" });

const Artist = mongoose.model("Artist", artistSchema);

export default Artist;