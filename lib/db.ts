import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;
const MONGODB_DATABASE_NAME = process.env.MONGODB_DATABASE_NAME!;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = globalThis.mongooseCache || {
  conn: null,
  promise: null,
};

export async function dbConnect() {
  if (cached.conn) return cached.conn;
  if (!cached.promise)
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: MONGODB_DATABASE_NAME,
      })
      .then((m) => m);
  cached.conn = await cached.promise;
  globalThis.mongooseCache = cached;

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
