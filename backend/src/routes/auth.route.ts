import express from "express";
import {
  loginHandler,
  logoutHandler,
  registerHandler,
  resetPasswordHandler
} from "../controllers/AuthController";
import { deserializeUser } from "../middleware/deserializeUser";
import { requireUser } from "../middleware/requireUser";
import { validate } from "../middleware/validate";
import { registerUserModel, loginUserModel } from "../services/user.service";

const router = express.Router();

// Register user route
router.post("/register", validate(registerUserModel), registerHandler);

// Login user route
router.post("/login", validate(loginUserModel), loginHandler);

// Logout user route
router.get("/logout", deserializeUser, requireUser, logoutHandler);

// Reset user password route
router.post("/reset-password", deserializeUser, resetPasswordHandler);

export default router;
