import { NextFunction, Request, Response } from "express";
import dbClient from '../utils/db';
import redisClient from '../utils/redis';
import User from "../models/user.model";
import Video from "../models/video.model";
import { ChannelModel as Channel} from "../models/channel.model";
import Comment from "../models/comment.model"

export default class AppController {
  static getStatus(req: Request, resp: Response, next: NextFunction) {
    resp.status(200).json({ redis: redisClient.isAlive(), db: dbClient.isAlive() });
  }

  static async getStats(req: Request, resp: Response, next: NextFunction) {
    const userCount = await User.countDocuments();
    const videoCount = await Video.countDocuments();
    const channelCount = await Channel.countDocuments();
    const commentCount = await Comment.countDocuments();
    resp.status(200).json({ 
      "users": userCount,
      "videos": videoCount,
      "comments": commentCount,
      "channels": channelCount
    });
  }
}
