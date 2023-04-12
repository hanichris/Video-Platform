const Queue = require('bull');
const fs = require('fs');
const imageThumbnail = require('image-thumbnail');
const dbClient = require('./utils/db');

const fileQueue = new Queue('image thumbnail generation');
try {
  fileQueue.process(async (job) => {
    const { _Id, userId } = job;
    if (!_Id) {
      return Promise.reject(new Error('Missing fileId'));
    }
    if (!userId) {
      return Promise.reject(new Error('Missing userId'));
    }
    const file = await dbClient.getUserFile(_Id, userId);
    if (!file) {
      return Promise.reject(new Error('File not found'));
    }
    [100, 250, 500].map(async (size) => {
      const thumbnail = await imageThumbnail(file.localPath, {
        width: size,
        height: size,
      });
      const imageName = `${file.localPath}_${size}`;
      await fs.writeFile(imageName, thumbnail, (err) => {
        if (err) return Promise.reject(err);
        console.log('The thumbnail has been saved!');
        return Promise.resolve(imageName);
      });
    });
    return Promise.resolve(file.localPath);
  });
} catch (err) {
  console.log('Bull Worker Error', err);
}
module.exports = fileQueue;
