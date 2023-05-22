import { expect } from 'chai';
import { describe, it } from 'mocha';
import { Request, Response, NextFunction } from 'express';
import sinon from 'sinon';
import CommentController from '../../src/controllers/comment.controller';
import Comment from '../../src/models/comment.model';
import Video from '../../src/models/video.model';
import createError from '../../src/error';

describe('CommentController', () => {
  describe('createComment', () => {
    it('should create a new comment and return the saved comment', async () => {
      const req: Partial<Request> = {
        body: { text: 'This is a comment' },
        params: { videoId: 'video-id' },
      };
      const resp: Partial<Response> = {
        status: sinon.stub().returnsThis(),
        send: sinon.stub(),
      };
      const next: NextFunction = sinon.stub();

      sinon
        .stub(Comment.prototype, 'save')
        .resolves({
          text: 'This is a comment',
          userId: 'user-id',
          videoId: 'video-id',
        });

      await CommentController.createComment(
        req as Request,
        resp as Response,
        next,
      );

      expect(resp.status).to.be.calledWith(200);
      expect(resp.send).to.be.calledWith({
        text: 'This is a comment',
        userId: 'user-id',
        videoId: 'video-id',
      });

      sinon.restore();
    });

    it('should handle errors and call the error handler middleware', async () => {
      const req: Partial<Request> = {
        body: { text: 'This is a comment' },
        params: { videoId: 'video-id' },
      };
      const resp: Partial<Response> = {
        status: sinon.stub().returnsThis(),
      };
      const next: NextFunction = sinon.stub();

      sinon
        .stub(Comment.prototype, 'save')
        .rejects(new Error('Failed to save comment'));

      await CommentController.createComment(
        req as Request,
        resp as Response,
        next,
      );

      expect(next).to.be.calledWith(sinon.match.instanceOf(Error));

      sinon.restore();
    });
  });

  describe('updateComment', () => {
    it('should update a comment and return the updated comment', async () => {
      const req: Partial<Request> = {
        body: { text: 'Updated comment' },
        params: { id: 'comment-id' },
      };
      const resp: Partial<Response> = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
      const next: NextFunction = sinon.stub();

      const comment = new Comment({
        text: 'Old comment',
        userId: 'user-id',
        videoId: 'video-id',
      });
      const video = new Video({ userId: 'user-id' });

      sinon.stub(Comment, 'findById').resolves(comment);
      sinon.stub(Video, 'findById').resolves(video);
      sinon
        .stub(Comment, 'findByIdAndUpdate')
        .resolves({
          text: 'Updated comment',
          userId: 'user-id',
          videoId: 'video-id',
        });

      await CommentController.updateComment(
        req as Request,
        resp as Response,
        next,
      );

      expect(resp.status).to.be.calledWith(200);
      expect(resp.json).to.be.calledWith({
        text: 'Updated comment',
        userId: 'user-id',
        videoId: 'video-id',
      });

      sinon.restore();
    });

    it('should handle unauthorized update and call the error handler middleware', async () => {
      const req: Partial<Request> = {
        body: { text: 'Updated comment' },
        params: { id: 'comment-id' },
      };
      const resp: Partial<Response> = {};
      const next: NextFunction = sinon.stub();

      const comment = new Comment({
        text: 'Old comment',
        userId: 'user-id',
        videoId: 'video-id',
      });
      const video = new Video({ userId: 'other-user-id' });

      sinon.stub(Comment, 'findById').resolves(comment);
      sinon.stub(Video, 'findById').resolves(video);

      await CommentController.updateComment(
        req as Request,
        resp as Response,
        next,
      );

      expect(next).to.be.calledWith(sinon.match.instanceOf(Error));

      sinon.restore();
    });

    it('should handle errors and call the error handler middleware', async () => {
      const req: Partial<Request> = {
        body: { text: 'Updated comment' },
        params: { id: 'comment-id' },
      };
      const resp: Partial<Response> = {};
      const next: NextFunction = sinon.stub();

      sinon
        .stub(Comment, 'findById')
        .rejects(new Error('Failed to find comment'));

      await CommentController.updateComment(
        req as Request,
        resp as Response,
        next,
      );

      expect(next).to.be.calledWith(sinon.match.instanceOf(Error));

      sinon.restore();
    });
  });

  describe('deleteComment', () => {
    it('should delete a comment and return a success response', async () => {
      const req: Partial<Request> = {
        params: { id: 'comment-id' },
      };
      const resp: Partial<Response> = {
        status: sinon.stub().returnsThis(),
        send: sinon.stub(),
      };
      const next: NextFunction = sinon.stub();

      const comment = new Comment({ userId: 'user-id', videoId: 'video-id' });
      const video = new Video({ userId: 'user-id' });

      sinon.stub(Comment, 'findById').resolves(comment);
      sinon.stub(Video, 'findById').resolves(video);
      sinon.stub(Comment, 'findByIdAndDelete').resolves();

      await CommentController.deleteComment(
        req as Request,
        resp as Response,
        next,
      );

      expect(resp.status).to.be.calledWith(204);
      expect(resp.send).to.be.called;

      sinon.restore();
    });

    it('should handle unauthorized deletion and call the error handler middleware', async () => {
      const req: Partial<Request> = {
        params: { id: 'comment-id' },
      };
      const resp: Partial<Response> = {};
      const next: NextFunction = sinon.stub();

      const comment = new Comment({ userId: 'user-id', videoId: 'video-id' });
      const video = new Video({ userId: 'other-user-id' });

      sinon.stub(Comment, 'findById').resolves(comment);
      sinon.stub(Video, 'findById').resolves(video);

      await CommentController.deleteComment(
        req as Request,
        resp as Response,
        next,
      );

      expect(next).to.be.calledWith(sinon.match.instanceOf(Error));

      sinon.restore();
    });

    it('should handle errors and call the error handler middleware', async () => {
      const req: Partial<Request> = {
        params: { id: 'comment-id' },
      };
      const resp: Partial<Response> = {};
      const next: NextFunction = sinon.stub();

      sinon
        .stub(Comment, 'findById')
        .rejects(new Error('Failed to find comment'));

      await CommentController.deleteComment(
        req as Request,
        resp as Response,
        next,
      );

      expect(next).to.be.calledWith(sinon.match.instanceOf(Error));

      sinon.restore();
    });
  });

  describe('getComments', () => {
    it('should get comments for a video and return the comments', async () => {
      const req: Partial<Request> = {
        params: { videoId: 'video-id' },
      };
      const resp: Partial<Response> = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
      const next: NextFunction = sinon.stub();

      const comments = [
        { text: 'Comment 1', userId: 'user-id', videoId: 'video-id' },
        { text: 'Comment 2', userId: 'user-id', videoId: 'video-id' },
      ];

      sinon.stub(Comment, 'find').resolves(comments);

      await CommentController.getComments(
        req as Request,
        resp as Response,
        next,
      );

      expect(resp.status).to.be.calledWith(200);
      expect(resp.json).to.be.calledWith(comments);

      sinon.restore();
    });

    it('should handle errors and call the error handler middleware', async () => {
      const req: Partial<Request> = {
        params: { videoId: 'video-id' },
      };
      const resp: Partial<Response> = {};
      const next: NextFunction = sinon.stub();

      sinon.stub(Comment, 'find').rejects(new Error('Failed to get comments'));

      await CommentController.getComments(
        req as Request,
        resp as Response,
        next,
      );

      expect(next).to.be.calledWith(sinon.match.instanceOf(Error));

      sinon.restore();
    });
  });
});
