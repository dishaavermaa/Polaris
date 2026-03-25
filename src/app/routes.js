import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes.js";
import userRoutes from "../modules/users/user.routes.js";
import channelRoutes from "../modules/channels/channel.routes.js";
import healthRoutes from "../modules/health/health.routes.js";
import videoRoutes from "../modules/videos/video.routes.js";
import subscriptionRoutes from "../modules/subscriptions/subscription.routes.js";
import commentRoutes from "../modules/comments/comment.routes.js";
import reactionRoutes from "../modules/reactions/reaction.routes.js";
import docsRoutes from "../modules/docs/docs.routes.js";

const router = Router();

router.use("/health", healthRoutes);
router.use("/", docsRoutes);
router.use("/api/v1/auth", authRoutes);
router.use("/api/v1/users", userRoutes);
router.use("/api/v1/channels", channelRoutes);
router.use("/api/v1/videos", videoRoutes);
router.use("/api/v1/subscriptions", subscriptionRoutes);
router.use("/api/v1/comments", commentRoutes);
router.use("/api/v1/reactions", reactionRoutes);

export default router;
