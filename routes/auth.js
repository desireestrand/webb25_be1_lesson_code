import { Router } from "express";
import User from "../models/User.js";
import { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken } from "../utils/tokens.js";

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

    const accessToken = generateAccessToken(registeredUser.id)
    const refreshToken = generateRefreshToken(registeredUser.id)

    return res.status(201).json({
      accessToken: accessToken,
      refreshToken: refreshToken,
      user: userObj
    });
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
    const accessToken = generateAccessToken(user.id)
    const refreshToken = generateRefreshToken(user.id)
    const userObj = user.toObject();
    delete userObj.password;
    return res.json({
      accessToken: accessToken,
      refreshToken: refreshToken,
      user: userObj
    });
  } catch (err) {
    console.log("error in login", err);
    return res.status(401).json({
      message: "Invalid credentials",
    });
  }
});

authRouter.get("/me", async (req, res) => {

  let userId = null;
  try {

    const header = req.headers?.authorization;
    if(!header) {
      throw new Error()
    }
    const token = header.split(" ")?.[1]
    if(!token) {
      throw new Error()
    }
    
    const decodedToken = verifyAccessToken(token)
    console.log(decodedToken)
    userId = decodedToken?.userId

    if(!userId) {
      throw new Error()
    }

  } catch (err) {
    console.log(err.message)
    if(err?.message?.includes("expired")) {
      return res.status(401).json({
      message: "Unauthorized - Expired"
    })
    }
    return res.status(401).json({
      message: "Unauthorized"
    })
  }

  try {

    const user = await User.findById(userId)
    if(!user) {
      throw new Error()
    }
    return res.json(user)
  } catch (err) {
    return res.status(401).json({
      message: "Unauthorized"
    })
  }
})

authRouter.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({
      message: "Refresh token is required"
    })
  }
  try {
    const decodedToken = verifyRefreshToken(refreshToken)
    const userId = decodedToken?.userId
    if (!userId) {
      throw new Error()
    }
    const accessToken = generateAccessToken(userId)
    return res.json({
      access: accessToken
    })
  } catch (err) {
    return res.status(401).json({
      message: "Unauthorized"
    })
  }
})
export default authRouter;
