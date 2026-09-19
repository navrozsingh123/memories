import mongoose from "mongoose";

// A serverless function is frozen and thawed rather than restarted, so the
// connection (and any in-flight attempt) is cached on globalThis and reused
// across invocations. Without this every request opens its own pool and the
// Atlas connection limit is reached quickly.
const cache = (globalThis._mongoose ??= { conn: null, promise: null });

const connectDB = async () => {
  if (cache.conn) return cache.conn;

  if (!cache.promise) {
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI is not set");

    cache.promise = mongoose.connect(process.env.MONGO_URI, {
      // Fail fast instead of queueing operations against a dead connection.
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
    });
  }

  try {
    cache.conn = await cache.promise;
  } catch (error) {
    // Clear the failed attempt so the next request retries rather than
    // resolving the same rejected promise forever.
    cache.promise = null;
    throw error;
  }

  return cache.conn;
};

export default connectDB;
