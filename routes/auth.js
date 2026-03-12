import { Router } from "express";
import User from "../models/User.js";

const authRouter = Router()

authRouter.post("/register", async (req, res) => {
    const {
        name,
        email,
        password
    } = req.body

    if(!name || !email || !password) {
        return res.status(400).json({
            message: "Email, Password and Name i required"
        })
    }

    try {
        const registeredUser = new User({
            name,
            email,
            password
        })
        await registeredUser.save()
        return res.status(201).json(registeredUser)
    } catch(err) {
        const emailError = err?.errors?.email?.message
        const hasPasswordError = err?.errors?.password
        const duplicateEmail = err?.errorResponse?.code === 11000

        const response = {
            message: "User was not registered",
        }

        if(emailError) {
            response.email = emailError
        }
        if(duplicateEmail) {
            response.email = "A user is allready registered to that email"
        }
        if(hasPasswordError) {
            response.password = "Password has to be 6 characters at least"
        }
        console.log("Failed to register user", err)
        return res.status(400).json(response)
    }
})

export default authRouter