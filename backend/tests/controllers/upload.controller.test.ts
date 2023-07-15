/* eslint-disable @typescript-eslint/no-unused-expressions */
import { describe, it } from 'mocha';
import { expect } from 'chai';
import { Request, Response, NextFunction } from 'express';
import { Upload } from '@aws-sdk/lib-storage';
import { S3 } from '@aws-sdk/client-s3';
import AWS from 'aws-sdk';
import multer from 'multer';
// import { randomUUID } from 'crypto';
import sinon from 'sinon';
import { ParsedQs } from 'qs';
import s3Config from '../../src/utils/aws';
// import createError from '../../src/error';
import User from '../../src/models/user.model';
import { ChannelModel as Channel } from '../../src/models/channel.model';
import UploadController from '../../src/controllers/upload.controller';

describe('UploadController', () => {
  let req: Request<any, object, any, ParsedQs, Record<string, any>>;
  let resp: any;
  let next: sinon.SinonStub<any[], any>;

  beforeEach(() => {
    req = {
      params: { id: 'channelId' },
      body: { title: 'Video Title' },
      file: { buffer: Buffer.from('video data') } as any,
    } as unknown as Request<any, object, any, ParsedQs, Record<string, any>>;
    resp = { locals: { user: { _id: 'userId' } } };
    next = sinon.stub();
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should upload a video successfully', async () => {
    const uploadStub = sinon.stub(AWS.S3.prototype, 'upload');
    const doneStub = sinon.stub().resolves({ Location: 'videoUrl' });
    sinon.stub(Upload.prototype, 'done').returns({ done: doneStub } as any);
    sinon.stub(User, 'findById').resolves({ _id: 'userId' });
    sinon.stub(Channel, 'findById').resolves({ _id: 'channelId', videos: [] });
    sinon.stub(multer, 'memoryStorage').returns(uploadStub as any);
    // sinon.stub(AWS.S3.prototype, 'constructor').returns({});

    await UploadController.uploadVideo(req, resp, next);

    expect(uploadStub.calledOnce).to.be.true;
    expect(doneStub.calledOnce).to.be.true;
    expect((User.findById as sinon.SinonStub).calledOnceWith('userId')).to.be
      .true;
    expect((Channel.findById as sinon.SinonStub).calledOnceWith('channelId')).to
      .be.true;
    expect(next.notCalled).to.be.true;
    expect(resp.status.calledOnceWith(200)).to.be.true;
    expect(resp.json.calledOnce).to.be.true;
    expect(resp.json.firstCall.args[0]).to.have.property('userId', 'userId');
  });

  it('should handle an error when uploading a video', async () => {
    const uploadStub = sinon.stub(AWS.S3.prototype, 'upload');
    const storageStub = sinon.stub();
    sinon.stub(multer, 'memoryStorage').returns(storageStub as any);
    // sinon.stub(AWS.S3.prototype, 'constructor').returns({});

    await UploadController.uploadVideo(req, resp, next);

    expect(uploadStub.calledOnce).to.be.true;
    expect(next.calledOnce).to.be.true;
    expect(next.firstCall.args[0].status).to.equal(500);
    expect(next.firstCall.args[0].message).to.equal(
      'Failed to upload video file!',
    );
  });

  it('should handle a user not found error', async () => {
    sinon.stub(User, 'findById').resolves(null);

    await UploadController.uploadVideo(req, resp, next);

    expect((User.findById as sinon.SinonStub).calledOnceWith('userId')).to.be
      .true;
    expect(next.calledOnce).to.be.true;
    expect(next.firstCall.args[0].status).to.equal(401);
    expect(next.firstCall.args[0].message).to.equal('User not found!');
  });

  it('should handle a channel not found error', async () => {
    sinon.stub(User, 'findById').resolves({ _id: 'userId' });
    sinon.stub(Channel, 'findById').resolves(null);

    await UploadController.uploadVideo(req, resp, next);

    expect((User.findById as sinon.SinonStub).calledOnceWith('userId')).to.be
      .true;
    expect((Channel.findById as sinon.SinonStub).calledOnceWith('channelId')).to
      .be.true;
    expect(next.calledOnce).to.be.true;
    expect(next.firstCall.args[0].status).to.equal(401);
    expect(next.firstCall.args[0].message).to.equal('Channel not found!');
  });
});
