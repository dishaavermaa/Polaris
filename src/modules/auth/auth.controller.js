import { asyncHandler } from "../../lib/asyncHandler.js";
import { ApiResponse } from "../../lib/ApiResponse.js";
import { ApiError } from "../../lib/ApiError.js";
import { uploadFileToCloudinary } from "../../infrastructure/storage/cloudinary.storage.js";
import { authService } from "./auth.service.js";
import { authCookieOptions, clearAuthCookieOptions } from "../../utils/cookies.js";

export const register = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadFileToCloudinary(avatarLocalPath);
  const coverImage = await uploadFileToCloudinary(coverImageLocalPath);

  if (!avatar?.url) {
    throw new ApiError(400, "Avatar upload failed");
  }

  const result = await authService.register(
    {
      ...req.validated.body,
      avatarUrl: avatar.url,
      coverImageUrl: coverImage?.url || "",
    },
    req
  );

  return res
    .status(201)
    .cookie("accessToken", result.accessToken, authCookieOptions)
    .cookie("refreshToken", result.refreshToken, authCookieOptions)
    .json(
      new ApiResponse(
        201,
        {
          user: result.user,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        },
        "User registered successfully"
      )
    );
});

export const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.validated.body, req);

  return res
    .status(200)
    .cookie("accessToken", result.accessToken, authCookieOptions)
    .cookie("refreshToken", result.refreshToken, authCookieOptions)
    .json(
      new ApiResponse(
        200,
        {
          user: result.user,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        },
        "User logged in successfully"
      )
    );
});

export const refresh = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
  const result = await authService.refreshAccessToken(incomingRefreshToken, req);

  return res
    .status(200)
    .cookie("accessToken", result.accessToken, authCookieOptions)
    .cookie("refreshToken", result.refreshToken, authCookieOptions)
    .json(
      new ApiResponse(
        200,
        {
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        },
        "Access token refreshed"
      )
    );
});

export const logout = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
  await authService.logout(incomingRefreshToken);

  return res
    .status(200)
    .clearCookie("accessToken", clearAuthCookieOptions)
    .clearCookie("refreshToken", clearAuthCookieOptions)
    .json(new ApiResponse(200, {}, "User logged out"));
});
