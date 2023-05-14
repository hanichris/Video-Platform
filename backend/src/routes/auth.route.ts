import express from 'express';
import { AuthController } from '../controllers/auth.controller';
import requireLogin from '../middleware/requireLogin';
import getAuthToken from '../middleware/getAuthToken';
import validate from '../middleware/validate';
import {
  registerUserModel,
  loginUserModel,
  resetPasswordModel,
} from '../services/user.service';

const router = express.Router();

// Register user route
router.post(
  '/register',
  validate(registerUserModel),
  AuthController.registerHandler,
); // POST /auth/register

// Login user route
router.post('/login', validate(loginUserModel), AuthController.loginHandler); // POST /auth/login

// Logout user route
router.get('/logout', getAuthToken, requireLogin, AuthController.logoutHandler); // GET /auth/logout

// Reset user password route
router.put(
  '/reset-password',
  validate(resetPasswordModel),
  AuthController.resetPasswordHandler,
); // PUT /auth/reset-password

export default router;
