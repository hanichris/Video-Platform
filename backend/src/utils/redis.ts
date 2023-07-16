/* eslint-disable no-inline-comments */
import { RedisClientType, createClient } from 'redis';
import * as dotenv from 'dotenv';

// const retryStrategy = function (options: any) {
//   if (options.error && options.error.code === 'ECONNREFUSED') {
//     // End reconnecting on a specific error
//     return new Error('The server refused the connection');
//   }
//   if (options.total_retry_time > 1000 * 60 * 60) {
//     // End reconnecting after a specific timeout
//     return new Error('Retry time exhausted');
//   }
//   if (options.attempt > 10) {
//     // End reconnecting with built in error
//     return undefined;
//   }

//   // reconnect after
//   return Math.min(options.attempt * 100, 3000);
// };

class RedisClient {
  _client: RedisClientType;

  connected = false;

  constructor() {
    dotenv.config();
    this._client = createClient();
    (async () => {
      await this._client.connect();
      if (this._client.isOpen) {
        this.connected = true;
      }
      this._client.on('connect', () => console.log('🚀 Redis Database connected successfully'));
      this._client.on('ready', () => console.log('Redis is ready'));
      this._client.on('reconnecting', () => console.log('Redis is reconnecting'));
      this._client.on('error', () => console.log('Redis error'));
      this._client.on('end', () => console.log('Redis end'));
    })();
  }

  isAlive() {
    return this.connected;
  }

  get client() {
    return <RedisClientType> this._client;
  }
}
const redisClient = new RedisClient();
export default redisClient;
