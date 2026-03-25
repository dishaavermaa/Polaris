import mongoose from "mongoose";

const success = (data) => ({ success: true, data });
const failure = (errors) => ({ success: false, errors });

export const reactionTargetSchema = (req) => {
  const targetType = req.params.targetType?.trim();
  const targetId = req.params.targetId?.trim();
  const errors = [];

  if (!targetType) {
    errors.push({ field: "targetType", message: "Target type is required" });
  }

  if (targetType && !["video", "comment"].includes(targetType)) {
    errors.push({ field: "targetType", message: "Target type is invalid" });
  }

  if (!targetId) {
    errors.push({ field: "targetId", message: "Target ID is required" });
  }

  if (targetId && !mongoose.Types.ObjectId.isValid(targetId)) {
    errors.push({ field: "targetId", message: "Target ID is invalid" });
  }

  if (errors.length > 0) {
    return failure(errors);
  }

  return success({
    params: {
      targetType,
      targetId,
    },
  });
};
