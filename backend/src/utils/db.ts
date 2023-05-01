import * as dotenv from 'dotenv';
import mongoose from 'mongoose';

class DBClient {
  constructor() {
    dotenv.config();
  }

  connect() {
    mongoose
      .connect(String(process.env.DB_CONN_STRING))
      .then(() => {
        console.log('🚀 Mongo Database connected successfully');
      })
      .catch((err) => {
        throw err;
      });
  }

  isAlive() {
    // 0: disconnected
    // 1: connected
    // 2: connecting
    // 3: disconnecting
    if (mongoose.connection.readyState === 1) {
      return true;
    }
    return false;
  }
}

const dbClient = new DBClient();
export default dbClient;
