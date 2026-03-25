import { Router } from "express";
import { imageUpload, videoCreationUpload } from "../../middlewares/multer.js";
import { optionalAccess, verifyAccess } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  createVideo,
  deleteVideo,
  getVideoById,
  listVideos,
  updateVideo,
} from "./video.controller.js";
import {
  createVideoSchema,
  listVideosSchema,
  updateVideoSchema,
} from "./video.schema.js";

const router = Router();

router.get("/", validate(listVideosSchema), listVideos);
router.get("/:videoId", optionalAccess, getVideoById);

router.post(
  "/",
  verifyAccess,
  videoCreationUpload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "videoFile", maxCount: 1 },
  ]),
  validate(createVideoSchema),
  createVideo
);

router.patch(
  "/:videoId",
  verifyAccess,
  imageUpload.single("thumbnail"),
  validate(updateVideoSchema),
  updateVideo
);

router.delete("/:videoId", verifyAccess, deleteVideo);

export default router;
