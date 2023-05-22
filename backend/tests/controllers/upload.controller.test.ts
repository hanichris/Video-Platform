import { describe, it } from 'mocha';
import { expect } from 'chai';
import { Upload } from '@aws-sdk/lib-storage';
import { S3 } from '@aws-sdk/client-s3';
import multer from 'multer';
import { randomUUID } from 'crypto';
import sinon from 'sinon';
import createError from '../../src/error';
import User from '../../src/models/user.model';
import Channel from '../../src/models/channel.model';
import UploadController from '../../src/controllers/upload.controller';

describe('UploadController', () => {
  let req; let resp; let
    next;

  beforeEach(() => {
    req = {
      params: { id: 'channelId' },
      body: { title: 'Video Title' },
      file: { buffer: Buffer.from('video data') },
    };
    resp = { locals: { user: { _id: 'userId' } } };
    next = sinon.stub();
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should upload a video successfully', async () => {
    const uploadStub = sinon.stub().callsFake((req, resp, callback) => {
      callback(null);
    });
    const doneStub = sinon.stub().resolves({ Location: 'videoUrl' });
    sinon.stub(Upload.prototype, 'done').returns({ done: doneStub });
    sinon.stub(User, 'findById').resolves({ _id: 'userId' });
    sinon.stub(Channel, 'findById').resolves({ _id: 'channelId', videos: [] });
    sinon.stub(multer, 'single').returns(uploadStub);
    sinon.stub(S3.prototype, 'constructor').returns({});

    await UploadController.uploadVideo(req, resp, next);

    expect(uploadStub.calledOnce).to.be.true;
    expect(doneStub.calledOnce).to.be.true;
    expect(User.findById.calledOnceWith('userId')).to.be.true;
    expect(Channel.findById.calledOnceWith('channelId')).to.be.true;
    expect(next.notCalled).to.be.true;
    expect(resp.status.calledOnceWith(200)).to.be.true;
    expect(resp.json.calledOnce).to.be.true;
    expect(resp.json.firstCall.args[0]).to.have.property('userId', 'userId');
  });

  it('should handle an error when uploading a video', async () => {
    const uploadStub = sinon.stub().callsFake((req, resp, callback) => {
      callback(new Error('Upload Error'));
    });
    sinon.stub(multer, 'single').returns(uploadStub);
    sinon.stub(S3.prototype, 'constructor').returns({});

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

    expect(User.findById.calledOnceWith('userId')).to.be.true;
    expect(next.calledOnce).to.be.true;
    expect(next.firstCall.args[0].status).to.equal(401);
    expect(next.firstCall.args[0].message).to.equal('User not found!');
  });

  it('should handle a channel not found error', async () => {
    sinon.stub(User, 'findById').resolves({ _id: 'userId' });
    sinon.stub(Channel, 'findById').resolves(null);

    await UploadController.uploadVideo(req, resp, next);

    expect(User.findById.calledOnceWith('userId')).to.be.true;
    expect(Channel.findById.calledOnceWith('channelId')).to.be.true;
    expect(next.calledOnce).to.be.true;
    expect(next.firstCall.args[0].status).to.equal(401);
    expect(next.firstCall.args[0].message).to.equal('Channel not found!');
  });
});
