import { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'crypto';
import User from '../models/user.model';
import Video from '../models/video.model';
import { ChannelModel as Channel } from '../models/channel.model';
import createError from '../error';

const DEFAULT_THUMBNAIL = process.env.DEFAULT_THUMBNAIL as string;

class ChannelController {
  static async createChannel(req: Request, resp: Response, next: NextFunction) {
    const userId = String(resp.locals.user._id);
    const user = await User.findById(userId);
    if (!user) {
      return resp.status(401).json({ error: 'User not found' });
    }
    try {
      const channel = new Channel({
        name: req.body.channelName || randomUUID(),
        userId,
        imgUrl: req.body.imgUrl || user.avatar,
        ...req.body,
      });
      if (!channel) {
        return next(createError(404, 'Channel could not be created!'));
      }
      await channel.save();
      user.channels.push(channel);
      await user.save();
      return resp.status(200).json(channel);
    } catch (err) {
      return next(err);
    }
  }

  static async updateChannel(req: Request, resp: Response, next: NextFunction) {
    const userId = String(resp.locals.user._id);
    const user = await User.findById(userId);
    if (!user) {
      return next(createError(401, 'User not found!'));
    }
    const ownedChannel = user.channels.filter(
      (channel) => channel?._id?.toString() === req.params.id,
    );
    if (ownedChannel) {
      try {
        const updatedChannel = await Channel.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true },
        );
        return resp.status(200).json(updatedChannel);
      } catch (err) {
        return next(err);
      }
    } else {
      return next(createError(403, 'You can only update your channel!'));
    }
  }

  static async deleteChannel(req: Request, resp: Response, next: NextFunction) {
    const userId = String(resp.locals.user._id);
    const channel = await Channel.findById(req.params.id);
    if (!channel) {
      return resp.status(401).json({ error: 'Channel not found' });
    }
    if (channel.userId === userId) {
      try {
        await Channel.findByIdAndDelete(req.params.id);
        return resp.status(200).json('Channel has been deleted.');
      } catch (err) {
        return next(err);
      }
    } else {
      return next(createError(403, 'You can only delete your channel!'));
    }
  }

  static async uploadVideo(req: Request, resp: Response, next: NextFunction) {
    const userId = String(resp.locals.user._id);
    if (!userId) {
      return resp.status(401).json({ error: 'User has not logged in' });
    }
    const user = await User.findById(userId);
    if (!user) {
      return resp.status(401).json({ error: 'Unauthorized user' });
    }
    const { title } = req.body;
    if (!title) {
      return resp.status(400).json({ error: 'Missing title' });
    }
    const channel = await Channel.findById(req.params.id);
    if (!channel) {
      return resp.status(401).json({ error: 'Channel not found' });
    }
    const newVideo = new Video({
      userId,
      channelId: channel.id,
      imgUrl: req.body.imgUrl || DEFAULT_THUMBNAIL,
      ...req.body,
    });
    try {
      const savedVideo = await newVideo.save();
      channel.videos.push(savedVideo.id);
      channel.save();
      return resp.status(201).json(savedVideo);
    } catch (err) {
      return next(err);
    }
  }

  static async getChannels(req: Request, resp: Response, next: NextFunction) {
    try {
      const channels = await Channel.aggregate([{ $sample: { size: 20 } }]);
      if (!channels) {
        return next(createError(404, 'No Channels found!'));
      }
      return resp.status(200).json(channels);
    } catch (err) {
      return next(err);
    }
  }

  static async viewChannel(req: Request, resp: Response, next: NextFunction) {
    try {
      const channel = await Channel.findById(req.params.id);
      if (!channel) {
        return next(createError(404, 'Channel not found!'));
      }
      return resp.status(200).json(channel);
    } catch (err) {
      return next(err);
    }
  }

  static async search(req: Request, resp: Response, next: NextFunction) {
    const query = req.query.q;
    try {
      const channels = await Channel.find({
        name: { $regex: query, $options: 'i' },
      }).limit(20);
      if (!channels) return next(createError(404, 'Channels not found!'));
      return resp.status(200).json(channels);
    } catch (err) {
      return next(err);
    }
  }
}

export default ChannelController;
