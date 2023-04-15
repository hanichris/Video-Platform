import express from "express";
import UserController from "../controllers/UserController";
import { deserializeUser } from "../middleware/deserializeUser";
import { requireUser } from "../middleware/requireUser";

const router = express.Router();

router.use(deserializeUser, requireUser);

// Get my info route
router.get("/me", UserController.getMeHandler); // GET /users/me

//update user
router.put("/:id", deserializeUser, UserController.updateUser); // PUT /users/:id

//delete user
router.delete("/:id", deserializeUser, UserController.deleteUser); // DELETE /users/:id

//get a user
router.get("/:id", UserController.getUser); // GET /users/:id

//subscribe a user
router.put("/subscribe/:channelId", deserializeUser, UserController.subscribe); // PUT /users/subscribe/:channelId

//unsubscribe a user
router.put("/unsubscribe/:channelId", deserializeUser, UserController.unsubscribe); // PUT /users/unsubscribe/:channelId

//like a video
router.put("/like/:videoId", deserializeUser, UserController.like); // PUT /users/like/:videoId

//dislike a video
router.put("/dislike/:videoId", deserializeUser, UserController.dislike); // PUT /users/dislike/:videoId

// Get user subscriptions
router.get('/subscriptions', deserializeUser, UserController.getSubscriptions); // GET /subscriptions

// Get user watched views history
router.get('/history', deserializeUser, UserController.getHistory); // GET /history

export default router;
