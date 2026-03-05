import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/";

export async function connectToDb(dbName) {
  if (mongoose.connection.readyState === 1) return;
  try {
    // Avoid double slash when MONGODB_URI already ends with /
    const uri = MONGODB_URI.endsWith("/") ? `${MONGODB_URI}${dbName}` : `${MONGODB_URI}/${dbName}`;
    await mongoose.connect(uri);
    console.info(`Connected to ${dbName} database`);
  } catch (err) {
    console.error("Error connecting to database", err);
  }
}

export async function disconnectFromDb() {
  if (mongoose.connection.readyState === 0) return;
  try {
    await mongoose.disconnect();
    console.info("Disconnected from database");
  } catch (err) {
    console.error("Error disconnecting from database", err);
  }
}