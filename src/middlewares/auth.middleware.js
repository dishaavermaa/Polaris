import { User } from "../models/user.model.js";
import { ApiError } from "../lib/ApiError.js";
import { asyncHandler } from "../lib/asyncHandler.js";
import { verifyAccessToken } from "../infrastructure/auth/token.service.js";
import { authRepository } from "../modules/auth/auth.repository.js";

const resolveBearerToken = (req) =>
  req.header("Authorization")?.replace(/^Bearer\s+/i, "").trim();

const attachAuthenticatedUser = async (req, token, required) => {
  if (!token) {
    if (required) {
      throw new ApiError(401, "Unauthorized request");
    }

    return;
  }

  try {
    const decodedToken = verifyAccessToken(token);
    const session = await authRepository.findActiveSessionById(decodedToken.sessionId);

    if (!session || session.userId.toString() !== decodedToken.sub) {
      throw new ApiError(401, "Invalid access token");
    }

    const user = await User.findById(decodedToken.sub).select("-passwordHash");

    if (!user) {
      throw new ApiError(401, "Invalid access token");
    }

    req.user = user;
    req.session = session;

    await authRepository.touchSession(session._id);
  } catch (error) {
    if (required) {
      throw new ApiError(401, error?.message || "Invalid access token");
    }
  }
};

export const verifyAccess = asyncHandler(async (req, _res, next) => {
  const token = req.cookies?.accessToken || resolveBearerToken(req);
  await attachAuthenticatedUser(req, token, true);
  next();
});

export const optionalAccess = asyncHandler(async (req, _res, next) => {
  const token = req.cookies?.accessToken || resolveBearerToken(req);
  await attachAuthenticatedUser(req, token, false);
  next();
});
