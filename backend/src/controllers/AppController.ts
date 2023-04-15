import { NextFunction, Request, Response } from "express";
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

export default class AppController {
  static getStatus(request: Request, response: Response) {
    response.status(200).json({ redis: redisClient.isAlive(), db: dbClient.isAlive() });
  }

  static async getStats(request: Request, response: Response) {
    const userCount = await dbClient.nbUsers();
    const fileCount = await dbClient.nbFiles();
    response.status(200).json({ users: userCount, files: fileCount });
  }
}
