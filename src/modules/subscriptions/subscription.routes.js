import { Router } from "express";
import { verifyAccess } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  listMySubscriptions,
  subscribeToChannel,
  unsubscribeFromChannel,
} from "./subscription.controller.js";
import {
  channelIdParamSchema,
  listSubscriptionsSchema,
} from "./subscription.schema.js";

const router = Router();

router.use(verifyAccess);

router.get("/me", validate(listSubscriptionsSchema), listMySubscriptions);
router.post("/channels/:channelId", validate(channelIdParamSchema), subscribeToChannel);
router.delete(
  "/channels/:channelId",
  validate(channelIdParamSchema),
  unsubscribeFromChannel
);

export default router;
