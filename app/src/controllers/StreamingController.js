import { S3 } from "@aws-sdk/client-s3";
import ffmpeg from 'fluent-ffmpeg';
import dbClient from '../utils/db';
import { config } from 'dotenv';

config();

const s3 = new S3({
  region: process.env.S3_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// Set the path to the ffmpeg binary
ffmpeg.setFfmpegPath('/usr/bin/ffmpeg');

class StreamingController {
  static async getStream(req, res) {
    try {
      // Get video metadata from MongoDB
      const video = await dbClient.findById(req.params.id);

      if (!video) {
        return res.status(404).json({ message: 'Video not found' });
      }

      // Convert the video file to a streamable format using ffmpeg
      const { Body } = await s3.getObject({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${req.params.id}.mp4`,
      });
      const streamable = ffmpeg(Body).format('hls').outputOptions('-hls_time 10');

      // Stream the video
      res.set('Content-Type', 'application/vnd.apple.mpegurl');
      streamable.pipe(res);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: 'Failed to stream video' });
    }
  }
}

export default StreamingController;
