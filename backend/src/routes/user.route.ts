import express from 'express';
import UserController from '../controllers/user.controller';
import getAuthToken from '../middleware/getAuthToken';
import requireLogin from '../middleware/requireLogin';

const router = express.Router();

// router.use(getAuthToken, requireLogin);

// Get all users
router.get('/', getAuthToken, requireLogin, UserController.getAllUsers); // GET /users

// Get my profile route
router.get('/me', getAuthToken, requireLogin, UserController.getMeHandler); // GET /users/me

// get a user
router.get('/:id', UserController.getUser); // GET /users/:id

// update user
router.put('/:id', getAuthToken, requireLogin, UserController.updateUser); // PUT /users/:id

// delete user
router.delete('/:id', getAuthToken, requireLogin, UserController.deleteUser); // DELETE /users/:id

// subscribe a user channel
router.put(
  '/subscribe/:channelId',
  getAuthToken,
  requireLogin,
  UserController.subscribe,
); // PUT /users/subscribe/:channelId

// unsubscribe a user channel
router.put(
  '/unsubscribe/:channelId',
  getAuthToken,
  requireLogin,
  UserController.unsubscribe,
); // PUT /users/unsubscribe/:channelId

// like a video
router.put('/like/:videoId', getAuthToken, requireLogin, UserController.like); // PUT /users/like/:videoId

// dislike a video
router.put(
  '/dislike/:videoId',
  getAuthToken,
  requireLogin,
  UserController.dislike,
); // PUT /users/dislike/:videoId

// Get user subscriptions
router.get(
  '/:id/subscriptions',
  getAuthToken,
  requireLogin,
  UserController.getSubscriptions,
); // GET /users/:id/subscriptions

// Add a video to history
router.put(
  '/history/:videoId',
  getAuthToken,
  requireLogin,
  UserController.addHistory,
); // PUT /users/history/:videoId

// Get user watched views history
router.get(
  '/:id/history',
  getAuthToken,
  requireLogin,
  UserController.getHistory,
); // GET /users/:id/history

export default router;
