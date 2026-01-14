/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in .env.local");
} //check connection is there or not

let cached = (global as any).mongoose; // check for connection in memory

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null }; //store the connection globally as reload doesn't disconnect and also for api use
}

export async function connectDB() {
  if (cached.conn) return cached.conn; // check if connection is there so reuse it

  if (!cached.promise) {
      console.log("connection established");
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => mongoose);
  }// make connection

  cached.conn = await cached.promise;
  return cached.conn;
}
