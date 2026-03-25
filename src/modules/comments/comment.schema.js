import mongoose from "mongoose";

const success = (data) => ({ success: true, data });
const failure = (errors) => ({ success: false, errors });

export const videoIdParamSchema = (req) => {
  const videoId = req.params.videoId?.trim();
  const errors = [];

  if (!videoId) {
    errors.push({ field: "videoId", message: "Video ID is required" });
  }

  if (videoId && !mongoose.Types.ObjectId.isValid(videoId)) {
    errors.push({ field: "videoId", message: "Video ID is invalid" });
  }

  if (errors.length > 0) {
    return failure(errors);
  }

  return success({
    params: {
      videoId,
    },
  });
};

export const commentIdParamSchema = (req) => {
  const commentId = req.params.commentId?.trim();
  const errors = [];

  if (!commentId) {
    errors.push({ field: "commentId", message: "Comment ID is required" });
  }

  if (commentId && !mongoose.Types.ObjectId.isValid(commentId)) {
    errors.push({ field: "commentId", message: "Comment ID is invalid" });
  }

  if (errors.length > 0) {
    return failure(errors);
  }

  return success({
    params: {
      commentId,
    },
  });
};

export const createCommentSchema = (req) => {
  const content = req.body.content?.trim();
  const parentCommentId = req.body.parentCommentId?.trim() || null;
  const errors = [];

  if (!content) {
    errors.push({ field: "content", message: "Content is required" });
  }

  if (parentCommentId && !mongoose.Types.ObjectId.isValid(parentCommentId)) {
    errors.push({ field: "parentCommentId", message: "Parent comment ID is invalid" });
  }

  if (errors.length > 0) {
    return failure(errors);
  }

  return success({
    body: {
      content,
      parentCommentId,
    },
  });
};

export const updateCommentSchema = (req) => {
  const content = req.body.content?.trim();
  const errors = [];

  if (!content) {
    errors.push({ field: "content", message: "Content is required" });
  }

  if (errors.length > 0) {
    return failure(errors);
  }

  return success({
    body: {
      content,
    },
  });
};

export const listCommentsSchema = (req) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);
  const parentCommentId = req.query.parentCommentId?.trim() || null;
  const errors = [];

  if (Number.isNaN(page) || page < 1) {
    errors.push({ field: "page", message: "Page must be a positive number" });
  }

  if (Number.isNaN(limit) || limit < 1 || limit > 50) {
    errors.push({ field: "limit", message: "Limit must be between 1 and 50" });
  }

  if (parentCommentId && !mongoose.Types.ObjectId.isValid(parentCommentId)) {
    errors.push({ field: "parentCommentId", message: "Parent comment ID is invalid" });
  }

  if (errors.length > 0) {
    return failure(errors);
  }

  return success({
    query: {
      page,
      limit,
      parentCommentId,
    },
  });
};
