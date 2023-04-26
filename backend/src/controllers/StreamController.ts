import { NextFunction, Request, Response } from "express";
import createError from "../error";
import { S3 } from "@aws-sdk/client-s3";
import ffmpeg from 'fluent-ffmpeg';
import Video from "../models/video.model";
import User from "../models/user.model";
import { s3Config } from "../utils/aws";
import { config } from 'dotenv';

config();

const s3: S3 = new S3( s3Config );
// Set the path to the ffmpeg binary
ffmpeg.setFfmpegPath('/usr/bin/ffmpeg');

class StreamingController {
  static async getStream(req: Request, resp: Response, next: NextFunction) {
    try {
      const video = await Video.findById(req.params.id)
      if (!video) {
        return next(createError(404, "Video not found!"));
      }

      // Convert the video file to a streamable format using ffmpeg
      const { Body } = await s3.getObject({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: video.filename,
      });
      const streamable = ffmpeg(Body as any).format('hls').outputOptions('-hls_time 10');

      // Stream the video
      resp.set('Content-Type', 'application/vnd.apple.mpegurl');
      streamable.pipe(resp);
    } catch (e) {
      console.error(e);
      return next(createError(500, "Failed to stream video!"));
    }
  }
}

export default StreamingController;
