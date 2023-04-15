/* eslint-disable no-inline-comments */
import { RedisClientType, createClient } from "redis";
import * as dotenv from 'dotenv';

const retryStrategy = function(options: any) {
    if (options.error && options.error.code === "ECONNREFUSED") {
      // End reconnecting on a specific error
      return new Error("The server refused the connection");
    }
    if (options.total_retry_time > 1000 * 60 * 60) {
      // End reconnecting after a specific timeout
      return new Error("Retry time exhausted");
    }
    if (options.attempt > 10) {
      // End reconnecting with built in error
      return undefined;
    }

    // reconnect after
    return Math.min(options.attempt * 100, 3000);
  }

class RedisClient {
    client: any;
    connected: boolean = false;
    constructor() {
        dotenv.config();
        this.client = createClient();
        (async () => {
            await this.client.connect();
            if (this.client.isOpen) {
                this.connected = true;
            }
            this.client.on('connect', () => console.log("🚀 Redis Database connected successfully"));
            this.client.on('ready', () => console.log('Redis is ready'));
            this.client.on('reconnecting', () => console.log('Redis is reconnecting'));
            this.client.on('error', () => console.log('Redis error'));
            this.client.on('end', () => console.log('Redis end'));
        }
        )();
    }

    isAlive() {
        return this.connected;
    }

    db() {
      return <RedisClientType>this.client;
    }
}
const redisClient = new RedisClient();
export default redisClient;