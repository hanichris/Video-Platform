import express from "express";
import ChannelController from "../controllers/ChannelController";
import { deserializeUser } from "../middleware/deserializeUser";
import { requireUser } from "../middleware/requireUser";

const router = express.Router();

router.use(deserializeUser, requireUser);

// Channels route
router.get('/', ChannelController.getChannels); // GET /channels
router.get(':id', ChannelController.viewChannel); // GET /channels/:id
router.post('/:id', deserializeUser, requireUser, ChannelController.uploadVideo); // POST /channels/:id

export default router;
