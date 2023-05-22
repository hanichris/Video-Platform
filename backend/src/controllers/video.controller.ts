import { NextFunction, Request, Response } from 'express';
import Video from '../models/video.model';
import createError from '../error';

class VideoController {
  static async setPublic(req: Request, resp: Response, next: NextFunction) {
    const userId = String(resp.locals.user._id);
    if (!userId) {
      return next(createError(401, 'Unauthorized'));
    }
    const video = await Video.findById(req.params.id);
    if (!video) {
      return next(createError(404, 'Video not found'));
    }
    const updatedVideo = await Video.findByIdAndUpdate(
      req.params.id,
      {
        $set: { isPublic: true },
      },
      { new: true },
    );
    if (!updatedVideo || !updatedVideo?.isModified) {
      return next(createError(404, 'Video not found'));
    }
    return resp.status(200).json(updatedVideo);
  }

  static async setPrivate(req: Request, resp: Response, next: NextFunction) {
    const userId = String(resp.locals.user._id);
    if (!userId) {
      return next(createError(401, 'Unauthorized'));
    }
    const video = await Video.findById(req.params.id);
    if (!video) {
      return next(createError(404, 'Video not found'));
    }
    const updatedVideo = await Video.findByIdAndUpdate(
      req.params.id,
      {
        $set: { isPublic: false },
      },
      { new: true },
    );
    if (!updatedVideo || !updatedVideo?.isModified) {
      return next(createError(404, 'Video not found'));
    }
    return resp.status(200).json(updatedVideo);
  }

  static async addTag(req: Request, resp: Response, next: NextFunction) {
    if (!req?.body?.tags) {
      return next(createError(404, 'No tag found'));
    }
    const userId = String(resp.locals.user._id);
    if (!userId) {
      return next(createError(401, 'Unauthorized'));
    }
    const video = await Video.findById(req.params.id);
    if (!video) {
      return next(createError(404, 'Video not found'));
    }
    const updatedVideo = await Video.findByIdAndUpdate(req.params.id, {
      $addToSet: { tags: req.body.tag },
    });
    if (!updatedVideo?.isModified) {
      return next(createError(404, 'Video not found'));
    }
    return resp.status(200).json(updatedVideo);
  }

  static async removeTag(req: Request, resp: Response, next: NextFunction) {
    if (!req?.body?.tags) {
      return next(createError(404, 'No tag found'));
    }
    const userId = String(resp.locals.user._id);
    if (!userId) {
      return next(createError(401, 'Unauthorized'));
    }
    const video = await Video.findById(req.params.id);
    if (!video) {
      console.error('Video was not found!!!');
      return next(createError(404, 'Video not found'));
    }
    const updatedVideo = await Video.findByIdAndUpdate(req.params.id, {
      $pull: { tags: req.body.tag },
    });
    if (!updatedVideo?.isModified) {
      return next(createError(404, 'Video not found'));
    }
    return resp.status(200).json(updatedVideo);
  }

  static async updateVideo(req: Request, resp: Response, next: NextFunction) {
    const userId = String(resp.locals.user._id);
    try {
      const video = await Video.findById(req.params.id);
      if (!video) return next(createError(404, 'Video not found!'));
      if (userId === video.userId) {
        const updatedVideo = await Video.findByIdAndUpdate(
          req.params.id,
          {
            $set: { ...req.body },
          },
          { new: true },
        );
        return resp.status(200).json(updatedVideo);
      }
      return next(createError(403, 'You can only update your video!'));
    } catch (err) {
      return next(err);
    }
  }

  static async deleteVideo(req: Request, resp: Response, next: NextFunction) {
    const userId = String(resp.locals.user._id);
    try {
      const video = await Video.findById(req.params.id);
      if (!video) return next(createError(404, 'Video not found!'));
      if (userId === video.userId) {
        await Video.findByIdAndDelete(req.params.id);
        return resp.status(200).json('The video has been deleted.');
      }
      return next(createError(403, 'You can only delete your video!'));
    } catch (err) {
      return next(err);
    }
  }

  static async getVideo(req: Request, resp: Response, next: NextFunction) {
    try {
      const video = await Video.findById(req.params.id);
      if (!video) {
        return next(createError(404, 'Video not found!'));
      }
      return resp.status(200).json(video);
    } catch (err) {
      return next(err);
    }
  }

  static async addView(req: Request, resp: Response, next: NextFunction) {
    try {
      const video = await Video.findByIdAndUpdate(req.params.id, {
        $inc: { views: 1 },
      });
      if (!video) {
        return next(createError(404, 'Video not found!'));
      }
      return resp.status(200).json('The view has been increased.');
    } catch (err) {
      return next(err);
    }
  }

  static async getRandom(req: Request, resp: Response, next: NextFunction) {
    try {
      const videos = await Video.aggregate([{ $sample: { size: 20 } }]);
      if (!videos) return next(createError(404, 'Videos not found!'));
      return resp.status(200).json(videos);
    } catch (err) {
      return next(err);
    }
  }

  static async getTrending(req: Request, resp: Response, next: NextFunction) {
    try {
      const videos = await Video.find().sort({ views: -1 });
      if (!videos) return next(createError(404, 'Videos not found!'));
      return resp.status(200).json(videos);
    } catch (err) {
      return next(err);
    }
  }

  static async getByTag(req: Request, resp: Response, next: NextFunction) {
    let tags = req?.query?.tags?.toString().split(',');
    tags = tags?.map(
      (item: string) => String(item.charAt(0)).toUpperCase() + item.slice(1),
    );
    try {
      const videos = await Video.find({ tags: { $in: tags } }).limit(20);
      if (!videos) return next(createError(404, 'Videos not found!'));
      return resp.status(200).json(videos);
    } catch (err) {
      return next(err);
    }
  }

  static async search(req: Request, resp: Response, next: NextFunction) {
    const query = req.query.q;
    try {
      const videos = await Video.find({
        title: { $regex: query, $options: 'i' },
      }).limit(20);
      if (!videos) return next(createError(404, 'Videos not found!'));
      return resp.status(200).json(videos);
    } catch (err) {
      return next(err);
    }
  }
}

export default VideoController;
