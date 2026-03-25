import { Video } from "../../models/video.model.js";

export const videoRepository = {
  create(payload) {
    return Video.create(payload);
  },

  findById(videoId) {
    return Video.findById(videoId).populate("owner", "username fullname avatar");
  },

  findOwnedById(videoId, ownerId) {
    return Video.findOne({ _id: videoId, owner: ownerId }).populate(
      "owner",
      "username fullname avatar"
    );
  },

  listPublished({ page, limit, ownerId, search }) {
    const query = {
      status: "published",
      visibility: "public",
    };

    if (ownerId) {
      query.owner = ownerId;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    return Video.find(query)
      .populate("owner", "username fullname avatar")
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
  },

  countPublished({ ownerId, search }) {
    const query = {
      status: "published",
      visibility: "public",
    };

    if (ownerId) {
      query.owner = ownerId;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    return Video.countDocuments(query);
  },

  updateOwned(videoId, ownerId, update) {
    return Video.findOneAndUpdate(
      { _id: videoId, owner: ownerId },
      update,
      { new: true }
    ).populate("owner", "username fullname avatar");
  },

  deleteOwned(videoId, ownerId) {
    return Video.findOneAndDelete({ _id: videoId, owner: ownerId });
  },

  incrementCommentsCount(videoId, amount) {
    return Video.findByIdAndUpdate(
      videoId,
      {
        $inc: {
          commentsCount: amount,
        },
      },
      { new: true }
    );
  },

  incrementLikesCount(videoId, amount) {
    return Video.findByIdAndUpdate(
      videoId,
      {
        $inc: {
          likesCount: amount,
        },
      },
      { new: true }
    );
  },
};
