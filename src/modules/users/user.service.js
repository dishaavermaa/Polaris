import { ApiError } from "../../lib/ApiError.js";
import { userRepository } from "./user.repository.js";
import { comparePassword, hashPassword } from "../../infrastructure/auth/password.service.js";
import { authRepository } from "../auth/auth.repository.js";

export const userService = {
  async getCurrentUser(userId) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return user;
  },

  async updateAccountDetails(userId, { fullname, email }) {
    const existingUser = await userRepository.findByEmail(email);

    if (existingUser && existingUser._id.toString() !== userId.toString()) {
      throw new ApiError(409, "Email is already in use");
    }

    const user = await userRepository.updateById(userId, {
      $set: {
        fullname,
        email,
      },
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return user;
  },

  async changePassword(userId, { oldPassword, newPassword }) {
    const user = await userRepository.findByIdWithPassword(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const isPasswordValid = await comparePassword(oldPassword, user.passwordHash);

    if (!isPasswordValid) {
      throw new ApiError(400, "Invalid old password");
    }

    user.passwordHash = await hashPassword(newPassword);
    await user.save();
    await authRepository.revokeAllSessionsForUser(userId);
  },

  async updateAvatar(userId, avatarUrl) {
    const user = await userRepository.updateById(userId, {
      $set: {
        avatar: avatarUrl,
      },
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return user;
  },

  async updateCoverImage(userId, coverImageUrl) {
    const user = await userRepository.updateById(userId, {
      $set: {
        coverImage: coverImageUrl,
      },
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return user;
  },
};
