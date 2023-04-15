import express from "express";
import FileController from "../controllers/FileController";
import { deserializeUser } from "../middleware/deserializeUser";
import { requireUser } from "../middleware/requireUser";

const router = express.Router();

router.use(deserializeUser, requireUser);

// Videos route
router.get('/', FileController.getIndex); // GET /videos
router.post('/', deserializeUser, requireUser, FileController.postUpload); // POST /videos
router.get(':id', FileController.getShow); // GET /videos/:id
router.put('/:id/publish', FileController.putPublish); // PUT /videos/:id/publish
router.put('/:id/unpublish', FileController.putUnpublish); // PUT /videos/:id/unpublish
router.get('/:id/data', FileController.getFile); // GET /videos/:id/data

export default router;
