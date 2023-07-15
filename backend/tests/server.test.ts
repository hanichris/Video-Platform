import request from 'supertest';
import { expect } from 'chai';
import app from '../src/server';

describe('Server', () => {
  describe('GET /status', () => {
    it('should return status', async () => {
      const res = await request(app).get('/status');

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('status');
    });
  });

  describe('GET /stats', () => {
    it('should return stats', async () => {
      const res = await request(app).get('/stats');

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('stats');
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const res = await request(app).get('/health');

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('status', 'success');
    });
  });

  describe('GET unknown route', () => {
    it('should return 404', async () => {
      const res = await request(app).get('/unknown');

      expect(res.status).to.equal(404);
      expect(res.body).to.have.property('message');
    });
  });

  describe('Error handling', () => {
    it('should handle errors', async () => {
      // Cause an error
      const res = await request(app).get('/error');

      expect(res.status).to.equal(500);
      expect(res.body).to.have.property('message');
    });
  });
});
