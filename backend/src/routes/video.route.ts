import express from "express";
import VideoController from "../controllers/VideoController";
import { deserializeUser } from "../middleware/deserializeUser";
import { requireUser } from "../middleware/requireUser";

const router = express.Router();

router.use(deserializeUser, requireUser);

// Videos route
router.get('/', VideoController.getRandom); // GET /videos
router.get('/trending', VideoController.getTrending); // GET /videos/trending
router.get('/tags', VideoController.getByTag); // GET /videos/tags
router.get('/search', VideoController.search); // GET /videos/search
router.get(':id', VideoController.getVideo); // GET /videos/:id
router.put('/:id/edit', deserializeUser, VideoController.updateVideo); // PUT /videos/:id/edit
router.put('/:id/publish', deserializeUser, VideoController.setPublic); // PUT /videos/:id/publish
router.put('/:id/unpublish', deserializeUser, VideoController.setPrivate); // PUT /videos/:id/unpublish
router.delete('/:id', deserializeUser, VideoController.deleteVideo); // DELETE /videos/:id
router.get('/:id/data', VideoController.downloadVideo); // GET /videos/:id/data

export default router;
