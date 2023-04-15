import { MongoClient, ServerApiVersion } from 'mongodb';
import * as dotenv from 'dotenv';
import usersSchema from './schema.js';//eslint-disable-line
import { filesSchema } from './schema.js'; //eslint-disable-line

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

      try {
        await this.db.createCollection(process.env.FILES_COLLECTION_NAME, {
          validator: { $jsonSchema: filesSchema },
        });
      } catch (e) {
        console.error(`Collection ${process.env.DB_NAME}.${process.env.FILES_COLLECTION_NAME} already Exists`);
      }
    }).catch((err) => console.error(`Mongodb client not connected to the database: ${err}`));
  }

  async nbUsers() {
    const userCount = await this.db.collection(
      process.env.USERS_COLLECTION_NAME,
    ).estimatedDocumentCount();
    return userCount;
  }

  async createUser(newUserDocument) {
    const result = await this.db.collection(
      process.env.USERS_COLLECTION_NAME,
    ).insertOne(newUserDocument);
    return result.insertedId;
  }

  async uploadVideo(newVideoDocument) {
    const result = await this.db.collection(
      process.env.FILES_COLLECTION_NAME,
    ).insertOne(newVideoDocument);
    return result.insertedId;
  }

  async getUser(userDocument) {
    const user = await this.db.collection(
      process.env.USERS_COLLECTION_NAME,
    ).findOne(userDocument);
    return user;
  }

  async getVideo(videoDocument) {
    const video = await this.db.collection(
      process.env.FILES_COLLECTION_NAME,
    ).findOne(videoDocument);
    return video;
  }

  async updateUser(filter, updatedUser) {
    const user = await this.db.collection(
      process.env.USERS_COLLECTION_NAME,
    ).findOneAndUpdate(filter, { $set: updatedUser }, { returnDocument: 'after' });
    return user;
  }

  async updateVideo(filter, updatedVideo) {
    const video = await this.db.collection(
      process.env.FILES_COLLECTION_NAME,
    ).findOneAndUpdate(filter, { $set: updatedVideo }, { returnDocument: 'after' });
    return video;
  }

  // async deleteUser() {}

  // async deleteVidoe() {}
}

export default new DBClient();
