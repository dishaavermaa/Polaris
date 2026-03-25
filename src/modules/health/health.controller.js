import mongoose from "mongoose";
import { ApiResponse } from "../../lib/ApiResponse.js";

export const live = (_req, res) => {
  res.status(200).json(new ApiResponse(200, { status: "ok" }, "Service is live"));
};

export const ready = (_req, res) => {
  const isReady = mongoose.connection.readyState === 1;

  res
    .status(isReady ? 200 : 503)
    .json(
      new ApiResponse(
        isReady ? 200 : 503,
        { status: isReady ? "ready" : "degraded" },
        isReady ? "Service is ready" : "Database is not connected"
      )
    );
};
