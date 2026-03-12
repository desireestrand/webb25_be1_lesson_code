import { Router } from "express";
import User from "../models/User.js";

const authRouter = Router();

authRouter.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "Email, Password and Name i required",
    });
  }

  try {
    const registeredUser = new User({
      name,
      email,
      password,
    });
    await registeredUser.save();
    const userObj = registeredUser.toObject();
    delete userObj.password;
    return res.status(201).json(userObj);
  } catch (err) {
    const emailError = err?.errors?.email?.message;
    const hasPasswordError = err?.errors?.password;
    const duplicateEmail = err?.errorResponse?.code === 11000;

    const response = {
      message: "User was not registered",
    };

    if (emailError) {
      response.email = emailError;
    }
    if (duplicateEmail) {
      response.email = "A user is allready registered to that email";
    }
    if (hasPasswordError) {
      response.password = "Password has to be 6 characters at least";
    }
    console.log("Failed to register user", err);
    return res.status(400).json(response);
  }
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and Password required",
    });
  }

  try {
    const user = await User.findOne({ email: email }).select("+password");

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isSamePassword = await user.isSamePassword(password);

    if (!isSamePassword) {
      throw new Error("Invalid credentials");
    }
    const userObj = user.toObject();
    delete userObj.password;
    return res.json(userObj);
  } catch (err) {
    console.log("error in login", err);
    return res.status(401).json({
      message: "Invalid credentials",
    });
  }
});

export default authRouter;
