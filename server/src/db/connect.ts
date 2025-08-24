import mongoose from "mongoose";
import { env } from "../config/env";
import { logger } from "../config/logger";

export async function connectDB() {
  try {
    await mongoose.connect(env().MONGO_URI, {
      dbName: "interviewpilot",
    });
    logger.info("✅ Connected to MongoDB");
  } catch (err) {
    logger.error("MongoDB connection error", err);
    process.exit(1); // exit process if DB fails
  }
}
