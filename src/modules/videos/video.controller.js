import { asyncHandler } from "../../lib/asyncHandler.js";
import { ApiError } from "../../lib/ApiError.js";
import { ApiResponse } from "../../lib/ApiResponse.js";
import { uploadFileToCloudinary } from "../../infrastructure/storage/cloudinary.storage.js";
import { videoService } from "./video.service.js";

export const createVideo = asyncHandler(async (req, res) => {
  const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;
  const videoLocalPath = req.files?.videoFile?.[0]?.path;

  if (!thumbnailLocalPath) {
    throw new ApiError(400, "Thumbnail file is required");
  }

  if (!videoLocalPath) {
    throw new ApiError(400, "Video file is required");
  }

  const [thumbnailUpload, videoUpload] = await Promise.all([
    uploadFileToCloudinary(thumbnailLocalPath),
    uploadFileToCloudinary(videoLocalPath),
  ]);

  if (!thumbnailUpload?.url) {
    throw new ApiError(400, "Thumbnail upload failed");
  }

  if (!videoUpload?.url) {
    throw new ApiError(400, "Video upload failed");
  }

  const video = await videoService.createVideo(req.user._id, {
    ...req.validated.body,
    thumbnail: thumbnailUpload.url,
    videoFile: videoUpload.url,
    duration: videoUpload.duration || 0,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, video, "Video created successfully"));
});

export const listVideos = asyncHandler(async (req, res) => {
  const result = await videoService.listVideos(req.validated.query);

  return res.status(200).json(new ApiResponse(200, result, "Videos fetched successfully"));
});

export const getVideoById = asyncHandler(async (req, res) => {
  const video = await videoService.getVideoById(req.params.videoId, req.user?._id);

  return res.status(200).json(new ApiResponse(200, video, "Video fetched successfully"));
});

export const updateVideo = asyncHandler(async (req, res) => {
  const thumbnailLocalPath = req.file?.path;
  let thumbnailUrl;

  if (thumbnailLocalPath) {
    const thumbnailUpload = await uploadFileToCloudinary(thumbnailLocalPath);

    if (!thumbnailUpload?.url) {
      throw new ApiError(400, "Thumbnail upload failed");
    }

    thumbnailUrl = thumbnailUpload.url;
  }

  const video = await videoService.updateVideo(req.params.videoId, req.user._id, {
    ...req.validated.body,
    thumbnail: thumbnailUrl,
  });

  return res.status(200).json(new ApiResponse(200, video, "Video updated successfully"));
});

export const deleteVideo = asyncHandler(async (req, res) => {
  await videoService.deleteVideo(req.params.videoId, req.user._id);

  return res.status(200).json(new ApiResponse(200, {}, "Video deleted successfully"));
});
