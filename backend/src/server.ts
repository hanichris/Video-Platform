import * as dotenv from 'dotenv';
import path from 'path';
import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import originalUrl from 'original-url';
import userRouter from './routes/user.route';
import authRouter from './routes/auth.route';
import sessionRouter from './routes/session.route';
import commentRouter from './routes/comment.route';
import channelRouter from './routes/channel.route';
import videoRouter from './routes/video.route';
import dbClient from './utils/db';
import AppController from './controllers/app.controller';

dotenv.config();

const app = express();

/*
* This middleware restores the original url of the request after it may have been
* rewritten by a proxy or load balancer.
*/
app.use(originalUrl.originalUrl);

/**
 * This parses incoming request payloads as JSON if the Content-Type matches.

 * The limit option limits the size of the payload to 10kb.

 * The verify callback logs the size of the request body and the url if a
 * non-empty body is received. This is used for debugging and monitoring.
 */
app.use(
  express.json({
    limit: '10kb',
    verify: (req, res, buf) => {
      if (buf && buf.length) {
        const { url } = req;
        console.log(
          `Request body size of ${buf.length} bytes received on ${url}`,
        );
      }
    },
  }),
);

/*
 * This parses incoming request payloads as url encoded if the
 * Content-Type matches.

 * The limit option limits the payload size to 10kb.

 * The extended option allows for rich objects and arrays to be encoded into
 * the URL-encoded format.

 * The verify callback logs the size of the request body and the url if a
 * non-empty body is received. This is used for debugging and monitoring.
*/
app.use(
  express.urlencoded({
    limit: '10kb',
    extended: true,
    verify: (req, res, buf) => {
      if (buf && buf.length) {
        const { url } = req;
        console.log(
          `Request body size of ${buf.length} bytes received on ${url}`,
        );
      }
    },
  }),
);

/*
* This initializes cookie-parser middleware which parses cookies attached
* to the client request object.
* It populates req.cookies with an object keyed by the cookie names.
*/
app.use(cookieParser());

/*
* This enables the morgan HTTP request logger middleware in development mode.
* Morgan will log information about requests and responses to the console.
* The 'dev' format is used which provides concise colored output.
*/
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

/*
* This serves static files from the given directory path.
* It will serve files under ../public for routes starting with /api/v1/thumbnails.
* This allows serving generated thumbnail images for videos.
*/
app.use(
  '/api/v1/thumbnails',
  express.static(path.join(__dirname, '../public')),
);

const FRONTEND_ENDPOINT = process.env.FRONTEND_ENDPOINT as unknown as string;

/*
* This initializes CORS middleware to allow cross-origin requests.
* The credentials option allows cookies/auth to be sent cross-origin.
* The origin is limited to the configured FRONTEND_ENDPOINT.
*/
app.use(
  cors({
    credentials: true,
    origin: [FRONTEND_ENDPOINT],
  }),
);

app.use('/api/v1/users', userRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/sessions', sessionRouter);
app.use('/api/v1/channels', channelRouter);
app.use('/api/v1/videos', videoRouter);
app.use('/api/v1/comments', commentRouter);

// GET /status.
app.get('/status', AppController.getStatus);

// GET /stats.
app.get('/stats', AppController.getStats);

// Get health status
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: '100% online',
  });
});

// Unknown Routes
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
});

// Error handling
app.use((err: any, req: Request, res: Response) => {
  const status = err.status || 'error';
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    status,
    message: err.message,
  });
});

const port = 8000;
app.listen(port, () => {
  dbClient.connect();
  console.log(`✅ Server started on port: ${port}`);
});
