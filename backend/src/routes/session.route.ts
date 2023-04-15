import express from 'express';
import {
  googleOauthHandler,
} from '../controllers/AuthController';

const router = express.Router();

// Google OAuth session route
router.get('/oauth/google', googleOauthHandler);

export default router;
