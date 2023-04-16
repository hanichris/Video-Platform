import { MongoClient, ServerApiVersion } from 'mongodb';
import { config } from 'dotenv';
import usersSchema from './schema';

config();
const dataBase = process.env.DB_NAME;
const videosCollection = process.env.DB_COLLECTION;
const dbURL = process.env.DB_CONN_STRING || 'mongodb://localhost:27017';

class DBClient {
  constructor() {
    config();
    this.client = new MongoClient(dbURL,{
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    } );
    this.isConnected = false;
    this.client.connect( ( err ) => {
      return new Promise( (reject ) => {
        if ( err ) {
          console.error( err );
          reject( err );
        }
        console.log( 'Connected to MongoDB' );
        this.isConnected = true;
      })
    } )

  }

  isAlive () {
    return this.isConnected;
  }

  async saveVideo(video) {
    try {
      const db = this.client.db(dataBase);
      const collection = db.collection(videosCollection);
      const savedVideo = await collection.insertOne( video );
      return savedVideo;
    } catch ( e ) {
      console.error(e);
      return e;
    }
  }

  async findById ( id ) {
    try {
      const db = this.client.db( dataBase );
      const collection = db.collection( videosCollection );
      const videoId = await collection.findOne( { _id: id } );
      return videoId;
    } catch ( e ) {
      console.error( e );
      return e;
    }
  }
}

const dbClient = new DBClient();
console.log(dbClient.uri);
module.exports = dbClient;
