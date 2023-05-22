import assert from 'assert';
import sinon from 'sinon';
import User from '../../src/models/user.model';
import Video from '../../src/models/video.model';
import { ChannelModel as Channel } from '../../src/models/channel.model';
import ChannelController from '../../src/controllers/channel.controller';

const DEFAULT_THUMBNAIL = process.env.DEFAULT_THUMBNAIL as string;

describe('ChannelController', () => {
  describe('createChannel', () => {
    it('should create a channel and return it', async () => {
      const req = {
        body: {
          channelName: 'New Channel',
          imgUrl: 'https://example.com/channel.jpg',
        },
      };
      const resp = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
      const next = sinon.stub();
      const userId = 'user_id';
      const user = new User({ _id: userId });
      sinon.stub(User, 'findById').resolves(user);
      sinon.stub(Channel.prototype, 'save').resolves();
      sinon.stub(user.channels, 'push');
      sinon.stub(user, 'save').resolves();

      await ChannelController.createChannel(req, resp, next);

      sinon.assert.calledWith(resp.status, 200);
      sinon.assert.calledWith(resp.json, sinon.match.instanceOf(Channel));
      sinon.assert.calledWith(
        user.channels.push,
        sinon.match.instanceOf(Channel),
      );
      sinon.assert.called(user.save);

      User.findById.restore();
      Channel.prototype.save.restore();
    });

    it('should handle errors during channel creation', async () => {
      const req = {
        body: {
          channelName: 'New Channel',
          imgUrl: 'https://example.com/channel.jpg',
        },
      };
      const resp = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
      const next = sinon.stub();
      const userId = 'user_id';
      const user = new User({ _id: userId });
      sinon.stub(User, 'findById').resolves(user);
      sinon
        .stub(Channel.prototype, 'save')
        .rejects(new Error('Error creating channel'));

      await ChannelController.createChannel(req, resp, next);

      sinon.assert.calledWith(next, sinon.match.instanceOf(Error));

      User.findById.restore();
      Channel.prototype.save.restore();
    });

    it('should handle user not found', async () => {
      const req = {
        body: {
          channelName: 'New Channel',
          imgUrl: 'https://example.com/channel.jpg',
        },
      };
      const resp = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
      const next = sinon.stub();
      sinon.stub(User, 'findById').resolves(null);

      await ChannelController.createChannel(req, resp, next);

      sinon.assert.calledWith(resp.status, 401);
      sinon.assert.calledWith(resp.json, { error: 'User not found' });

      User.findById.restore();
    });
  });

  // Add tests for other methods in ChannelController here
});
