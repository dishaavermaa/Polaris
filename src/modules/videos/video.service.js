import mongoose from "mongoose";
import { ApiError } from "../../lib/ApiError.js";
import { videoRepository } from "./video.repository.js";

const ensureValidObjectId = (value, fieldName) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw new ApiError(400, `${fieldName} is invalid`);
  }
};

const sanitizeTags = (tags = []) =>
  [...new Set(tags.map((tag) => tag.trim().toLowerCase()).filter(Boolean))];

export const videoService = {
  async createVideo(ownerId, payload) {
    const status = payload.status || "draft";

    const video = await videoRepository.create({
      owner: ownerId,
      title: payload.title,
      description: payload.description,
      videoFile: payload.videoFile,
      thumbnail: payload.thumbnail,
      duration: payload.duration || 0,
      visibility: payload.visibility || "public",
      status,
      tags: sanitizeTags(payload.tags),
      publishedAt: status === "published" ? new Date() : null,
    });

    return videoRepository.findById(video._id);
  },

  async listVideos(query) {
    const page = Number(query.page || 1);
    const limit = Math.min(Number(query.limit || 10), 50);
    const ownerId = query.ownerId || undefined;
    const search = query.search || undefined;

    const [items, totalItems] = await Promise.all([
      videoRepository.listPublished({ page, limit, ownerId, search }),
      videoRepository.countPublished({ ownerId, search }),
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

  async getVideoById(videoId, viewerId) {
    ensureValidObjectId(videoId, "Video ID");

    const video = await videoRepository.findById(videoId);

    if (!video) {
      throw new ApiError(404, "Video not found");
    }

    const isOwner = viewerId && video.owner?._id?.toString() === viewerId.toString();
    const isVisibleToViewer =
      video.status === "published" &&
      (video.visibility === "public" || video.visibility === "unlisted");

    if (!isOwner && !isVisibleToViewer) {
      throw new ApiError(404, "Video not found");
    }

    return video;
  },

  async updateVideo(videoId, ownerId, payload) {
    ensureValidObjectId(videoId, "Video ID");

    const update = {
      $set: {
        title: payload.title,
        description: payload.description,
        visibility: payload.visibility,
        tags: sanitizeTags(payload.tags),
      },
    };

    if (payload.thumbnail) {
      update.$set.thumbnail = payload.thumbnail;
    }

    if (payload.status) {
      update.$set.status = payload.status;
      update.$set.publishedAt = payload.status === "published" ? new Date() : null;
    }

    const video = await videoRepository.updateOwned(videoId, ownerId, update);

    if (!video) {
      throw new ApiError(404, "Video not found");
    }

    return video;
  },

  async deleteVideo(videoId, ownerId) {
    ensureValidObjectId(videoId, "Video ID");

    const video = await videoRepository.deleteOwned(videoId, ownerId);

    if (!video) {
      throw new ApiError(404, "Video not found");
    }
  },
};
