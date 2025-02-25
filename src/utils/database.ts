import mongoose from "mongoose";
import { DATABASE_URL } from "./env";

// Database Connection

const connect = async () => {
  try {
    await mongoose.connect(DATABASE_URL, {
      dbName: "db-tixly",
    });
    return Promise.resolve("Database Connected");
  } catch (error) {
    return Promise.reject(error);
  }
};

export default connect;