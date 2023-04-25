import { createClient } from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    this.client = createClient();

    this.client.on('error', (err) => {
      console.log(`Redis client not connected to the server: ${err}`);
    });
  }

  // Check connection to the redis-server.
  isAlive() {
    return this.client.connected;
  }

  // Get the value stored at index 'key' in the redis store.
  async get(key) {
    const getAsync = promisify(this.client.get).bind(this.client);
    const keyValue = await getAsync(key);
    return keyValue;
  }

  // Store a new key: value pair in redis and set an expiration on the key.
  async set(key, value, duration) {
    const setExAsync = promisify(this.client.setex).bind(this.client);
    await setExAsync(key, duration, value);
  }

  // Delete the value stored at index `key` in the redis store.
  async del(key) {
    const delAsync = promisify(this.client.del).bind(this.client);
    await delAsync(key);
  }
}

export default new RedisClient();
