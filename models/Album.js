import mongoose from "mongoose";

const albumSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  artist: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Artist",
    required: true,
    },
  releaseDate: { type: Date, required: true },
}, { timestamps: true });

albumSchema.pre("deleteOne", 
  {document: true}, 
  async function (doc) {
    console.log("DOcument",doc)
})

const Album = mongoose.model("Album", albumSchema);

export default Album;