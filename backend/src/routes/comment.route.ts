import express from "express";
import CommentController from "../controllers/CommentController";
import { deserializeUser } from "../middleware/deserializeUser";
import { requireUser } from "../middleware/requireUser";

const router = express.Router();

router.use(deserializeUser, requireUser);

// Comments route
router.post("/", deserializeUser, CommentController.createComment) // POST /comments/
router.put("/:id", deserializeUser, CommentController.updateComment) // PUT /comments/:id
router.delete("/:id", deserializeUser, CommentController.deleteComment) // DELETE /comments/:id
router.get("/:videoId", CommentController.getComments) // GET /comments/:videoId

export default router;
