import express from "express";
import ChannelController from "../controllers/ChannelController";
import { getAuthToken } from "../middleware/getAuthToken";
import { requireLogin } from "../middleware/requireLogin";

const router = express.Router();

// router.use(getAuthToken, requireLogin);

// Channels route
router.get('/', ChannelController.getChannels); // GET /channels
router.get('/:id/view', ChannelController.viewChannel); // GET /channels/:id/view
router.put('/:id', ChannelController.updateChannel); // PUT /channels/:id
router.post('/', getAuthToken, requireLogin, ChannelController.createChannel); // POST /channels
router.post('/:id/upload', getAuthToken, requireLogin, ChannelController.uploadVideo); // POST /channels/:id
router.get('/search', ChannelController.search); // GET /channels/search
router.delete('/:id', getAuthToken, requireLogin, ChannelController.deleteChannel); // DELETE /channels/:id

export default router;
