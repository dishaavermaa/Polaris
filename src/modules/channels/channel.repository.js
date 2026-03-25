import mongoose from "mongoose";
import { User } from "../../models/user.model.js";

export const channelRepository = {
  async findChannelProfileByUsername({ username, viewerId }) {
    const viewerObjectId = viewerId ? new mongoose.Types.ObjectId(viewerId) : null;

    const result = await User.aggregate([
      {
        $match: {
          username,
        },
      },
      {
        $lookup: {
          from: "subscriptions",
          localField: "_id",
          foreignField: "channel",
          as: "subscribers",
        },
      },
      {
        $lookup: {
          from: "subscriptions",
          localField: "_id",
          foreignField: "subscriber",
          as: "subscribedTo",
        },
      },
      {
        $addFields: {
          subscribersCount: {
            $size: "$subscribers",
          },
          channelsSubscribedToCount: {
            $size: "$subscribedTo",
          },
          isSubscribed: viewerObjectId
            ? {
                $in: [viewerObjectId, "$subscribers.subscriber"],
              }
            : false,
        },
      },
      {
        $project: {
          fullname: 1,
          username: 1,
          avatar: 1,
          coverImage: 1,
          email: 1,
          subscribersCount: 1,
          channelsSubscribedToCount: 1,
          isSubscribed: 1,
        },
      },
    ]);

    return result[0] || null;
  },
};
