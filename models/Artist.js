import mongoose from "mongoose";
import slugify from "slugify";

const artistSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, unique: true },
  slug: {type: String, required: false, trim: true, unique: true}
}, { timestamps: true });

// Add text index for name field for full-text search
artistSchema.index({ name: "text" });

artistSchema.pre("save", function(next) {
  if(this.isModified("name")) {
    this.slug = slugify(this.name, {
      lower: true
    })
  }
  return next
})

const Artist = mongoose.model("Artist", artistSchema);

export default Artist;