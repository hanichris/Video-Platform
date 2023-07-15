/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Request, Response, NextFunction } from 'express';
import { expect } from 'chai';
import sinon from 'sinon';
import { Readable } from 'stream';
import { GetObjectCommand, S3 } from '@aws-sdk/client-s3';
import createError from '../../src/error';
import Video from '../../src/models/video.model';
import DownloadController from '../../src/controllers/download.controller';

describe('DownloadController', () => {
  describe('downloadVideo', () => {
    it('should download the video successfully', async () => {
      const req: Request = { params: { id: 'videoId' } } as any;
      const resp: Response = {} as any;
      const next = sinon.stub();

      const video = { filename: 'video.mp4' };
      const s3Response = {
        Body: Readable.from('video content'),
        ContentType: 'video/mp4',
      };
      // const getObjectCommandStub = sinon.stub().resolves(s3Response);
      // const s3Stub = { send: getObjectCommandStub } as unknown as S3;
      sinon.stub(Video, 'findById').resolves(video);

      await DownloadController.downloadVideo(req, resp, next);

      expect(resp.status).to.equal(200);
      expect(resp.getHeader('Content-Type')).to.equal(s3Response.ContentType);
      expect(resp.getHeader('Content-Disposition')).to.equal(
        `attachment; filename=${video.filename}`,
      );
    });

    it('should handle video not found', async () => {
      const req: Request = { params: { id: 'videoId' } } as any;
      const resp: Response = {} as any;
      const next = sinon.stub();

      sinon.stub(Video, 'findById').resolves(null);

      await DownloadController.downloadVideo(req, resp, next);

      expect(next.calledWith(createError(404, 'Video not found!'))).to.be.true;
    });

    it('should handle failed video download', async () => {
      const req: Request = { params: { id: 'videoId' } } as any;
      const resp: Response = {} as any;
      const next = sinon.stub();

      const video = { filename: 'video.mp4' };
      // const getObjectCommandStub = sinon
      //   .stub()
      //   .throws(new Error('Download failed'));
      // const s3Stub = { send: getObjectCommandStub } as unknown as S3;
      sinon.stub(Video, 'findById').resolves(video);

      await DownloadController.downloadVideo(req, resp, next);

      expect(next.calledWith(createError(500, 'Failed to download video!'))).to
        .be.true;
    });
  });
});
