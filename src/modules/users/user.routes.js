import { Router } from "express";
import { verifyAccess } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { upload } from "../../middlewares/multer.js";
import {
  changePassword,
  getCurrentUser,
  updateAccount,
  updateAvatar,
  updateCoverImage,
} from "./user.controller.js";
import { changePasswordSchema, updateAccountSchema } from "./user.schema.js";

const router = Router();

router.use(verifyAccess);

router.get("/me", getCurrentUser);
router.patch("/me", validate(updateAccountSchema), updateAccount);
router.patch("/me/password", validate(changePasswordSchema), changePassword);
router.patch("/me/avatar", upload.single("avatar"), updateAvatar);
router.patch("/me/cover-image", upload.single("coverImage"), updateCoverImage);

export default router;
