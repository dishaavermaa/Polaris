import { Router } from "express";
import { getChannelProfile } from "./channel.controller.js";
import { optionalAccess } from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/:username", optionalAccess, getChannelProfile);

export default router;
