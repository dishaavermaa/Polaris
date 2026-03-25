import { v2 as cloudinary } from "cloudinary";
import fs from "node:fs/promises";
import { env } from "../../config/env.js";
import { logger } from "../../lib/logger.js";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export const uploadFileToCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      return null;
    }

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    await fs.unlink(localFilePath);
    return response;
  } catch (error) {
    logger.error("Cloudinary upload failed", { message: error.message });

    if (localFilePath) {
      await fs.unlink(localFilePath).catch(() => undefined);
    }

    return null;
  }
};
