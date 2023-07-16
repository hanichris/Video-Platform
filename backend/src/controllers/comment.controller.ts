import { NextFunction, Request, Response } from 'express';
import Comment from '../models/comment.model';
import Video from '../models/video.model';
import createError from '../error';

class CommentController {
  static async createComment(req: Request, resp: Response, next: NextFunction) {
    const userId = String(resp.locals.user._id);
    const newComment = new Comment({
      ...req.body,
      userId,
      videoId: req.params.videoId,
    });
    try {
      const savedComment = await newComment.save();
      return resp.status(200).send(savedComment);
    } catch (err) {
      return next(err);
    }
  }

  static async updateComment(req: Request, resp: Response, next: NextFunction) {
    try {
      const userId = String(resp.locals.user._id);
      const comment = await Comment.findById(req.params.id);
      const video = await Video.findById(comment?.videoId);
      if (userId === comment?.userId || userId === video?.userId) {
        const updatedComment = await Comment.findByIdAndUpdate(
          req.params.id,
          {
            $set: { ...req.body, updatedAt: new Date() },
          },
          { new: true },
        );
        return resp.status(200).json(updatedComment);
      }
      return next(createError(403, 'You can only update your comment!'));
    } catch (err) {
      return next(err);
    }
  }

  static async deleteComment(req: Request, resp: Response, next: NextFunction) {
    try {
      const userId = String(resp.locals.user._id);
      const comment = await Comment.findById(req.params.id);
      const video = await Video.findById(req.params.id);
      if (userId === comment?.userId || userId === video?.userId) {
        await Comment.findByIdAndDelete(req.params.id);
        return resp.status(204).send('The comment has been deleted.');
      }
      return next(createError(403, 'You can only delete your comment!'));
    } catch (err) {
      return next(err);
    }
  }

  static async getComments(req: Request, resp: Response, next: NextFunction) {
    try {
      const comments = await Comment.find({ videoId: req.params.videoId });
      return resp.status(200).json(comments);
    } catch (err) {
      return next(err);
    }
  }
}

export default CommentController;
