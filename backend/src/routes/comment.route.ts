import express from 'express';
import CommentController from '../controllers/comment.controller';
import getAuthToken from '../middleware/getAuthToken';
import requireLogin from '../middleware/requireLogin';

const router = express.Router();

// router.use(getAuthToken, requireLogin);

// Comments route
router.put('/:id', getAuthToken, requireLogin, CommentController.updateComment); // PUT /comments/:id
router.delete(
  '/:id',
  getAuthToken,
  requireLogin,
  CommentController.deleteComment,
); // DELETE /comments/:id
router.get('/:videoId', CommentController.getComments); // GET /comments/:videoId
router.post(
  '/:videoId',
  getAuthToken,
  requireLogin,
  CommentController.createComment,
); // POST /comments/

export default router;
