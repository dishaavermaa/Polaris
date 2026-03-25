import { Router } from "express";
import { verifyAccess } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { createReaction, deleteReaction } from "./reaction.controller.js";
import { reactionTargetSchema } from "./reaction.schema.js";

const router = Router();

router.use(verifyAccess);

router.post("/:targetType/:targetId", validate(reactionTargetSchema), createReaction);
router.delete("/:targetType/:targetId", validate(reactionTargetSchema), deleteReaction);

export default router;
