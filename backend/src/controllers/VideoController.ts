import mime from 'mime-types';
import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import Video from "../models/video.model";
import createError from '../error';

class VideoController {
  static async setPublic(req: Request, resp: Response, next: NextFunction) {
    const userId = String(resp.locals.user._id)
    if (!userId) {
      return resp.status(401).json({ error: 'Unauthorized' });
    }
    const video = await Video.findById(req.params.id);
    if (!video) {
      console.error('Video was not found!!!');
      return resp.status(404).json({ error: 'Video not found' });
    }
    const updatedVideo = await Video.findByIdAndUpdate(
      req.params.id,
      {
        $set: { isPublic: true},
      },
      { new: true }
    );
    if (!updatedVideo?.isModified) {
      return resp.status(404).json({ error: 'Video not found' });
    }
    return resp.status(200).json(updatedVideo);
  }

  static async setPrivate(req: Request, resp: Response, next: NextFunction) {
    const userId = String(resp.locals.user._id)
    if (!userId) {
      return resp.status(401).json({ error: 'Unauthorized' });
    }
    const video = await Video.findById(req.params.id);
    if (!video) {
      console.error('Video was not found!!!');
      return resp.status(404).json({ error: 'Video not found' });
    }
    const updatedVideo = await Video.findByIdAndUpdate(
      req.params.id,
      {
        $set: { isPublic: false }
      },
      { new: true }
    );
    if (!updatedVideo?.isModified) {
      return resp.status(404).json({ error: 'Video not found' });
    }
    return resp.status(200).json(updatedVideo);
  }

  static async downloadVideo(req: Request, resp: Response, next: NextFunction) {
    const userId = String(resp.locals.user._id)
    const video: any = await Video.findById(req.params.id);
    if (!video || !video.isPublic|| !video.name || !video.videoUrl) {
      return resp.status(404).json({ error: 'Video not found' });
    }
    let contentType = mime.contentType(video.name) ? ".mp4" in video.name : `${video.name}.mp4`;
    return resp.header('Content-Type', String(contentType)).status(200).json(video)
  }
  
  static async updateVideo(req: Request, resp: Response, next: NextFunction) {
    const userId = String(resp.locals.user._id)
    try {
      const video = await Video.findById(req.params.id);
      if (!video) return next(createError(404, "Video not found!"));
      if (userId === video.userId) {
        const updatedVideo = await Video.findByIdAndUpdate(
          req.params.id,
          {
            $set: {...req.body}
          },
          { new: true }
        );
        resp.status(200).json(updatedVideo);
      } else {
        return next(createError(403, "You can only update your video!"));
      }
    } catch (err) {
      next(err);
    }
  };
  
  static async deleteVideo(req: Request, resp: Response, next: NextFunction) {
    const userId = String(resp.locals.user._id)
    try {
      const video = await Video.findById(req.params.id);
      if (!video) return next(createError(404, "Video not found!"));
      if (userId === video.userId) {
        await Video.findByIdAndDelete(req.params.id);
        resp.status(200).json("The video has been deleted.");
      } else {
        return next(createError(403, "You can only delete your video!"));
      }
    } catch (err) {
      next(err);
    }
  };
  
  static async getVideo(req: Request, resp: Response, next: NextFunction) {
    try {
      const video = await Video.findById(req.params.id);
      if (!video) {
        return next(createError(404, "Video not found!"));
      }
      resp.status(200).json(video);
    } catch (err) {
      next(err);
    }
  };
  
  static async addView(req: Request, resp: Response, next: NextFunction) {
    const userId = String(resp.locals.user._id)
    try {
      const video = await Video.findByIdAndUpdate(req.params.id, {
        $inc: { views: 1 },
      });
      if (!video) {
        return next(createError(404, "Video not found!"));
      }
      if (userId) {
        const user = await User.findById(userId);
        if (user) {
          user.history.push(video.id);
          user.save();
        }
      }
      resp.status(200).json("The view has been increased.");
    } catch (err) {
      next(err);
    }
  };
  
  static async getRandom(req: Request, resp: Response, next: NextFunction) {
    try {
      const videos = await Video.aggregate([{ $sample: { size: 20 } }]);
      if (!videos) return next(createError(404, "Videos not found!"));
      resp.status(200).json(videos);
    } catch (err) {
      next(err);
    }
  };
  
  static async getTrending(req: Request, resp: Response, next: NextFunction) {
    try {
      const videos = await Video.find().sort({ views: -1 });
      if (!videos) return next(createError(404, "Videos not found!"));
      resp.status(200).json(videos);
    } catch (err) {
      next(err);
    }
  };
  
  static async getByTag(req: Request, resp: Response, next: NextFunction) {
    const tags = req?.query?.tags?.toString().split(",");
    try {
      const videos = await Video.find({ tags: { $in: tags } }).limit(20);
      if (!videos) return next(createError(404, "Videos not found!"));
      resp.status(200).json(videos);
    } catch (err) {
      next(err);
    }
  };

 static async search(req: Request, resp: Response, next: NextFunction){
    const query = req.query.q;
    try {
      const videos = await Video.find({
        title: { $regex: query, $options: "i" },
      }).limit(20);
      if (!videos) return next(createError(404, "Videos not found!"));
      resp.status(200).json(videos);
    } catch (err) {
      next(err);
    }
  };
}

export default VideoController;
