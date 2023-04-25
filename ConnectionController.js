import { MongoClient, ServerApiVersion } from 'mongodb';
import mongoose from 'mongoose';
import { config } from 'dotenv';
// import { client } from '../utils/db';

config();
const env = process.env.NODE_ENV || 'development';
const DB_PORT = process.env.DB_PORT || 3000;
const DB_HOST = process.env.DB_HOST || 'localhost';
const myDB = env === 'development' ? 'files_manager' : 'videos_manager';
const DB_CONN_STRING = process.env.DB_CONN_STRING;
const defaultDb = `mongodb://${DB_HOST}:${DB_PORT}/${myDB}`;
const uri = DB_CONN_STRING || defaultDb;

class ConnectionController {
    constructor () {
        this.dbClient = this.getConnect();
    }
    async getConnect () {
        if ( env === 'development' ) {
            await mongoose.connect( uri, { useNewUrlParser: true, useUnifiedTopology: true } );
            const client = mongoose.connection;
            client.on( 'error', console.error.bind( console, 'connection error:' ) );
            return new Promise( ( resolve ) => {
                client.once( 'open', () => {
                    console.log( 'Connected to database using mongoose' );
                    resolve( client );
                } );
            } );
        } else if ( env === 'production' ) {
            const client = new MongoClient( uri, {
                serverApi: {
                    version: ServerApiVersion.v1,
                    strict: true,
                    deprecationErrors: true,
                }
            } );
            return new Promise( ( resolve ) => {
                client.connect( ( err ) => {
                    if ( err ) {
                        console.log( err, 'Error connecting to database' );
                    } else {
                        console.log( 'Connected to database using mongo client' );
                        resolve( client );
                    }
                } );
            } );
        } else {
            console.log( 'Invalid or no environment variable set. Use either development or production' );
        }
    }
}

const connectionController = new ConnectionController();
module.exports = connectionController;
