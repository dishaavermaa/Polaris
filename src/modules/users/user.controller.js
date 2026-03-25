import { asyncHandler } from "../../lib/asyncHandler.js";
import { ApiError } from "../../lib/ApiError.js";
import { ApiResponse } from "../../lib/ApiResponse.js";
import { userService } from "./user.service.js";
import { uploadFileToCloudinary } from "../../infrastructure/storage/cloudinary.storage.js";

export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await userService.getCurrentUser(req.user._id);

  return res.status(200).json(new ApiResponse(200, user, "Current user fetched successfully"));
});

export const updateAccount = asyncHandler(async (req, res) => {
  const user = await userService.updateAccountDetails(req.user._id, req.validated.body);

  return res.status(200).json(new ApiResponse(200, user, "Account details updated successfully"));
});

export const changePassword = asyncHandler(async (req, res) => {
  await userService.changePassword(req.user._id, req.validated.body);

  return res.status(200).json(new ApiResponse(200, {}, "Password changed successfully"));
});

export const updateAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing");
  }

  const avatar = await uploadFileToCloudinary(avatarLocalPath);

  if (!avatar?.url) {
    throw new ApiError(400, "Error while uploading avatar");
  }

  const user = await userService.updateAvatar(req.user._id, avatar.url);

  return res.status(200).json(new ApiResponse(200, user, "Avatar updated successfully"));
});

export const updateCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path;

  if (!coverImageLocalPath) {
    throw new ApiError(400, "Cover image file is missing");
  }

  const coverImage = await uploadFileToCloudinary(coverImageLocalPath);

  if (!coverImage?.url) {
    throw new ApiError(400, "Error while uploading cover image");
  }

  const user = await userService.updateCoverImage(req.user._id, coverImage.url);

  return res.status(200).json(new ApiResponse(200, user, "Cover image updated successfully"));
});
