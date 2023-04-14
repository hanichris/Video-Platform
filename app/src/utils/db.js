import { MongoClient, ServerApiVersion } from 'mongodb';
import usersSchema from './schema';
import * as dotenv from 'dotenv';

class DBClient {
  constructor() {
    dotenv.config();
    this.client = new MongoClient(process.env.DB_CONN_STRING,{
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });
    this.client.connect().then(() => {
      this.client.db("admin").command({ ping: 1 });
      console.log('MongoDB client connected to server');
    }).catch((err) => console.error(`Mongodb client not connected to the database: ${err}`));
  }

  async getUser(userObject) {}
  async createUser(userDetails) {}
  async getVideo() {}
  async uploadVideo() {}
}

const dbClient = new DBClient();
module.exports = dbClient;
