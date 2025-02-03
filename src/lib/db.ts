// src\lib\db.ts
import mongoose from "mongoose";
// ! is used to tell typescript that the variable is not null
const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined");
}
// we use global to cache the mongoose connection
// Here, we check if there is already a stored database connection inside global.mongoose.
// This means "Hey, is there an existing connection? If yes, we can reuse it."
let cached = global.mongoose;
// If we don't use global.mongoose, every time the code runs, a new database connection will be created.
// In a serverless environment (like Next.js API routes), the code runs multiple times, and without a cache,
//  it will create multiple connections, which is bad

// we use global caching. This means we store the database connection in a global
//  variable so that even if the server restarts, we can reuse the existing connection
// instead of making a new one every time.

if (!cached) {
  // if there is no cached connection, we create a new one
  // we are telling typescript that the global.mongoose is an object and it has a conn property and a promise property
  // and both of them are null (we are keeping null as a default value)
  cached = global.mongoose = { conn: null, promise: null };
}

export const connectToDatabase = async () => {
  // if there is a cached connection, we return it
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    // If cached.promise is null (meaning we haven’t started connecting yet), we create a new promise.
    // The mongoose.connect() function starts connecting to MongoDB, but it doesn’t finish immediately.
    // Instead, it returns a Promise, which we store in cached.promise.

    const opts = {
      // buffercommands is a property of mongoose and it is a boolean
      // buffercommands is used to tell mongoose to buffer the commands if the connection is not ready
      // bufferCommands is like a waiting list at a restaurant.
      // Instead of turning people away when all tables are full (false), you let them wait in line (true)
      bufferCommands: true,
      // maxPoolSize is a property of mongoose and it is a number
      // maxPoolSize is used to tell mongoose to keep a maximum of 10 connections in the pool
      // maxPoolSize is like having 10 phone lines at a call center. You can handle 10 calls simultaneously,
      // and any additional callers wait until a line becomes free
      maxPoolSize: 10,
    };
    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then(() => mongoose.connection);
    // What Does .then(() => mongoose.connection) Do?
    // This waits until mongoose.connect() successfully connects.
    // Once connected, it resolves the promise with mongoose.connection, 
    // which contains the actual database connection.
    // .then(() => mongoose.connection) ensures we use the database only after it's ready

  }
  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
  return cached.conn;
};
