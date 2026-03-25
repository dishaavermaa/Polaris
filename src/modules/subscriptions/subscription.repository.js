import { Subscription } from "../../models/subscription.model.js";

export const subscriptionRepository = {
  findBySubscriberAndChannel(subscriberId, channelId) {
    return Subscription.findOne({
      subscriber: subscriberId,
      channel: channelId,
    });
  },

  create(payload) {
    return Subscription.create(payload);
  },

  deleteBySubscriberAndChannel(subscriberId, channelId) {
    return Subscription.findOneAndDelete({
      subscriber: subscriberId,
      channel: channelId,
    });
  },

  listSubscribedChannels(subscriberId, { page, limit }) {
    return Subscription.find({
      subscriber: subscriberId,
    })
      .populate("channel", "username fullname avatar coverImage")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
  },

  countSubscribedChannels(subscriberId) {
    return Subscription.countDocuments({
      subscriber: subscriberId,
    });
  },
};
