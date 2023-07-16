/* eslint-disable @typescript-eslint/no-unused-expressions */
import { expect } from 'chai';
import sinon from 'sinon';
import { describe, it } from 'mocha';
import { Request, Response } from 'express';
import Video from '../../src/models/video.model';
import createError from '../../src/error';
import VideoController from '../../src/controllers/video.controller';

describe('VideoController', () => {
  describe('setPublic', () => {
    it('should set video as public', async () => {
      const videoId = 'video123';
      const userId = 'user123';
      const req = {
        params: { id: videoId },
        body: {},
      } as unknown as Request<any, object, any>;
      const resp = {} as Response;
      const next = () => {};

      const findByIdStub = sinon
        .stub(Video, 'findById')
        .returns(Promise.resolve({ _id: videoId }) as any);
      const findByIdAndUpdateStub = sinon
        .stub(Video, 'findByIdAndUpdate')
        .returns(Promise.resolve({ _id: videoId, isPublic: true }) as any);

      await VideoController.setPublic(req, resp, next);

      expect(findByIdStub.calledOnceWithExactly(videoId)).to.be.true;
      expect(
        findByIdAndUpdateStub.calledOnceWithExactly(videoId, {
          $set: { isPublic: true },
        }),
      ).to.be.true;

      sinon.restore();
    });

    it('should handle video not found', async () => {
      const videoId = 'video123';
      const userId = 'user123';
      const req = {
        params: { id: videoId },
        body: {},
      } as unknown as Request<any, object, any>;
      const resp = {} as Response;
      const next = sinon.stub();

      const findByIdStub = sinon
        .stub(Video, 'findById')
        .returns(Promise.resolve(null) as any);

      await VideoController.setPublic(req, resp, next);

      expect(findByIdStub.calledOnceWithExactly(videoId)).to.be.true;
      expect(next.calledOnceWithExactly(createError(404, 'Video not found'))).to
        .be.true;

      sinon.restore();
    });

    // Add more test cases for other scenarios
  });

  // Add more test cases for other methods

  afterEach(() => {
    sinon.restore();
  });
});
