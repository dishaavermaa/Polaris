import { Router } from "express";
import { optionalAccess, verifyAccess } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  createComment,
  deleteComment,
  listComments,
  updateComment,
} from "./comment.controller.js";
import {
  commentIdParamSchema,
  createCommentSchema,
  listCommentsSchema,
  updateCommentSchema,
  videoIdParamSchema,
} from "./comment.schema.js";

const router = Router();

router.get(
  "/videos/:videoId",
  optionalAccess,
  validate(videoIdParamSchema),
  validate(listCommentsSchema),
  listComments
);

router.post(
  "/videos/:videoId",
  verifyAccess,
  validate(videoIdParamSchema),
  validate(createCommentSchema),
  createComment
);

router.patch(
  "/:commentId",
  verifyAccess,
  validate(commentIdParamSchema),
  validate(updateCommentSchema),
  updateComment
);

router.delete("/:commentId", verifyAccess, validate(commentIdParamSchema), deleteComment);

export default router;
