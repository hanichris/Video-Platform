import mongoose from 'mongoose';

// Comments model
const CommentSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    videoId: {
      type: String,
      required: true,
    },
    parentCommentId: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
    upvotes: {
      type: [String],
      default: [],
    },
    downvotes: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);

const CommentModel = mongoose.model('Comment', CommentSchema);
export default CommentModel;
