/* eslint-disable @typescript-eslint/no-unused-expressions */
import { expect } from 'chai';
import sinon from 'sinon';
import {
  describe, it, beforeEach, afterEach,
} from 'mocha';
import { Request, Response } from 'express';
import UserController from '../../src/controllers/user.controller';
// import User from '../../src/models/user.model';
// import Video from '../../src/models/video.model';
// import { ChannelModel as Channel } from '../../src/models/channel.model';
// import createError from '../../src/error';

describe('UserController', () => {
  beforeEach(() => {
    // Create stubs or mocks for dependencies, if needed
  });

  afterEach(() => {
    // Restore stubs or mocks, if any
    sinon.restore();
  });

  describe('getMeHandler', () => {
    it('should return the current user with excluded properties', async () => {
      const user = {
        _id: 'user_id',
        name: 'John Doe',
        subscriptions: ['sub1', 'sub2'],
        history: ['video1', 'video2'],
      } as unknown as Response;
      const req = {} as unknown as Request<any, object, any>;
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      } as unknown as Response;
      const next = sinon.stub();

      sinon.stub(UserController, 'getMeHandler').resolves(user);

      await UserController.getMeHandler(req, res, next);

      expect((res.status as sinon.SinonStub).calledWith(200)).to.be.true;
      expect(
        (res.json as sinon.SinonStub).calledWith({
          status: 'success',
          data: {
            user: {
              _id: 'user_id',
              name: 'John Doe',
            },
          },
        }),
      ).to.be.true;
      expect(next.notCalled).to.be.true;
    });

    it('should call next with the error if an error occurs', async () => {
      const error = new Error('Internal Server Error');
      const req = {} as unknown as Request<any, object, any>;
      const res = {
        status: sinon.stub(),
        json: sinon.stub(),
      } as unknown as Response;
      const next = sinon.stub();

      sinon.stub(UserController, 'getMeHandler').rejects(error);

      await UserController.getMeHandler(req, res, next);

      expect((res.status as sinon.SinonStub).notCalled).to.be.true;
      expect((res.json as sinon.SinonStub).notCalled).to.be.true;
      expect(next.calledWith(error)).to.be.true;
    });
  });

  // Add more test cases for other methods in UserController
});
