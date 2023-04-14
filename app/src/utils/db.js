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
    this.client.connect()

  }
}

const dbClient = new DBClient();
console.log(dbClient.uri);
module.exports = dbClient;
