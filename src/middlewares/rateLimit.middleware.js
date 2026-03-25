import rateLimit from "express-rate-limit";
import { env } from "../config/env.js";

const buildLimiter = (options) =>
  rateLimit({
    standardHeaders: true,
    legacyHeaders: false,
    ...options,
  });

export const apiRateLimiter = buildLimiter({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  limit: env.RATE_LIMIT_MAX_REQUESTS,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});

export const authRateLimiter = buildLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  message: {
    success: false,
    message: "Too many authentication attempts, please try again later.",
  },
});
