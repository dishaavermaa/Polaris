import { User } from "../../models/user.model.js";
import { Session } from "../../models/session.model.js";

export const authRepository = {
  createUser(payload) {
    return User.create(payload);
  },

  findUserByEmailOrUsername({ email, username }) {
    const conditions = [];

    if (email) {
      conditions.push({ email });
    }

    if (username) {
      conditions.push({ username });
    }

    if (conditions.length === 0) {
      return null;
    }

    return User.findOne({
      $or: conditions,
    });
  },

  findUserById(userId) {
    return User.findById(userId);
  },

  findPublicUserById(userId) {
    return User.findById(userId).select("-passwordHash");
  },

  createSession(payload) {
    return Session.create(payload);
  },

  findActiveSessionById(sessionId) {
    return Session.findOne({
      _id: sessionId,
      revokedAt: null,
      expiresAt: { $gt: new Date() },
    });
  },

  findActiveSessionByHash(tokenHash) {
    return Session.findOne({
      tokenHash,
      revokedAt: null,
      expiresAt: { $gt: new Date() },
    });
  },

  revokeSession(sessionId) {
    return Session.findByIdAndUpdate(
      sessionId,
      {
        $set: {
          revokedAt: new Date(),
        },
      },
      { new: true }
    );
  },

  revokeAllSessionsForUser(userId) {
    return Session.updateMany(
      {
        userId,
        revokedAt: null,
      },
      {
        $set: {
          revokedAt: new Date(),
        },
      }
    );
  },

  touchSession(sessionId) {
    return Session.findByIdAndUpdate(
      sessionId,
      {
        $set: {
          lastUsedAt: new Date(),
        },
      },
      { new: true }
    );
  },
};
