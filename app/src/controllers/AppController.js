import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class AppController {
  static getStatus(request, response) {
    response.status(200).json({ redis: redisClient.isAlive(), db: dbClient.isAlive() });
  }

  static async getStats(request, response) {
    const userCount = await dbClient.nbUsers();
    const fileCount = await dbClient.nbFiles();
    response.status(200).json({ users: userCount, files: fileCount });
  }
}

module.exports = AppController;
