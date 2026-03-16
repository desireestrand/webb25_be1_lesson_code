import User from "../models/User.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/tokens.js";

function _generateTokens(userId) {
    const accessToken = generateAccessToken(userId)
    const refreshToken = generateRefreshToken(userId)
    return { accessToken, refreshToken };
}

function _getUserObject(user) {
    const userObject = user.toObject();
    delete userObject.password;
    return userObject;
}

export async function registerUser(name, email, password) {
    const newUser = new User({ name, email, password });
    await newUser.save();
    const { accessToken, refreshToken } = _generateTokens(newUser.id)

    const userObject = _getUserObject(newUser);

    return { user: userObject, accessToken, refreshToken };
}

export async function loginUser(email, password) {
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

    if (!user) {
        throw new Error("Invalid credentials");
    }

    const isSamePassword = await user.isSamePassword(password);

    if (!isSamePassword) {
        throw new Error("Invalid credentials");
    }
    const { accessToken, refreshToken } = _generateTokens(user.id)

    const userObject = _getUserObject(user);

    return { user: userObject, accessToken, refreshToken };
}


export async function getUserById(id) {
    const user = await User.findById(id);
    if (!user) {
        throw new Error("User not found");
    }
    return _getUserObject(user);
}

export async function refreshAccessToken(refreshToken) {
    const decodedToken = verifyRefreshToken(refreshToken)
    const userId = decodedToken?.userId
    if (!userId) {
        throw new Error("Invalid refresh token");
    }

    const user = await getUserById(userId)
    if (!user) {
        throw new Error("User not found");
    }
    const accessToken = generateAccessToken(userId)
    return { accessToken };
}