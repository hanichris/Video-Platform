require("dotenv").config();
import path from "path";
import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route";
import authRouter from "./routes/auth.route";
import sessionRouter from "./routes/session.route";
import videoRouter from "./routes/video.route";
import dbClient from './utils/db';
import AppController from "./controllers/AppController";

const app = express();

app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));
app.use("/api/v1/thumbnails", express.static(path.join(__dirname, "../public")));

const FRONTEND_ENDPOINT = process.env.FRONTEND_ENDPOINT as unknown as string;
app.use(
  cors({
    credentials: true,
    origin: [FRONTEND_ENDPOINT],
  })
);

app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/sessions", sessionRouter);
app.use("/api/v1/videos", videoRouter);

// GET /status.
app.get('/status', AppController.getStatus); 

// GET /stats.
app.get('/stats', AppController.getStats); 

// Get health status
app.get("/healthchecker", (req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    message: "100% online",
  });
});

// Unknown Routes
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
});

// Error handling
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  err.status = err.status || "error";
  err.statusCode = err.statusCode || 500;

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

const port = 8000;
app.listen(port, () => {
  console.log(`✅ Server started on port: ${port}`);
});
