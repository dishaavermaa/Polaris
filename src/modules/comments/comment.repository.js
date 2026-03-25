import { Comment } from "../../models/comment.model.js";

export const commentRepository = {
  create(payload) {
    return Comment.create(payload);
  },

  findById(commentId) {
    return Comment.findById(commentId).populate("authorId", "username fullname avatar");
  },

  findOwnedById(commentId, authorId) {
    return Comment.findOne({
      _id: commentId,
      authorId,
    }).populate("authorId", "username fullname avatar");
  },

  listByVideoId(videoId, parentCommentId, { page, limit }) {
    return Comment.find({
      videoId,
      parentCommentId,
    })
      .populate("authorId", "username fullname avatar")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
  },

  countByVideoId(videoId, parentCommentId) {
    return Comment.countDocuments({
      videoId,
      parentCommentId,
    });
  },

  updateOwned(commentId, authorId, update) {
    return Comment.findOneAndUpdate(
      {
        _id: commentId,
        authorId,
      },
      update,
      { new: true }
    ).populate("authorId", "username fullname avatar");
  },

  deleteOwned(commentId, authorId) {
    return Comment.findOneAndDelete({
      _id: commentId,
      authorId,
    });
  },

  incrementReplyCount(commentId, amount) {
    return Comment.findByIdAndUpdate(
      commentId,
      {
        $inc: {
          replyCount: amount,
        },
      },
      { new: true }
    );
  },

  incrementLikesCount(commentId, amount) {
    return Comment.findByIdAndUpdate(
      commentId,
      {
        $inc: {
          likesCount: amount,
        },
      },
      { new: true }
    );
  },
};
