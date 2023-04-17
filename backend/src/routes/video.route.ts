import express from "express";
import VideoController from "../controllers/VideoController";
import { getAuthToken } from "../middleware/getAuthToken";
import { requireLogin } from "../middleware/requireLogin";

const router = express.Router();

router.use(getAuthToken, requireLogin);

// Videos route
router.get('/', VideoController.getRandom); // GET /videos
router.get('/trending', VideoController.getTrending); // GET /videos/trending
router.get('/tags', VideoController.getByTag); // GET /videos/tags
router.get('/search', VideoController.search); // GET /videos/search
router.get('/:id/view', VideoController.getVideo); // GET /videos/:id
router.put('/:id/edit', getAuthToken, requireLogin, VideoController.updateVideo); // PUT /videos/:id/edit
router.put('/:id/publish', getAuthToken, requireLogin, VideoController.setPublic); // PUT /videos/:id/publish
router.put('/:id/unpublish', getAuthToken, requireLogin, VideoController.setPrivate); // PUT /videos/:id/unpublish
router.delete('/:id', getAuthToken, requireLogin, VideoController.deleteVideo); // DELETE /videos/:id
router.get('/:id/data', VideoController.downloadVideo); // GET /videos/:id/data

export default router;
