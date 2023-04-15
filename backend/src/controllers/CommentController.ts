import { NextFunction, Request, Response } from "express";
import Comment from "../models/comment.model";
import Video from "../models/video.model";
import createError from "../error";

class CommentController {
  static async createComment(req: Request, resp: Response, next: NextFunction) {
    const newComment = new Comment({ ...req.body, userId: resp.locals.user.id });
    try {
      const savedComment = await newComment.save();
      resp.status(200).send(savedComment);
    } catch (err) {
      next(err);
    }
  };

  static async updateComment(req: Request, resp: Response, next: NextFunction) {
    try {
      const comment = await Comment.findById(req.params.id);
      const video = await Video.findById(comment?.videoId);
      if (resp.locals.user.id === comment?.userId || resp.locals.user.id === video?.userId) {
        const updatedComment = await Comment.findByIdAndUpdate(
          req.params.id,
          {
            $set: {...req.body, updatedAt: new Date()}
          },
          { new: true }
        );
        resp.status(200).json(updatedComment);
      } else {
        return next(createError(403, "You can only update your comment!"));
      }
    } catch (err) {
      next(err);
    }
  };

  static async deleteComment(req: Request, resp: Response, next: NextFunction) {
    try {
      const comment = await Comment.findById(req.params.id);
      const video = await Video.findById(req.params.id);
      if (resp.locals.user.id === comment?.userId || resp.locals.user.id === video?.userId) {
        await Comment.findByIdAndDelete(req.params.id);
        resp.status(204).json("The comment has been deleted.");
      } else {
        return next(createError(403, "You can only delete your comment!"));
      }
    } catch (err) {
      next(err);
    }
  };

  static async getComments(req: Request, resp: Response, next: NextFunction) {
    try {
      const comments = await Comment.find({ videoId: req.params.videoId });
      resp.status(200).json(comments);
    } catch (err) {
      next(err);
    }
  };
}

export default CommentController;