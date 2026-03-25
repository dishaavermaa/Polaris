import { env } from "./env.js";
import { ApiError } from "../lib/ApiError.js";

export const corsOptions = {
  origin(origin, callback) {
    if (!origin || env.CORS_ORIGINS.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new ApiError(403, "CORS origin not allowed"));
  },
  credentials: true,
};
