import { Upload } from "@aws-sdk/lib-storage";
import { S3 } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from 'uuid';
import { config } from 'dotenv';
import multer from 'multer';
import dbClient from '../utils/db';

config();

const s3 = new S3( {
    region: process.env.S3_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('video');

class UploadController {
  static async postUpload(req, res) {
    try {
      // Create a unique ID for the video
      const videoId = uuidv4();

      // Call multer middleware to get the video file
      upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
          // A Multer error occurred when uploading.
          console.error(err);
          return res.status(400).json({ message: 'Error uploading video file' });
        } else if (err) {
          // An unknown error occurred when uploading.
          console.error(err);
          return res.status(500).json({ message: 'Failed to upload video file' });
        }

        // Create a temporary path to store the video
        const params = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: `${videoId}.mp4`,
          Body: req.file.buffer,
        };

        // Upload the video to AWS S3 Bucket
        const response = await new Upload({
          client: s3,
          params,
        }).done();

        // Save the video metadata to MongoDB
        const video = {
          _id: videoId,
          title: req.body.title,
          description: req.body.description,
          videoUrl: response.Location,
        };

        await dbClient.saveVideo(video);

        // Send the response to the client
        return res.status(200).json({ message: 'Video uploaded successfully', id: video._id, location: video.videoUrl });
      });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: 'Failed to upload video file' });
    }
  }
}

export default UploadController;
