import { asyncHandler } from "../../lib/asyncHandler.js";
import { ApiResponse } from "../../lib/ApiResponse.js";
import { subscriptionService } from "./subscription.service.js";

export const subscribeToChannel = asyncHandler(async (req, res) => {
  const result = await subscriptionService.subscribe(
    req.user._id,
    req.validated.params.channelId
  );

  return res
    .status(201)
    .json(new ApiResponse(201, result, "Subscribed to channel successfully"));
});

export const unsubscribeFromChannel = asyncHandler(async (req, res) => {
  await subscriptionService.unsubscribe(req.user._id, req.validated.params.channelId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Unsubscribed from channel successfully"));
});

export const listMySubscriptions = asyncHandler(async (req, res) => {
  const result = await subscriptionService.listMySubscriptions(
    req.user._id,
    req.validated.query
  );

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Subscriptions fetched successfully"));
});
