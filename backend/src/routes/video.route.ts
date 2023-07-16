import express from 'express';
import VideoController from '../controllers/video.controller';
import DownloadController from '../controllers/download.controller';
import StreamController from '../controllers/stream.controller';
import getAuthToken from '../middleware/getAuthToken';
import requireLogin from '../middleware/requireLogin';

const router = express.Router();

// router.use(getAuthToken, requireLogin);

// Videos route
router.get('/', VideoController.getRandom); // GET /videos
router.get('/trending', VideoController.getTrending); // GET /videos/trending
router.get('/tags', VideoController.getByTag); // GET /videos/tags
router.get('/search', VideoController.search); // GET /videos/search
router.get('/:id/view', VideoController.getVideo); // GET /videos/:id/view
router.put('/:id/view', VideoController.addView); // PUT /videos/:id/view
router.put(
  '/:id/edit',
  getAuthToken,
  requireLogin,
  VideoController.updateVideo,
); // PUT /videos/:id/edit
router.put('/:id/tag', getAuthToken, requireLogin, VideoController.addTag); // PUT /videos/:id/tag
router.put('/:id/untag', getAuthToken, requireLogin, VideoController.removeTag); // PUT /videos/:id/untag
router.put(
  '/:id/publish',
  getAuthToken,
  requireLogin,
  VideoController.setPublic,
); // PUT /videos/:id/publish
router.put(
  '/:id/unpublish',
  getAuthToken,
  requireLogin,
  VideoController.setPrivate,
); // PUT /videos/:id/unpublish
router.delete('/:id', getAuthToken, requireLogin, VideoController.deleteVideo); // DELETE /videos/:id
router.get('/:id/download', DownloadController.downloadVideo); // GET /download/:id
router.get('/:id/stream', StreamController.getStream); // GET /stream/:id

export default router;
