import { Router } from "express";
import { apiReference } from "@scalar/express-api-reference";
import { openApiDocument } from "../../config/openapi.js";

const router = Router();

router.get("/openapi.json", (_req, res) => {
  res.status(200).json(openApiDocument);
});

router.use(
  "/docs",
  apiReference({
    url: "/openapi.json",
    theme: "moon",
    layout: "modern",
    defaultHttpClient: {
      targetKey: "js",
      clientKey: "fetch",
    },
  })
);

export default router;
