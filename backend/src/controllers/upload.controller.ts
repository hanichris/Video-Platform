/* eslint-disable consistent-return */
import { Upload } from '@aws-sdk/lib-storage';
import { NextFunction, Request, Response } from 'express';
import { S3 } from '@aws-sdk/client-s3';
import multer from 'multer';
import { randomUUID } from 'crypto';
import { config } from 'dotenv';
import createError from '../error';
import Video from '../models/video.model';
import User from '../models/user.model';
import { ChannelModel as Channel } from '../models/channel.model';
import s3Config from '../utils/aws';

config();

const s3: S3 = new S3(s3Config);
const storage = multer.memoryStorage();
const upload = multer({ storage }).single('video');

const DEFAULT_THUMBNAIL = process.env.DEFAULT_THUMBNAIL as string;

class UploadController {
  static async uploadVideo(req: Request, resp: Response, next: NextFunction) {
    try {
      const userId = String(resp.locals.user._id);
      const user = await User.findById(userId);
      if (!user) {
        return next(createError(401, 'User not found!'));
      }
      const channel = await Channel.findById(req.params.id);
      if (!channel) {
        return next(createError(401, 'Channel not found!'));
      }

      // Create a unique ID for the video
      const videoUUID = randomUUID();

      // Call multer middleware to get the video file
      await new Promise<any>((resolve, reject) => {
        upload(req, resp, async (err: any) => {
          if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            console.error(err);
            reject(createError(400, 'Error uploading video file!'));
          }
          if (err) {
            // An unknown error occurred when uploading.
            console.error(err);
            reject(createError(500, 'Failed to upload video file!'));
          }

          // Create a temporary path to store the video
          const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `${videoUUID}.mp4`,
            Body: req?.file?.buffer,
          };
          // Upload the video to AWS S3 Bucket
          const data = await new Upload({
            client: s3,
            params,
          }).done();
          // Save the video metadata to MongoDB
          const video = new Video({
            userId,
            channelId: channel._id,
            imgUrl: req.body.imgUrl || DEFAULT_THUMBNAIL,
            title: req.body.title,
            filename: `${videoUUID}.mp4`,
            description: req.body.description || videoUUID,
            videoUrl: (data as any)?.Location,
            ...req.body,
          });

          await video.save();
          channel.videos.push(video._id.toString());
          await channel.save();

          // Send the response to the client
          return resolve(resp.status(200).json(video));
        });
      });
    } catch (e) {
      console.error(e);
      return next(createError(500, 'Failed to upload video file!'));
    }
  }
}

export default UploadController;
