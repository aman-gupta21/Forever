import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import "dotenv/config";

const connectDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error("MONGODB_URI is not configured");
    }

    await mongoose.connect(mongoUri);
    console.log("MongoDB connected successfully");
    return;
  } catch (error) {
    console.warn("Primary MongoDB connection failed, falling back to local in-memory MongoDB:", error.message);
  }

  try {
    const mongoMemoryServer = await MongoMemoryServer.create();
    const mongoUri = mongoMemoryServer.getUri();

    await mongoose.connect(mongoUri);
    console.log("MongoDB connected successfully using in-memory fallback");
  } catch (fallbackError) {
    console.error("MongoDB connection error:", fallbackError.message);
    process.exit(1);
  }
};

export default connectDatabase;