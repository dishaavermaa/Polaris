import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { authRepository } from "./auth.repository.js";
import { ApiError } from "../../lib/ApiError.js";
import { comparePassword, hashPassword } from "../../infrastructure/auth/password.service.js";
import {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
  verifyRefreshToken,
} from "../../infrastructure/auth/token.service.js";

const buildSessionMetadata = (req) => ({
  userAgent: req.get("user-agent") || "",
  ip: req.ip || req.socket?.remoteAddress || "",
});

const buildAuthPayload = async (user, req) => {
  const sessionId = new mongoose.Types.ObjectId();

  const accessToken = generateAccessToken({
    userId: user._id.toString(),
    sessionId: sessionId.toString(),
  });

  const refreshToken = generateRefreshToken({
    userId: user._id.toString(),
    sessionId: sessionId.toString(),
  });

  const decodedRefreshToken = jwt.decode(refreshToken);
  const session = await authRepository.createSession({
    _id: sessionId,
    userId: user._id,
    tokenHash: hashToken(refreshToken),
    expiresAt: new Date(decodedRefreshToken.exp * 1000),
    ...buildSessionMetadata(req),
  });

  return {
    accessToken,
    refreshToken,
    sessionId: session._id,
  };
};

export const authService = {
  async register({ fullname, email, username, password, avatarUrl, coverImageUrl }, req) {
    const existingUser = await authRepository.findUserByEmailOrUsername({ email, username });

    if (existingUser) {
      throw new ApiError(409, "User with email or username already exists");
    }

    const passwordHash = await hashPassword(password);
    const user = await authRepository.createUser({
      fullname,
      email,
      username,
      passwordHash,
      avatar: avatarUrl,
      coverImage: coverImageUrl || "",
    });

    const publicUser = await authRepository.findPublicUserById(user._id);
    const tokens = await buildAuthPayload(user, req);

    return {
      user: publicUser,
      ...tokens,
    };
  },

  async login({ email, username, password }, req) {
    const user = await authRepository.findUserByEmailOrUsername({ email, username });

    if (!user) {
      throw new ApiError(401, "Invalid user credentials");
    }

    const isPasswordValid = await comparePassword(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid user credentials");
    }

    const publicUser = await authRepository.findPublicUserById(user._id);
    const tokens = await buildAuthPayload(user, req);

    return {
      user: publicUser,
      ...tokens,
    };
  },

  async refreshAccessToken(refreshToken, req) {
    if (!refreshToken) {
      throw new ApiError(401, "Unauthorized request");
    }

    let decodedToken;

    try {
      decodedToken = verifyRefreshToken(refreshToken);
    } catch {
      throw new ApiError(401, "Invalid refresh token");
    }

    const session = await authRepository.findActiveSessionByHash(hashToken(refreshToken));

    if (!session || session._id.toString() !== decodedToken.sessionId) {
      throw new ApiError(401, "Refresh token expired");
    }

    const user = await authRepository.findUserById(decodedToken.sub);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    await authRepository.revokeSession(session._id);

    return buildAuthPayload(user, req);
  },

  async logout(refreshToken) {
    if (!refreshToken) {
      return;
    }

    try {
      const decodedToken = verifyRefreshToken(refreshToken);

      if (!decodedToken?.sessionId) {
        return;
      }

      await authRepository.revokeSession(decodedToken.sessionId);
    } catch {
      return;
    }
  },
};
