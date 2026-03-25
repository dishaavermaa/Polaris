import mongoose from "mongoose";
import { ApiError } from "../../lib/ApiError.js";
import { subscriptionRepository } from "./subscription.repository.js";
import { userRepository } from "../users/user.repository.js";

const ensureValidObjectId = (value, fieldName) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw new ApiError(400, `${fieldName} is invalid`);
  }
};

export const subscriptionService = {
  async subscribe(subscriberId, channelId) {
    ensureValidObjectId(channelId, "Channel ID");

    if (subscriberId.toString() === channelId.toString()) {
      throw new ApiError(400, "You cannot subscribe to your own channel");
    }

    const channel = await userRepository.findById(channelId);

    if (!channel) {
      throw new ApiError(404, "Channel not found");
    }

    const existingSubscription = await subscriptionRepository.findBySubscriberAndChannel(
      subscriberId,
      channelId
    );

    if (existingSubscription) {
      throw new ApiError(409, "Already subscribed to this channel");
    }

    const subscription = await subscriptionRepository.create({
      subscriber: subscriberId,
      channel: channelId,
    });

    return {
      subscriptionId: subscription._id,
      channel,
    };
  },

  async unsubscribe(subscriberId, channelId) {
    ensureValidObjectId(channelId, "Channel ID");

    const deletedSubscription = await subscriptionRepository.deleteBySubscriberAndChannel(
      subscriberId,
      channelId
    );

    if (!deletedSubscription) {
      throw new ApiError(404, "Subscription not found");
    }
  },

  async listMySubscriptions(subscriberId, query) {
    const page = Number(query.page || 1);
    const limit = Math.min(Number(query.limit || 10), 50);

    const [items, totalItems] = await Promise.all([
      subscriptionRepository.listSubscribedChannels(subscriberId, { page, limit }),
      subscriptionRepository.countSubscribedChannels(subscriberId),
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
};
