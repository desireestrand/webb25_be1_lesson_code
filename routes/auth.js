import { Router } from "express";
import { verifyAccessToken, verifyRefreshToken } from "../utils/tokens.js";
import { getUserById, registerUser, loginUser, refreshAccessToken } from "../db/auth.js";

const authRouter = Router();

authRouter.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "Email, Password and Name i required",
    });
  }

  try {
    const { user, accessToken, refreshToken } = await registerUser(name, email, password);

    return res.status(201).json({
      user,
      accessToken,
      refreshToken
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
    const { user, accessToken, refreshToken } = await loginUser(email, password);

    return res.json({
      user,
      accessToken,
      refreshToken
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

    const user = await getUserById(userId)
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
    const { accessToken } = await refreshAccessToken(refreshToken)
    return res.json({
      accessToken
    })
  } catch (err) {
    return res.status(401).json({
      message: "Unauthorized"
    })
  }
})
export default authRouter;
