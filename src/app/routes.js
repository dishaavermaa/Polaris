import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes.js";
import userRoutes from "../modules/users/user.routes.js";
import channelRoutes from "../modules/channels/channel.routes.js";
import healthRoutes from "../modules/health/health.routes.js";

const router = Router();

router.use("/health", healthRoutes);
router.use("/api/v1/auth", authRoutes);
router.use("/api/v1/users", userRoutes);
router.use("/api/v1/channels", channelRoutes);

export default router;
