/* eslint-disable @typescript-eslint/no-unused-expressions */
import { expect } from 'chai';
import sinon from 'sinon';
import { NextFunction, Request, Response } from 'express';
import dbClient from '../../src/utils/db';
import redisClient from '../../src/utils/redis';
import User from '../../src/models/user.model';
import Video from '../../src/models/video.model';
import { ChannelModel as Channel } from '../../src/models/channel.model';
import Comment from '../../src/models/comment.model';
import AppController from '../../src/controllers/app.controller';

describe('AppController', () => {
  describe('getStatus', () => {
    it('should return status 200 and check if redis and mongoose connections are alive', () => {
      // Arrange
      const req = {} as Request;
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      } as unknown as Response;
      const next = sinon.stub() as unknown as NextFunction;

      const redisIsAliveStub = sinon.stub(redisClient, 'isAlive').returns(true);
      const dbIsAliveStub = sinon.stub(dbClient, 'isAlive').returns(true);

      // Act
      AppController.getStatus(req, res, next);

      // Assert
      expect(res.status.calledWith(200)).to.be.true;
      expect(
        res.json.calledWith({
          redis: true,
          db: true,
        }),
      ).to.be.true;

      expect(redisIsAliveStub.calledOnce).to.be.true;
      expect(dbIsAliveStub.calledOnce).to.be.true;

      redisIsAliveStub.restore();
      dbIsAliveStub.restore();
    });

    it('should call next with an error if an exception occurs', () => {
      // Arrange
      const req = {} as Request;
      const res = {} as Response;
      const next = sinon.stub() as unknown as NextFunction;
      const error = new Error('Some error message');

      sinon.stub(redisClient, 'isAlive').throws(error);
      sinon.stub(dbClient, 'isAlive').returns(true);

      // Act
      AppController.getStatus(req, res, next);

      // Assert
      expect(next.calledWith(error)).to.be.true;

      sinon.restore();
    });
  });

  describe('getStats', () => {
    it('should return status 200 and the statistics', async () => {
      // Arrange
      const req = {} as Request;
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      } as unknown as Response;
      const next = sinon.stub() as unknown as NextFunction;

      const userCountStub = sinon.stub(User, 'countDocuments').resolves(10);
      const videoCountStub = sinon.stub(Video, 'countDocuments').resolves(20);
      const channelCountStub = sinon
        .stub(Channel, 'countDocuments')
        .resolves(5);
      const commentCountStub = sinon
        .stub(Comment, 'countDocuments')
        .resolves(15);

      // Act
      await AppController.getStats(req, res, next);

      // Assert
      expect(res.status.calledWith(200)).to.be.true;
      expect(
        res.json.calledWith({
          users: 10,
          videos: 20,
          comments: 15,
          channels: 5,
        }),
      ).to.be.true;

      expect(userCountStub.calledOnce).to.be.true;
      expect(videoCountStub.calledOnce).to.be.true;
      expect(channelCountStub.calledOnce).to.be.true;
      expect(commentCountStub.calledOnce).to.be.true;

      sinon.restore();
    });

    it('should handle errors', async () => {
      // Arrange
      const req = {} as Request;
      const res = {} as Response;
      const next = sinon.stub() as unknown as NextFunction;
      const error = new Error('Some error message');

      sinon.stub(User, 'countDocuments').rejects(error);

      // Act
      await AppController.getStats(req, res, next);

      // Assert
      expect(next.calledWith(error)).to.be.true;

      sinon.restore();
    });
  });
});
