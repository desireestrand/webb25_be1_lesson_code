import mongoose from "mongoose";

const artistSchema = new  mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    }
}, {
    timestamps: true
})

const Artist = mongoose.model("Artist", artistSchema)

export default Artist