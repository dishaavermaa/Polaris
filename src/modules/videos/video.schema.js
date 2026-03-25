import mongoose from "mongoose";

const success = (data) => ({ success: true, data });
const failure = (errors) => ({ success: false, errors });

const normalizeTags = (value) => {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value;
  }

  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

const validateVisibility = (visibility) =>
  ["public", "private", "unlisted"].includes(visibility);

const validateStatus = (status) => ["draft", "published", "archived"].includes(status);

export const createVideoSchema = (req) => {
  const title = req.body.title?.trim();
  const description = req.body.description?.trim();
  const visibility = req.body.visibility?.trim() || "public";
  const status = req.body.status?.trim() || "draft";
  const tags = normalizeTags(req.body.tags);
  const errors = [];

  if (!title) errors.push({ field: "title", message: "Title is required" });
  if (!description) errors.push({ field: "description", message: "Description is required" });
  if (!validateVisibility(visibility)) {
    errors.push({ field: "visibility", message: "Visibility is invalid" });
  }
  if (!validateStatus(status)) {
    errors.push({ field: "status", message: "Status is invalid" });
  }

  if (errors.length > 0) {
    return failure(errors);
  }

  return success({
    body: {
      title,
      description,
      visibility,
      status,
      tags,
    },
  });
};

export const updateVideoSchema = (req) => {
  const title = req.body.title?.trim();
  const description = req.body.description?.trim();
  const visibility = req.body.visibility?.trim();
  const status = req.body.status?.trim();
  const tags = normalizeTags(req.body.tags);
  const errors = [];

  if (!title) errors.push({ field: "title", message: "Title is required" });
  if (!description) errors.push({ field: "description", message: "Description is required" });
  if (visibility && !validateVisibility(visibility)) {
    errors.push({ field: "visibility", message: "Visibility is invalid" });
  }
  if (status && !validateStatus(status)) {
    errors.push({ field: "status", message: "Status is invalid" });
  }

  if (errors.length > 0) {
    return failure(errors);
  }

  return success({
    body: {
      title,
      description,
      visibility: visibility || "public",
      status,
      tags,
    },
  });
};

export const listVideosSchema = (req) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);
  const ownerId = req.query.ownerId?.trim();
  const search = req.query.search?.trim();
  const errors = [];

  if (Number.isNaN(page) || page < 1) {
    errors.push({ field: "page", message: "Page must be a positive number" });
  }

  if (Number.isNaN(limit) || limit < 1 || limit > 50) {
    errors.push({ field: "limit", message: "Limit must be between 1 and 50" });
  }

  if (ownerId && !mongoose.Types.ObjectId.isValid(ownerId)) {
    errors.push({ field: "ownerId", message: "Owner ID is invalid" });
  }

  if (errors.length > 0) {
    return failure(errors);
  }

  return success({
    query: {
      page,
      limit,
      ownerId,
      search,
    },
  });
};
