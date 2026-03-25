import { User } from "../../models/user.model.js";

export const userRepository = {
  findById(userId) {
    return User.findById(userId).select("-passwordHash");
  },

  findByIdWithPassword(userId) {
    return User.findById(userId);
  },

  findByEmail(email) {
    return User.findOne({ email });
  },

  updateById(userId, update) {
    return User.findByIdAndUpdate(userId, update, { new: true }).select("-passwordHash");
  },
};
