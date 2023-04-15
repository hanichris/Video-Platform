import { MongoClient, ServerApiVersion } from 'mongodb';
import * as dotenv from 'dotenv';
import usersSchema from './schema.js';//eslint-disable-line

class DBClient {
  constructor() {
    dotenv.config();
    this.client = new MongoClient(process.env.DB_CONN_STRING, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
    this.client.connect().then(async () => {
      console.log('MongoDB client connected to server');
      this.db = this.client.db(process.env.DB_NAME);
      try {
        await this.db.createCollection(process.env.USERS_COLLECTION_NAME, {
          validator: { $jsonSchema: usersSchema },
        });
      } catch (e) {
        console.error(`Collection ${process.env.DB_NAME}.${process.env.USERS_COLLECTION_NAME} already Exists`);
      }
    }).catch((err) => console.error(`Mongodb client not connected to the database: ${err}`));
  }

  async nbUsers() {
    const userCount = await this.db.collection(
      process.env.USERS_COLLECTION_NAME,
    ).estimatedDocumentCount();
    return userCount;
  }

  async createUser(newUser) {
    const result = await this.db.collection(
      process.env.USERS_COLLECTION_NAME,
    ).insertOne(newUser);
    return result.insertedId;
  }

  // async getUser(userObject) {}
  // async getVideo() {}
  // async uploadVideo() {}
}

export default new DBClient();
