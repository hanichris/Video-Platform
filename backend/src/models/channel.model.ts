import mongoose from 'mongoose';

// Channel model
const ChannelSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    imgUrl: {
      type: String,
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
  { timestamps: true },
);

const ChannelModel = mongoose.model('Channel', ChannelSchema);
export { ChannelSchema, ChannelModel };
