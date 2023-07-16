import { expect } from 'chai';
import { describe, it } from 'mocha';
import sinon from 'sinon';
import ffmpeg from 'fluent-ffmpeg';

import { queue, createJob, processJob } from '../src/worker';

describe('createJob', () => {
  it('should add job to queue', async () => {
    // Arrange
    const jobData = {
      videoId: '123',
      videoPath: '/path/to/video.mp4',
      thumbnailPath: '/path/to/thumbnail.jpg',
    };
    const addSpy = sinon.spy(queue, 'add');

    // Act
    await createJob(jobData);

    // Assert
    expect(addSpy.calledOnce).to.be.true;
    expect(addSpy.calledWith(jobData)).to.be.true;
  });
});

describe('processJob', () => {
  it('should generate thumbnail', async () => {
    // Arrange
    const job = new Job();
    job.data = {
      videoId: '123',
      videoPath: '/path/to/video.mp4',
      thumbnailPath: '/path/to/thumbnail.jpg',
    };
    const screenshotsSpy = sinon.spy(ffmpeg.prototype, 'screenshots');
    const onSpy = sinon.spy(ffmpeg.prototype, 'on');

    // Act
    await processJob(job);

    // Assert
    expect(screenshotsSpy.calledOnce).to.be.true;
    expect(onSpy.calledWith('end')).to.be.true;
  });
});
