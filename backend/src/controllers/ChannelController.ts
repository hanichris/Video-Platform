import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import Video from "../models/video.model";
import { ChannelModel as Channel } from "../models/channel.model";
import createError from '../error';

class ChannelController {
  static async uploadVideo(req: Request, resp: Response, next: NextFunction) {
    const userId = String(resp.locals.user._id);
    if (!userId) {
      return resp.status(401).json({ error: 'User has not logged in' });
    }
    const user = await User.findById(userId)
    if (!user) {
      return resp.status(401).json({ error: 'Unauthorized user' });
    }
    const { title } = req.body;
    if (!title) {
      return resp.status(400).json({ error: 'Missing title' });
    }
    const newVideo = new Video({ 
      userId: userId,
      channelId: req.params.id,
      ...req.body });
    try {
      const savedVideo = await newVideo.save();
      resp.status(201).json(savedVideo);
    } catch (err) {
      next(err);
    }
  }

  static async getChannels(req: Request, resp: Response, next: NextFunction) {
    try {
      const channels = await Channel.aggregate([{ $sample: { size: 20 } }]);
      if (!channels) {
        return next(createError(404, "No Channels found!"));
      }
      resp.status(200).json(channels);
    } catch (err) {
      next(err);
    }
  };
  
  static async viewChannel(req: Request, resp: Response, next: NextFunction) {
    try {
      const channel = await Channel.findById(req.params.id);
      if (!channel) {
        return next(createError(404, "Channel not found!"));
      }
      resp.status(200).json(channel);
    } catch (err) {
      next(err);
    }
  };
}

export default ChannelController;
