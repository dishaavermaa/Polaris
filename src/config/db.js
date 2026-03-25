import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import { env } from "./env.js";
import { logger } from "../lib/logger.js";

const connectDB = async () => {
  const connection = await mongoose.connect(`${env.MONGODB_URI}/${DB_NAME}`, {
    serverSelectionTimeoutMS: 10000,
  });

  logger.info("MongoDB connected", {
    host: connection.connection.host,
    database: connection.connection.name,
  });

  return connection;
};

export default connectDB;
