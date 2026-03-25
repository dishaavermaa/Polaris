import mongoose from "mongoose";
import { ApiError } from "../../lib/ApiError.js";
import { commentRepository } from "./comment.repository.js";
import { videoRepository } from "../videos/video.repository.js";

const ensureValidObjectId = (value, fieldName) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw new ApiError(400, `${fieldName} is invalid`);
  }
};

const getVisibleVideoOrThrow = async (videoId, viewerId) => {
  const video = await videoRepository.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  const isOwner = viewerId && video.owner?._id?.toString() === viewerId.toString();
  const isVisible = video.status === "published";

  if (!isOwner && !isVisible) {
    throw new ApiError(404, "Video not found");
  }

  return video;
};

export const commentService = {
  async createComment({ videoId, authorId, content, parentCommentId }) {
    ensureValidObjectId(videoId, "Video ID");
    await getVisibleVideoOrThrow(videoId, authorId);

    let validatedParentCommentId = null;

    if (parentCommentId) {
      ensureValidObjectId(parentCommentId, "Parent comment ID");

      const parentComment = await commentRepository.findById(parentCommentId);

      if (!parentComment || parentComment.videoId.toString() !== videoId.toString()) {
        throw new ApiError(404, "Parent comment not found");
      }

      validatedParentCommentId = parentCommentId;
    }

    const comment = await commentRepository.create({
      videoId,
      authorId,
      parentCommentId: validatedParentCommentId,
      content,
    });

    await videoRepository.incrementCommentsCount(videoId, 1);

    if (validatedParentCommentId) {
      await commentRepository.incrementReplyCount(validatedParentCommentId, 1);
    }

    return commentRepository.findById(comment._id);
  },

  async listComments({ videoId, parentCommentId, page, limit }, viewerId) {
    ensureValidObjectId(videoId, "Video ID");
    await getVisibleVideoOrThrow(videoId, viewerId);

    let validatedParentCommentId = null;

    if (parentCommentId) {
      ensureValidObjectId(parentCommentId, "Parent comment ID");
      const parentComment = await commentRepository.findById(parentCommentId);

      if (!parentComment || parentComment.videoId.toString() !== videoId.toString()) {
        throw new ApiError(404, "Parent comment not found");
      }

      validatedParentCommentId = parentCommentId;
    }

    const [items, totalItems] = await Promise.all([
      commentRepository.listByVideoId(videoId, validatedParentCommentId, { page, limit }),
      commentRepository.countByVideoId(videoId, validatedParentCommentId),
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit) || 1,
      },
    };
  },

  async updateComment(commentId, authorId, content) {
    ensureValidObjectId(commentId, "Comment ID");

    const comment = await commentRepository.updateOwned(commentId, authorId, {
      $set: {
        content,
      },
    });

    if (!comment) {
      throw new ApiError(404, "Comment not found");
    }

    return comment;
  },

  async deleteComment(commentId, authorId) {
    ensureValidObjectId(commentId, "Comment ID");

    const comment = await commentRepository.findOwnedById(commentId, authorId);

    if (!comment) {
      throw new ApiError(404, "Comment not found");
    }

    if (comment.replyCount > 0) {
      throw new ApiError(400, "Delete replies before deleting this comment");
    }

    await commentRepository.deleteOwned(commentId, authorId);
    await videoRepository.incrementCommentsCount(comment.videoId, -1);

    if (comment.parentCommentId) {
      await commentRepository.incrementReplyCount(comment.parentCommentId, -1);
    }
  },
};
