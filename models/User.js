import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate: {
            validator: function(v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: props => `${props.value} is not a valid email address!`
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 6,
        select: false
    }
}, {
    timestamps: true
});

userSchema.pre("save", async function() {
    if(!this.isModified("password")) return

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(this.password, salt)
    console.log("Password: ", this.password)
    console.log("Hashed password: ", hashedPassword)
    const isSame = await bcrypt.compare(this.password, hashedPassword)
    console.log("is same", isSame)
    const isNotSame = await bcrypt.compare(this.password.toUpperCase(), hashedPassword)
    console.log("is not same", isNotSame)

    this.password = hashedPassword

})

const User = mongoose.model("User", userSchema)

export default User