// types.d.ts is a file that is used to tell typescript about the types of the global variables
import { Connection } from "mongoose";
/* eslint-disable no-var */
declare global {
  // mongoose is a global variable
  // we are telling typescript that mongoose is an object and it has a connection property and it has a promise property
  // in this global object that it will get a connection
  // in this connection there are 2 thing either it will be connected or it will be connecting (promise)
  var mongoose: {
    // connection is a property of mongoose and it is special type of string
    conn: Connection | null;
    // promise is a property of mongoose and it is a promise that will resolve to a type of mongoose
    // promise type is either a connection (from mongoose) or null
    promise: Promise<Connection> | null;
    // The promise will start connecting to MongoDB.
    // While waiting, we don't block other code.
    // When the connection is ready, the promise is resolved, and we can use it.
    // If there is an error, the promise is rejected, and we handle
  };
}
export {};
