import { asyncHandler } from "../../lib/asyncHandler.js";
import { ApiResponse } from "../../lib/ApiResponse.js";
import { commentService } from "./comment.service.js";

export const createComment = asyncHandler(async (req, res) => {
  const comment = await commentService.createComment({
    videoId: req.validated.params.videoId,
    authorId: req.user._id,
    content: req.validated.body.content,
    parentCommentId: req.validated.body.parentCommentId,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, comment, "Comment created successfully"));
});

export const listComments = asyncHandler(async (req, res) => {
  const result = await commentService.listComments(
    {
      ...req.validated.params,
      ...req.validated.query,
    },
    req.user?._id
  );

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Comments fetched successfully"));
});

export const updateComment = asyncHandler(async (req, res) => {
  const comment = await commentService.updateComment(
    req.validated.params.commentId,
    req.user._id,
    req.validated.body.content
  );

  return res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment updated successfully"));
});

export const deleteComment = asyncHandler(async (req, res) => {
  await commentService.deleteComment(req.validated.params.commentId, req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Comment deleted successfully"));
});
