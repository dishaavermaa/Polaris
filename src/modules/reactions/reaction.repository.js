import { Reaction } from "../../models/reaction.model.js";

export const reactionRepository = {
  findByUserAndTarget({ userId, targetType, targetId }) {
    return Reaction.findOne({
      userId,
      targetType,
      targetId,
    });
  },

  create(payload) {
    return Reaction.create(payload);
  },

  deleteByUserAndTarget({ userId, targetType, targetId }) {
    return Reaction.findOneAndDelete({
      userId,
      targetType,
      targetId,
    });
  },
};
