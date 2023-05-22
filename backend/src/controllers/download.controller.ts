/* eslint-disable consistent-return */
import { NextFunction, Request, Response } from 'express';
import { S3, GetObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import createError from '../error';
import Video from '../models/video.model';
import s3Config from '../utils/aws';

const s3: S3 = new S3(s3Config);

class DownloadController {
  static async downloadVideo(req: Request, resp: Response, next: NextFunction) {
    try {
      const video = await Video.findById(req.params.id);
      if (!video) {
        return next(createError(404, 'Video not found!'));
      }

      // Get Video Metadata from AWS S3 Bucket
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: video.filename,
      };

      const command = new GetObjectCommand(params);
      const response = await s3.send(command);
      const stream = Readable.from(response.Body as any);

      // Send Video to the client
      resp.status(200);
      resp.set('Content-Type', response.ContentType);
      resp.set('Content-Disposition', `attachment; filename=${video.filename}`);
      stream.pipe(resp);
    } catch (e) {
      console.error(e);
      return next(createError(500, 'Failed to download video!'));
    }
  }
}

export default DownloadController;
