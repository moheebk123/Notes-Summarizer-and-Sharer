import mongoose from "mongoose";
import { constants } from "node:fs/promises";

const MONGODB_URI = process.env.MONGODB_URI!;
const MONGODB_DATABASE_NAME = process.env.MONGODB_DATABASE_NAME!;

const cached: {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
} = (global as any).mongoose || { conn: null, promise: null };


export async function dbConnect() {
  if (cached.conn) return cached.conn;
  if (!cached.promise)
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: MONGODB_DATABASE_NAME,
      })
      .then((m) => m);
  cached.conn = await cached.promise;
  return cached.conn;
}

const SummarySchema = new mongoose.Schema(
  {
    prompt: String,
    transcript: String,
    summary: String,
  },
  { timestamps: true }
);

export const Summary =
  mongoose.models.Summary || mongoose.model("Summary", SummarySchema);
