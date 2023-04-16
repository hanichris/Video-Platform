import express from 'express';
import {AuthController} from '../controllers/AuthController';

const router = express.Router();

// Google OAuth session route
router.get('/oauth/google', AuthController.googleOauthHandler);

export default router;
