import { Upload } from "@aws-sdk/lib-storage";
import { NextFunction, Request, Response } from "express";
import { S3Client, S3 } from "@aws-sdk/client-s3";
import { config } from 'dotenv';
import multer from 'multer';
import Video from "../models/video.model";

config();

const s3 = new S3Client( {
    region: process.env.S3_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  }
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('video');

class UploadController {
  static async uploadVideo(request: Request, response: Response) {
    try {
      // Create a unique ID for the video
      const videoId = uuidv4();

      // Call multer middleware to get the video file
      upload(req, resp, async function (err: any) {
        if (err instanceof multer.MulterError) {
          // A Multer error occurred when uploading.
          console.error(err);
          return resp.status(400).json({ message: 'Error uploading video file' });
        } else if (err) {
          // An unknown error occurred when uploading.
          console.error(err);
          return resp.status(500).json({ message: 'Failed to upload video file' });
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
        const video = new Video({
          title: req.body.title,
          description: req.body.description,
          videoUrl: resp.Location,
          ...req.body
        });

        await video.save();
        // Send the response to the client
        return res.status(200).json({ message: 'Video uploaded successfully', id: video._id, location: video.videoUrl });
      });
    } catch (e) {
      console.error(e);
      return response.status(500).json({ message: 'Failed to upload video file' });
    }
  }
}

export default UploadController;
