import mongoose from "mongoose";
import { ApiError } from "../../lib/ApiError.js";
import { reactionRepository } from "./reaction.repository.js";
import { videoRepository } from "../videos/video.repository.js";
import { commentRepository } from "../comments/comment.repository.js";

const ensureValidObjectId = (value, fieldName) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw new ApiError(400, `${fieldName} is invalid`);
  }
};

const ensureVisibleVideo = async (videoId, userId) => {
  const video = await videoRepository.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Target not found");
  }

  const isOwner = userId && video.owner?._id?.toString() === userId.toString();
  const isVisible =
    video.status === "published" &&
    (video.visibility === "public" || video.visibility === "unlisted");

  if (!isOwner && !isVisible) {
    throw new ApiError(404, "Target not found");
  }

  return video;
};

const targetHandlers = {
  video: {
    async findTarget(targetId, userId) {
      return ensureVisibleVideo(targetId, userId);
    },
    async incrementCount(targetId, amount) {
      return videoRepository.incrementLikesCount(targetId, amount);
    },
  },
  comment: {
    async findTarget(targetId, userId) {
      const comment = await commentRepository.findById(targetId);

      if (!comment) {
        throw new ApiError(404, "Target not found");
      }

      await ensureVisibleVideo(comment.videoId, userId);
      return comment;
    },
    async incrementCount(targetId, amount) {
      return commentRepository.incrementLikesCount(targetId, amount);
    },
  },
};

const getTargetHandler = (targetType) => {
  const handler = targetHandlers[targetType];

  if (!handler) {
    throw new ApiError(400, "Target type is invalid");
  }

  return handler;
};

export const reactionService = {
  async react({ userId, targetType, targetId }) {
    ensureValidObjectId(targetId, "Target ID");

    const handler = getTargetHandler(targetType);
    const target = await handler.findTarget(targetId, userId);

    if (!target) {
      throw new ApiError(404, "Target not found");
    }

    const existingReaction = await reactionRepository.findByUserAndTarget({
      userId,
      targetType,
      targetId,
    });

    if (existingReaction) {
      throw new ApiError(409, "Reaction already exists");
    }

    const reaction = await reactionRepository.create({
      userId,
      targetType,
      targetId,
      reactionType: "like",
    });

    await handler.incrementCount(targetId, 1);

    return reaction;
  },

  async removeReaction({ userId, targetType, targetId }) {
    ensureValidObjectId(targetId, "Target ID");

    const handler = getTargetHandler(targetType);
    await handler.findTarget(targetId, userId);
    const reaction = await reactionRepository.deleteByUserAndTarget({
      userId,
      targetType,
      targetId,
    });

    if (!reaction) {
      throw new ApiError(404, "Reaction not found");
    }

    await handler.incrementCount(targetId, -1);
  },
};
