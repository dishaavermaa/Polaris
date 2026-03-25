import mongoose, { Schema } from "mongoose";

const reactionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    targetType: {
      type: String,
      enum: ["video", "comment"],
      required: true,
      index: true,
    },
    targetId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    reactionType: {
      type: String,
      enum: ["like"],
      default: "like",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

reactionSchema.index(
  { userId: 1, targetType: 1, targetId: 1 },
  { unique: true }
);

export const Reaction = mongoose.model("Reaction", reactionSchema);
