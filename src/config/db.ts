import mongoose from "mongoose";
import { ENV } from "./env";

declare global {
  // eslint-disable-next-line no-var
  var mongooseConnection: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } | undefined;
}

export async function connectDB(): Promise<void> {
  if (global.mongooseConnection && global.mongooseConnection.conn) {
    return;
  }

  if (!global.mongooseConnection) {
    global.mongooseConnection = { conn: null, promise: null };
  }

  if (!global.mongooseConnection.promise) {
    global.mongooseConnection.promise = mongoose
      .connect(ENV.MONGO_URI)
      .then((m) => {
        global.mongooseConnection!.conn = mongoose;
        return mongoose;
      })
      .catch((err) => {
        console.error("MongoDB connection failed:", err);
        throw err;
      });
  }

  await global.mongooseConnection.promise;
  console.log("MongoDB connected");
}