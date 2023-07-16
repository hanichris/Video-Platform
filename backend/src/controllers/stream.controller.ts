/* eslint-disable no-bitwise */
/* eslint-disable consistent-return */
import os from 'os';
import { NextFunction, Request, Response } from 'express';
import { S3, GetObjectCommand } from '@aws-sdk/client-s3';
import ffmpeg from 'fluent-ffmpeg';
import { config } from 'dotenv';
import { Readable } from 'stream';
import Video from '../models/video.model';
import s3Config from '../utils/aws';
import createError from '../error';

config();

// Set the path to the ffmpeg binary based on the operating system
const ffmpegPath = os.platform() === 'win32'
  ? 'C:\\ProgramData\\chocolatey\\bin\\ffmpeg.exe'
  : '/usr/bin/ffmpeg';

ffmpeg.setFfmpegPath(ffmpegPath);

const s3: S3 = new S3(s3Config);

class StreamingController {
  static async getStream(req: Request, resp: Response, next: NextFunction) {
    try {
      const video: any = await Video.findById(req.params.id);
      if (!video) {
        return next(createError(404, 'Video not found!'));
      }

      // Convert the video file to a streamable format using ffmpeg
      const command = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: video.filename,
      });
      const response = await s3.send(command);
      const stream = Readable.from(response.Body as any);

      resp.set('Content-Type', 'video/mp4');
      resp.set('Transfer-Encoding', 'chunked');

      let totalTime = 0; // Initialize totalTime

      // Stream the video
      ffmpeg(stream)
        // set the size
        // .withSize('50%')
        // set fps
        .withFps(24)
        .outputOptions(['-movflags isml+frag_keyframe'])
        .toFormat('mp4')
        .withAudioCodec('copy')
        .on('start', () => {
          // something message for init process
          console.log('Streaming started!');
        })
        .on('codecData', (data) => {
          // HERE YOU GET THE TOTAL TIME
          totalTime = parseInt(data.duration.replace(/:/g, ''), 10);
        })
        .on('error', (err: any, stdout: any, stderr: any) => {
          console.log(`an error happened: ${err.message}`);
          console.log(`ffmpeg stdout: ${stdout}`);
          console.log(`ffmpeg stderr: ${stderr}`);
        })
        .on('end', () => {
          console.log('Processing finished !');
        })
        .on('progress', (progress: any) => {
          // console.log('Processing: ' + progress.percent + '% done');
          const time: number = parseInt(
            progress.timemark.replace(/:/g, ''),
            10,
          );

          // AND HERE IS THE CALCULATION
          const percent = (time / totalTime) * 100;
          console.log(`Processing: ${percent >= 0 ? 0 | percent : 0}% done`);
        })
        .pipe(resp, { end: true });
    } catch (e) {
      console.error(e);
      return next(createError(500, 'Failed to stream video!'));
    }
  }
}

export default StreamingController;
