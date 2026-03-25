import { asyncHandler } from "../../lib/asyncHandler.js";
import { ApiResponse } from "../../lib/ApiResponse.js";
import { reactionService } from "./reaction.service.js";

export const createReaction = asyncHandler(async (req, res) => {
  const reaction = await reactionService.react({
    userId: req.user._id,
    targetType: req.validated.params.targetType,
    targetId: req.validated.params.targetId,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, reaction, "Reaction created successfully"));
});

export const deleteReaction = asyncHandler(async (req, res) => {
  await reactionService.removeReaction({
    userId: req.user._id,
    targetType: req.validated.params.targetType,
    targetId: req.validated.params.targetId,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Reaction removed successfully"));
});
