import multer from "multer";
import path from "node:path";
import crypto from "node:crypto";
import { ApiError } from "../lib/ApiError.js";

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (_req, file, cb) {
    const extension = path.extname(file.originalname);
    cb(null, `${Date.now()}-${crypto.randomUUID()}${extension}`);
  },
});

const createUploader = ({ allowedMimePrefixes, isAllowedFile, maxFileSize }) =>
  multer({
    storage,
    fileFilter: (_req, file, cb) => {
      const isAllowed = isAllowedFile
        ? isAllowedFile(file)
        : allowedMimePrefixes.some((prefix) => file.mimetype.startsWith(prefix));

      if (!isAllowed) {
        cb(new ApiError(400, "Unsupported file type"));
        return;
      }

      cb(null, true);
    },
    limits: {
      fileSize: maxFileSize,
    },
  });

export const upload = createUploader({
  allowedMimePrefixes: ["image/"],
  maxFileSize: 5 * 1024 * 1024,
});

export const mediaUpload = createUploader({
  allowedMimePrefixes: ["image/", "video/"],
  maxFileSize: 100 * 1024 * 1024,
});

export const videoCreationUpload = createUploader({
  isAllowedFile: (file) => {
    if (file.fieldname === "thumbnail") {
      return file.mimetype.startsWith("image/");
    }

    if (file.fieldname === "videoFile") {
      return file.mimetype.startsWith("video/");
    }

    return false;
  },
  maxFileSize: 100 * 1024 * 1024,
});

export const videoUpload = createUploader({
  allowedMimePrefixes: ["video/"],
  maxFileSize: 100 * 1024 * 1024,
});

export const imageUpload = createUploader({
  allowedMimePrefixes: ["image/"],
  maxFileSize: 5 * 1024 * 1024,
});
