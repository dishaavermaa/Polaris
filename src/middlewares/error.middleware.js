import { ApiError } from "../lib/ApiError.js";
import { env } from "../config/env.js";
import { logger } from "../lib/logger.js";

export const notFoundHandler = (req, _res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

export const errorHandler = (err, req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  logger.error("Request failed", {
    statusCode,
    message,
    requestId: req.id,
    method: req.method,
    path: req.originalUrl,
    stack: env.NODE_ENV === "production" ? undefined : err.stack,
  });

  res.status(statusCode).json({
    success: false,
    message,
    errors: err instanceof ApiError ? err.errors : [],
    requestId: req.id,
  });
};
