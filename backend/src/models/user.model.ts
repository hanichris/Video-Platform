import mongoose from 'mongoose';
import { ChannelSchema } from './channel.model';

// User model
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    avatar: {
      type: String,
    },
    subscriptions: {
      type: [String],
    },
    history: {
      type: [String],
    },
    fromGoogle: {
      type: Boolean,
      default: false,
    },
    // Embedded channels (one to many)
    channels: {
      type: [ChannelSchema],
    },
  },
  { timestamps: true },
);

const UserModel = mongoose.model('User', UserSchema);
export default UserModel;
