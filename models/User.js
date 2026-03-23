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
    },
    resetPasswordCode: {
        type: String,
        required: false,
        default: null,
    }
}, {
    timestamps: true
});

userSchema.pre("save", async function() {
    if(!this.isModified("password")) return

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(this.password, salt)
    this.password = hashedPassword
})

userSchema.pre("save", async function() {
    if(!this.isModified("email")) return
    this.email = this.email.toLowerCase()
})

userSchema.methods.isSamePassword = async function (password){
    return await bcrypt.compare(password, this.password)
}

const User = mongoose.model("User", userSchema)

export default User