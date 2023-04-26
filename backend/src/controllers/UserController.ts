import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import Video from "../models/video.model";
import { ChannelModel as Channel } from "../models/channel.model";
import createError from "../error";
import { exclude } from "./AuthController";

class UserController {
  static async getMeHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user = exclude(res.locals.user, ["password"]);
      res.status(200).json({
        status: "success",
        data: {
          user: exclude(user, ["password"]),
        },
      });
    } catch (err: any) {
      next(err);
    }
  };

  static async updateUser(req: Request, resp: Response, next: NextFunction) {
    const userId = String(resp.locals.user._id)
    console.log(userId)
    if (req.params.id === userId) {
      try {
        const updatedUser = await User.findByIdAndUpdate(
          userId,
          {
            $set: req.body,
          },
          { new: true }
        );
        resp.status(200).json(updatedUser);
      } catch (err) {
        next(err);
      }
    } else {
      return next(createError(403, "You can only update your account!"));
    }
  };
  
  static async deleteUser(req: Request, resp: Response, next: NextFunction) {
    const userId = String(resp.locals.user._id)
    if (req.params.id === userId) {
      try {
        await User.findByIdAndDelete(userId);
        resp.status(200).json("User has been deleted.");
      } catch (err) {
        next(err);
      }
    } else {
      return next(createError(403, "You can only delete your account!"));
    }
  };
  
  static async getUser(req: Request, resp: Response, next: NextFunction) {
    const userId = String(req.params.id)
    try {
      const user = await User.findById(userId);
      resp.status(200).json(user);
    } catch (err) {
      next(err);
    }
  };
  
  static async subscribe(req: Request, resp: Response, next: NextFunction) {
    const userId = String(resp.locals.user._id)
    try {
      await User.findByIdAndUpdate(userId, {
        $push: { subscriptions: req.params.channelId },
      });
      await Channel.findByIdAndUpdate(req.params.channelId, {
        $inc: { subscribers: 1 },
      });
      resp.status(200).json("Subscription successfull.")
    } catch (err) {
      next(err);
    }
  };
  
  static async unsubscribe(req: Request, resp: Response, next: NextFunction) {
    const userId = String(resp.locals.user._id)
      try {
        await User.findByIdAndUpdate(userId, {
          $pull: { subscriptions: req.params.channelId },
        });
        await Channel.findByIdAndUpdate(req.params.channelId, {
          $inc: { subscribers: -1 },
        });
        resp.status(200).json("Unsubscription successfull.")
      } catch (err) {
        next(err);
      }
  };
  
  static async like(req: Request, resp: Response, next: NextFunction) {
    const userId = String(resp.locals.user._id)
    const videoId = req.params.videoId;
    try {
      await Video.findByIdAndUpdate(videoId,{
        $addToSet:{likes:userId},
        $pull:{dislikes:userId}
      })
      resp.status(200).json("The video has been liked.")
    } catch (err) {
      next(err);
    }
  };
  
  static async dislike(req: Request, resp: Response, next: NextFunction) {
    const userId = String(resp.locals.user._id)
      const videoId = req.params.videoId;
      try {
        await Video.findByIdAndUpdate(videoId,{
          $addToSet:{dislikes:userId},
          $pull:{likes:userId}
        })
        resp.status(200).json("The video has been disliked.")
    } catch (err) {
      next(err);
    }
  };

  static async getSubscriptions(req: Request, resp: Response, next: NextFunction) {
    try {
      const userId = String(resp.locals.user._id);
      const user = await User.findById(userId);
      if (!user) {
        return next(createError(403, "You are not logged in!"));
      }
      const subscribedChannels = user.subscriptions;
  
      const list = await Promise.all(
        subscribedChannels.map(async (channelId: any) => {
          return await Channel.findById(channelId);
        })
      );
      if (!list) return next(createError(404, "Channels not found!"));
      resp.status(200).json(list.flat().sort((a: any, b: any) => b.createdAt - a.createdAt));
    } catch (err) {
      next(err);
    }
  };
  
  static async getHistory(req: Request, resp: Response, next: NextFunction) {
    try {
      const userId = String(resp.locals.user._id);
      const user = await User.findById(userId);
      if (!user) {
        return next(createError(403, "You are not logged in!"));
      }
      const watchedVideos = user.history;
      const list = await Promise.all(
        watchedVideos.map(async (videoId) => {
          return await Video.findById(videoId);
        })
      );

      resp.status(200).json(list.flat().sort((a: any, b: any) => b.updatedAt - a.updatedAt));
    } catch (err) {
      next(err);
    }
  };

}

export default UserController;