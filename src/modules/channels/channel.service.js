import { ApiError } from "../../lib/ApiError.js";
import { channelRepository } from "./channel.repository.js";

export const channelService = {
  async getChannelProfile(username, viewerId) {
    const channel = await channelRepository.findChannelProfileByUsername({
      username,
      viewerId,
    });

    if (!channel) {
      throw new ApiError(404, "Channel does not exist");
    }

    return channel;
  },
};
