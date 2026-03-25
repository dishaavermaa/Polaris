import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./routes.js";
import { corsOptions } from "../config/cors.js";
import { requestContextMiddleware } from "../middlewares/requestContext.middleware.js";
import { errorHandler, notFoundHandler } from "../middlewares/error.middleware.js";
import { logger } from "../lib/logger.js";

const app = express();

app.disable("x-powered-by");

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

app.use(requestContextMiddleware);
app.use(cors(corsOptions));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.use((req, _res, next) => {
  logger.info("Incoming request", {
    requestId: req.id,
    method: req.method,
    path: req.originalUrl,
  });
  next();
});

app.use(routes);
app.use(notFoundHandler);
app.use(errorHandler);

export { app };
