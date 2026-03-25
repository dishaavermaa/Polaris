import { asyncHandler } from "../../lib/asyncHandler.js";
import { ApiResponse } from "../../lib/ApiResponse.js";
import { channelService } from "./channel.service.js";

export const getChannelProfile = asyncHandler(async (req, res) => {
  const channel = await channelService.getChannelProfile(
    req.params.username?.trim().toLowerCase(),
    req.user?._id
  );

  return res.status(200).json(new ApiResponse(200, channel, "Channel fetched successfully"));
});
