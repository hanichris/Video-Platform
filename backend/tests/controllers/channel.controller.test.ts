/* eslint-disable @typescript-eslint/no-unused-expressions */
import sinon from 'sinon';
import { expect } from 'chai';
import { Request, Response, NextFunction } from 'express';
import User from '../../src/models/user.model';
import { ChannelModel as Channel } from '../../src/models/channel.model';
import ChannelController from '../../src/controllers/channel.controller';

describe('ChannelController', () => {
  describe('createChannel', () => {
    it('should create a channel and return it', async () => {
      const req = {
        body: {
          channelName: 'New Channel',
          imgUrl: 'https://example.com/channel.jpg',
        },
      } as unknown as Request<any, object, any>;
      const resp = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      } as unknown as Response;
      const next = sinon.stub() as unknown as NextFunction;
      const userId = 'user_id';
      const user = new User({ _id: userId });
      sinon.stub(User, 'findById').resolves(user);
      sinon.stub(Channel.prototype, 'save').resolves();
      sinon.stub(user.channels, 'push');
      sinon.stub(user, 'save').resolves();

      await ChannelController.createChannel(req, resp, next);

      expect((resp.status as sinon.SinonStub).calledWith(200)).to.be.true;
      expect(
        (resp.json as sinon.SinonStub).calledWith(
          sinon.match.instanceOf(Channel),
        ),
      ).to.be.true;
      expect(
        (user.channels.push as sinon.SinonStub).calledWith(
          sinon.match.instanceOf(Channel),
        ),
      ).to.be.true;
      expect((user.save as sinon.SinonStub).called).to.be.true;

      (User.findById as sinon.SinonStub).restore();
      Channel.prototype.save.restore();
    });

    it('should handle errors during channel creation', async () => {
      const req = {
        body: {
          channelName: 'New Channel',
          imgUrl: 'https://example.com/channel.jpg',
        },
      } as unknown as Request<any, object, any>;
      const resp = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      } as unknown as Response;
      const next = sinon.stub();
      const userId = 'user_id';
      const user = new User({ _id: userId });
      sinon.stub(User, 'findById').resolves(user);
      sinon
        .stub(Channel.prototype, 'save')
        .rejects(new Error('Error creating channel'));

      await ChannelController.createChannel(req, resp, next);

      expect(next.calledWith(sinon.match.instanceOf(Error))).to.be.true;

      (User.findById as sinon.SinonStub).restore();
      Channel.prototype.save.restore();
    });

    it('should handle user not found', async () => {
      const req = {
        body: {
          channelName: 'New Channel',
          imgUrl: 'https://example.com/channel.jpg',
        },
      } as unknown as Request<any, object, any>;
      const resp = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      } as unknown as Response;
      const next = sinon.stub() as unknown as NextFunction;
      sinon.stub(User, 'findById').resolves(null);

      await ChannelController.createChannel(req, resp, next);

      expect((resp.status as sinon.SinonStub).calledWith(401)).to.be.true;
      expect(
        (resp.json as sinon.SinonStub).calledWith({ error: 'User not found' }),
      ).to.be.true;

      (User.findById as sinon.SinonStub).restore();
    });
  });

  // Add tests for other methods in ChannelController here
});
