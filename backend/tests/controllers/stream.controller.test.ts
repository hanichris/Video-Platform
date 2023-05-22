import { expect } from 'chai';
import { createRequest, createResponse } from 'node-mocks-http';
import StreamingController from '../../src/controllers/stream.controller';

describe('StreamingController', () => {
  describe('getStream', () => {
    it('should stream the video successfully', async () => {
      // Mock the request and response objects
      const req = createRequest({ params: { id: 'video_id' } });
      const resp = createResponse();

      // Call the getStream method
      await StreamingController.getStream(req, resp, () => {});

      // Assert that the response status code is 200
      expect(resp.statusCode).to.equal(200);

      // Assert that the response headers are set correctly
      expect(resp.getHeader('Content-Type')).to.equal('video/mp4');
      expect(resp.getHeader('Transfer-Encoding')).to.equal('chunked');
    });

    it('should return a 404 error if the video is not found', async () => {
      // Mock the request and response objects
      const req = createRequest({ params: { id: 'nonexistent_id' } });
      const resp = createResponse();

      // Call the getStream method
      await StreamingController.getStream(req, resp, (error) => {
        // Assert that an error with status code 404 is returned
        expect(error.status).to.equal(404);
        expect(error.message).to.equal('Video not found!');
      });
    });

    it('should return a 500 error if streaming the video fails', async () => {
      // Mock the request and response objects
      const req = createRequest({ params: { id: 'video_id' } });
      const resp = createResponse();

      // Call the getStream method
      await StreamingController.getStream(req, resp, (error) => {
        // Assert that an error with status code 500 is returned
        expect(error.status).to.equal(500);
        expect(error.message).to.equal('Failed to stream video!');
      });
    });
  });
});
