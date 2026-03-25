import { app } from "./app.js";
import connectDB from "../config/db.js";
import { env } from "../config/env.js";
import { logger } from "../lib/logger.js";

let server;

const shutdown = (signal) => {
  logger.info("Shutdown signal received", { signal });

  if (!server) {
    process.exit(0);
  }

  server.close(() => {
    logger.info("HTTP server closed");
    process.exit(0);
  });
};

try {
  await connectDB();

  server = app.listen(env.PORT, () => {
    logger.info("Server started", {
      port: env.PORT,
      environment: env.NODE_ENV,
    });
  });

  server.on("error", (error) => {
    logger.error("Server error", {
      message: error.message,
    });
    process.exit(1);
  });

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
} catch (error) {
  logger.error("Startup failed", {
    message: error.message,
    stack: error.stack,
  });
  process.exit(1);
}
