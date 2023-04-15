import express from "express";
import { getMeHandler } from "../controllers/UserController";
import { deserializeUser } from "../middleware/deserializeUser";
import { requireUser } from "../middleware/requireUser";

const router = express.Router();

router.use(deserializeUser, requireUser);

// Get my info route
router.get("/me", getMeHandler);

export default router;
