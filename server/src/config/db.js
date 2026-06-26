import mongoose from "mongoose";

let cachedConnectionPromise = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (cachedConnectionPromise) {
    await cachedConnectionPromise;
    return mongoose.connection;
  }

  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error("MONGO_URI environment variable is required");
  }

  cachedConnectionPromise = mongoose.connect(mongoUri, {
    bufferCommands: true,
  });

  try {
    await cachedConnectionPromise;
    console.log("MongoDB Connected Successfully");
    return mongoose.connection;
  } catch (error) {
    cachedConnectionPromise = null;
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
};

export default connectDB;