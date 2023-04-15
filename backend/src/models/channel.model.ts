import mongoose from "mongoose";

// Channel model
const ChannelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
    imgUrl: {
      type: String,
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    dislikes: {
      type: Number,
      default: 0,
    },
    videos: {
      type: [String],
      default: [],
    },
    subscribers: {
      type: [String],
      default: [],
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const ChannelModel = mongoose.model("Channel", ChannelSchema);
export { ChannelSchema, ChannelModel };
