import Bull, { Job } from 'bull';
import ffmpeg from 'fluent-ffmpeg';

// queue: Bull queue instance used for queuing thumbnail generation jobs.
export const queue = new Bull('thumbnail-queue');

export interface JobData {
  videoId: string;
  videoPath: string;
  thumbnailPath: string;
}

export interface JobNotification {
  type: string;
  videoId: string;
  message?: string;
  error?: Error;
}

/**
 * sendJobNotification:
  - Sends a job notification and updates job progress
  - @param notification: JobNotification object
  - @param job: The job object
  - Returns the notification error if type is 'job-failed', else returns true

 */
export function sendJobNotification(notification: JobNotification, job: Job) {
  if (notification.type === 'job-failed') {
    console.error(notification.error);
    return notification.error;
  }

  job.progress(100);

  console.log(
    `Sending notification for ${notification.videoId}, message: ${notification.message}`,
  );
  return notification.message;
}

/**
 *
createJob:
  - Adds a job to the queue and registers event handlers
  - @param job: The job object
  - Registers 'completed' and 'failed' event handlers that call sendJobNotification

 */
export async function createJob(jobData: JobData) {
  const job = await queue.add(jobData);
  return job.id;
}

/**
 * processJob:
  - Processes jobs from the queue
  - @param job: The job object
  - Uses ffmpeg to generate thumbnail and sends a 'thumbnail-generated' notification

 */
export function processJob(job: Job) {
  return new Promise((resolve, reject) => {
    let progress;
    ffmpeg(job.data.videoPath)
      .screenshots({
        timestamps: ['50%'],
        filename: job.data.thumbnailPath,
      })
      .on('start', () => {
        progress = 0;
        job.progress(progress);
        sendJobNotification(
          {
            type: 'job-started',
            videoId: job.data.videoId,
            message: 'Thumbnail generation started',
          },
          job,
        );
      })
      .on('progress', ({ percent }) => {
        progress = percent;
        job.progress(progress);
      })
      .on('end', () => {
        job.progress(100);
        sendJobNotification(
          {
            type: 'thumbnail-generated',
            videoId: job.data.videoId,
          },
          job,
        );
        return resolve(true);
      })
      .on('error', (err) => {
        sendJobNotification(
          {
            type: 'job-failed',
            videoId: job.data.videoId,
            error: err,
          },
          job,
        );
        return reject(err);
      });
  });
}

// queue.on('start', (job: Job) => {
//   // Handle job start errors
//   job.on('failed', (err: Error) => {
//     console.error(`Job ${job.id} failed`, err);
//   });
// });

queue.process(processJob);

/**
 * createPushNotificationjobs:
  - Validates jobs array and creates jobs by calling createJob
  - @param jobs: Array of job objects
 */
// export function createPushNotificationjobs(jobs: Job[]) {
//   if (!Array.isArray(jobs) || jobs.length === 0) {
//     throw Error('Invalid Jobs array');
//   }
//   jobs.forEach((job: Job) => {
//     if (job) {
//       createJob(job);
//     }
//   });
// }
