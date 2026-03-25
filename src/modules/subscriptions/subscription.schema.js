import mongoose from "mongoose";

const success = (data) => ({ success: true, data });
const failure = (errors) => ({ success: false, errors });

export const channelIdParamSchema = (req) => {
  const channelId = req.params.channelId?.trim();
  const errors = [];

  if (!channelId) {
    errors.push({ field: "channelId", message: "Channel ID is required" });
  }

  if (channelId && !mongoose.Types.ObjectId.isValid(channelId)) {
    errors.push({ field: "channelId", message: "Channel ID is invalid" });
  }

  if (errors.length > 0) {
    return failure(errors);
  }

  return success({
    params: {
      channelId,
    },
  });
};

export const listSubscriptionsSchema = (req) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);
  const errors = [];

  if (Number.isNaN(page) || page < 1) {
    errors.push({ field: "page", message: "Page must be a positive number" });
  }

  if (Number.isNaN(limit) || limit < 1 || limit > 50) {
    errors.push({ field: "limit", message: "Limit must be between 1 and 50" });
  }

  if (errors.length > 0) {
    return failure(errors);
  }

  return success({
    query: {
      page,
      limit,
    },
  });
};
